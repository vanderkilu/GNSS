// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const {
  pointDifference,
  exportToSheet,
  pointFilteredDifference
} = require("./reader");

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js")
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  ipcMain.on("upload-file", () => {
    const options = { properties: ["openFile"] };
    dialog
      .showOpenDialog(null, options)
      .then(fileObj => {
        if (fileObj !== undefined) {
          const filePath = fileObj.filePaths[0];
          mainWindow.send("filename", fileName(filePath));
          const content = pointDifference(filePath);
          mainWindow.send("points", content);
        }
      })
      .catch(err => console.log(err));
  });

  ipcMain.on("export-file", () => {
    exportToSheet("SHEET_JSON_NORMAL", "difference.xlsx");
  });

  ipcMain.on("upload-filter-file", () => {
    const options = { properties: ["openFile"] };
    dialog
      .showOpenDialog(null, options)
      .then(fileObj => {
        if (fileObj !== undefined) {
          const filePath = fileObj.filePaths[0];
          mainWindow.send("filename", fileName(filePath));
          pointFilteredDifference(filePath);
          mainWindow.send("show-btn");
        }
      })
      .catch(err => console.log(err));
  });

  ipcMain.on("export-filter-file", () => {
    exportToSheet("EXPORT_SHEET_JSON", "processed.xlsx");
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

const fileName = filePath => {
  return path.basename(filePath);
};

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
