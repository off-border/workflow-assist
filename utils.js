import { execSync } from 'child_process';
import fs from 'fs'
import path from 'path';

export function bash(cmd) {
    msg(cmd);
    return execSync(cmd, { encoding: 'utf-8' });
}

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
    const fullPath = resolvePath(dir)
    if (!dirExists(fullPath)) {
        createDir(fullPath)
    }
}

export function resolvePath(dir) {
    if (dir[0] === '~') {
        return path.join(process.env.HOME, dir.slice(1));
    }

    return path.resolve(dir)
}

export function msg(...args) {
    console.log('\n', ...args);
}