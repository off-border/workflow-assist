export function createGitApi({ api }) {
    function getCurrentBranch() {
        return api
            .bash('git branch --show-current', { silent: true })
            .split('\n')[0];
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
        clone,
        pull,
        commit,
        createBranch,
        getCurrentBranch,
    };
}
