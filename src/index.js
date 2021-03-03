const { app, BrowserWindow, BrowserView, ipcMain, screen } = require('electron');

function createWin () {
  const size = screen.getPrimaryDisplay().workAreaSize;
  const screenWidth = size.width;
  const screenHeight = size.height;

  let mainWin = new BrowserWindow({
    width: screenWidth,
    height: screenHeight,
    webPreferences: { nodeIntegration: true }
  });
  
  // mainWin.webContents.openDevTools();

  mainWin.loadFile('index.html');

  let browserViewMap = {
    doge: new BrowserView({ webPreferences: { nodeIntegration: false }}),
    baidu: new BrowserView({ webPreferences: { nodeIntegration: false }}),
    wechat: new BrowserView({ webPreferences: { nodeIntegration: false }})
  };

  let viewUrlMap = {
    doge: 'https://www.dogedoge.com/results?q=',
    baidu: 'https://www.baidu.com/s?wd=',
    wechat: 'https://weixin.sogou.com/weixin?type=2&query='
  };

  Object.keys(browserViewMap)
        .forEach((k, idx) => {
          let current = browserViewMap[k];

          mainWin.addBrowserView(current);
          current.webContents.loadURL(viewUrlMap[k] + 'golang');
        });

  ipcMain.on('set-width', (event, totalWidth) => {
    Object.keys(browserViewMap)
        .forEach((k, idx) => {
          let current = browserViewMap[k];
          let itemWidth = Number.parseInt(totalWidth / 3);
          let x = Number.parseInt(idx * itemWidth);
          current.setBounds({ x, y: 100, width: itemWidth, height: screenHeight });
        });
  });

  ipcMain.on('start-search', (event, searchVal) => {
    Object.keys(browserViewMap)
          .forEach((k, idx) => {
            let current = browserViewMap[k];
            current.webContents.loadURL(viewUrlMap[k] + searchVal);
          });
  });

  mainWin.on('close', () => {
    mainWindow = null;
  });
}

app.on('ready', createWin);
