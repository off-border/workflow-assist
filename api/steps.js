export function createStepsApi({ api, config }) {
    function isOriginDirExists() {
        return api.fs.dirExists(config.originDir);
    }

    function updateOrigin() {
        if (isOriginDirExists()) {
            api.msg('UPDATING ORIGIN:', config.originDir);
            api.git.pull(config.originDir);
        } else {
            api.msg('CLONING REPO:', config.repo, 'to', config.originDir);
            api.git.clone(config.repo, config.originDir);
        }
    }

    function copyOriginToTaskDir(taskId) {
        api.fs.copyDir(config.originDir, taskId);
    }

    function createTaskBranch(taskId) {
        api.git.createBranch(taskId);
        const branchName = config.branches.inLowerCase
            ? taskId.toLowerCase()
            : taskId;

        api.msg('CREATING BRANCH:', branchName);
        api.git.createBranch(taskId, branchName);
    }

    function installDeps(taskId) {
        api.bash(`cd ${taskId} && ${config.commands.installDeps}`);
    }

    return {
        updateOrigin,
        copyOriginToTaskDir,
        createTaskBranch,
        installDeps,
    };
}
