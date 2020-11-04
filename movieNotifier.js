const notifier = require('node-notifier');
const path = require('path');
const opn = require('opn');

const fetch = require('node-fetch');
const parser = require('node-html-parser');

// using winston for logging
const winston = require('winston');
const files = new winston.transports.File({
  filename: 'notifierLogs.log'
});
const myconsole = new winston.transports.Console();
winston.add(myconsole);
winston.add(files);

let url = 'https://in.bookmyshow.com/buytickets/pvr-forum-mall-koramangala/cinema-bang-PVBN-MT/20190427';
let trackingWords = ['avengers', 'avenger', 'endgame', 'avengers endgame', 'Avengers: Endgame'];

winston.info(new Date());
winston.info('Starting Process');
winston.info('Polling BookMyShow...');

notify('Polling BookMyShow', 'Process Running in the Background...');
notifier.on('click', function (notifierObject, options) {
  opn(url);
});

function notify(title, message) {
  notifier.notify({
    title: title,
    message: message,
    icon: path.join('C:\\Users\\riyam\\Pictures', 'Avengers_Endgame_Poster.jpg'),
    wait: true // required for the onClick eventListener to work
  });
}

function pollBMS() {
  console.log('Polling BookMyShow...');
  fetch(url)
    .then(res => res.text())
    .then(body => {
      const dom = parser.parse(body);
      var nodeList = dom.querySelectorAll('.__name strong');
      winston.info('**********************************************' + new Date() + '**********************************************');
      nodeList.forEach(function (node) {
        let movieName = node.rawText.toLowerCase();
        for (trackingWord of trackingWords) {
          if (movieName.includes(trackingWord.toLowerCase())) {
            notify(node.rawText, 'Tickets Available Now !!!');
            console.log('Tickets for Avengers: Endgame available Now !!!');
            setTimeout(() => process.exit(0), 30 * 1000);
          }
        }
        winston.info(movieName);
      });
    })
    .catch((error) => {
      console.log('Error Occurred !!!' + error);
      winston.info(new Date() + ' Error Occurred !!! NO INTERNET !!!');
      notify('No Internet', 'Unable to connect to the Internet');
    });
}

setInterval(pollBMS, 10 * 1000); // Every Minute
