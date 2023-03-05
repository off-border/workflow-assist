export function msg(...args) {
    if (isTest()) {
        return;
    }

    console.log('\n', ...args);
}

function isTest() {
    return process.env.NODE_ENV === 'test';
}
