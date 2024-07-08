const { SlashCommandBuilder, inlineCode } = require('discord.js');
const fs = require('fs');
const { pathToMinecraftData } = require('../config.json');
const path = require('path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('howoldisminecraft')
		.setDescription('Get how old a minecraft update is')
		.addStringOption(option =>
			option.setName('update')
				.setDescription('What specific update?')
				.setRequired(true)),
	async execute(interaction) {
		const dataJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', pathToMinecraftData)));
		

		const inputUpdate = interaction.options.getString('update');

		let updateDate;

		dataJson.forEach(element => {
			// console.log(element.version);
			if (element.Version == inputUpdate) {
				updateDate = element.Release;
				//console.log('Got Update');
			}
		});
		

		if (updateDate) {
			await interaction.reply(`Minecraft ${inlineCode(inputUpdate)} is ${inlineCode(dateAgo(updateDate))} old `);
		}
		else {
			await interaction.reply(`Did not find update ${inlineCode(inputUpdate)} in database`);
		}


	},
	
};

function calcDate(date1, date2) {
    const diff = Math.floor(date1.getTime() - date2.getTime());
    const day = 1000 * 60 * 60 * 24;

    const days = Math.floor(diff / day);
    const months = Math.floor(days / 31);
    const years = Math.floor(months / 12);

    let message = days + ' days '; 
    message += months + ' months ';
    message += years + ' years';

    return message;
    }

	function dateAgo(date) {
		const startDate = new Date(date);
		const diffDate = new Date(new Date() - startDate);
		return ((diffDate.toISOString().slice(0, 4) - 1970) + ' Years ' +
			diffDate.getMonth() + ' Months ' + (diffDate.getDate() - 1) + ' Days');
	}