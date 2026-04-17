import { SlashCommandBuilder } from 'discord.js';
import { Embeds } from '../../utils/embeds.js';

export const data = new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Toggle loop mode.')
    .addStringOption(opt => 
        opt.setName('mode')
        .setDescription('Loop mode')
        .setRequired(true)
        .addChoices(
            { name: 'Track', value: 'track' },
            { name: 'Queue', value: 'queue' },
            { name: 'Off', value: 'off' }
        )
    );

export async function execute(message, args, client) {
    const player = client.lavalink.getPlayer(message.guildId);
    if (!player) return message.reply({ embeds: [Embeds.error('Nothing is playing.')] });
    
    const mode = args[0]?.toLowerCase();
    if (!['track', 'queue', 'off'].includes(mode)) {
        return message.reply({ embeds: [Embeds.error('Please specify a valid loop mode: `track`, `queue`, or `off`.')] });
    }
    
    await player.setRepeatMode(mode);
    message.reply({ embeds: [Embeds.success(`Loop mode set to \`${mode}\``)] });
}
