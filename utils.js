import { execSync } from 'child_process';
import fs from 'fs'
import path from 'path';

export function bash(cmd) {
    return execSync(cmd, { encoding: 'utf-8' });
}

export function setWorkingDir(dir) {
    const fullPath = resolvePath(dir);
    console.log('---setWorkingDir', fullPath);
    
    process.chdir(fullPath);
}

export function dirExists(dir) {
    const fullPath = resolvePath(dir);
    return fs.existsSync(fullPath);
}

export function createDir(dir) {
    const fullPath = resolvePath(dir);
    console.log('---creating dir:', fullPath);
    

    bash(`mkdir ${fullPath}`);
}

export function createDirNotExist(dir) {
    const fullPath = resolvePath(dir)
    if (!dirExists(fullPath)) {
        createDir(fullPath)
    }
}

function resolvePath(dir) {
    if (dir[0] === '~') {
        return path.join(process.env.HOME, dir.slice(1));
    }

    return path.resolve(dir)
}
