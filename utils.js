import { execSync } from 'child_process';
import fs from 'fs'
import path from 'path';

export function bash(cmd) {
    return execSync(cmd, { encoding: 'utf-8' });
}

export function setWorkingDir(dir) {
    console.log('---setWorkingDir', dir);
    
    process.chdir(path.resolve(dir));
}

export function dirExists(dir) {
    return fs.existsSync(dir)
}

export function createDirNotExist(dir) {
    if (!dirExists) {
        bash(`mdkir ${dir}`);
    }
}
