export function createRebaseCommand({ api, config }) {
    return function rebase() {
        api.msg('REBASING');
        const taskPath = api.fs.getCurrentDir();
        // const { remoteName, branchName } = api.git.getUpstream(taskPath);
        const originName = 'origin';
        const baseBranch = config.branches.baseBranch ?? 'master';

        api.msg('FETCH:', originName, baseBranch);
        api.git.fetch(taskPath, {
            remoteName: originName,
            branchName: baseBranch,
        });
        api.msg('REBASE BY:', originName, baseBranch);
        api.git.rebase(taskPath, {
            remoteName: originName,
            branchName: baseBranch,
        });
    };
}
