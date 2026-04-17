import { readdirSync, existsSync } from 'fs';
import { REST, Routes } from 'discord.js';
import { logger } from '../utils/logger.js';

export async function loadCommands(client) {
    logger.info('Loading Discord commands...');
    const commandsArray = [];
    const commandsDir = new URL('../commands', import.meta.url).pathname;

    if (!existsSync(commandsDir)) {
        logger.warn(`Commands directory not found at ${commandsDir}. Skipping.`);
        return;
    }

    try {
        const folders = readdirSync(commandsDir);
        for (const folder of folders) {
            const commandFiles = readdirSync(`${commandsDir}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const commandModule = await import(`../commands/${folder}/${file}`);
                const command = commandModule.default || commandModule;

                // Now command can just have a name and an execute function,
                // but we will support both slash object structure or simple object
                const cmdName = command.name || (command.data && command.data.name);
                if (cmdName && 'execute' in command) {
                    client.commands.set(cmdName, command);
                } else {
                    logger.warn(`[WARNING] The command at ${folder}/${file} is missing a required name or execute property.`);
                }
            }
        }
        logger.success(`Loaded ${client.commands.size} commands.`);

    } catch (error) {
        logger.error('Error loading commands:', error);
    }
}
