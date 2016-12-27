var express=require('express');
var webserver=express();
require('./router/router1.js')(webserver);
webserver.set('views', './ejs');
webserver.set('view engine', 'ejs');
webserver.use(express.static('bootstrap'));
webserver.use(express.static('public'));

webserver.listen(80);
