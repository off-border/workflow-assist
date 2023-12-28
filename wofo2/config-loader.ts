import path from 'path';
import { fileURLToPath } from 'url';

const CONFIG_NAME = '.workflow.config.js';

type RepoUrl = string;
type DirPath = string;
type BranchName = string;

type BashCommand = string;


type Config = {
    repo: RepoUrl;
    rootDir: DirPath;
    originDir: DirPath;
    branches: {
        baseBranch: BranchName;
        inLowerCase: boolean;
    }
    hooks: {
        taskCopyReady: BashCommand[];
        originUpdated: BashCommand[];
    };
    copyOriginToTask: boolean;
    commits: {
        taskId: {
            extractRegex: string;
            upperCase: boolean;
        }
        headerSeparator: string;
        firstWordAsCommitType: boolean;
    }
}

export async function loadConfig(cwd = process.env.PWD, requireFile?: () => unknown) {
    const config = await searchInTree(cwd!, CONFIG_NAME, requireFile);

    if (config) {
        return config as Config;
    }

    throw new Error('CONFIG NOT FOUND');
}

async function searchInTree(dir: string, file: string, requireFile?: () => unknown) {
    let pathArr = dir.split('/');
    let config, error: any;
    while (!config && pathArr.length) {
        ({ config, error } = await tryRequire(
            pathArr,
            CONFIG_NAME,
            requireFile
        ));

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

async function tryRequire(dirArr: string[], file: string, requireFile?: (path: string) => unknown) {
    if (requireFile) {
        try {
            const config = await requireFile(path.join(...dirArr, file));
            return { config };
        } catch (e) {
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
    } catch (e) {
        return { error: e };
    }
}
