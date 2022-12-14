const { CategoryChannel, EmbedBuilder } = require('discord.js');

module.exports.plugin = {
    name: 'utils',
    description: 'Thread utils',
    author: 'Dan Perkins (Aesth3tical)',
    repository: 'https://github.com/Devetical/Modmail-Plugins/blob/main/utils/plugin.js'
}

module.exports.move = {
    name: 'move',
    description: 'Move a thread to another category',
    run: async ({ client, message, args }) => {
        const isThread = client.isThread(client, message);

        if (!isThread) return client.embeds.error({
            message: message,
            options: {
                error: 'This command can only be used in a thread channel.'
            }
        })

        if (!args[0]) return client.embeds.error({
            message: message,
            options: {
                error: 'No category ID provided'
            }
        })

        const category = message.guild.channels.cache.get(args[0])
        if (!category) return client.embeds.error({
            message: message,
            options: {
                error: 'Invalid category ID'
            }
        })

        if (!category instanceof CategoryChannel) return client.embeds.error({
            message: message,
            options: {
                error: 'Invalid category'
            }
        })

        await message.channel.setParent(category.id)

        return client.embeds.success({
            message: message,
            options: {
                description: `Successfully moved thread to **${category.name}**`
            }
        });
    }
}

module.exports.closeTimer = {
    name: 'tclose',
    description: 'Close a thread after a specified amount of time',
    run: async ({ client, message, args, guildData }) => {
        const isThread = client.isThread(client, message);

        if (!isThread) return client.embeds.error({
            message: message,
            options: {
                error: 'This command can only be used in a thread channel.'
            }
        });

        if (!args[0]) return client.embeds.error({
            message: message,
            options: {
                error: 'No time provided'
            }
        });

        const time = args[0];
        const duration = time.charAt(time.length - 1);
        const timeNumber = parseInt(time.slice(0, -1));

        if (!['s', 'm', 'h', 'd'].includes(duration) || isNaN(timeNumber)) return client.embeds.error({
            message: message,
            options: {
                error: 'Invalid time format'
            }
        });

        const timeMs = {
            s: 1000,
            m: 60000,
            h: 3600000,
            d: 86400000
        }

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setDescription(`This thread will be closed in ${time}!`);
        
        message.channel.send({ embeds: [ embed ] });

        const timeToClose = timeMs[duration] * timeNumber;

        setTimeout(() => {
            client.handleThreadClose(client, message, guildData)
        }, timeToClose);
    }
}

module.exports.id = {
    name: 'id',
    description: 'Get the ID of a thread user',
    usage: '{PREFIX}id',
    category: 'utility',
    run: async ({ client, message }) => {
        const isThread = client.isThread(client, message);

        if (!isThread) return client.embeds.error({
            message: message,
            options: {
                error: 'This command can only be used in a thread channel.'
            }
        });

        return message.reply(message.channel.topic);
    }
}

module.exports.raw = {
    name: 'raw',
    description: 'Get the raw content of a message',
    usage: '{PREFIX}raw <message ID>',
    category: 'utility',
    run: async ({ client, message, args }) => {
        const isThread = client.isThread(client, message);

        if (!isThread) return client.embeds.error({
            message: message,
            options: {
                error: 'This command can only be used in a thread channel.'
            }
        });

        if (!args[0]) return client.embeds.error({
            message: message,
            options: {
                error: 'No message ID provided'
            }
        });

        const msg = await message.channel.messages.fetch(args[0]);

        if (!msg) return client.embeds.error({
            message: message,
            options: {
                error: 'Invalid message ID'
            }
        });


        return message.reply({ content: `\`\`\`${msg.embeds[0].description}\`\`\`` });
    }
}
