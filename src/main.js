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
const path = require('path');
require('./db');

// Quit when all windows are closed.
app.on('window-all-closed', () => {
// On OS X it is common for applications and their menu bar
// to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// Global references
let appIcon;
let preferencesWindow;
let playerWindow;

app.on('ready', () => {
    let img = nativeImage.createFromPath(process.cwd() + '/images/icon.png');
    appIcon = new Tray(img);
    let appInterfaceManuItem = new MenuItem({
        label: 'Launch Player',
        click() {
            playerWindow.loadURL(`file://${__dirname}/views/library.html`);
            playerWindow.show();
        }
    });
    let item = new MenuItem({
        label: 'Launch Web Interface',
        click() {
            childProcess.exec('open http://localhost:3000');
        }
    });

    playerWindow = new BrowserWindow({ width: 500, height: 600, show: false, resizable: true });
    preferencesWindow = new BrowserWindow({ width: 500, height: 600, show: false, resizable: false });

    let launchPreferences = function() {
        let configPath = path.resolve(__dirname, '../config.json');
        console.log(configPath);
        UserPreferences.loadFromFile(configPath).then(() => {
            preferencesWindow.loadURL('file://' + __dirname + '/views/preferences.html');
            preferencesWindow.show();
        }).catch((err) => {
            console.error(err);
        });
    };

    var contextMenu = Menu.buildFromTemplate([
        new MenuItem({ label: 'Preferences...', click: launchPreferences }),
        new MenuItem({ type: 'separator' }),
        appInterfaceManuItem,
        item,
        new MenuItem({ type: 'separator' }),
        new MenuItem({ label: 'Quit', click: () => app.quit() })
    ]);
    appIcon.setToolTip('This is my application.');
    appIcon.setContextMenu(contextMenu);

    server.run();

    launchPreferences();
});
