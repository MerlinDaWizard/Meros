const { SlashCommandBuilder, codeBlock } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('team')
		.setDescription('Creates teams from provided names')
		.addStringOption(option =>
			option.setName('names')
				.setDescription('Put in names broken up by a , to create teams')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('team_number')
				.setDescription('Number of teams')
				.setRequired(true)),
	async execute(interaction) {
		const nameArray = interaction.options.getString('names').split(',');

        shuffle(nameArray);
        
        const numberOfTeams = interaction.options.getInteger('team_number');
        const teamArray = createTeams(nameArray, numberOfTeams);

        await interaction.reply(createOutputString(teamArray));
	},
};

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

function createOutputString(teamArray) {
    let output = '';
    let index = 1;
    teamArray.forEach(element => {
        output = output + 'Team ' + index + ': ' + element.toString() + '\n';
        index += 1;
    });

    return codeBlock(output);
  }

function createTeams(players, numTeams) {
    let tempArray = [];
    tempArray = players.slice();

    const output = new Array(numTeams);
    for (let i = 0; i < output.length; i++) {
        output[i] = new Array();
    }
    
    let teamIndex = 0;
    for (let i = 0; i < players.length; i++) {
        output[teamIndex].push(tempArray.pop());
        teamIndex++;
        teamIndex = (teamIndex == numTeams) ? 0 : teamIndex;
    }

    return output;
}

/*
function generateTeams(players, numTeams) {
    let tempArray = [];
    tempArray = players.slice();

    const playerPerTeam = Math.floor(tempArray.length / numTeams);
    const results = [];
    while (results.length < numTeams) {
        results.push(tempArray.splice(0, playerPerTeam));
    }
    if (tempArray.length) {
    results[results.length - 1] = [...results[results.length - 1], ...tempArray];
    }
    return results;
}*/