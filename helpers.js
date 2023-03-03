import { msg } from './utils.js';

export function createHelpers({ config, utils, taskId }) {
    function parseCmdLine(cmdLine) {
        return cmdLine.split(' ');
    }

    function isTaskDirExists() {
        return utils.dirExists(taskId);
    }

    function updateOrigin() {
        if (isOriginDirExists()) {
            msg('UPDATING ORIGIN:', config.originDir);
            gitPull();
        } else {
            msg('CLONING REPO:', config.repo, 'to', config.originDir);
            cloneOrigin();
        }
    }

    function isOriginDirExists() {
        return utils.dirExists(config.originDir);
    }

    function cloneOrigin() {
        utils.bash(`git clone ${config.repo} ${config.originDir}`);
    }

    function gitPull() {
        utils.bash('cd .origin && git pull');
    }

    function copyOriginToTaskDir() {
        utils.bash(`cp -r ${config.originDir} ${taskId}`);
    }

    function checkoutTaskBranch() {
        const branchName = config.branches.inLowerCase
            ? taskId.toLowerCase()
            : taskId;

        msg('CHECKING CREATING BRANCH:', branchName);
        utils.bash(`cd ${taskId} && git checkout -b ${branchName}`);
    }

    function installDeps() {
        msg('INSTALLING DEPS');
        utils.bash(`cd ${taskId} && ${config.commands.installDeps}`);
    }

    return {
        parseCmdLine,
        isTaskDirExists,
        updateOrigin,
        copyOriginToTaskDir,
        checkoutTaskBranch,
        installDeps,
    };
}
