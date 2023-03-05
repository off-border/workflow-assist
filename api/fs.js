

export function setWorkingDir(dir) {
    const fullPath = resolvePath(dir);
    msg('WORKING DIR:', fullPath);
    process.chdir(fullPath);
}

export function dirExists(dir) {
    const fullPath = resolvePath(dir);
    return fs.existsSync(fullPath);
}

export function createDir(dir) {
    const fullPath = resolvePath(dir);
    msg('CREATING DIR:', fullPath);
    bash(`mkdir ${fullPath}`);
}

export function createDirNotExist(dir) {
    const fullPath = resolvePath(dir);
    if (!dirExists(fullPath)) {
        createDir(fullPath);
    }
}

export function resolvePath(dir) {
    if (dir[0] === '~') {
        return path.join(process.env.HOME, dir.slice(1));
    }

    return path.resolve(dir);
}
