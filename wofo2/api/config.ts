import { join } from "path";
import { loadConfig } from "../../utils/config-loader/config-loader";
import { resolvePath, dirExists } from "./fs.js";

async function taskDirExists() {
    const config = await loadConfig();
    const rootDir = resolvePath(config.rootDir);
    const taskDir = join(rootDir, config.taskDir);
    return !dirExists(taskDir);
}