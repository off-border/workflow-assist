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

    function fetch(path, { remoteName = 'origin', branchName }) {
        api.bash(`cd ${path} && git fetch ${remoteName} ${branchName}`);
    }

    function checkout(path, branchName) {
        api.bash(`cd ${path} && git checkout ${branchName}`);
    }

    function createBranch(path, branchName) {
        api.bash(`cd ${path} && git checkout -b ${branchName}`);
    }

    function getUpstream(path) {
        const output = api.bash(
            `cd ${path} && git rev-parse --abbrev-ref @{upstream}`
        );

        const nameParts = output.split('/');
        const remoteName = nameParts.shift();
        const branchName = nameParts.join('/');

        return { remoteName, branchName };
    }

    function rebase(path, { remoteName, branchName: remoteBranch }) {
        // https://stackoverflow.com/questions/29914052/how-to-git-rebase-a-branch-with-the-onto-command/29916361#29916361
        api.bash(
            `cd ${path} && git rebase --onto ${remoteName}/${remoteBranch} HEAD^`
        );
    }

    return {
        clone,
        pull,
        fetch,
        checkout,
        commit,
        createBranch,
        getCurrentBranch,
        getUpstream,
        rebase,
    };
}
