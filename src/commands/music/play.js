import { SlashCommandBuilder } from 'discord.js';
import { Embeds } from '../../utils/embeds.js';

export const data = new SlashCommandBuilder()
    .setName('p')
    .setDescription('Play a song from YouTube, Spotify, or Soundcloud.')
    .addStringOption(option => 
        option.setName('query')
            .setDescription('URL or search query')
            .setRequired(true)
    );

export async function execute(message, args, client) {
    if (args.length === 0) {
        return message.reply({ embeds: [Embeds.error('Please provide a URL or search query!')] });
    }
    
    const query = args.join(' ');
    // Handle caching for message.member
    const member = message.member || message.guild.members.cache.get(message.author.id);
    const voiceChannel = member?.voice?.channel;

    if (!voiceChannel) {
        return message.reply({ embeds: [Embeds.error('You need to be in a voice channel!')] });
    }

    const player = client.lavalink.createPlayer({
        guildId: message.guildId,
        voiceChannelId: voiceChannel.id,
        textChannelId: message.channelId,
        selfDeaf: true,
        selfMute: false,
        volume: 100
    });

    await player.connect();

    const res = await player.search({ query }, message.author);

    if (res.loadType === 'empty' || res.loadType === 'error') {
        if (!player.queue.current) player.destroy();
        return message.reply({ embeds: [Embeds.error(`No matches found or an error occurred. (${res.loadType})`)] });
    }

    if (res.loadType === 'playlist') {
        await player.queue.add(res.tracks);
        if (!player.playing && !player.paused) await player.play();
        return message.reply({ embeds: [Embeds.success(`Added playlist **${res.playlist?.title || 'Unknown'}** with \`${res.tracks.length}\` tracks!`)] });
    } else {
        const track = res.tracks[0];
        await player.queue.add(track);
        if (!player.playing && !player.paused) await player.play();
        return message.reply({ embeds: [Embeds.success(`Added **[${track.info.title}](${track.info.uri})** to the queue!`)] });
    }
}
