const { SlashCommandBuilder, codeBlock } = require('discord.js');


const chair =
`
[0;31m   __________.
[0;31m  /_/-----[0;31m/_/|[0;33m   __
[0;31m  ( ([0;30m ' ' [0;31m( (|[0;33m /[0;37m'--'[0;33m\\
[0;31m  (_([0;30m ' ' [0;31m(_(|[0;33m/.    .\\
[0;31m  / /[0;30m=====[0;31m/ /|[0;30m  '||'
[0;31m /_//[0;30m____[0;31m/_/ |[0;30m   ||
[0;31m(o|[0;30m:.....[0;31m|o) |[0;30m   ||
[0;31m|_|[0;30m:_____[0;31m|_|/'[0;30m  _||_
[0;31m'        '    [0;30m/______\\ 
`;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chair')
		.setDescription('Gives nice chair'),
	async execute(interaction) {
		await interaction.reply(codeBlock('ansi', chair));
	},
};
