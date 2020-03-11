import { IpcMessage } from './src/app/models/ipc.model';
import { app, BrowserWindow, screen, ipcMain, IpcMainEvent } from 'electron';
import * as path from 'path';
import * as url from 'url';

var iconPath = path.join(__dirname, 'imgs', 'hepticon.ico');

let mainWindow: BrowserWindow = null;
const wins = {};
const args = process.argv.slice(1),
    serve = args.some(val => val === '--serve');

function showWindow(name) {
  if (!wins[name]) {
    let myWin = new BrowserWindow({
      webPreferences: {
        experimentalFeatures: true,
        nodeIntegration: true,
        webSecurity: false,
      },
      // width: 800,
      // height: 600,
      // frame: false,
      titleBarStyle: 'default',
      icon: iconPath,
      show: false,
    });

    if (serve) {
      myWin.loadURL(url.format({
        pathname: 'localhost:4242',
        protocol: 'http:',
        slashes: true,
        hash: `/${name}`
      }));
    } else {
      myWin.loadURL(url.format({
        pathname: path.join(__dirname, 'dist', 'index.html'),
        protocol: 'file:',
        slashes: true,
        hash: `/${name}`
      }));
    }
   
    // console.log(`Path: '${path.join(__dirname, 'playlist.html')}'`);
    
    myWin.on('closed', function () {
      wins[name] = null;
    });
    wins[name] = myWin;
    wins[name].on('ready-to-show', () => {
      wins[name].show();
      wins[name].webContents.openDevTools();
    });
  } else {
    wins[name].show();
  }
};

function hideWindow(name) {
  if (wins[name]) {
    wins[name].hide();
  }
};

function minWindow(name) {
  if (wins[name]) {
    wins[name].minimize();
  }
};
function createWindow(): BrowserWindow {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: 1000, // size.width,
    height: 300, // size.height,
    webPreferences: {
      experimentalFeatures: true,
      nodeIntegration: true,
      webSecurity: false,
      // allowRunningInsecureContent: (serve) ? true : false,
    },
    icon: iconPath,
    // frame: false,
    // titleBarStyle: 'hidden',
    show: false, // wait for ready-to-show
  });

  // not supported on windows.
  // mainWindow.setAspectRatio(21/9, { height: 0, width: 0 });

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    mainWindow.loadURL(url.format({
      pathname: 'localhost:4242',
      protocol: 'http:',
      slashes: true,
      hash: `/flex`
    }));
  } else {
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'dist', 'index.html'),
      protocol: 'file:',
      slashes: true,
      hash: "/flex"
    }));
  }

  if (serve) {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  ipcMain.on('webamp-loadpath', (event, arg) => {
    console.log("main.js::" + JSON.stringify(arg)); // prints "ping"
    // not supported, not sure what the point was // mainWindow.send('webamp-loadpath', arg);
  });

  return mainWindow;
}

try {
  app.allowRendererProcessReuse = true;

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}

// allow main window to show/hide other windows
ipcMain.on('showWindow', (ev, arg) => {
  let name = arg.window;
  switch (name) {
    case 'playlist':
      showWindow(name);
      break;
    default:
      break;
  }
});

ipcMain.on('hideWindow', (ev, arg) => {
  let name = arg.window;
  switch (name) {
    case 'playlist':
      hideWindow(name);
      break;
    default:
      break;
  }
});

const channel = 'cc-ipc-msg';
ipcMain.on(channel, (event: IpcMainEvent, msg: IpcMessage) => {
  if (msg) {
    switch(msg.target) {
      case "player":
        mainWindow.webContents.send(channel, msg);
        break;
      default:
        if (wins[msg.target]) {
          wins[msg.target].webContents.send(channel, msg);
        }
        break;
    }
  }
});

//el fin//
