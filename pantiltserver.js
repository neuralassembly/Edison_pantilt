var mraa = require('mraa');
var p0 = new mraa.Pwm(0);  // J17-1
var p1 = new mraa.Pwm(14); // J18-1

p0.period_us(19500);
p0.enable(true);
p1.period_us(19500);
p1.enable(true);

// For upper servo
var duty0min = 0.03; // min
var duty0max = 0.11; // max
var duty0 = (duty0min + duty0max)/2;

// For lower servo
var duty1min = 0.031; // min
var duty1max = 0.115; // max
var duty1 = (duty1min + duty1max)/2;

p0.write(duty0);
p1.write(duty1);

var datamin = 0;
var datamax = 255;

var connect = require('connect');

connect.createServer(
    connect.static(__dirname)
).listen(8080);

var socketio = require("socket.io");
var io = socketio.listen(8888);

io.sockets.on("connection", function (socket) {

    socket.on("message", function(data){
        var split_data = data.split(',');

        var data0 = parseInt(split_data[0]);
        var data1 = parseInt(split_data[1]);

        if(data0 >= datamin && data0<=datamax  &&
           data1 >= datamin && data1<=datamax){
            duty0 = (duty0min-duty0max)*(data0 - datamin)/(datamax-datamin) + duty0max;
            duty1 = (duty1min-duty1max)*(data1 - datamin)/(datamax-datamin) + duty1max;

            p0.write(duty0);
            p1.write(duty1);
        }
 
    });
});


