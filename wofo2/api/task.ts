import { join } from "path";
import { loadConfig } from "../config-loader.js";
import { resolvePath } from "./fs.js";

async function getTaskDir(taskId: string) {
    const config = await loadConfig();
    const rootDir = resolvePath(config.rootDir);
    const originDir = join(rootDir, config.originDir);

    if (config.copyOriginToTask === false) {
        return originDir;
    }

    const taskDir = join(rootDir, getEscapedTaskId(taskId));
    return taskDir;
}

function getEscapedTaskId(taskId: string) {
    return taskId.replace(/\//g, '_');
}   

export {
    getTaskDir,
}