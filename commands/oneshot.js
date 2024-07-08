const { SlashCommandBuilder } = require('discord.js');
const request = require('request');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('oneshot')
		.setDescription('Gets the current price of Onehsot'),
	async execute(interaction) {

        request('https://store.steampowered.com/api/appdetails?appids=420530', (error, response, body) => {
            if (error) {console.error(error);}
            else {
                const object = JSON.parse(body);
                const data = object['420530']['data']['price_overview'];
                if (data['discount_percent'] != 0) {
                    interaction.reply (`Oneshot is currently ${data['final_formatted']}, a saving of ${data['discount_percent']}%`);
                }
                else {
                    interaction.reply(`Oneshot is currently ${data['final_formatted']} as normal`);
                }
            }
        });
	},
};


/*
import requests
req = requests.get(url="https://store.steampowered.com/api/appdetails?appids=504230")
data = req.json().get('504230').get('data').get('price_overview')
if data.get('discount_percent') != 0:
    print(f"Celeste is currently {data.get('final_formatted')}, a saving of {data.get('discount_percent')}%")
else:
    print(f"Celeste is currently {data.get('final_formatted')} as normal")
    */