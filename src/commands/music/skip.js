import { SlashCommandBuilder } from 'discord.js';
import { Embeds } from '../../utils/embeds.js';

export const data = new SlashCommandBuilder()
    .setName('s')
    .setDescription('Skips the current track.');

export async function execute(message, args, client) {
    const player = client.lavalink.getPlayer(message.guildId);
    if (!player || !player.queue.current) return message.reply({ embeds: [Embeds.error('Nothing is playing.')] });
    
    if (player.queue.tracks.length === 0) {
        await player.stop();
        return message.reply({ embeds: [Embeds.success('Skipped the last song and stopped playback.')] });
    }
    
    await player.skip();
    message.reply({ embeds: [Embeds.success('Skipped the current track.')] });
}
