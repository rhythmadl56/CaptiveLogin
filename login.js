import { chromium } from "playwright";
import { getCredentials } from "./credentials.js";

const PORTAL_URL = "https://192.168.100.1:6082/php/uid.php";

(async () => {
    console.log("Launching browser...");

    const browser = await chromium.launch({
        headless: false,
        args: [
            "--ignore-certificate-errors",
            "--allow-insecure-localhost",
            "--disable-web-security"
        ]
    });

    const context = await browser.newContext({
        ignoreHTTPSErrors: true
    });

    const page = await context.newPage();

    try {
        console.log("Triggering captive portal...");

        await page.goto("http://neverssl.com", {
            waitUntil: "commit",
            timeout: 10000
        });

    } catch (err) {
        console.log("Navigation interrupted (expected on captive portals).");
    }

    console.log("Current URL:", page.url());
    console.log("Page title:", await page.title());

    try {
        await page.waitForTimeout(1000);
        await page.keyboard.type("thisisunsafe");
        await page.waitForTimeout(2000);
    } catch (e) {

    }

    console.log("Current URL:", page.url());

    try {

        console.log("Waiting for login form...");

        await page.waitForSelector("#user", {
            timeout: 15000
        });

        console.log("Login form detected.");

        // Read credentials from Windows Credential Manager
        const creds = await getCredentials();

        const USERNAME = creds.username;
        const PASSWORD = creds.password;  

        await page.locator("#user").fill(USERNAME);
        await page.locator("#passwd").fill(PASSWORD);

        console.log("Credentials entered.");

        // Small delay so JavaScript can enable the button
        await page.waitForTimeout(500);

        console.log("Submitting login...");

        // First try pressing Enter
        await page.locator("#passwd").press("Enter");

        // Wait a few seconds to see if login succeeded
        await page.waitForTimeout(3000);

        // If still on login page, click button
        if (await page.locator("#user").isVisible().catch(() => false)) {

            console.log("Still on login page. Trying button click...");

            await page.locator("#submit").click();

        }

        console.log("Login request submitted.");

        // Wait to observe result
        await page.waitForTimeout(10000);

    } catch (err) {

        console.error("Automation failed:");
        console.error(err);

        await page.screenshot({
            path: "error.png",
            fullPage: true
        });

        console.log("Screenshot saved as error.png");
    }

    console.log("Press Ctrl+C to close or close the browser manually.");

    // Leave browser open for debugging
})();