export interface PortalPilotApi {
  saveSettings: (settings: Record<string, unknown>) => Promise<boolean>;
  getSettings: () => Promise<Record<string, unknown>>;
  saveCredentials: (username: string, password: string) => Promise<boolean>;
}

declare global {
  interface Window {
    portalPilotApi: PortalPilotApi;
  }
}

export {};