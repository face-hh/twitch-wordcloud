const { writeFileSync } = require('fs');
const tmi = require('tmi.js');
const readline = require('readline');
//const chalk = require('chalk');

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

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

rl.on('line', (input) => {
	const messagesPropertyName = input?.split(' ')?.[1];
	const messages2 = messages?.[messagesPropertyName];

	if(!messages2) return;

	if (input.startsWith(':q ')) close(messagesPropertyName);

	if (input.startsWith(':c ')) console.log('The streamer has: ' + messages2.split('\n').length)
});

function close(messagesPropertyName) {
	writeFileSync(`${messagesPropertyName}.txt`, messages[messagesPropertyName]);
	client.part(messagesPropertyName);
}

function onMessageHandler(target, context, msg, self) {
	if (self) return;
	target = target.replace(/#/g, '');

	if (!messages[target]) messages[target] = '';
	messages[target] += `${msg}\n`;

	// UNCOMMENT IF YOU WANT REAL-TIME LOGS OF ALL THE MESSAGES, MIGHT MAKE IT HARD TO TYPE :q OR :c

	//console.log(`${chalk.green(`[${new Date().toLocaleString()}] ${target}`)}: ${chalk.white(msg)}`);
}

function onConnectedHandler(addr, port) {
	console.log(`* Connected to ${addr}:${port}`);
}