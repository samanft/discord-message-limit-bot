const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client();
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
            messages.each(async message => {
                if (message.author.id === '863832130730721280' && isToday(message.createdTimestamp)) {
                    messageCount++;
                    console.log(`Shark has sent ${messageCount} messages today.`);

                    if (messageCount >= 40) {
                        const user = guild.members.cache.get('863832130730721280'); // replace '1234567890' with the ID of the user you want to mute
                        user.roles.add(muteRoleId).then(() => {
                            console.log(`Muted ${user.user.tag} for exceeding message limit.`);
                            setTimeout(() => {
                                getRemainingTime();
                                user.roles.remove(muteRoleId).then(() => {
                                    console.log(`Unmuted ${user.user.tag}.`);
                                });
                            }, getDelayUntilEndOfDay());
                        });
                    }
                }
                lastMessageId = message.id;
            });
            while (messages.size === 100) {
                messages = await channel.messages.fetch({ limit: 100, before: lastMessageId });
                messages.each(async message => {
                    if (message.author.id === '863832130730721280' && isToday(message.createdTimestamp)) {
                        messageCount++;
                        console.log(`Shark has sent ${messageCount} messages today.`);

                        if (messageCount >= 40) {
                            const user = guild.members.cache.get('863832130730721280');
                            if (user.roles.cache.has(muteRoleId)) {
                                console.log(`${user.user.tag} is already muted.`);
                            } else {
                                user.roles.add(muteRoleId).then(() => {
                                    console.log(`Muted ${user.user.tag} for exceeding message limit.`);
                                    setTimeout(() => {
                                        getRemainingTime();
                                        user.roles.remove(muteRoleId).then(() => {
                                            console.log(`Unmuted ${user.user.tag}.`);
                                        });
                                    }, getDelayUntilEndOfDay());
                                });
                            }
                        }
                    }
                    lastMessageId = message.id;
                });
            }
        }
    });
});

function isToday(timestamp) {
    const now = new Date();
    const today = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Singapore' })).setHours(0, 0, 0, 0); // replace 'Europe/Paris' with the timezone you want to use
    const messageDate = new Date(timestamp).setHours(0, 0, 0, 0);
    return today === messageDate;
}

function getDelayUntilEndOfDay() {
    const now = new Date();
    const endOfDay = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Singapore' })).setHours(23, 59, 59, 999);
    return endOfDay - now.getTime();
}

function getRemainingTime() {
    const now = new Date();
    const endOfDay = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Singapore' })).setHours(23, 59, 59, 999);
    return endOfDay - now.getTime();
}

client.login('MTA3OTEzMDgwMjUxNzk3MTA0NA.GSPI4C.cYEmRRZVSChohnOdeBtE9iwfwzdlZTzkdwi1Zw');