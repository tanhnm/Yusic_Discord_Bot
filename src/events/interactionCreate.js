import { Events } from 'discord.js';
import { logger } from '../utils/logger.js';

export const name = Events.InteractionCreate;

export async function execute(interaction, client) {
    if (!interaction.isButton()) return;

    // Handle music player buttons
        const customId = interaction.customId;
        const player = client.lavalink.getPlayer(interaction.guildId);

        if (!player) {
            return interaction.reply({ content: 'No active player in this guild.', ephemeral: true });
        }

        try {
            switch (customId) {
                case 'btn_pause_resume':
                    if (player.paused) {
                        await player.resume();
                        await interaction.reply({ content: '▶️ Resumed playback.', ephemeral: true });
                    } else {
                        await player.pause();
                        await interaction.reply({ content: '⏸️ Paused playback.', ephemeral: true });
                    }
                    break;
                case 'btn_skip':
                    await player.skip();
                    await interaction.reply({ content: '⏭️ Skipped track.', ephemeral: true });
                    break;
                case 'btn_stop':
                    await player.destroy();
                    await interaction.reply({ content: '⏹️ Stopped player and cleared queue.', ephemeral: true });
                    break;
            }
        } catch (e) {
            logger.error('Button interaction error', e);
        }
    }
