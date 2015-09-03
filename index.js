var GoogleSpreadsheet = require("google-spreadsheet");
var rest = require('restler');
var BitlyAPI = require("node-bitlyapi");
var moment = require('moment');

var my_sheet = new GoogleSpreadsheet('1qfcj2g0UTUsSt64Wnf3tGFcVxQ3_RBqs4y6u_xAH3pE');
var creds = require('./google sheet-9d4c2fc8def0.json');
var Bitly = new BitlyAPI({
    client_id: "jeet09",
    client_secret: "R_f5f765b56594427b81a2fdf3ef9323d2"
});
Bitly.setAccessToken('c796771304c2fa9f79acf7fc4bce7d749aa2aaf8');



//console.log('creds', my_sheet);
my_sheet.useServiceAccountAuth(creds, function(err) {
    my_sheet.getInfo(function(err, sheet_info) {
        console.log('sheet', sheet_info);
        var sheet1 = sheet_info.worksheets[1];

        console.log('sheet1', sheet1.title);
        // 2 is index or sheet ID
        my_sheet.getRows(2, function(err, rows) {

            rows.forEach(function(element, index) {
                // If already not shorten and concatinated!             
                //if (element.finaltweetshortenurlconcatenate === '' || element.finaltweetshortenurlconcatenate === undefined || element.finaltweetshortenurlconcatenate === null) {
                    // Validate wheteher URL is valid or not
                    var isUrl = function(url) {
                        var p = /\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;
                        return p.test(url);
                    }
                    if (isUrl(element.url)) {
                        Bitly.shorten({
                            longUrl: element.url
                        }, function(err, results) {
                            // Do something with your new, shorter url...
                            var result = JSON.parse(results);
                            // Concate tweet and shorten url and save
                            element.finaltweetshortenurlconcatenate = element.tweet.concat(' ', result.data.url);
                            element.numberofcharacters = (element.finaltweetshortenurlconcatenate).length
                            rows[0] = element;
                            rows[0].save();
                            console.log('rows', rows[0]);
                            console.log("Saved succesfully");

                        });
                    } else {
                        //If there is no url just concate as it is.
                        element.finaltweetshortenurlconcatenate = element.tweet.concat(' ', element.url);
                        element.numberofcharacters = (element.finaltweetshortenurlconcatenate).length
                        rows[0] = element;
                        rows[0].save();
                        console.log('rows', rows[0]);
                        console.log("Saved succesfully");
                    }
                //}
            });
           
        });

    });
});