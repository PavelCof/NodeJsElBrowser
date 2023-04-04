const { app, BrowserWindow } = require('electron')

//const { exec } = require('child_process');
//const { autoUpdater } = require('electron-updater');

//autoUpdater.checkForUpdatesAndNotify();



const { download } = require('electron-dl');
const os = require('os');
const path = require('path')

async function installChrome() {
  const win = new BrowserWindow({
    show: false, // создаем окно без отображения на экране
  });

  const platform = os.platform(); // получаем текущую платформу

  // формируем URL для скачивания Chrome в зависимости от платформы


  let chromeUrl;
  switch (platform) {
    case 'darwin':
      chromeUrl = 'https://dl.google.com/chrome/mac/universal/stable/GGRO/googlechrome.dmg';
      break;
    case 'win32':
      chromeUrl = 'https://dl.google.com/tag/s/appguid={8A69D345-D564-463C-AFF1-A69D9E530F96}&iid={DEBE09F1-8884-617A-AA5E-F7207BE24A0F}&lang=ru&browser=4&usagestats=0&appname=Google%20Chrome&needsadmin=prefers&ap=x64-stable-statsdef_1&installdataindex=defaultbrowser/update2/installers/ChromeSetup.exe';
      break;
    case 'linux':
      chromeUrl = 'https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb';
      break;
    default:
      console.error(`Unsupported platform: ${platform}`);
      return;
  }

  // скачиваем Chrome и устанавливаем его
  try {
    const dl = await download(win, chromeUrl, { directory: app.getPath('userData') });
    console.log(`Chrome downloaded to: ${dl.filePath}`);
  } catch (error) {
    
  }
 
}

app.on('ready', async () => {
  await installChrome();
 // const reload = require('electron-reload');
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
    // mainWindow.webContents.openDevTools()
  
  
    mainWindow.loadURL('https://google.com')
    mainWindow.setFullScreen(true)
    mainWindow.setMenu(null) 
    mainWindow.webContents.on('did-navigate', () => {
      mainWindow.webContents.executeJavaScript(`
  
        let homeButton = document.createElement('button');
        homeButton.style = 'position: fixed; top: 49px; left: 20px; z-index: 9999; background:none; border:none; color: grey; cursor:pointer; font-size: 17px;    font-family: fantasy;';
        homeButton.innerHTML = 'Домашняя';
        homeButton.onclick = function() { window.location = "https://google.com"; }
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
});








    

