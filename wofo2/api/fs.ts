import path from 'path';
import fs from 'fs';
import { msg } from './msg.js';

    function setWorkingDir(dir:string) {
        const fullPath = resolvePath(dir);
        msg('WORKING DIR:', fullPath);
        process.chdir(fullPath);
    }

    function getCurrentDir() {
        return process.cwd();
    }

    function dirExists(dir: string) {
        const fullPath = resolvePath(dir);
        return fs.existsSync(fullPath);
        // return fs.existsSync(dir);
    }

    function createDir(dir: string) {
        const fullPath = resolvePath(dir);
        msg('CREATING DIR:', fullPath);
        // api.bash(`mkdir ${fullPath}`);
    }

    function createDirNotExist(dir: string) {
        const fullPath = resolvePath(dir);
        if (!dirExists(fullPath)) {
            createDir(fullPath);
        }
    }

    function resolvePath(dir: string) {
        if (dir[0] === '~') {
            return path.join(process.env.HOME!, dir.slice(1));
        }

        return path.resolve(dir);
    }

    function copyDir(from: string, to: string) {
        // api.bash(`cp -r ${from} ${to}`);
    }


    export {
        dirExists,
        resolvePath,
    }
