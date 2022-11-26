const { ActivityType } = require('discord.js');

module.exports.plugin = {
    name: 'activity',
    description: 'Set the activity of the bot',
    author: 'Dan Perkins (Aesth3tical)',
    repository: 'https://github.com/Devetical/Modmail-Plugins/blob/main/activity/plugin.js',
}

module.exports.activity = {
    name: 'activity',
    description: 'Set the activity of the bot',
    usage: '{PREFIX}activity <playing|listening|watching|streaming> <activity>',
    category: 'utility',
    run: async ({ client, message, args, guildData }) => {
        if (!guildData.managers.includes(message.author.id)) return;

        const type = args[0];
        const activity = args.slice(1).join(' ');

        if (!type || !activity) return client.embeds.error({
            message: message,
            options: {
                error: `Invalid arguments provided. See \`\`${guildData.config.prefix}help activity\`\` for more information.`
            }
        });

        if (!['playing', 'listening', 'watching', 'streaming'].includes(type)) return client.embeds.error({
            message: message,
            options: {
                error: `Invalid activity type provided. See \`\`${guildData.config.prefix}help activity\`\` for more information.`
            }
        });

        await client.user.setActivity(activity, { type: ActivityType[type[0].toUpperCase() + type.slice(1).toLowerCase()] });

        return client.embeds.success({
            message: message,
            options: {
                description: `Successfully set activity to **${type} ${activity}**`
            }
        });
    }
}