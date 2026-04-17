import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { logger } from '../utils/logger.js';

export function loadLavalinkEvents(manager, client) {
    // Node events
    manager.nodeManager.on('connect', node => {
        logger.lava(`Node ${node.id} connected successfully!`);
    });
    
    manager.nodeManager.on('error', (node, error) => {
        logger.error(`Node ${node.id} encountered an error:`, error);
    });

    manager.nodeManager.on('disconnect', (node, reason) => {
        logger.warn(`Node ${node.id} disconnected. Reason: ${JSON.stringify(reason)}`);
    });

    // Player events
    manager.on('trackStart', async (player, track) => {
        logger.info(`Track started: ${track.info.title} in guild ${player.guildId}`);
        
        const channel = client.channels.cache.get(player.textChannelId);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor('#2b2d31')
            .setAuthor({ name: 'Now Playing', iconURL: 'https://i.imgur.com/kQJpUSg.gif' })
            .setTitle(track.info.title)
            .setURL(track.info.uri)
            .setDescription(`**Duration:** \`${formatTime(track.info.duration)}\`\n**Author:** ${track.info.author}`)
            .setFooter({ text: `Requested by ${track.requester?.username || 'Unknown'}` });
            
        if (track.info.artworkUrl) {
            embed.setThumbnail(track.info.artworkUrl);
        }

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('btn_pause_resume').setEmoji('⏯️').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('btn_skip').setEmoji('⏭️').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('btn_stop').setEmoji('⏹️').setStyle(ButtonStyle.Danger)
        );

        const msg = await channel.send({ embeds: [embed], components: [buttons] }).catch(() => null);
        
        // Save the message ID so we can edit or delete it later if needed (optional)
        if (msg) player.set('nowPlayingMessageId', msg.id);
    });

    manager.on('queueEnd', async (player, track, payload) => {
        // Autoplay logic
        if (player.get('autoplay')) {
            logger.info(`Queue ended in guild ${player.guildId}, fetching autoplay recommended tracks...`);
            const previousTrack = track || player.queue.previous[0];
            if (previousTrack) {
                // Determine source for autoplay based on previous track
                // If it was spotify, lavasrc handles recommendations via "sprec"
                const searchStr = previousTrack.info.sourceName === 'spotify' 
                    ? `sprec:${previousTrack.info.identifier}`
                    : `ytmsearch:${previousTrack.info.author} ${previousTrack.info.title}`;
                
                const res = await player.search({ query: searchStr }, client.user);
                
                if (res.tracks.length > 0) {
                    // Avoid playing exactly the same requested track again if returned by recommendation
                    const nextTrack = res.tracks.find(t => t.info.identifier !== previousTrack.info.identifier) || res.tracks[0];
                    await player.queue.add(nextTrack);
                    await player.play();
                    return;
                }
            }
        }

        // If not autoplay or no tracks found
        const channel = client.channels.cache.get(player.textChannelId);
        if (channel) {
            await channel.send({ embeds: [
                new EmbedBuilder()
                    .setColor('#2b2d31')
                    .setDescription('🏁 The queue has ended.')
            ]}).catch(() => null);
        }
        
        // Let auto-leave logic handle disconnecting if 24/7 is off.
    });

    manager.on('trackError', (player, track, payload) => {
        logger.error(`Track error for ${track.info.title}`, payload.error);
    });
}

function formatTime(ms) {
    if (!ms || isNaN(ms)) return '0:00';
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    
    const sc = seconds < 10 ? `0${seconds}` : seconds;
    const mn = minutes < 10 ? `0${minutes}` : minutes;
    
    if (hours > 0) return `${hours}:${mn}:${sc}`;
    return `${minutes}:${sc}`;
}
