import { readdirSync } from 'fs';
import { logger } from '../utils/logger.js';

export async function loadEvents(client) {
    logger.info('Loading Discord events...');
    try {
        const eventsFiles = readdirSync(new URL('../events', import.meta.url)).filter(file => file.endsWith('.js'));
        
        for (const file of eventsFiles) {
            const event = await import(`../events/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
        logger.success(`Loaded ${eventsFiles.length} events.`);
    } catch (error) {
        logger.error('Error loading events:', error);
    }
}
