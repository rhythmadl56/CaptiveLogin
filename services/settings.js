import fs from "fs/promises";
import path from "path";

const defaultSettings = {
  firstRun: true,
  wifiSSID: "",
  launchAtStartup: false,
  pollingIntervalSeconds: 10,
};

function settingsFilePath() {
  const base = process.env.PORTAL_PILOT_USER_DATA || process.cwd();
  return path.join(base, "settings.json");
}

export async function getSettings() {
  try {
    const raw = await fs.readFile(settingsFilePath(), "utf-8");
    return {
      ...defaultSettings,
      ...JSON.parse(raw),
    };
  } catch {
    return { ...defaultSettings };
  }
}

export async function saveSettings(settings) {
  const merged = {
    ...defaultSettings,
    ...settings,
    firstRun: false,
  };
  await fs.writeFile(settingsFilePath(), JSON.stringify(merged, null, 2), "utf-8");
  return merged;
}
