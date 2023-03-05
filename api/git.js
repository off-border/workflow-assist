export function createGitApi({ api }) {
    // function updateOrigin() {
    //     if (isOriginDirExists()) {
    //         msg('UPDATING ORIGIN:', config.originDir);
    //         gitPull();
    //     } else {
    //         msg('CLONING REPO:', config.repo, 'to', config.originDir);
    //         cloneOrigin();
    //     }
    // }

    function cloneOrigin() {
        utils.bash(`git clone ${config.repo} ${config.originDir}`);
    }

    function gitPull() {
        utils.bash('cd .origin && git pull');
    }

    // function createTaskBtanch() {
    //     const branchName = config.branches.inLowerCase
    //         ? taskId.toLowerCase()
    //         : taskId;

    //     msg('CHECKING CREATING BRANCH:', branchName);
    //     utils.bash(`cd ${taskId} && git checkout -b ${branchName}`);
    // }

    function getCurrentBranch() {
        return api
            .bash('git branch --show-current', { silent: true })
            .split('\n')[0];
    }

    function getCurrentTaskId() {
        return getCurrentBranch().toUpperCase();
    }

    function commit(message) {
        api.bash(`git commit -m "${message}"`);
    }

    function clone(repo, to) {
        api.bash(`git clone ${repo} ${to}`);
    }

    function pull(path) {
        api.bash(`cd ${path} && git pull`);
    }

    function createBranch(path, branchName) {
        api.bash(`cd ${path} && git checkout -b ${branchName}`);
    }

    return {
        // updateOrigin,
        // createTaskBtanch,
        getCurrentTaskId,
        clone,
        pull,
        commit,
        createBranch,
    };
}