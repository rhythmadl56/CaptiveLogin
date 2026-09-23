import keytar from "keytar";

const SERVICE = "PortalPilot";

export async function saveCredentials(username, password) {
    await keytar.setPassword(SERVICE, "username", username);
    await keytar.setPassword(SERVICE, "password", password);
}

export async function getCredentials() {

    const username = await keytar.getPassword(
        SERVICE,
        "username"
    );

    const password = await keytar.getPassword(
        SERVICE,
        "password"
    );

    return {
        username,
        password
    };
}