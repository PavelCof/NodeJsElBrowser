const { app, BrowserWindow, Menu } = require('electron')


const menu = Menu.buildFromTemplate([

  {
    label: 'Главная',
    click: (menuItem, browserWindow) => {
      browserWindow.loadFile('index.html');
    },
    accelerator: 'CmdOrCtrl+H'
  },
  {
    type: 'separator'
  },
  {
    label: 'Назад',
    click: (menuItem, browserWindow) => {
      const contents = browserWindow.webContents;
      if (contents.canGoBack()) {
        contents.goBack();
      } else {
        try {
          const history = contents.session.getNavigationEntries();
          if (history.length > 1) {
            contents.goBack(history.length - 2);
          }  
        } catch (error) {
          console.log(error);
        }
      }
    },
    accelerator: 'CmdOrCtrl+[',
    id: 'back'
  },
  {
    type: 'separator'
  },
  {
    label: 'Закрыть',
    role: 'close',
    accelerator: 'CmdOrCtrl+W'
  }
]);
menu.backgroundColor = '#333333';
Menu.setApplicationMenu(menu);

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('index.html');
 
  win.webContents.on('did-finish-load', () => {
    win.webContents.insertCSS(`
    .menu {
      background-color: #333333;
      color: white;
    }
      ::-webkit-scrollbar {
        width: 0;
      }
      ::-webkit-scrollbar-horizontal {
        display: none;
      }
      ::-webkit-scrollbar-track {
        background-color: #f2f2f2;
        border-radius: 5px;
      }
      ::-webkit-scrollbar-thumb {
        background-color: #ccc;
        border-radius: 5px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background-color: #999;
      }
    `);
  });

  win.webContents.on('context-menu', (event) => {
    event.preventDefault();
    const contents = win.webContents;
    if (contents.canGoBack()) {
      contents.goBack();
    } else {
      try {
        const history = contents.session.getNavigationEntries();
        if (history.length > 1) {
          contents.goBack(history.length - 2);
        }  
      } catch (error) {
        console.log(error);
      }
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on('browser-window-created', (event, win) => {
    const contents = win.webContents;
    contents.on('did-navigate', () => {
      try {
        menu.getMenuItemById('back').enabled = contents.canGoBack();
      } catch (error) {
        console.log(error);
      }
    });
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
