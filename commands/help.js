const HELP_TEXT = `
help
`;

export function createHelpCommand({ api, config }) {
    return function () {
        console.log(HELP_TEXT);
    };
}
