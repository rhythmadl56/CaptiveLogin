import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("portalPilotApi", {
  saveSettings: (settings) => ipcRenderer.invoke("save-settings", settings),
  getSettings: () => ipcRenderer.invoke("get-settings"),
  saveCredentials: (username, password) => ipcRenderer.invoke("save-credentials", username, password),
});
