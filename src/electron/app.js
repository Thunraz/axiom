const {app, BrowserWindow} = require('electron');
let win;

app.on('ready', () => {
    win = new BrowserWindow({
        width: 1024,
        height: 768,
        useContentSize: true,
        resizable: false
    });
    win.loadURL(`file://${__dirname}/index.html`);
    //win.webContents.openDevTools({ mode: 'undocked' });
    win.on('closed', () => { win = null });
});

app.on('window-all-closed', () => { app.quit(); });