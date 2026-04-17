import chalk from 'chalk';

const prefix = chalk.gray(`[${new Date().toLocaleTimeString()}]`);

export const logger = {
    info: (message) => console.log(`${prefix} ${chalk.blue('INFO')}  ${message}`),
    success: (message) => console.log(`${prefix} ${chalk.green('SUCCESS')} ${message}`),
    warn: (message) => console.warn(`${prefix} ${chalk.yellow('WARN')}  ${message}`),
    error: (message, error) => {
        console.error(`${prefix} ${chalk.red('ERROR')} ${message}`);
        if (error) console.error(chalk.red(error.stack || error));
    },
    lava: (message) => console.log(`${prefix} ${chalk.magenta('LAVA')}  ${message}`),
};
