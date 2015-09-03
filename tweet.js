var GoogleSpreadsheet = require("google-spreadsheet");
var rest = require('restler');
var moment = require('moment');
var my_sheet = new GoogleSpreadsheet('1qfcj2g0UTUsSt64Wnf3tGFcVxQ3_RBqs4y6u_xAH3pE');
var creds = require('./google sheet-9d4c2fc8def0.json');

my_sheet.useServiceAccountAuth(creds, function(err) {
    my_sheet.getInfo(function(err, sheet_info) {
        console.log('sheet', sheet_info);
        var sheet1 = sheet_info.worksheets[1];

        console.log('sheet1', sheet1.title);
        // 2 is index or sheet ID
        my_sheet.getRows(2, function(err, rows) {
			var tweetRecursive = function() {
                var i = 0;
                var date = moment().add(1,'h').format();
                while (i < 20) {
                    var randomTweet = rows[Math.floor(Math.random() * rows.length)];
                    //console.log(randomTweet);
                    if (randomTweet.tweeted == 'NO' && (randomTweet.finaltweetshortenurlconcatenate != '' || randomTweet.finaltweetshortenurlconcatenate != null || randomTweet.finaltweetshortenurlconcatenate != undefined) && (randomTweet.numberofcharacters <= 140 && randomTweet.numberofcharacters > 1)) {
                        rest.post('https://panel.socialpilot.co/oauth/post/update', {
                            data: {
                                post_content: randomTweet.finaltweetshortenurlconcatenate,
                                "account_id[0]": "10371",
                                access_token: "MOzn9LBiN8SnOtuXzcmbTvraQoSPxJU7CV2qWr6QAhospLkw4F36XzlLFJID4MrOkHSJxDLBKuq3Xwns",
                                schedule_date: date
                            },
                        }).on('complete', function(data, response) {
                            console.log('data', data);
                            if (data.error == 0) {
                                // you can get at the raw response like this...
                                console.log('data--', data);
                                console.log('Tweeted!--', randomTweet);

                                randomTweet.tweeted = 'Yes';
                                rows[0] = randomTweet;
                                rows[0].save();
                            } else {
                                console.log('It might happen that tweet is already tweeted! or check if there is another error!');
                            }
                        });
                        //console.log(randomTweet);
                        i++;
                    }
                }
            }
            tweetRecursive();
        });

    });
});