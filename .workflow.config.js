export default {
    // your project repo
    repo: 'git@github.com:off-border/workflow-assist.git',

    // where you want your working copies to be put
    rootDir: '~/tasks',

    // where to keep the main repo copy. this will be a subdir in your rootDir
    originDir: '.origin',

    // configure a new task branches creation and rebasing
    branches: {
        // a branch that tasks branches will be created from and rebased on
        baseBranch: 'master',
        // always convert task-id to lowercase (TASK-1234 -> task-1234)
        inLowerCase: true,
        // max length of the task branch name
        maxLength: 50,
    },

    // to switch whether it should create a new folder for task or use the current one
    copyOriginToTaskDir: true,

    // hooks
    hooks: {
        // command to run after cloning/pulling repo
        taskCopyReady: [
            // instal deps
            'yarn',
            // launch vscode
            'upen -a "Visual Studio Code" $TASK_DIR',
        ],
    },

    // commits config
    commits: {
        // how to format task-id in the commit message
        taskId: {
            // regEx to extract task id from current branch name
            // e.g. here will be extracted:
            //    TASK-1234 from TASK-1234-some-text
            //    !1234 from !1234-some-text
            extractRegex: /(\w+)/i,

            // convert task id to upper case (task-1234 -> TASK-1234)
            upperCase: true,
        },

        // header fields separator (e.g. "TASK-1234 | type | message")
        headerSeparator: ' / ',

        // use first word of the message as commit type
        // (e.g. "wofo commit 'some commit message'" -> "TASK-1234 | some | commit message)
        firstWordAsCommitType: false,
    },
};
