import { loadConfig } from './config-loader';

const config = {
    originDir: '.origin',
};

const setup = ({ cwd, configPath }) => {
    const requireFile = (path) => {
        if (path === configPath) {
            return config;
        }

        throw new Error('MODULE NOT FOUND');
    };

    const load = () => loadConfig(cwd, requireFile);

    return {
        load,
    };
};

describe('config-loader', () => {
    describe('if config:', () => {
        describe('in the current working dir', () => {
            it('- load from cwd', () => {
                const { load } = setup({
                    cwd: 'path/to/working/dir',
                    configPath: 'path/to/working/dir/.workflow.config.js',
                });

                const loadedConfig = load();

                expect(loadedConfig).toEqual({ originDir: '.origin' });
            });
        });

        describe('in some of the parent dirs', () => {
            it('- find in parents recursively', () => {
                const { load } = setup({
                    cwd: 'path/to/working/dir',
                    configPath: 'path/to/.workflow.config.js',
                });

                const loadedConfig = load();

                expect(loadedConfig).toEqual({ originDir: '.origin' });
            });
        });

        describe('not found', () => {
            it('- throw error', () => {
                const { load } = setup({
                    cwd: 'path/to/working/dir',
                    configPath: 'invalid/path/to/.workflow.config.js',
                });

                expect(load).toThrow();
            });
        });
    });
});
