import { Client, GatewayIntentBits, Collection } from 'discord.js';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { loadCommands } from './handlers/commands.js';
import { loadEvents } from './handlers/events.js';
import { setupLavalink } from './lavalink/manager.js';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Collections
client.commands = new Collection();
client.cooldowns = new Collection();

// Core initialization
async function init() {
    logger.info('Starting bot initialization...');
    
    // 1. Setup Lavalink client
    setupLavalink(client);

    // 2. Load commands
    await loadCommands(client);

    // 3. Load discord events
    await loadEvents(client);

    // 4. Important: Forward raw voice/Gateway events directly to Lavalink
    client.on('raw', (d) => client.lavalink.sendRawData(d));

    // 5. Login
    await client.login(process.env.DISCORD_TOKEN);
}

init().catch(err => logger.error('Failed to initialize bot', err));
