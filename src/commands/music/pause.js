import { SlashCommandBuilder } from 'discord.js';
import { Embeds } from '../../utils/embeds.js';

export const data = new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses the player.');

export async function execute(message, args, client) {
    const player = client.lavalink.getPlayer(message.guildId);
    if (!player) return message.reply({ embeds: [Embeds.error('Nothing is playing.')] });
    
    await player.pause();
    message.reply({ embeds: [Embeds.success('Paused the current track.')] });
}
