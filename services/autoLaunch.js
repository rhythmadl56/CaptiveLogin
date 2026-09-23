import AutoLaunch from "auto-launch";

const portalPilotLauncher = new AutoLaunch({
  name: "PortalPilot",
});

export async function ensureAutoLaunch() {
  try {
    const enabled = await portalPilotLauncher.isEnabled();
    if (!enabled) {
      await portalPilotLauncher.enable();
    }
  } catch (error) {
    throw new Error(`Failed to enable auto launch: ${error.message}`);
  }
}

export async function disableAutoLaunch() {
  try {
    const enabled = await portalPilotLauncher.isEnabled();
    if (enabled) {
      await portalPilotLauncher.disable();
    }
  } catch (error) {
    throw new Error(`Failed to disable auto launch: ${error.message}`);
  }
}
