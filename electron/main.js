import path from "path";
import { app, BrowserWindow, Tray, nativeImage, ipcMain, Menu } from "electron";
import isDev from "electron-is-dev";
import log from "electron-log";
import { startBackgroundMonitor } from "../services/monitor.js";
import { getSettings, saveSettings } from "../services/settings.js";
import { ensureAutoLaunch, disableAutoLaunch } from "../services/autoLaunch.js";
import { saveCredentials } from "../services/credentials.js";

log.catchErrors({ showDialog: false });
log.transports.file.level = "info";
log.transports.console.level = "warn";

const APP_TITLE = "PortalPilot";
let mainWindow;
let tray;

const getRendererPath = () => {
  if (isDev) {
    return "http://localhost:5173";
  }

  return `file://${path.join(app.getAppPath(), "dist", "index.html")}`;
};

const createWindow = async () => {
  const settings = await getSettings();

  mainWindow = new BrowserWindow({
    width: 480,
    height: 560,
    title: APP_TITLE,
    show: false,
    resizable: false,
    webPreferences: {
      preload: path.join(app.getAppPath(), "electron", "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    await mainWindow.loadURL(getRendererPath());
  } else {
    await mainWindow.loadURL(getRendererPath());
  }

  mainWindow.on("close", (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.once("ready-to-show", () => {
    if (settings.firstRun) {
      mainWindow.show();
    } else {
      mainWindow.hide();
    }
  });
};

const createTray = () => {
  const iconPath = path.join(app.getAppPath(), "public", "icons.svg");
  const image = nativeImage.createFromPath(iconPath);

  tray = new Tray(image);
  tray.setToolTip(APP_TITLE);
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "Open PortalPilot",
        click: () => mainWindow.show(),
      },
      {
        label: "Quit",
        click: () => {
          app.quit();
        },
      },
    ]),
  );

  tray.on("double-click", () => mainWindow.show());
};

app.on("ready", async () => {
  app.setAppUserModelId("com.portalpilot.portalpilot");
  process.env.PORTAL_PILOT_USER_DATA = app.getPath("userData");

  log.info("App ready");

  await createWindow();
  createTray();

  ipcMain.handle("save-settings", async (_, settings) => {
    await saveSettings(settings);
    if (settings.launchAtStartup) {
      await ensureAutoLaunch();
    } else {
      await disableAutoLaunch();
    }
    return true;
  });

  ipcMain.handle("get-settings", async () => getSettings());
  ipcMain.handle("save-credentials", async (_, username, password) => {
    await saveCredentials(username, password);
    return true;
  });

  startBackgroundMonitor({ logger: log, showWindow: () => mainWindow.show() });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("before-quit", () => {
  log.info("App shutting down");
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
