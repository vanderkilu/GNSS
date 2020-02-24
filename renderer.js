// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const {ipcRenderer} = require('electron')
const btn = document.getElementById('uploadBtn')
const pointsElement = document.querySelector('.points-wrapper')

btn.addEventListener('click', ()=> {
    ipcRenderer.send('upload-file')
})

ipcRenderer.on('filename', (_, filename)=> {
    btn.disabled = true
    btn.innerText = filename
})

const template = (N,E,Z) => {
    const innerTemplate= `
        <p class="points__north points__item">${N}</p>
        <p class="points__east points__item">${E}</p>
        <p class="points__zee points__item">${Z}</p>
    `
    const div = document.createElement('div')
    div.className = 'points'
    div.innerHTML = innerTemplate
    return div
}

const templateHeader = () => {
    const template = `
        <h3 class="points__header points__item">Northings</h3>
        <h3 class="points__header points__item">Eastings</h3>
        <h3 class="points__header points__item">Zees</h3>
    `
    const div = document.createElement('div')
    div.className = 'points'
    div.innerHTML = template
    return div
}

ipcRenderer.on('points', (_, points)=> {
    pointsElement.appendChild(templateHeader())
    points.forEach((point)=> {
        pointsElement.appendChild(template(point.N, point.E, point.Z))
    })
})
