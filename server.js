var express = require('express');
var app = express();
var path = require('path');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

const server_port = process.env.PORT || 3000

app.use(express.static('./public'));

app.use(function(req, res, next) {
  var matchUrl = '/api';
  if(req.url.substring(0, matchUrl.length) === matchUrl) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'application/json');
  }
  return next();
});

const adapter = new FileAsync('./db.json');
low(adapter)
  .then(db => {
    app.get('/api/fundos/:nome/:prazo', (req, res) => {
      var prazo = req.params.prazo || '0';
      var fundo = db.get(req.params.nome).value();
      fundo = fundo[prazo] || fundo[0];
      res.send(fundo);
    });

    app.get('/api/fundos', (req, res) => {
      var fundNames = db.keys().value().map((name)=> name.replace(/_/g, ' '));
      res.send(fundNames);
    });
  })
  .then(() => {
    app.listen(server_port, 
      () => console.log('listening on ' + server_port));
  })