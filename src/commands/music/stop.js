import { SlashCommandBuilder } from 'discord.js';
import { Embeds } from '../../utils/embeds.js';

export const data = new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops the player and clears the queue.');

export async function execute(message, args, client) {
    const player = client.lavalink.getPlayer(message.guildId);

    if (!player) {
        return message.reply({ embeds: [Embeds.error('There is no active music player in this server.')] });
    }

    const member = message.member || message.guild.members.cache.get(message.author.id);
    if (!member.voice.channel || member.voice.channel.id !== player.voiceChannelId) {
        return message.reply({ embeds: [Embeds.error('You must be in the same voice channel to stop the music.')] });
    }

    await player.destroy();
    message.reply({ embeds: [Embeds.success('Stopped the player and left the channel.')] });
}
