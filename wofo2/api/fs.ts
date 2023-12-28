import path from 'path';
import fs from 'fs';
import { msg } from './msg.js';

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


    function resolvePath(dir: string) {
        if (dir[0] === '~') {
            return path.join(process.env.HOME!, dir.slice(1));
        }

        return path.resolve(dir);
    }

    export {
        dirExists,
        resolvePath,
    }
