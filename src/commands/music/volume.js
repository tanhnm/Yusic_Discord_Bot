import { SlashCommandBuilder } from 'discord.js';
import { Embeds } from '../../utils/embeds.js';

export const data = new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Changes the player volume.')
    .addIntegerOption(opt => opt.setName('amount').setDescription('Volume 1-1000').setRequired(true));

export async function execute(message, args, client) {
    const player = client.lavalink.getPlayer(message.guildId);
    if (!player) return message.reply({ embeds: [Embeds.error('Nothing is playing.')] });
    
    const vol = parseInt(args[0]);
    if (isNaN(vol) || vol < 1 || vol > 1000) {
        return message.reply({ embeds: [Embeds.error('Please provide a valid volume between 1 and 1000.')] });
    }
    
    await player.setVolume(vol);
    message.reply({ embeds: [Embeds.success(`Volume set to \`${vol}%\``)] });
}
