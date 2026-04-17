import { SlashCommandBuilder } from 'discord.js';
import { Embeds } from '../../utils/embeds.js';

export const data = new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffles the queue.');

export async function execute(message, args, client) {
    const player = client.lavalink.getPlayer(message.guildId);
    if (!player) return message.reply({ embeds: [Embeds.error('Nothing is playing.')] });
    
    await player.queue.shuffle();
    message.reply({ embeds: [Embeds.success('Queue shuffled.')] });
}
