# Discord Bot

This is a Discord bot that tracks messages in a specific channel and updates a leaderboard based on the number of messages a user has sent. It also updates a topic in the tracking channel with the current top score.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Discord.js](https://discord.js.org/)

### Installing

1. Clone the repository
2. Install the dependencies by running `npm install` in the project directory
3. Set up a [Discord bot](https://discord.com/developers/docs/intro) and copy the token
4. Go to index.js and search for the config object:
   - `token`: the Discord bot token
   - `prefix`: the command prefix for the bot
   - `countchannel`: the ID of the channel where messages should be counted
   - `lbchannel`: the ID of the channel where the leaderboard should be posted
   - `failrole`: the ID of the role to be given to users who fail to meet the daily message count requirement
   - `guild`: the ID of the Discord server
5. Run the bot using `node index.js`

## Built With

- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Discord.js](https://discord.js.org/) - Discord API library for Node.js

## Author

- **invaliduser231** - [GitHub profile](https://github.com/invaliduser231)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
