var express = require('express');
var qs = require('qs');
var request = require('superagent');
var hpn = express();

hpn.set('host', 'https://happinessometer.herokuapp.com');
hpn.set('version', 'v1');

if (!process.env.OFFICE_TOKEN || !process.env.OFFICE_USER) {
    console.log('[ERROR] Env. Vars. OFFICE_TOKEN or OFFICE_USER are not setted.');
    process.exit(0);
}

hpn.set('port', process.env.PORT || 3000);
hpn.set('imgUrls', {
    good : (process.env.IMG_GOOD_URL || '/img/_good.png'),
    bad : (process.env.IMG_BAD_URL || '/img/_bad.png'),
    neutral : (process.env.IMG_NEUTRAL_URL || '/img/_neutral.png')
});

console.log('Office User: ' + process.env.OFFICE_USER);
console.log('URL 4 good : ' + hpn.get('imgUrls').good);
console.log('URL 4 bad : ' + hpn.get('imgUrls').bad);
console.log('URL 4 neutral : ' + hpn.get('imgUrls').neutral);

hpn.use(express.static(__dirname + '/public'));
hpn.set('views', __dirname + '/views');
hpn.set('view engine', 'ejs');

// functions
function url(uri) {
    return hpn.get('host') + '/' + hpn.get('version') + uri;
}

function postMood(mood) {
    console.log("\nRequesting Office Mood : " + mood);
    request.post(url('/users/me/moods'))
        .send({ mood : mood, comment : '', user: process.env.OFFICE_USER }) //no msg due to not affect analysis of messages
        .set('Accept', 'application/json')
        .set('Authorization', 'Token ' + process.env.OFFICE_TOKEN)
        .end(function(err, res){
            if (err) {
                console.log("\n-Error: " + JSON.stringify(err));
            }
            else {
                console.log("\n-Response: " + JSON.stringify(res));
            }
        });
}

// routes
hpn.get('/', function (req, res) {
    res.render('index', {imgUrls: hpn.get('imgUrls'), user: process.env.OFFICE_USER });
});

hpn.post('/im/good', function(req, res) {
    postMood('good');
});
hpn.post('/im/neutral', function(req, res) {
    postMood('neutral');
});
hpn.post('/im/bad', function(req, res) {
    postMood('bad');
});

// listening on
hpn.listen(hpn.get('port'), function() {
    console.log('Listening on port: ' + hpn.get('port'));
});