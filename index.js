const discord = require("discord.js")
const client = new discord.Client({
    intents: [
        discord.GatewayIntentBits.DirectMessages,
        discord.GatewayIntentBits.Guilds,
        discord.GatewayIntentBits.GuildBans,
        discord.GatewayIntentBits.GuildMessages,
        discord.GatewayIntentBits.MessageContent,
    ]
});

let config = {
    token: "",
    prefix: "+",
    countchannel: "",
    lbchannel: "",
    failrole: "",
    guild: "",
}

client.on("ready", async () => {
    await fs.readFileSync(path.join(__dirname, "db.json"))
    console.log(`Bot booted up!`);
    console.log(`Logged in as ${client.user.tag}!`);
    setInterval(async () => {
        let countchannel = client.channels.cache.get(config.countchannel);
        countchannel.setTopic(`Topscore: ${db["topscore"]}`)
        //check if the date from db is the same as the current date
        //get date in dd/mm
        let date = new Date();
        let dd = date.getDate();
        let mm = date.getMonth() + 1;
        let today = dd + "/" + mm;
        if (db["checker"] != today) {
            let lbchannel = client.channels.cache.get(config.lbchannel);
            // clear the channel first then add the new top 10
            await lbchannel.bulkDelete(10)
            let text = "";
            let i = 1;
            // add the top 10 to the channel filtered by the count
            db["users"].sort((a, b) => b.count - a.count).slice(0, 10).forEach(user => {
                let t = client.users.cache.get(user.id);
                text += `**#${i}** <@${user.id}>, **${user.count}**\n`
                i++;
            })
            const embed = new discord.EmbedBuilder()
                .setTitle("Top 10")
                .setColor(0x00AE86)
                .setDescription(text)
                .setTimestamp()
            lbchannel.send({ embeds: [embed] })
            db["checker"] = today;
            fs.writeFileSync(path.join(__dirname, "db.json"), JSON.stringify(db))
            let failrole = client.guilds.cache.get(config.guild).roles.cache.get(config.failrole);
            db["failed"] = db["failed"] || [];
            if (db["failed"].length > 0) {
                let failed = db["failed"].filter((v, i, a) => a.indexOf(v) === i);
                for(let i = 0; i < failed.length; i++) {
                    try{
                    let user = await client.guilds.cache.get(config.guild).members.fetch(failed[i]);
                    user.roles.remove(failrole);
                    }catch(e){
                        console.log(e)
                    }
                }
            }
        }
    }, 30000);
});


// initialize json database
const fs = require("fs");
const path = require("path");
// check if db.json exists
if (!fs.existsSync(path.join(__dirname, "db.json"))) {
    fs.writeFileSync(path.join(__dirname, "db.json"), "{}");
}
const db = require("./db.json");

client.on("messageCreate", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    if (message.channel.id === config.countchannel) {
        if (isNaN(message.content)) {
            let current = db[message.channel.id] || 0
            const embed = new discord.EmbedBuilder()
                .setTitle("Verkackt!")
                .setColor("#ff0000")
                .setDescription(`${message.author} hat den counter bei ${current} verkackt`)
                .setFooter({ text: `Wenn du glaubst, das ist ein Fehler, melde dich bei InvalidUser` })
                .setTimestamp();
            db[message.channel.id] = 1
            db["lastperson"] = message.author.id;
            db["failed"] = db["failed"] || [];
            db["failed"].push(message.author.id)
            await fs.writeFileSync(path.join(__dirname, "db.json"), JSON.stringify(db));
            let failrole = client.guilds.cache.get(message.guild.id).roles.cache.get(config.failrole);
            await message.member.roles.add(failrole);
            return message.channel.send({ embeds: [embed] })
        } else {
            //console.log(db[message.channel.id])
            await fs.readFileSync(path.join(__dirname, "db.json"))
            let current = db[message.channel.id] || 1
            if (db["lastperson"] === message.author.id) {
                const embed = new discord.EmbedBuilder()
                    .setTitle("Verkackt!")
                    .setColor("#ff0000")
                    .setDescription(`${message.author} hat den counter bei ${current - 1} verkackt`)
                    .setFooter({ text: `Wenn du glaubst, das ist ein Fehler, melde dich bei InvalidUser` })
                    .setTimestamp()
                db[message.channel.id] = 1
                db["lastperson"] = message.author.id
                db["failed"] = db["failed"] || [];
                db["failed"].push(message.author.id)
                await fs.writeFileSync(path.join(__dirname, "db.json"), JSON.stringify(db));
                let failrole = client.guilds.cache.get(message.guild.id).roles.cache.get(config.failrole);
                await message.member.roles.add(failrole);
                return message.channel.send({ embeds: [embed] })
            }
            if (current === parseInt(message.content)) {
                db[message.channel.id] = parseInt(message.content) + 1
                if ((db["topscore"] || 0) < (current - 1) || (db["topscore"] || 0) < (current)) {
                    db["topscore"] = parseInt(message.content)
                }
                db["lastperson"] = message.author.id;
                db["users"] = db["users"] || [];
                db["users"].some(user => user.id === message.author.id) ? db["users"].find(user => user.id === message.author.id).count++ : db["users"].push({ id: message.author.id, count: 1 })
                await fs.writeFileSync(path.join(__dirname, "db.json"), JSON.stringify(db));
                return message.react("✅")
            } else {
                const embed = new discord.EmbedBuilder()
                    .setTitle("Verkackt!")
                    .setColor("#ff0000")
                    .setDescription(`${message.author} hat den counter bei ${current - 1} verkackt`)
                    .setFooter({ text: `Wenn du glaubst, das ist ein Fehler, melde dich bei InvalidUser` })
                    .setTimestamp()
                db[message.channel.id] = 1
                db["lastperson"] = message.author.id
                db["failed"] = db["failed"] || [];
                db["failed"].push(message.author.id)
                await fs.writeFileSync(path.join(__dirname, "db.json"), JSON.stringify(db));
                let failrole = client.guilds.cache.get(message.guild.id).roles.cache.get(config.failrole);
                await message.member.roles.add(failrole);
                return message.channel.send({ embeds: [embed] })
            }
        }
    }
});

client.on("messageDelete", async message => {
    if (message.author.bot) return;
    if (message.channel.id === config.countchannel) {
        let content = message.content
        let logs = await message.guild.fetchAuditLogs({ type: 72 });
        let entry = logs.entries.first();
        message.channel.send(content + " ~ Deleted by " + entry.executor.tag)
    }
});


client.login(config.token);