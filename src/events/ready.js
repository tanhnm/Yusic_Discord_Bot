import { Events } from 'discord.js';
import { logger } from '../utils/logger.js';

export const name = Events.ClientReady;
export const once = true;

export function execute(client) {
    logger.success(`Logged in as ${client.user.tag}!`);
    
    // Initialize Lavalink now that we have the bot user's actual ID
    client.lavalink.options.client.id = client.user.id;
    client.lavalink.init({
        id: client.user.id,
        username: client.user.username,
        dependencies: {
            // Optional: for some internal stuff
        }
    });
    
    // TODO: Recover 24/7 queues from DB here.
}
