# Wofo: task development wofkflow assistant

## Usage

### Installation

1. create your workflow directore (e.g. ~/tasks)
2. create .workflow.config.js in the workflow dir
3. put this code in the config file and change settings as you needed

```js
module.exports = {
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
            extractRegex: /(!\d+|TASK-\d+)/i,

            // convert task id to upper case (task-1234 -> TASK-1234)
            upperCase: true,
        },
    },
};
```

### start new task:

```bash
wofo start TASK-1234
```

this will:

1. update repository
   if it's not cloned yet - clone repo
   if cloned - pull latest changes
2. copy repo to `~/tasks/TASK-1234` subdir
3. install dependencies
4. create new branch, named `TASK-1234`
    - or `task-1234` if lowecase specified in config

### make commit

```bash
wofo commit "some commit message"
```

will create a commit with commit message:
`TASK-1234 | some commit message`
