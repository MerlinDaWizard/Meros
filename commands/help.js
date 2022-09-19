const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

const exampleEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('The Help Embed :new_moon_with_face: ')
	.setAuthor({ name: 'LW Bot', iconURL: 'https://cdn.discordapp.com/attachments/406114988504252419/1021536066878054420/Meros_Artistic.png' })
	.setDescription('A text to speech program utilising discord.js and gTTS')
	.setThumbnail('https://external-preview.redd.it/1Ue9d7ASCGBH7RHliUxmiPCEezJyVR3FKAf1rvKnmxM.png?format=pjpg&auto=webp&s=df4ef27f4ff66e659a47e3c5758c749d3030e818')
	.addFields(
		{ name: '/help', value: 'Brings this menu up ' },
		{ name: '/speak', value: 'The bots transfers inputted text into a beautiful voice' },
		{ name: '/changevoice', value: 'Change the nationality of the beautiful voice. Sets it per user' },
		{ name: '/team', value: 'Insert names seperated by ` , ` and number of teams, to get a random assortment of teams.' },
		{ name: '/celeste', value: 'Get the current price of :star: Celeste :star:  on steam and if they are on sale' },
		{ name: '/ping', value: 'Says "Pong!" back.' },
	)
	.setTimestamp()
	.setFooter({ text: 'Bot baddly done by Ekpy#1372', iconURL: 'https://cdn.discordapp.com/attachments/406114988504252419/1021536066878054420/Meros_Artistic.png' });


module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Tells about my features!'),
	async execute(interaction) {
		await interaction.reply({ embeds: [exampleEmbed] });
	},
};
