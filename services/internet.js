import dns from "dns/promises";

const TEST_URL = "https://www.msftconnecttest.com/connecttest.txt";

export async function internetAvailable() {
  try {
    await dns.lookup("1.1.1.1");
    const response = await fetch(TEST_URL, { method: "GET", timeout: 8000 });
    return response.ok && (await response.text()).includes("Microsoft Connect Test");
  } catch {
    return false;
  }
}
