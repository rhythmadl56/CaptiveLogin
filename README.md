# CaptiveLogin

A small Windows/Electron automation tool that automatically logs into my hostel's captive Wi-Fi portal using saved credentials.

The project was built to eliminate the repetitive process of manually opening the hostel Wi-Fi login page and entering credentials whenever the session expires.

## What It Does

CaptiveLogin:

* Detects and opens the hostel's captive login portal
* Retrieves saved credentials securely from the Windows Credential Manager
* Automatically fills in the username and password
* Submits the login form
* Uses Playwright to automate the browser interaction

## How It Works

```text
Connect to Hostel Wi-Fi
          ↓
Captive Portal Appears
          ↓
CaptiveLogin Opens Portal
          ↓
Retrieve Saved Credentials
          ↓
Fill Username & Password
          ↓
Submit Login Form
          ↓
Internet Access
```

## Tech Stack

* **Electron** — Desktop application
* **Node.js** — Application runtime
* **Playwright** — Browser automation
* **Keytar** — Secure credential storage
* **Chromium** — Automated browser

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/rhythmadl56/CaptiveLogin.git
cd CaptiveLogin
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright Chromium

```bash
npx playwright install chromium
```

### 4. Save your credentials

Run:

```bash
node setup.js
```

Enter your hostel Wi-Fi username and password when prompted.

The credentials are stored using the system's credential manager through Keytar rather than being saved directly in the source code.

### 5. Start the application

```bash
npm start
```

## Important

This project was developed specifically for the captive Wi-Fi portal used by my hostel.

The portal URL, form fields, and authentication flow are currently configured for that environment, so **it is not designed to work with every captive portal**.

If your network uses a different captive portal, the automation logic will likely need to be modified.

## Why I Built It

This started as a simple personal automation project.

Having to repeatedly log into the hostel Wi-Fi portal was annoying, so I built a small Electron application to automate the process and experiment with browser automation, credential management, and desktop application development.

## Disclaimer

Use this only on networks you are authorized to access.

The project is intended to automate legitimate authentication, not to bypass network restrictions or gain unauthorized access.

## License

This project is licensed under the MIT License.
