import { getSettings } from "./settings.js";
import { internetAvailable } from "./internet.js";
import { currentWifiSSID, connectToWifi } from "./wifi.js";
import { LoginService } from "./login.js";
import { getCredentials, hasCredentials } from "./credentials.js";

const INTERNET_CHECK_INTERVAL = 10000;
const LOGIN_RETRY_DELAY = 30000;

export async function startBackgroundMonitor({ logger, showWindow }) {
  const loginService = new LoginService(logger);

  async function performCheck() {
    try {
      const settings = await getSettings();
      if (!settings.wifiSSID) {
        logger.warn("WiFi SSID not configured. Waiting for setup.");
        return;
      }

      const connectedSsid = await currentWifiSSID();
      if (connectedSsid !== settings.wifiSSID) {
        logger.info(`Connecting to SSID: ${settings.wifiSSID}`);
        await connectToWifi(settings.wifiSSID);
      }

      const hasInternet = await internetAvailable();
      if (hasInternet) {
        logger.info("Internet is already available.");
        return;
      }

      logger.info("Internet unavailable. Checking captive portal login.");
      const hasCreds = await hasCredentials();
      if (!hasCreds) {
        logger.error("Credentials not available. Showing setup window.");
        showWindow();
        return;
      }

      const loginSuccess = await loginService.execute();
      if (!loginSuccess) {
        logger.warn(`Login failed; retrying in ${LOGIN_RETRY_DELAY / 1000} seconds.`);
        setTimeout(() => void performCheck(), LOGIN_RETRY_DELAY);
      }
    } catch (error) {
      logger.error(`Background monitor error: ${error.message}`);
    }
  }

  setInterval(() => void performCheck(), INTERNET_CHECK_INTERVAL);
  await performCheck();
}
