import { LavalinkManager } from 'lavalink-client';
import { logger } from '../utils/logger.js';
import { loadLavalinkEvents } from './events.js';

export function setupLavalink(client) {
    client.lavalink = new LavalinkManager({
        nodes: [
            {
                id: 'Main Node',
                host: process.env.LAVALINK_HOST || '10.148.0.5',
                port: parseInt(process.env.LAVALINK_PORT || '2333'),
                authorization: process.env.LAVALINK_PASSWORD || 'youshallnotpass',
                secure: false, // Set to true if using https/wss
                retryAmount: 10,
                retryDelay: 10000,
            }
        ],
        sendToShard: (guildId, payload) => {
            const guild = client.guilds.cache.get(guildId);
            if (guild) guild.shard.send(payload);
        },
        autoSkip: true, // Auto skip to the next track if one fails
        client: {
            id: process.env.CLIENT_ID || 'PENDING_ID', // Replaced on ready event if pending
            username: 'Yusic Bot',
        },
        playerOptions: {
            clientBasedPositionUpdateInterval: 150,
            defaultSearchPlatform: 'ytsearch', // fallback
            volumeDecrementer: 0.75, // Better sound scaling
            requesterTransformer: requester => {
                // We'll store the User object directly or their ID
                if (typeof requester === 'object' && 'id' in requester) {
                    return requester;
                }
                return { id: requester };
            },
            onDisconnect: {
                destroyPlayer: false, // Don't wipe the queue if disconnect happens
            },
            onEmptyQueue: {
                destroyAfterMs: 300000, // 5 minutes auto leave
            }
        }
    });

    loadLavalinkEvents(client.lavalink, client);
}
