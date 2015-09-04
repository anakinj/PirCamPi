var log = require('./log');
var util = require('util');
var child_process = require('child_process');
var config = require('./config');
var path = require('path');

module.exports = {
  raspistill: function() {
    var filename = path.join(config.storage, 'image_' + new Date().toISOString() + '.jpg');
    var args = ['-w', '320', '-h', '240', '-o', filename, '-t', '1'];

    child_process.spawn('raspistill', args).on('exit', function(code) {

    });
  },
  raspivid: function(onClose) {
    var filename = path.join(config.storage, 'video_' + new Date().toISOString() + '.h264');
    var args = ['-o', filename, '-t', config.maxVideoDuration  || '60000'];

    var spawn = child_process.spawn('raspivid', args)

    log.info(util.format("Saving raspivid output to file '%s'", filename));

    spawn.on('exit', function(code) {
      log.info(util.format("Raspivid exited with code '%d'", code));
    });

    spawn.on('close', function(code, signal) {
      log.info(util.format("Raspivid exited with code '%d' and signal '%s'", code, signal));
      if (onClose) {
        onClose(filename);
      }
    });

    return spawn;
  }
}
