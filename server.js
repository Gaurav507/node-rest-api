var app = require('./app');
var port = process.env.Port || 3000 ;

var server = app.listen(port, function() {
    console.log("Listening to port: "+ port);
});
