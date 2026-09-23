import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export async function currentWifiSSID() {
  try {
    const { stdout } = await execAsync("netsh wlan show interfaces");
    const match = stdout.match(/\s*SSid\s*:\s*(.+)/i);
    return match ? match[1].trim() : null;
  } catch {
    return null;
  }
}

export async function connectToWifi(ssid) {
  if (!ssid) {
    throw new Error("WiFi SSID is required");
  }

  try {
    await execAsync(`netsh wlan connect name="${ssid}" ssid="${ssid}"`);
  } catch (error) {
    throw new Error(`Failed to connect to WiFi SSID ${ssid}: ${error.message}`);
  }
}
