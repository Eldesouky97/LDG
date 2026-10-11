import { cpSync, existsSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(new URL("../frontend/out/", import.meta.url));
const destination = fileURLToPath(new URL("./hosting/", import.meta.url));
if (!existsSync(source)) throw new Error("Build the frontend before deployment.");
// Start clean so files from earlier builds are not published again.
rmSync(destination, { recursive: true, force: true });
cpSync(source, destination, { recursive: true });
console.log("Prepared Firebase Hosting files.");
