import path from 'path';
import fs from 'fs';

export function createFsApi({ api }) {
    function setWorkingDir(dir) {
        const fullPath = resolvePath(dir);
        api.msg('WORKING DIR:', fullPath);
        process.chdir(fullPath);
    }

    function dirExists(dir) {
        const fullPath = resolvePath(dir);
        return fs.existsSync(fullPath);
    }

    function createDir(dir) {
        const fullPath = resolvePath(dir);
        api.msg('CREATING DIR:', fullPath);
        api.bash(`mkdir ${fullPath}`);
    }

    function createDirNotExist(dir) {
        const fullPath = resolvePath(dir);
        if (!dirExists(fullPath)) {
            createDir(fullPath);
        }
    }

    function resolvePath(dir) {
        if (dir[0] === '~') {
            return path.join(process.env.HOME, dir.slice(1));
        }

        return path.resolve(dir);
    }

    function copyDir(from, to) {
        api.bash(`cp -r ${from} ${to}`);
    }

    return {
        dirExists,
        createDirNotExist,
        resolvePath,
        copyDir,
    };
}
