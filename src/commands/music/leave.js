import { SlashCommandBuilder } from 'discord.js';
import { Embeds } from '../../utils/embeds.js';

export const data = new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Disconnects the bot from the voice channel.');

export async function execute(message, args, client) {
    const player = client.lavalink.getPlayer(message.guildId);

    if (!player) {
        return message.reply({ embeds: [Embeds.error('I am not in any voice channel.')] });
    }

    const member = message.member || message.guild.members.cache.get(message.author.id);
    if (!member.voice.channel || member.voice.channel.id !== player.voiceChannelId) {
        return message.reply({ embeds: [Embeds.error('You must be in the same voice channel to disconnect me.')] });
    }

    await player.destroy();
    message.reply({ embeds: [Embeds.success('Goodbye! Disconnected from the voice channel.')] });
}
