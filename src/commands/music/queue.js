import { SlashCommandBuilder } from 'discord.js';
import { Embeds } from '../../utils/embeds.js';

export const data = new SlashCommandBuilder()
    .setName('queue')
    .setDescription('See the current music queue.');

export async function execute(message, args, client) {
    const player = client.lavalink.getPlayer(message.guildId);

    if (!player) {
        return message.reply({ embeds: [Embeds.error('There is no active music player in this server.')] });
    }

    if (!player.queue.current) {
        return message.reply({ embeds: [Embeds.info('The queue is empty.')] });
    }

    const current = player.queue.current;
    let description = `**Now Playing:**\n[${current.info.title}](${current.info.uri}) | \`${formatTime(current.info.duration)}\`\n\n**Next Up:**\n`;

    if (player.queue.tracks.length === 0) {
        description += '*No more tracks in queue.*';
    } else {
        const nextTracks = player.queue.tracks.slice(0, 10);
        description += nextTracks.map((track, i) => `${i + 1}. [${track.info.title}](${track.info.uri})`).join('\n');
        
        if (player.queue.tracks.length > 10) {
            description += `\n*...and ${player.queue.tracks.length - 10} more tracks.*`;
        }
    }

    message.reply({ embeds: [Embeds.music('Server Queue', description)] });
}

function formatTime(ms) {
    if (!ms || isNaN(ms)) return '0:00';
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    
    const sc = seconds < 10 ? `0${seconds}` : seconds;
    const mn = minutes < 10 ? `0${minutes}` : minutes;
    
    if (hours > 0) return `${hours}:${mn}:${sc}`;
    return `${minutes}:${sc}`;
}
