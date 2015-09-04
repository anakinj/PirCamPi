var raspi = require('raspi-io');
var five = require('johnny-five');
var log = require('./log');
var processWrapper = require('./processWrapper');

var board = new five.Board({
  io: new raspi()
});

board.on('ready', function() {
  log.info('Board ready, starting to initialize components');

  var motion = new five.Motion('P1-7');

  motion.on('calibrated', function() {
    log.info('PIR sensor calibrated');
  });

  var currentProc;

  motion.on('motionstart', function() {
    log.info('Motion detected');
    currentProc = processWrapper.raspivid(function(file) {});
  });

  motion.on('motionend', function() {
    log.info('Motion ended');
    if (currentProc) {
      currentProc.kill('SIGINT');
    }
  });
});

process.on('SIGINT', function() {
  log.info('Got SIGINT, exiting');
  process.exit();
});
