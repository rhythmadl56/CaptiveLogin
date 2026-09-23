import { chromium } from "playwright";
import { getCredentials } from "./credentials.js";

const PORTAL_URL = "http://neverssl.com";
const LOGIN_TIMEOUT = 20000;

export class LoginService {
  constructor(logger) {
    this.logger = logger;
    this.loginInProgress = false;
  }

  async execute() {
    if (this.loginInProgress) {
      this.logger.info("Login already in progress; skipping duplicate attempt.");
      return false;
    }

    this.loginInProgress = true;
    let browser;

    try {
      const creds = await getCredentials();
      if (!creds.username || !creds.password) {
        throw new Error("Missing saved credentials");
      }

      this.logger.info("Starting Playwright login flow.");
      browser = await chromium.launch({
        headless: true,
        args: [
          "--ignore-certificate-errors",
          "--allow-insecure-localhost",
          "--disable-web-security",
        ],
      });

      const context = await browser.newContext({ ignoreHTTPSErrors: true });
      const page = await context.newPage();

      try {
        await page.goto(PORTAL_URL, { waitUntil: "commit", timeout: 15000 });
      } catch (navigationError) {
        this.logger.info("Portal navigation likely redirected by captive portal.");
      }

      this.logger.info("Waiting for login page form...");
      await page.waitForSelector("#user", { timeout: 15000 });

      await page.locator("#user").fill(creds.username);
      await page.locator("#passwd").fill(creds.password);
      await page.waitForTimeout(500);
      await page.locator("#submit").click();
      await page.waitForLoadState("networkidle", { timeout: LOGIN_TIMEOUT }).catch(() => {});

      this.logger.info("Login form submitted.");
      await this.waitForPostLogin(page);
      this.logger.info("Login flow completed.");
      return true;
    } catch (error) {
      this.logger.error(`Login flow failed: ${error.message}`);
      return false;
    } finally {
      if (browser) {
        await browser.close().catch((closeError) => {
          this.logger.warn(`Failed to close browser cleanly: ${closeError.message}`);
        });
      }
      this.loginInProgress = false;
    }
  }

  async waitForPostLogin(page) {
    try {
      await Promise.race([
        page.waitForSelector("#user", { state: "hidden", timeout: 10000 }),
        page.waitForLoadState("networkidle", { timeout: 10000 }),
      ]);
      this.logger.info("Post-login page detected.");
    } catch {
      this.logger.info("Post-login detection timeout; continuing anyway.");
    }
  }
}
