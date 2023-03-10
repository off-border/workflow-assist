export function createStepsApi({ api, config }) {
    function getOriginDir() {
        return api.fs.resolveSubdir(config.rootDir, config.originDir);
    }

    function getTaskDir(taskId) {
        return api.fs.resolveSubdir(config.rootDir, taskId);
    }

    // const originDir = getOriginDir();

    function isOriginDirExists() {
        return api.fs.dirExists(getOriginDir());
    }

    function updateOrigin() {
        if (isOriginDirExists()) {
            api.msg('UPDATING ORIGIN:', getOriginDir());
            api.git.pull(getOriginDir());
        } else {
            api.msg('CLONING REPO:', config.repo, 'to', getOriginDir());
            api.git.clone(config.repo, getOriginDir());
        }
    }

    function copyOriginToTaskDir(taskId) {
        api.fs.copyDir(getOriginDir(), getTaskDir(taskId));
    }

    function createTaskBranch(taskId) {
        const branchName = config.branches.inLowerCase
            ? taskId.toLowerCase()
            : taskId;

        api.msg('CREATING BRANCH:', branchName);
        api.git.createBranch(getTaskDir(taskId), branchName);
    }

    function installDeps(taskId) {
        api.bash(`cd ${getTaskDir(taskId)} && ${config.commands.installDeps}`);
    }

    return {
        updateOrigin,
        copyOriginToTaskDir,
        createTaskBranch,
        installDeps,
    };
}
