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
screen.on('keypress', async (ch, key) => {
  if (key.name === 'up' || key.name === 'down' || key.name === 'left' || key.name === 'right') return;
  switch (key.name) {
    case 'backspace':
      input = input.trim().substring(0, input.trim().length - 1);
      box.setContent(input.trim());
      screen.render();
      break;
    case 'enter':
      const messagesPropertyName = input?.split(' ')?.[1];
      const messages2 = messages?.[messagesPropertyName];
      if (messages2) {
        if (input.trim().startsWith(':q ')) await close(messagesPropertyName);

        if (input.trim().startsWith(':c ')) write(chalk.cyan('The streamer has: ' + messages2.split('\n').length + ' messages in the chat'));
      } else if (!messages2 && input.trim().length > 0) {
        write(chalk.yellow('Unknown command!'))
      }
      input = '';
      box.setContent(input);
      screen.render();
      break;
    default:
      input += ch;
      box.setContent(input.trim());
      box.render();
      break;
  }
  box.setContent(input.trim());
  screen.render();

});

screen.key(['up'], function (ch, key) {
  textArea.scroll(-1);
  autoScroll = false;
  screen.render();
});

screen.key(['down'], function (ch, key) {
  textArea.scroll(1);
  if (textArea.getScrollPerc() === 100) {
    autoScroll = true;
  }
  screen.render();

});
screen.key(['escape', 'C-c'], async (ch, key) => {
  for (const streamer of opts.channels) {
    await close(streamer.slice(1));
  }
  return process.exit(0);
});

function write(content) {
  textArea.setContent(textArea.content + '\n' + content);
  if (autoScroll) textArea.scroll(1, false);
  screen.render();
}



async function close(messagesPropertyName) {
  if (!messages[messagesPropertyName]) return;
  appendFileSync(`${messagesPropertyName}.txt`, messages[messagesPropertyName], { encoding: 'utf8' });
  try {
    await client.part(messagesPropertyName);
    write(chalk.yellow(`Loaded collected messages to ${messagesPropertyName}.txt!`));
    box.setContent(input);
    screen.render();
  } catch {
    write(chalk.red(`${messagesPropertyName} Channel has already been disconnected!`));
  }
}

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