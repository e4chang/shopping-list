var https = require('https');
var express = require('express');
var db = require('mongoose').connection;
var router = express.Router();

var updateDatabase = function(jsonData) {
  console.log('Updating database');
  console.log(jsonData['1']);

  var jsonArray = [];
  /*
   * json data
   * {
   *   '1': {
   *          is_ultimate: false,
   *          materials: [ [ 152, 1 ] ],
   *          evolves_to: 2
   *        }
   *  ...
   *  }
   */

  // Convert json into insertable format
  for(var key in jsonData) {
    console.log(key);
    var monster = jsonData[key];
    for(item in monster) {
      jsonArray.push(
          {
            monster_id: key, 
            is_ultimate: item['is_ultimate'], 
            materials: item['materials'],
            evolves_to: item['evolves_to']
          }
      );
    }

  }

  // Insert json array into mongodb
  db.collection('evolutions').insertMany(jsonArray);

};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET update local database. */
router.get('/update', function(req, res, next) {
  var url = 'https://www.padherder.com/api/evolutions/';

  // Make https request to the data source
  https.get(url, (httpsRes) => {
    console.log('statusCode:', httpsRes.statusCode);
    console.log('headers:', httpsRes.headers);

    var body = '';

    // Decode and concat pieces of data
    httpsRes.on('data', (d) => {
      body += d.toString('utf8');
    });

    // Parse the data after receiving it
    httpsRes.on('end', function() {
      var result = JSON.parse(body);
      console.log(result);
      updateDatabase(result);
      res.send('OK');
    });

  // Handle eror in retrieving data
  }).on('error', (e) => {
      console.error(e);
      res.send('ERROR');
  });
});

router.get('/tree/:id', function(req, res, next) {
  var id = req.params.id;

  res.json({name:'hi', id: req.params.id});
});

module.exports = router;
