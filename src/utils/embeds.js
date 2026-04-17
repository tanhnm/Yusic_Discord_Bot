import { EmbedBuilder } from 'discord.js';

export const Embeds = {
    success: (text) => new EmbedBuilder().setColor('#43b581').setDescription(`✅ ${text}`),
    error: (text) => new EmbedBuilder().setColor('#f04747').setDescription(`❌ ${text}`),
    info: (text) => new EmbedBuilder().setColor('#2b2d31').setDescription(`ℹ️ ${text}`),
    music: (title, description, thumbnail) => {
        const embed = new EmbedBuilder().setColor('#5865F2').setTitle(title).setDescription(description);
        if (thumbnail) embed.setThumbnail(thumbnail);
        return embed;
    }
};
