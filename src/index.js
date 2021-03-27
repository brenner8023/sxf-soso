const { app, BrowserWindow, BrowserView, ipcMain, screen } = require('electron');

const isOpenDevTool = false;
const SOSO_MAP = {
  yandex: 'yandex',
  baidu: 'baidu',
  wechat: 'wechat'
};
const SOSO_MAP_URL = {
  [SOSO_MAP.yandex]: 'https://yandex.com/search/?text=',
  [SOSO_MAP.baidu]: 'https://www.baidu.com/s?wd=',
  [SOSO_MAP.wechat]: 'https://weixin.sogou.com/weixin?type=2&query='
};

function createWin () {
  const size = screen.getPrimaryDisplay().workAreaSize;
  const screenWidth = size.width;
  const screenHeight = size.height;

  let mainWin = new BrowserWindow({
    width: screenWidth,
    height: screenHeight,
    webPreferences: { nodeIntegration: true }
  });
  
  isOpenDevTool && mainWin.webContents.openDevTools();

  mainWin.loadFile('index.html');

  let browserViewMap = {
    [SOSO_MAP.yandex]: new BrowserView({ webPreferences: { nodeIntegration: false }}),
    [SOSO_MAP.baidu]: new BrowserView({ webPreferences: { nodeIntegration: false }}),
    [SOSO_MAP.wechat]: new BrowserView({ webPreferences: { nodeIntegration: false }})
  };

  let viewUrlMap = Object.freeze(SOSO_MAP_URL);

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
