import { join } from "path";
import { loadConfig } from "../config-loader.js";
import { resolvePath } from "./fs.js";
import { error } from "./msg.js";
import { getCurrentBranch } from "./git.js";

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

async function getTaskIdFromBranch(branch: string = getCurrentBranch()) {
    const config = await loadConfig();
    const extractRegex = config.commits.taskId.extractRegex;

    if (!extractRegex) {
        return branch;
    }

    const extractedTaskId = branch.match(extractRegex)?.[0];

    if (!extractedTaskId) {
        error(`Failed to extract taskId from branch: ${branch}`);
        throw new Error('Failed to extract taskId from branch');
    }

    const taskId = config.commits.taskId.upperCase
        ? extractedTaskId.toUpperCase()
        : extractedTaskId;

    return taskId;

}

function getEscapedTaskId(taskId: string) {
    return taskId.replace(/\//g, '_');
}   

export {
    getTaskDir,
    getTaskIdFromBranch,
}