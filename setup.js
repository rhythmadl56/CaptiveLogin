import readline from "readline";
import { saveCredentials } from "./credentials.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Username: ", (username) => {

    rl.question("Password: ", async (password) => {

        await saveCredentials(
            username,
            password
        );

        console.log("Credentials saved.");

        rl.close();

    });

});