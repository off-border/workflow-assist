import { createRequire } from 'module';
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
    let config;
    while (!config && pathArr.length) {
        config = await tryRequire(pathArr, CONFIG_NAME, requireFile);
        pathArr.pop();
    }

    return config;
}

async function tryRequire(dirArr, file, requireFile) {
    if (requireFile) {
        try {
            return requireFile(path.join(...dirArr, file));
        } catch (e) {
            return null;
        }
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const absolutePath = path.join('/', ...dirArr, file);
    const basePath = __dirname;
    let relativePath = path.relative(basePath, absolutePath);

    console.log('\n---fullpath', absolutePath);
    console.log('---basePath', basePath);
    console.log('---relativePath', relativePath);

    if (relativePath === '.workflow.config.js') {
        relativePath = './.workflow.config.js';
    }

    try {
        const modul = await import(relativePath);
        console.log('---loaded module:', modul);

        return modul.default;

        // return createRequire(basePath)(relativePath);
    } catch (e) {
        console.log('---- not found in:', relativePath);
        return null;
    }
}
