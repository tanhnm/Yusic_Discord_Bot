import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { logger } from '../utils/logger.js';

const dbDir = new URL('../../data', import.meta.url).pathname;
if (!existsSync(dbDir)) mkdirSync(dbDir, { recursive: true });

const db = new Database(`${dbDir}/yusic.db`);

db.pragma('journal_mode = WAL');

// Init tables
const initDB = () => {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS persistent_sessions (
            guild_id TEXT PRIMARY KEY,
            voice_channel_id TEXT NOT NULL,
            text_channel_id TEXT NOT NULL,
            is_247 INTEGER DEFAULT 0,
            autoplay INTEGER DEFAULT 0,
            volume INTEGER DEFAULT 100
        )
    `).run();
    logger.info('Database initialized successfully.');
};

initDB();

export const DatabaseManager = {
    saveSession: (guildId, voiceChannelId, textChannelId, is247, autoplay, volume) => {
        const stmt = db.prepare(`
            INSERT OR REPLACE INTO persistent_sessions (guild_id, voice_channel_id, text_channel_id, is_247, autoplay, volume)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        stmt.run(guildId, voiceChannelId, textChannelId, is247 ? 1 : 0, autoplay ? 1 : 0, volume);
    },
    
    getSession: (guildId) => {
        return db.prepare('SELECT * FROM persistent_sessions WHERE guild_id = ?').get(guildId);
    },

    deleteSession: (guildId) => {
        db.prepare('DELETE FROM persistent_sessions WHERE guild_id = ?').run(guildId);
    }
};
