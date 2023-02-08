const { writeFileSync, appendFileSync } = require('fs');
const tmi = require('tmi.js');
const chalk = require('chalk');
const blessed = require('blessed');
const screen = blessed.screen();

// STREAMERS, ADD/REMOVE AS YOU WISH

const opts = {
	channels: [
    'ninja',
		'auronplay',
		'rubius',
		'ibai',
		'tfue',
		'thegrefg',
		'shroud',
		'juansguarnizo',
		'pokimane',
		'sodapoppin',
		'heelmike',
		'tommyinnit',
		'adinross',
		'nickmercs',
		'hasanabi',
		'lvndmark',
		'pestily',
		'summit1g',
		'kaicenat',
		'k3soju',
		'tarik',
		'moistcr1tikal',
		'xqc',
	],
};

const client = new tmi.client(opts);

const messages = {};

client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

client.connect();


const textArea = blessed.box({
  content: '',
  tags: true,
  left: 0,
  top: 0, 
  border: {
    type: 'line',
  },
  height: '94%',
  scrollable: true,
  alwaysScroll: true,
  scrollbar: {
    style: {
      bg: 'white'
    }
  }

})
const box = blessed.box({
  content: '',
  left: 0,
  bottom: 0,
  width: '100%',
  height: '10%',
  border: {
    type: 'line'
  },
  style: {
    border: {
      fg: 'grey'
    },
    hover: {
      bg: 'grey'
    }
  }
});
screen.append(box);
screen.append(textArea)
screen.render();
let autoScroll = true;
textArea.focus();
let input = '';
screen.on('keypress', (ch, key) => {
  if (key.name === 'up' || key.name === 'down' || key.name === 'left' || key.name === 'right') return;
  box.focus()
  if (key.name === 'backspace') {
    input = input.slice(0, -1);
  }
  if (key.name === 'enter') {
    const messagesPropertyName = input?.split(' ')?.[1];
	const messages2 = messages?.[messagesPropertyName];

	if(!messages2) return;

	if (input.startsWith(':q ')) close(messagesPropertyName);

	if (input.startsWith(':c ')) write(chalk.cyan('The streamer has: ' + messages2.split('\n').length + ' messages in the chat'));
    input = '';
	screen.render();
  } else {
    input += ch;
  }
  box.setContent(input);
  screen.render();

});

screen.key(['up'], function(ch, key) {
  textArea.scroll(-1);
  autoScroll = false;
  screen.render();
});

screen.key(['down'], function(ch, key) {
  textArea.scroll(1);
  if (textArea.getScrollPerc() === 100) {
    autoScroll = true;
  }
  screen.render();
  
});
screen.key(['escape', 'C-c'], function(ch, key) {
for (const streamer of opts.channels) {
	close(streamer.slice(1));
}
  return process.exit(0);
});

function write(content) {
  textArea.setContent(textArea.content + '\n' + content);
  if (autoScroll) textArea.scroll(1, false);
  screen.render();
}



function close(messagesPropertyName) {
	if (!messages[messagesPropertyName]) return;
  appendFileSync(`${messagesPropertyName}.txt`, messages[messagesPropertyName], { encoding: 'utf8' });
  client.part(messagesPropertyName);}

function onMessageHandler(target, context, msg, self) {
	if (self) return;
	target = target.replace(/#/g, '');

	if (!messages[target]) messages[target] = '';
	messages[target] += `${msg}\n`;

	write(`${chalk.green(`[${new Date().toLocaleString()}] ${context.username} (${target})`)}: ${chalk.white(msg)}`);
}

function onConnectedHandler(addr, port) {
	write(`* Connected to ${addr}:${port}`);
}