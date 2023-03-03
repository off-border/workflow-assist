import { msg } from './utils.js';

export const workflow =
    ({ config, utils }) =>
    (cmdLine) => {
        const [cmd, ...args] = parseCmdLine(cmdLine);

        const handlers = {
            start: startTask,
        };

        utils.createDirNotExist(config.rootDir);
        utils.setWorkingDir(config.rootDir);

        handlers[cmd]({ config, utils }, ...args);
    };

function parseCmdLine(cmdLine) {
    return cmdLine.split(' ');
}

function startTask({ config, utils }, taskId) {
    if (isTaskDirExists({ config, utils }, taskId)) {
        msg('TASK DIR ALREADY EXISTS:', utils.resolvePath(taskId));
        return;
    }

    msg('STARTING TASK:', taskId);
    updateOrigin({ config, utils });
    copyOriginToTaskDir({ config, utils }, taskId);
    installDeps({ config, utils }, taskId);

    msg('TASK DIR READY:', utils.resolvePath(taskId));
}

function isTaskDirExists({ config, utils }, tasiId) {
    return utils.dirExists(tasiId);
}

function updateOrigin({ config, utils }) {
    if (isOriginDirExists({ config, utils })) {
        msg('UPDATING ORIGIN:', config.originDir);
        gitPull({ config, utils });
    } else {
        msg('CLONING REPO:', config.repo, 'to', config.originDir);
        cloneOrigin({ config, utils });
    }
}

function isOriginDirExists({ config, utils }) {
    return utils.dirExists(config.originDir);
}

function cloneOrigin({ config, utils }) {
    utils.bash(`git clone ${config.repo} ${config.originDir}`);
}

function gitPull({ config, utils }) {
    utils.bash('cd .origin && git pull');
}

function copyOriginToTaskDir({ config, utils }, taskId) {
    utils.bash(`cp -r ${config.originDir} ${taskId}`);
}

function installDeps({ config, utils }, taskId) {
    msg('INSTALLING DEPS');
    utils.bash(`cd ${taskId} && ${config.commands.installDeps}`);
}
