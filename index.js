const {app, BrowserWindow, autoUpdater, dialog} = require('electron')
const path = require("path");
const logger = require('electron-log')

let mainWindow;

app.on('ready', () => {
    // initUpdater()

    mainWindow = new BrowserWindow({
        width: 1400,
        height: 1400,
        show: true,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })

    mainWindow.loadURL(path.join('file://', __dirname, 'index.html'))
    // mainWindow.loadFile('index.html')

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })
})

function log(...args) {
    logger.log(...args)
}

function initUpdater() {
    const host = 'https://update.electronjs.org'
    const repo = 'https://github.com/bvlcsae/electron-test.git'
    // const feedURL = `${host}/${repo}/${process.platform}-${process.arch}/${app.getVersion()}`
    const feedURL = `${host}/${repo}/${process.platform}-${process.arch}/${app.getVersion()}`
    const requestHeaders = { 'User-Agent': userAgent }

    autoUpdater.setFeedURL(feedURL, requestHeaders)

    autoUpdater.on('error', err => {
        log('updater error')
        log(err)
    })

    autoUpdater.on('checking-for-update', () => {
        log('checking-for-update')
    })

    autoUpdater.on('update-available', () => {
        log('update-available; downloading...')
    })

    autoUpdater.on('update-not-available', () => {
        log('update-not-available')
    })

    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateURL) => {
        log('update-downloaded', [event, releaseNotes, releaseName, releaseDate, updateURL])

        const dialogOpts = {
            type: 'info',
            buttons: ['Restart', 'Later'],
            title: 'Application Update',
            message: process.platform === 'win32' ? releaseNotes : releaseName,
            detail: 'A new version has been downloaded. Restart the application to apply the updates.'
        }

        dialog.showMessageBox(dialogOpts).then(({response}) => {
            if (response === 0) autoUpdater.quitAndInstall()
        })
    })

    // check for updates right away and keep checking later
    autoUpdater.checkForUpdates()
    setInterval(() => {
        autoUpdater.checkForUpdates()
    }, ms(updateInterval))
}
