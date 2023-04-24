export function createRebaseCommand({ api, config }) {
    return function rebase() {
        api.msg('REBASING');
        const taskPath = api.fs.getCurrentDir();
        const { remoteName, branchName } = api.git.getUpstream(taskPath);

        api.msg('FETCH:', remoteName, branchName);
        api.git.fetch(taskPath, { remoteName, branchName });
        api.msg('REBASE BY:', remoteName, branchName);
        api.git.rebase(taskPath, { remoteName, branchName });
    };
}
