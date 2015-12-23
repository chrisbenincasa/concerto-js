'use strict';
const electron = require('electron');
const childProcess = require('child_process');
const app = electron.app;  // Module to control application life.
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const Tray = electron.Tray;
const nativeImage = electron.nativeImage;

const server = require('./server');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
// On OS X it is common for applications and their menu bar
// to stay active until the user quits explicitly with Cmd + Q

    if (process.platform != 'darwin') {
        app.quit();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
let appIcon;

app.on('ready', function() {
    let img = nativeImage.createFromPath(process.cwd() + '/images/icon.png');
    appIcon = new Tray(img);
    let item = new MenuItem({
        label: 'Cool',
        click: function() {
            childProcess.exec('open http://localhost:8000');
        }
    });

    var contextMenu = Menu.buildFromTemplate([
        { label: 'Item1', type: 'radio' },
        { label: 'Item2', type: 'radio' },
        { label: 'Item3', type: 'radio', checked: true },
        { label: 'Item4', type: 'radio' },
        item
    ]);
    appIcon.setToolTip('This is my application.');
    appIcon.setContextMenu(contextMenu);

    server.run();
});
