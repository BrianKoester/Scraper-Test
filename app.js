
/**
 * Module dependencies.
 */

var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var writeStream = fs.createWriteStream("file.csv");

var header = "Sl No"+","+"Age"+","+"Name"+"\n";
var row1 =  "0"+","+"21"+","+"Rob"+"\n";
var row2 =  "1"+","+"22"+","+"bob"+"\n";


pools = {
    'Aloha': 3,
    'Beaverton': 15,
    'Conestoga': 12,
    'Harman': 11,
    'Raleigh': 6,
    'Somerset': 22,
    'Sunset': 5,
    'Tualatin Hills': 2
};

days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

writeStream.write('Pool,' + 'Day,' + 'Time,' + 'Event' + '\n');

for (pool in pools) {
    var url = 'http://www.thprd.org/schedules/schedule.cfm?cs_id=' + pools[pool];

        request(url, (function(pool) { return function(err, resp, body) {
        $ = cheerio.load(body);
        $('#calendar .days td').each(function(day) {
            $(this).find('div').each(function() {
                event = $(this).text().trim().replace(/\s\s+/g, ',').split(',');
                if (event.length >= 2 && (event[1].match(/open swim/i) || event[1].match(/family swim/i)))
                    writeStream.write(pool + ',' + days[day] + ',' + event[0] + ',' + event[1] +'\n');
            });
        });
    }})(pool));
}

var delay=3000
    setTimeout(function(){
        writeStream.close();
    },delay);
