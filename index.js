// https://discord.com/api/oauth2/authorize?client_id=1015327355725680660&permissions=8&redirect_uri=https%3A%2F%2Fdiscordapp.com%2Foauth2%2Fauthorize%3F%26client_id%3D1015327355725680660%26scope%3Dbot&response_type=code&scope=bot%20messages.read%20guilds.join%20guilds%20guilds.members.read%20applications.commands%20voice
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, ActivityType } = require('discord.js');
const { token } = require('./config.json');
const { execute } = require('./commands/speak');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log(`Ready Freddy Spagheti! Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
	if (!(interaction.isChatInputCommand() || interaction.isContextMenuCommand())) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


client.on('messageCreate', async message => {
	const prefix = get_prefix(message);
    if (!message.content.startsWith(prefix)) return; 
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim();

	message.channel.send('You typed: ' + args);
	const speak = require('./speakPrefix.js');
	speak.func(message, args);

});


client.login(token);

function get_prefix(message) {
	const { pathToGuildData } = require('./config.json');
	const pathData = path.join(__dirname, pathToGuildData);
	const rawdata = fs.readFileSync(pathData);
	const userData = JSON.parse(rawdata);
	if (!userData[message.guildId]) {
		set_prefix(message.guildId);
	}
	else {return userData[message.guildId].prefix;}
}

function set_prefix(guildID) {
	const { pathToGuildData } = require('./config.json');
	const pathToFile = path.join(__dirname, pathToGuildData);
	const rawdata = fs.readFileSync(pathToFile);
	const dataJson = JSON.parse(rawdata);

	dataJson[guildID] = {
		prefix: '-',
	};

	fs.writeFile(pathToFile, JSON.stringify (dataJson, null, 4), err => {
		if (err) throw err;
		console.log('Sucesfully updated ', guildID);
	});
}