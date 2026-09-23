import { useEffect, useState } from "react";

type SettingsForm = {
  wifiSSID: string;
  username: string;
  password: string;
  launchAtStartup: boolean;
};

const defaultForm: SettingsForm = {
  wifiSSID: "",
  username: "",
  password: "",
  launchAtStartup: false,
};

export default function App() {
  const [settings, setSettings] = useState<SettingsForm>(defaultForm);
  const [isReady, setIsReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    window.portalPilotApi
      .getSettings()
      .then((stored) => {
        if (stored && !stored.firstRun) {
          setSettings({ ...defaultForm, ...stored });
        }
      })
      .finally(() => setIsReady(true));
  }, []);

  const handleChange = (field: keyof SettingsForm) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = field === "launchAtStartup" ? event.target.checked : event.target.value;
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    if (!settings.wifiSSID || !settings.username || !settings.password) {
      setError("Please fill in all fields.");
      setSaving(false);
      return;
    }

    try {
      await window.portalPilotApi.saveSettings(settings);
      await window.portalPilotApi.saveCredentials(settings.username, settings.password);
      window.close();
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : String(saveError);
      setError(message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (!isReady) {
    return <div className="setup-loading">Loading…</div>;
  }

  return (
    <div className="setup-container">
      <div className="setup-card">
        <h1>PortalPilot Setup</h1>
        <p>Enter your WiFi SSID and captive portal credentials.</p>
        <form onSubmit={handleSubmit}>
          <label>
            WiFi SSID
            <input value={settings.wifiSSID} onChange={handleChange("wifiSSID")} />
          </label>
          <label>
            Username
            <input value={settings.username} onChange={handleChange("username")} />
          </label>
          <label>
            Password
            <input type="password" value={settings.password} onChange={handleChange("password")} />
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.launchAtStartup}
              onChange={handleChange("launchAtStartup")}
            />
            Launch at startup
          </label>

          {error ? <div className="error-message">{error}</div> : null}

          <button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save and continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
