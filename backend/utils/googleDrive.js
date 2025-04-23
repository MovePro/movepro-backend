const fs = require("fs");
const { google } = require("googleapis");
const path = require("path");

const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: SCOPES,
});

const driveService = google.drive({ version: "v3", auth });

async function createFolder(nombre, parentFolderId = null) {
  const fileMetadata = {
    name: nombre,
    mimeType: "application/vnd.google-apps.folder",
    ...(parentFolderId && { parents: [parentFolderId] }),
  };

  const file = await driveService.files.create({
    resource: fileMetadata,
    fields: "id",
  });

  return file.data.id;
}

async function uploadFile({ filePath, nombre, mimeType, parentFolderId }) {
  const fileMetadata = {
    name: nombre,
    parents: [parentFolderId],
  };

  const media = {
    mimeType: mimeType,
    body: fs.createReadStream(filePath),
  };

  const file = await driveService.files.create({
    resource: fileMetadata,
    media: media,
    fields: "id, webViewLink",
  });

  return file.data;
}

module.exports = {
  createFolder,
  uploadFile,
};

