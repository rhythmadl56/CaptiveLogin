# Captive Login

Captive Login is a small automation tool that handles authentication for captive Wi-Fi portals automatically.

It was built to solve a simple but annoying problem: hostel Wi-Fi requires users to repeatedly authenticate through a web-based captive portal before accessing the internet. Captive Login automates that process so the user doesn't have to manually open the portal and log in every time.

## Features

* Automatically detects the captive login portal
* Automates username/password authentication
* Uses Playwright to interact with the portal
* Designed around hostel Wi-Fi captive portal environments
* Can be extended to run as a background service
* Credentials can be stored securely using the Windows Credential Manager

## How It Works

The basic workflow is:

```text
Connect to Hostel Wi-Fi
        ↓
Check Internet Connectivity
        ↓
Captive Portal Detected?
        ↓
Open Login Page
        ↓
Fill Credentials
        ↓
Submit Login Form
        ↓
Internet Access Restored
```

The browser automation is handled using **Playwright**, which interacts with the captive portal just like a normal browser session.

## Tech Stack

* **Node.js** — Application runtime
* **Playwright** — Browser automation
* **Windows netsh** — Wi-Fi/network interaction
* **Windows Credential Manager / keytar** — Secure credential storage

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/captive-login.git
cd captive-login
```

Install dependencies:

```bash
npm install
```

Install the Playwright browser:

```bash
npx playwright install chromium
```

Create your configuration/environment variables as required by the application.

Then run:

```bash
npm start
```

## Configuration

The application requires the credentials used by the captive portal.

For development, these should be provided through environment variables or another secure configuration method.

**Do not hard-code your Wi-Fi credentials into the source code.**

Example:

```env
WIFI_USERNAME=your_username
WIFI_PASSWORD=your_password
```

## Project Structure

```text
captive-login/
│
├── src/
│   ├── login.js
│   ├── network.js
│   └── ...
│
├── .env.example
├── package.json
├── package-lock.json
└── README.md
```

> The exact structure may vary depending on the current implementation.

## Why I Built This

This project started as a practical automation problem.

Having to repeatedly authenticate through a captive portal on hostel Wi-Fi was annoying, so instead of manually logging in every time, I experimented with automating the browser interaction.

It also served as a practical project for learning **browser automation, network connectivity detection, Windows networking commands, and credential management**.

## Limitations

This project is designed around a specific captive-portal workflow and may not work with every Wi-Fi provider or authentication system.

Changes to the captive portal's HTML structure, authentication flow, URLs, or security mechanisms may require changes to the automation logic.

## Disclaimer

This project is intended for use on networks where you are authorized to authenticate.

Do not use it to bypass network restrictions or access networks without permission.

## License

This project is licensed under the MIT License.
