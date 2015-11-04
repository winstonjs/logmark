'use strict';

var fs = require('fs'),
    path = require('path'),
    benchmark = require('benchmark'),
    winston3 = require('winston'),
    winston2 = require('winston2'),
    winston1 = require('winston1'),
    bunyan = require('bunyan');

module.exports = function (opts) {
  opts = opts || {};

  var max = opts.max || 10000;
  var message = opts.message || 'A logging message that is reasonable long';

  var streams = {
    winston3: fs.createWriteStream(path.join(__dirname, '..', 'winston3.log')),
    winston2: fs.createWriteStream(path.join(__dirname, '..', 'winston2.log')),
    winston1: fs.createWriteStream(path.join(__dirname, '..', 'winston1.log')),
    bunyan: fs.createWriteStream(path.join(__dirname, '..', 'bunyan.log'))
  };

  var suite = new benchmark.Suite({
    maxTime: 1
  });


  var loggers = {
    winston1: new winston1.Logger({
      transports: [
        new winston1.transports.File({ stream: streams.winston1 })
      ]
    }),
    winston2: new winston2.Logger({
      transports: [
        new winston2.transports.File({ stream: streams.winston2 })
      ]
    }),
    winston3: new winston3.LogStream({
      transports: [
        new winston3.transports.File({ stream: streams.winston3 })
      ]
    }),
    bunyan: bunyan.createLogger({
      name: 'benchmark',
      stream: streams.bunyan
    })
  }

  // suite.add('winston1', function () {
  //   loggers.winston1.log('info', message);
  // });

  suite.add('winston2', function () {
    loggers.winston2.log('info', message);
  });

  suite.add('winston3', function () {
    loggers.winston3.write({
      level: 'info',
      message: message,
      meta: { ok: true }
    });
  });

  // suite.add('bunyan', function () {
  //   loggers.bunyan.info({ message: message });
  // });

  return suite;
};
