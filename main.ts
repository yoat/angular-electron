import { ICreateWindow } from './src/app/shared/interfaces/ipc.interface';
import { IpcMessage } from './src/app/models/ipc.model';
import { app, BrowserWindow, screen, ipcMain, IpcMainEvent } from 'electron';
import * as path from 'path';
import * as url from 'url';

var iconPath = path.join(__dirname, 'imgs', 'hepticon.ico');

interface WinDict {
  [key: string]: BrowserWindow;
}

let mainWindow: BrowserWindow = null;
const wins: WinDict = {};
const args = process.argv.slice(1),
    serve = args.some(val => val === '--serve');

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

function createWindow(args: ICreateWindow) {
  const name = args.name;
  if (!name) {
    console.warn('invalid name supplied to createWindow');
    return;
  }
  // initial configuration
  const options: Electron.BrowserWindowConstructorOptions = {
    webPreferences: {
      experimentalFeatures: true,
      nodeIntegration: true,
      webSecurity: false,
    },
    // frame: false,
    titleBarStyle: 'default',
    show: false,
    icon: iconPath,
  };
  if (args.position) {
    options.x = args.position.x;
    options.y = args.position.y;
  }
  if (args.size) {
    options.width = args.size.x;
    options.height = args.size.y;
  }

  // init
  const myWin = new BrowserWindow(options);

  // debug vs prod
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

  // callbacks
  myWin.on('closed', function () {
    wins[name] = null;
  });
  
  myWin.on('ready-to-show', () => {
    if (args.debug) {
      myWin.webContents.openDevTools();
    }

    if (args.foreground) {
      myWin.show();
    } else if (args.show) {
      myWin.showInactive();
    } else {
      myWin.hide();
    }
  });

  // storage
  wins[name] = myWin;
}

function createMainWindow(): BrowserWindow {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: 520, // size.width,
    height: 205, // size.height,
    webPreferences: {
      experimentalFeatures: true,
      nodeIntegration: true,
      webSecurity: false,
      // allowRunningInsecureContent: (serve) ? true : false,
    },
    icon: iconPath,
    frame: false,
    titleBarStyle: 'hidden',
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

    // init others
    // createWindow({ name: 'viz', debug: true, show: false });
    // createWindow({ name: 'playlist', debug: true, show: false });
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
  app.on('ready', createMainWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    console.log(`window-all-closed in main`);
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    console.log(`activate!!`);
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createMainWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}

ipcMain.on('create-window', (ev: IpcMainEvent, args: ICreateWindow) => {
  createWindow(args);
});

ipcMain.on('close-all-windows', () => {
  console.log(`close-all-windows in main`);
  for (const kk in wins) {
    wins[kk].close();
  }
  mainWindow.close();
});

// allow main window to show/hide other windows
ipcMain.on('showWindow', (ev, arg) => {
  let name = arg.window;
  switch (name) {
    case 'playlist':
    case 'viz':
      wins[name].show();
      break;
    default:
      break;
  }
});

ipcMain.on('hideWindow', (ev, arg) => {
  let name = arg.window;
  switch (name) {
    case 'playlist':
    case 'viz':
      hideWindow(name);
      break;
    default:
      break;
  }
});

ipcMain.on('vizData', (ev, arg) => {
  //const buffer = arg.buffer;
  if (wins['viz']) {
    wins['viz'].webContents.send('vizData', arg);
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

// get-id takes an object with string param 'name'
// returns a number
// 0 indicates no named input provided
// -1 indicates name not found
ipcMain.handle('get-id', async (event, payload) => {
  // console.log('get-id triggered...');
  if (!payload || !payload.name) {
    return 0;
  } 
  const name = payload.name.toLowerCase();
  if (name == "main") {
    return mainWindow.webContents.id;
  } else if (Object.keys(wins).includes(name)) {
    return wins[name].webContents.id;
  } else {
    return -1;
  }
});

//el fin//
