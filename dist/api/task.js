import { join } from "path";
import { loadConfig } from "../config-loader.js";
import { resolvePath } from "./fs.js";
import { error } from "./msg.js";
import { getCurrentBranch } from "./git.js";
import { bash } from "./bash.js";
async function getTaskDir(taskId) {
    const config = await loadConfig();
    const rootDir = resolvePath(config.rootDir);
    const originDir = join(rootDir, config.originDir);
    if (config.copyOriginToTask === false) {
        return originDir;
    }
    const taskDirectoryPrefix = config.tasks?.directoryPrefix || '';
    const taskDirName = taskDirectoryPrefix + getEscapedTaskId(taskId);
    const taskDir = join(rootDir, taskDirName);
    return taskDir;
}
async function getTaskIdFromBranch(branch = getCurrentBranch()) {
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
async function getTaskCommits(taskId) {
    const gitHistory = bash(`git log -n 50 --format="%s ### %H"`, { cwd: process.cwd(), silent: true });
    const taskCommits = gitHistory.split('\n').filter((line) => line.toLowerCase().startsWith(taskId.toLowerCase()));
    return taskCommits;
}
function getEscapedTaskId(taskId) {
    return taskId.replace(/\//g, '_');
}
async function getCommitMessage(taskId, type, message) {
    const config = await loadConfig();
    const headerSeparator = config.commits.headerSeparator || ' ';
    const firstWordAsCommitType = config.commits.firstWordAsCommitType;
    let commitMessage = config.commits.taskId
        ? `${taskId}${headerSeparator}${type}`
        : `${type}`;
    if (firstWordAsCommitType) {
        commitMessage += `${headerSeparator}`;
    }
    else {
        commitMessage += ' ';
    }
    commitMessage += `${message.join(' ')}`;
    return commitMessage;
}
export { getTaskDir, getTaskIdFromBranch, getTaskCommits, getCommitMessage, };
