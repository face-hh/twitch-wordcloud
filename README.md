# Twitch Wordcloud
A project that turns twitch streamers' chats into a wordcloud (image).

Dev log at: https://youtu.be/yqUUsAxZG50

# ❓ How to use
## Fetching streamers chats
> 1. Modify `twitch.js` to add/remove streamers, instructions are in comments (`//`)
> 2. Install [NodeJS](https://nodejs.org/en/) if you haven't already.
> 3. Open a terminal in the directory where this repository is present
> 4. Run `npm i` to install all the required packages. (Manually: `npm i tmi.js chalk`)
> 5. Run the file using `node twitch.js`
> 6. You're all set! The script will now listen to the chat of the streamers in the code!
>> NOTE: The Twitch chat can be used regardless if the streamer is live or not!

>> NOTE: Use `:c <streamer>` to receive the amount of messages collected. (i.e. `:c xqc`)

>> NOTE: Use `:q <streamer>` to stop the process of a certain streamer and output all their messages to a txt file. (i.e. `:q xqc`)

## Creating the wordcloud
>> NOTE: This uses the public Python project called [word_cloud](https://github.com/amueller/word_cloud).
> 1. Modify the `main.py` with the options you want to use.
> 2. Install [Python](https://www.python.org/) if you haven't already.
> 3. Download the required packages by using `pip install wordcloud scipy.ndimage matplotlib.pyplot` (If you receive "Module not found", run the same command including the specific package)
> 4. Run the commad using `python main.py path/to/file.txt path/to/input_image.png path/to/output_image.png`

>> NOTE: path/to/file.txt = file you received from the `twitch.js` script above.

>> NOTE: path/to/input_image.png = the image you want the mask to apply to, **the image shall not include any black** (not sure about white), and **it should not have a background/have a white background**.

# Contribution
Pull requests are appreciated!

# Errors

Errors might occur, if so, **open an issue here** or join our [Discord server](https://discord.gg/W98yWga6YK) for faster help.
## Credits

- [word_cloud](https://github.com/amueller/word_cloud)
- [remove.bg](https://remove.bg)

## License
Free to use, as long as you credit me :)