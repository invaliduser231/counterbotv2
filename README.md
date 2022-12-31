# Discord Count Bot

This is a simple Discord bot that allows users to send messages in a designated channel to add to a count. The bot will keep track of the current count, as well as the top score for the day. The top 10 scores for the day will be displayed in a separate channel at midnight. If a user sends a message that is not a number, they will receive a message and their count will be reset to 0.

## Requirements

- Node.js 12.0.0 or later
- npm 6.14.4 or later
- A Discord bot account and token

## Set Up

1. Clone the repository to your local machine
2. Run `npm install` to install the necessary dependencies
3. Create a `.env` file in the root directory of the project and add the following variables:
    - `TOKEN`: The Discord bot token
    - `PREFIX`: The desired command prefix for the bot (default is `+`)
    - `COUNT_CHANNEL`: The ID of the channel where users will send messages to add to the count
    - `LB_CHANNEL`: The ID of the channel where the top 10 scores will be displayed
    - `FAIL_ROLE`: The ID of the role that will be applied to users who send a message that is not a number
    - `GUILD`: The ID of the Discord server
4. Run the bot using `node index.js`

## Usage

- To add to the count, send a message with a number in the designated count channel.
- To view the current count and top score, use the `+count` command.
- To view the top 10 scores for the day, use the `+top` command.

## Credits

- [discord.js](https://github.com/discordjs/discord.js)
- [dotenv](https://github.com/motdotla/dotenv)
