'use strict';
const electron = require('electron');
const childProcess = require('child_process');
const app = electron.app;  // Module to control application life.
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;
const MenuItem = electron.MenuItem;
const Tray = electron.Tray;
const nativeImage = electron.nativeImage;
const UserPreferences = require('./preferences/userPreferences');

const server = require('./server');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', () => {
// On OS X it is common for applications and their menu bar
// to stay active until the user quits explicitly with Cmd + Q

    if (process.platform != 'darwin') {
        app.quit();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
let appIcon;

let preferencesWindow;

app.on('ready', () => {
    let img = nativeImage.createFromPath(process.cwd() + '/images/icon.png');
    appIcon = new Tray(img);
    let item = new MenuItem({
        label: 'Launch Web Interface',
        click: function() {
            childProcess.exec('open http://localhost:8000');
        }
    });

    preferencesWindow = new BrowserWindow({ width: 500, height: 600, show: false });

    let launchPreferences = function() {
        UserPreferences.loadFromFile('/Users/christianbenincasa/Desktop/prefs.json').then(function(prefs) {
            console.log(prefs);
            preferencesWindow.loadUrl('localhost:3000/library');
            preferencesWindow.show();
        }).catch(function(err) {
            console.error(err);
        });
    };

    var contextMenu = Menu.buildFromTemplate([
        new MenuItem({ label: 'Preferences...', click: launchPreferences }),
        new MenuItem({ type: 'separator' }),
        item,
        new MenuItem({ type: 'separator' }),
        new MenuItem({ label: 'Quit' })
    ]);
    appIcon.setToolTip('This is my application.');
    appIcon.setContextMenu(contextMenu);

    server.run();
});
