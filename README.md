# Wofo: task development wofkflow assistant

## Usage

## start new task:

```bash
wofo start TASK-1234
```

this will:

1.  update repository:

    -   if it's not cloned yet:

        -   clone repo into `...tasks/.origin` dir

    -   if cloned:

        -   pull latest changes into `.origin` dir

2.  copy the local repo to `~/tasks/TASK-1234` subdir

3.  create new branch, named `TASK-1234`

    -   or `task-1234` if the lowecase is specified in **config.branches.inLowerCase:true**

4.  run **config.hooks.taskCopyReady** hook, (optional, see config) e.g.:

    -   install deps

    -   open VSCode with newly created task dir

## start new task derived from specific branch:

`wofo start TASK-1234 some-remote-branch`

this will do all the same except that before creating the task
branch the specified remote branch will be pulled and checked out first

## make commit

```bash
wofo commit "some commit message"
```

will make commit with the message:

`TASK-1234 | some commit message`

if **config.commits.firstWordAsCommitType** and **config.commits.headerSeparator** are specified:

`TASK-1234 | some | commit message`

if no **config.commits.headerSeparator** in config:

`TASK-1234 some commit message`

if no **config.commits.taskId** in config:

`some commit message`

## rebase on base branch

```bash
wofo rebase
```

will rebase current branch on **origin/<config.branches.baseBranch>**

## get info

### show current config

```bash
wofo show config
```

```bash
 > Workspace config:

 {
  repo: 'git@github.com:off-border/workflow-assist.git',
  rootDir: '~/tasks',
  originDir: '.origin',
...
```

### show current task

```bash
wofo show task
```

```
> Current task: TASK-1234
```

## Installation

0. `npm i -g wofo`
1. create your workflow directory (e.g. `~/tasks`)
2. create **.workflow.config.js** in the **workflow dir**
3. copy the following code to the config file and change the settings as you wish

```js
module.exports = {
    // your project repo
    repo: 'git@github.com:off-border/workflow-assist.git',

    // where you want your working copies to be put
    rootDir: '~/tasks',

    // where to keep the main repo copy. this will be a subdir in your rootDir
    originDir: '.origin',

    // configure a new task branches creation and rebasing
    branches: {
        // the branch which task branches will be created from and repased on
        baseBranch: 'master',
        // always convert task-id to lowercase (TASK-1234 -> task-1234)
        inLowerCase: true,
    },

    // hooks
    hooks: {
        // commands to run after copying .origin to a TASK-1234 dir
        taskCopyReady: [
            // install deps
            'yarn',
            'echo DEPS INSTALLED',
            // launch VSCode (for linux)
            'code $TASK_DIR &',
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

## Known issues

### no global .wofkflow.config.js yet

for now `wofo` command looks for config starting from current dir and goes up
until it finds `.wofkflow.config.js` in some of the parent dirs. That means the command
should be run in the direcory where the correct config file exists for this or one of the parent dirs.

### js/cjs config wrong format

for now only **.js** config files supported (no **.ts/.json**)

Config export format (**commonjs/esnext**) depends on the `package.json` **"type"**
section value. (e.g. `"type": "module"`)

If **wofo** command says that no config file found - try checking its export type correspondance to your
project **package.json** settings
