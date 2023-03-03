export const workflow =
    ({ config, utils }) =>
    (cmdLine) => {
        const [cmd, ...args] = parseCmdLine(cmdLine);

        const handlers = {
            start: startTask,
        };

        console.log('---config', config);
        
        utils.createDirNotExist(config.rootDir);
        utils.setWorkingDir(config.rootDir);

        handlers[cmd]({ config, utils }, ...args);
    };

function parseCmdLine(cmdLine) {
    return cmdLine.split(" ");
}

function startTask({ config, utils }, taskId) {
    if (isTaskDirExists({config, utils}, taskId)) {
        return;
    }

    updateOrigin({ config, utils });
    copyOriginToTaskDir({ config, utils }, taskId);
    installDeps({config, utils}, taskId);
}

function isTaskDirExists({config, utils}, tasiId) {
    return utils.dirExists(tasiId)
}

function updateOrigin({ config, utils }) {
    if (isOriginDirExists({ config, utils})) {
        gitPull({ config, utils });
    } else {
        cloneOrigin({ config, utils });
    }
}

function isOriginDirExists({ config, utils}) {
    return utils.dirExists(config.originDir);
}

function cloneOrigin({ config, utils }) {
    utils.bash(`git clone ${config.repo} ${config.originDir}`);
}

function gitPull({ config, utils }) {
    utils.bash("cd .origin && git pull");
}

function copyOriginToTaskDir({ config, utils }, taskId) {
    utils.bash(`cp ${config.originDir} ${taskId}`);
}

function installDeps({ config, utils }, taskId) {
    utils.bash(`cd ${taskId} && ${config.commands.installDeps}`);
}
