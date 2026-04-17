import { SlashCommandBuilder } from 'discord.js';
import { Embeds } from '../../utils/embeds.js';

export const data = new SlashCommandBuilder()
    .setName('filters')
    .setDescription('Apply anti-gravity filters.')
    .addStringOption(opt => 
        opt.setName('type')
        .setDescription('The filter to apply')
        .setRequired(true)
        .addChoices(
            { name: 'Bassboost', value: 'bassboost' },
            { name: 'Nightcore', value: 'nightcore' },
            { name: 'Vaporwave', value: 'vaporwave' },
            { name: 'Clear', value: 'clear' }
        )
    );

export async function execute(message, args, client) {
    const player = client.lavalink.getPlayer(message.guildId);
    if (!player) return message.reply({ embeds: [Embeds.error('Nothing is playing.')] });
    
    const filter = args[0]?.toLowerCase();
    
    switch(filter) {
        case 'bassboost':
            await player.filterManager.toggleBassboost();
            break;
        case 'nightcore':
            await player.filterManager.toggleNightcore();
            break;
        case 'vaporwave':
            await player.filterManager.toggleVaporwave();
            break;
        case 'clear':
            await player.filterManager.reset();
            break;
        default:
            return message.reply({ embeds: [Embeds.error('Please specify a valid filter: `bassboost`, `nightcore`, `vaporwave`, or `clear`.')] });
    }
    
    message.reply({ embeds: [Embeds.success(`Applied filter: \`${filter}\``)] });
}
