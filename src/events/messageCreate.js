import { Events } from 'discord.js';
import { logger } from '../utils/logger.js';

export const name = Events.MessageCreate;

const PREFIX = '!';

export async function execute(message, client) {
    if (message.author.bot || !message.guild) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // In commands.js we set client.commands by their interaction 'data.name' or plain string
    const command = client.commands.get(commandName);

    if (!command) return;

    try {
        await command.execute(message, args, client);
    } catch (error) {
        logger.error(`Error executing ${commandName}`, error);
        message.reply({ 
            content: 'There was an error while executing this command!', 
            allowedMentions: { repliedUser: false } 
        }).catch(err => logger.error('Failed to reply error', err));
    }
}
