import { SlashCommandBuilder } from 'discord.js';
import { Embeds } from '../../utils/embeds.js';

export const data = new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resumes the player.');

export async function execute(message, args, client) {
    const player = client.lavalink.getPlayer(message.guildId);
    if (!player) return message.reply({ embeds: [Embeds.error('Nothing is playing.')] });
    
    await player.resume();
    message.reply({ embeds: [Embeds.success('Resumed the current track.')] });
}
