# Wofo: task development wofkflow assistant

## Usage

### Installation

1. create your workflow directory (e.g. ~/tasks)
2. create .workflow.config.js in the workflow dir
3. put the following code in the config file and change settings as you needed

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
        // commands to run after cloning/pulling repo
        installDeps: ['yarn', 'echo DEPS INSTALLED'],
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

        // header fields separator (e.g. "TASK-1234 | type | message")
        headerSeparator: ' | ',

        // use the first word of the message as a commit type
        // (e.g. "wofo commit 'some commit message'" -> "TASK-1234 | some | commit message)
        firstWordAsCommitType: true,
    },
};
```

### start new task:

```bash
wofo start TASK-1234
```

this will:

1. update repository
   if it's not cloned yet
    - clone repo
      if cloned
    - pull latest changes
2. copy the repo to `~/tasks/TASK-1234` subdir
3. install dependencies (using config.commands.installDeps command)
4. create new branch, named `TASK-1234`
    - or `task-1234` if the lowecase is specified in config

### make commit

```bash
wofo commit "some commit message"
```

will create a commit with commit message:
`TASK-1234 | some commit message`
