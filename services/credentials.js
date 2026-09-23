import keytar from "keytar";

const SERVICE = "PortalPilot";
const USERNAME_ACCOUNT = "username";
const PASSWORD_ACCOUNT = "password";

export async function saveCredentials(username, password) {
  await keytar.setPassword(SERVICE, USERNAME_ACCOUNT, username);
  await keytar.setPassword(SERVICE, PASSWORD_ACCOUNT, password);
}

export async function getCredentials() {
  const username = await keytar.getPassword(SERVICE, USERNAME_ACCOUNT);
  const password = await keytar.getPassword(SERVICE, PASSWORD_ACCOUNT);
  return { username, password };
}

export async function hasCredentials() {
  const creds = await getCredentials();
  return Boolean(creds.username && creds.password);
}
