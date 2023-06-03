export function createStepsApi({ api, config }) {
    const getTaskDir = api.tasks.getTaskDir;

    function getOriginDir() {
        return api.fs.resolveSubdir(config.rootDir, config.originDir);
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

    function checkoutRemoteBranch(taskId, remoteBranch) {
        api.msg('CHECKING OUT BRANCH:', taskId);
        api.git.fetch(getTaskDir(taskId), { branchName: remoteBranch });
        api.git.checkout(getTaskDir(taskId), remoteBranch);
    }

    function createTaskBranch(taskId) {
        const branchName = config.branches.inLowerCase
            ? taskId.toLowerCase()
            : taskId;

        api.msg('CREATING BRANCH:', branchName);
        api.git.createBranch(getTaskDir(taskId), branchName);
    }

    function runTaskDirReadyHook(taskId) {
        api.msg('TASK DIR READY HOOK FOR:', taskId);

        const onReadyHook = config.hooks?.taskCopyReady;
        if (!onReadyHook) {
            return;
        }

        process.env.TASK_DIR = getTaskDir(taskId);

        const isArrayOfStrings = Array.isArray(onReadyHook);
        const runTaskDirReadyHookCmd = isArrayOfStrings
            ? onReadyHook.join(' && ')
            : onReadyHook;
        api.bash(`cd ${getTaskDir(taskId)} && ${runTaskDirReadyHookCmd}`);
    }

    return {
        updateOrigin,
        copyOriginToTaskDir,
        createTaskBranch,
        checkoutRemoteBranch,
        runTaskDirReadyHook,
    };
}
