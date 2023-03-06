import path from 'path';

const CONFIG_NAME = '.workflow.config.js';

export function loadConfig(cwd = process.cwd(), requireFile = require) {
    const config = searchInTree(cwd, CONFIG_NAME, requireFile);

    if (config) {
        return config;
    }

    throw new Error('CONFIG NOT FOUND');
}

function searchInTree(dir, file, requireFile) {
    let pathArr = dir.split('/');
    let config;
    while (!config && pathArr.length) {
        config = tryRequire(pathArr, CONFIG_NAME, requireFile);
        pathArr.pop();
    }

    return config;
}

function tryRequire(dirArr, file, requireFile) {
    try {
        return requireFile(path.join(...dirArr, file));
    } catch (e) {
        return null;
    }
}
