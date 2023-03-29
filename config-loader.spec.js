import { loadConfig } from './config-loader';

const config = {
    originDir: '.origin',
};

const setup = ({ cwd, configPath, hasSyntaxError = false }) => {
    const requireFile = (path) => {
        if (hasSyntaxError) {
            throw new Error('SyntaxError: Unexpected token, expected ","');
        }

        if (path === configPath) {
            return config;
        }

        const error = new Error('ERR_MODULE_NOT_FOUND');
        error.code = 'ERR_MODULE_NOT_FOUND';

        throw error;
    };

    const load = () => loadConfig(cwd, requireFile);

    return {
        load,
    };
};

describe('config-loader', () => {
    describe('if config:', () => {
        describe('in the current working dir', () => {
            it('- load from cwd', async () => {
                const { load } = setup({
                    cwd: 'path/to/working/dir',
                    configPath: 'path/to/working/dir/.workflow.config.js',
                });

                const loadedConfig = await load();

                expect(loadedConfig).toEqual({ originDir: '.origin' });
            });
        });

        describe('in some of the parent dirs', () => {
            it('- find in parents recursively', async () => {
                const { load } = setup({
                    cwd: 'path/to/working/dir',
                    configPath: 'path/to/.workflow.config.js',
                });

                const loadedConfig = await load();

                expect(loadedConfig).toEqual({ originDir: '.origin' });
            });
        });

        describe('not found', () => {
            it('- throw error', async () => {
                const { load } = setup({
                    cwd: 'path/to/working/dir',
                    configPath: 'invalid/path/to/.workflow.config.js',
                });

                await expect(load).rejects.toThrowError('ERR_MODULE_NOT_FOUND');
            });
        });

        describe('has syntax error', () => {
            it('- throw error', async () => {
                const { load } = setup({
                    cwd: 'path',
                    configPath: 'path/.workflow.config.js',
                    hasSyntaxError: true,
                });

                await expect(load).rejects.toThrowError(
                    'SyntaxError: Unexpected token'
                );
            });
        });
    });
});
