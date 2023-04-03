const { app, BrowserWindow } = require('electron')
const path = require('path')
const reload = require('electron-reload');
const { exec } = require('child_process');

    // Автоматическое обновление браузера при изменении файлов
    reload(__dirname, {
      electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
      hardResetMethod: 'exit'
    });
    
function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
   mainWindow.webContents.openDevTools()


  mainWindow.loadURL('http://cubalab.ru/CubaSmartBox/')
  mainWindow.setFullScreen(true)
  mainWindow.setMenu(null) 
  mainWindow.webContents.on('did-navigate', () => {
    mainWindow.webContents.executeJavaScript(`

      let homeButton = document.createElement('button');
      homeButton.style = 'position: fixed; top: 49px; left: 20px; z-index: 9999; background:none; border:none; color: grey; cursor:pointer; font-size: 17px;    font-family: fantasy;';
      homeButton.innerHTML = 'Домашняя';
      homeButton.onclick = function() { window.location = "http://cubalab.ru/CubaSmartBox/"; }
      document.body.appendChild(homeButton);

      let backButton = document.createElement('button');
      backButton.style = 'position: fixed; top: 49px; left: 112px; z-index: 9999; background:none; border:none; color: grey; cursor:pointer; font-size: 17px;    font-family: fantasy;';
      backButton.innerHTML = 'Назад';
      backButton.onclick = function() { window.history.back(); }
      document.body.appendChild(backButton);

      let closeButton = document.createElement('button');
      closeButton.style = 'position: fixed; top: 49px; left:169px; z-index: 9999; background:none; border:none; color: grey; cursor:pointer; font-size: 17px;    font-family: fantasy;';
      closeButton.innerHTML = 'Закрыть';
      closeButton.onclick = function() { window.close(); }
      document.body.appendChild(closeButton);



    `);
  });
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
