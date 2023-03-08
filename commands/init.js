export function createInitCommand({ api, config }) {
    return function init() {
        api.fs.createDirNotExist(config.rootDir);
    };
}
