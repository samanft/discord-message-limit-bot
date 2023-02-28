const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client();
const { DateTime } = require('luxon');
const muteRoleId = '1079160470310760538'; // replace with the ID of the mute role

console.log(process.env);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.fetchApplication().then(application => {
        const owner = application.owner;
        const guild = client.guilds.cache.get('1036106671719714817');
        guild.members.fetch(owner.id).then(guildMember => {
            console.log(guildMember.permissions.toArray());
        });
    }).catch(console.error);
});

client.on('message', async message => {
    const guild = message.guild;
    if (!guild) return;

    let messageCount = 0;
    let lastMessageId;


    guild.channels.cache.each(async channel => {
        if (channel.type === 'text') {
            let messages = await channel.messages.fetch({ limit: 100 });
            await messages.each(async message => {
                if (message.author.id === '863832130730721280' && isToday(message.createdTimestamp)) {
                    messageCount++;
                    console.log(`Shark has sent ${messageCount} messages today.`);

                    if (messageCount >= 40) {
                        const user = guild.members.cache.get('863832130730721280'); // replace '1234567890' with the ID of the user you want to mute
                        user.roles.add(muteRoleId).then(() => {
                            const remainingTime = getRemainingTime();
                            const remainingHours = Math.floor(remainingTime / (60 * 60 * 1000));
                            const remainingMinutes = Math.floor((remainingTime / (60 * 1000)) % 60);
                            console.log(`Muted ${user.user.tag} for exceeding message limit. Unmuting ${user.user.tag} in ${remainingHours} hours and ${remainingMinutes} minutes.`);
                            setTimeout(() => {
                                getRemainingTime();
                                user.roles.remove(muteRoleId).then(() => {
                                    console.log(`Unmuted ${user.user.tag}.`);
                                });
                            }, getDelayUntilEndOfDay() / 1000);
                        });
                    }
                }
                lastMessageId = message.id;
            });
            while (messages.size === 100) {
                messages = await channel.messages.fetch({ limit: 100, before: lastMessageId });
                await messages.each(async message => {
                    if (message.author.id === '863832130730721280' && isToday(message.createdTimestamp)) {
                        messageCount++;
                        console.log(`Shark has sent ${messageCount} messages today.`);

                        if (messageCount >= 40) {
                            const user = guild.members.cache.get('863832130730721280');
                            user.roles.add(muteRoleId).then(() => {
                                const remainingTime = getRemainingTime();
                                const remainingHours = Math.floor(remainingTime / (60 * 60 * 1000));
                                const remainingMinutes = Math.floor((remainingTime / (60 * 1000)) % 60);
                                console.log(`Muted ${user.user.tag} for exceeding message limit. Unmuting ${user.user.tag} in ${remainingHours} hours and ${remainingMinutes} minutes.`);
                                setTimeout(() => {
                                    getRemainingTime();
                                    user.roles.remove(muteRoleId).then(() => {
                                        console.log(`Unmuted ${user.user.tag}.`);
                                    });
                                }, getDelayUntilEndOfDay() / 1000);
                            });
                        }
                    }
                    lastMessageId = message.id;
                });
            }
        }
    });
});

function isToday(timestamp) {
    const now = DateTime.now().setZone('Asia/Singapore');
    const today = now.startOf('day');
    const messageDate = DateTime.fromMillis(timestamp).setZone('Asia/Singapore').startOf('day');
    return today.equals(messageDate);
}

function getDelayUntilEndOfDay() {
    const now = DateTime.now().setZone('Asia/Singapore');
    const endOfDay = now.endOf('day');
    return endOfDay.diff(now).as('milliseconds');
}

function getRemainingTime() {
    const now = DateTime.now().setZone('Asia/Singapore');
    const endOfDay = now.endOf('day');
    return endOfDay.diff(now).as('milliseconds');
}

client.login('MTA3OTEzMDgwMjUxNzk3MTA0NA.GSPI4C.cYEmRRZVSChohnOdeBtE9iwfwzdlZTzkdwi1Zw');