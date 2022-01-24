const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const warndb = require('../../models/warndb');

module.exports = {
    name: 'warn',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args, Discord) => {

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        if (!user) return message.reply('Mention a valid user')
        const reason = args.slice(1).join(" ")
        if (!reason) return message.reply('Tell me a reason')

        warndb.findOne({
            guild: message.guild.id,
            user: user.user.id
        }, async (err, data) => {
            if (err) throw err;
            if (!data) {
                data = new warndb({
                    guild: message.guild.id,
                    user: user.user.id,
                    content: [{
                        moderator: message.author.id,
                        reason: reason
                    }]
                })
            } else {
                const object = {
                    moderator: message.author.id,
                    reason: reason
                }
                data.content.push(object)
            }
            data.save()

        })

        const verify = message.guild.emojis.cache.find(emoji => emoji.name === 'yes');

        const embed1 = new MessageEmbed()
        .setColor('RED')
        .setDescription(`${verify} User has been **warned!**`) 

        const embed2 = new MessageEmbed()
        .setColor('GREEN')
        .setDescription(`You have been **warned!**`)

        message.channel.send({ embeds: [embed1] });
        user.send({ embeds: [embed2] });

    }
}