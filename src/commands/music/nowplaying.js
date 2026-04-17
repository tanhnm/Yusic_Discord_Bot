import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { Embeds } from '../../utils/embeds.js';

export const data = new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Shows the currently playing track.');

export async function execute(message, args, client) {
    const player = client.lavalink.getPlayer(message.guildId);

    if (!player || !player.queue.current) {
        return message.reply({ embeds: [Embeds.error('Nothing is playing right now.')] });
    }

    const current = player.queue.current;
    
    const embed = new EmbedBuilder()
        .setColor('#5865F2')
        .setAuthor({ name: 'Now Playing', iconURL: 'https://i.imgur.com/kQJpUSg.gif' })
        .setTitle(current.info.title)
        .setURL(current.info.uri)
        .setDescription(`**Author:** ${current.info.author}\n**Progress:** \`${formatTime(player.position)}\` / \`${formatTime(current.info.duration)}\``)
        .setFooter({ text: `Requested by ${current.requester?.username || 'Unknown'}` });

    if (current.info.artworkUrl) {
        embed.setThumbnail(current.info.artworkUrl);
    }

    const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('btn_pause_resume').setEmoji('⏯️').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('btn_skip').setEmoji('⏭️').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('btn_stop').setEmoji('⏹️').setStyle(ButtonStyle.Danger)
    );

    message.reply({ embeds: [embed], components: [buttons] });
}

function formatTime(ms) {
    if (!ms || isNaN(ms)) return '0:00';
    const Math = global.Math;
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    
    const sc = seconds < 10 ? `0${seconds}` : seconds;
    const mn = minutes < 10 ? `0${minutes}` : minutes;
    
    if (hours > 0) return `${hours}:${mn}:${sc}`;
    return `${minutes}:${sc}`;
}
