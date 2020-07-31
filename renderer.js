// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const { ipcRenderer } = require("electron");
const btn = document.getElementById("uploadBtn");
const btnExport = document.getElementById("exportBtn");
const pointsElement = document.querySelector(".points-wrapper");
const btnFilteredUpload = document.getElementById("uploadFilteredBtn");
const btnFilteredExport = document.getElementById("exportFilteredBtn");
const h3 = document.querySelector("h3");
const h2 = document.querySelector("h2");

btn.addEventListener("click", () => {
  ipcRenderer.send("upload-file");
  h3.remove();
});

btnExport.addEventListener("click", () => {
  ipcRenderer.send("export-file");
});

btnFilteredUpload.addEventListener("click", () => {
  ipcRenderer.send("upload-filter-file");
  h2.remove();
  h3.remove();
  btnFilteredUpload.remove();
  btnExport.remove();
});
btnFilteredExport.addEventListener("click", () => {
  ipcRenderer.send("export-filter-file");
});

ipcRenderer.on("filename", (_, filename) => {
  btn.disabled = true;
  btn.innerText = filename;
});

const template = (N, E) => {
  const innerTemplate = `
        <p class="points__north points__item">${N}</p>
        <p class="points__east points__item">${E}</p>
    `;
  const div = document.createElement("div");
  div.className = "points";
  div.innerHTML = innerTemplate;
  return div;
};

const templateHeader = () => {
  const template = `
        <h3 class="points__header points__item">N/m</h3>
        <h3 class="points__header points__item">E/m</h3>
    `;
  const div = document.createElement("div");
  div.className = "points";
  div.innerHTML = template;
  return div;
};
ipcRenderer.on("show-btn", () => btnFilteredExport.classList.add("show"));

ipcRenderer.on("points", (_, points) => {
  pointsElement.appendChild(templateHeader());
  points.forEach(point => {
    pointsElement.appendChild(template(point.N, point.E, point.Z));
  });
  btnExport.classList.add("show");
});
