export default {
    // your project repo
    repo: 'git@github.com:off-border/workflow-assist.git',

    // where you want your working copies to be put
    rootDir: '~/tasks',

    // where to keep the main repo copy. this will be a subdir in your rootDir
    originDir: '.origin',

    // configure a new task branch naming
    branches: {
        // always convert task-id to lowercase (TASK-1234 -> task-1234)
        inLowerCase: true,
    },

    // basic commands
    commands: {
        // command to run after cloning/pulling repo
        installDeps: 'yarn',
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
    },
};
