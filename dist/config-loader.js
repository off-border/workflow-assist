import path from 'path';
import { fileURLToPath } from 'url';
const CONFIG_NAME = '.workflow.config.js';
export async function loadConfig(cwd = process.env.PWD, requireFile) {
    const config = await searchInTree(cwd, CONFIG_NAME, requireFile);
    if (config) {
        return config;
    }
    throw new Error('CONFIG NOT FOUND');
}
async function searchInTree(dir, file, requireFile) {
    let pathArr = dir.split('/');
    let config, error;
    while (!config && pathArr.length) {
        ({ config, error } = await tryRequire(pathArr, CONFIG_NAME, requireFile));
        if (error && !error.code?.includes('ERR_MODULE_NOT_FOUND')) {
            throw error;
        }
        pathArr.pop();
    }
    if (error) {
        throw error;
    }
    return config;
}
async function tryRequire(dirArr, file, requireFile) {
    if (requireFile) {
        try {
            const config = await requireFile(path.join(...dirArr, file));
            return { config };
        }
        catch (e) {
            return { error: e };
        }
    }
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const absolutePath = path.join('/', ...dirArr, file);
    const basePath = __dirname;
    let relativePath = path.relative(basePath, absolutePath);
    // console.log('--- tryig to load from:', relativePath);
    if (relativePath === '.workflow.config.js') {
        relativePath = './.workflow.config.js';
    }
    try {
        const modul = await import(relativePath);
        return { config: modul.default };
    }
    catch (e) {
        return { error: e };
    }
}
