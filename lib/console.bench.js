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

  var suite = new benchmark.Suite();

  var loggers = {
    winston1: new winston1.Logger({
      transports: [
        new winston1.transports.File({ stream: process.stdout })
      ]
    }),
    winston2: new winston2.Logger({
      transports: [
        new winston2.transports.File({ stream: process.stdout })
      ]
    }),
    winston3: new winston3.LogStream({
      transports: [
        new winston3.transports.Console()
      ]
    }),
    bunyan: bunyan.createLogger({
      name: 'benchmark',
      stream: process.stdout
    })
  }

  // suite.add('winston1', function () {
  //   for (var i = 0; i < max; i++) {
  //     loggers.winston1.log('info', message);
  //   }
  // });

  // suite.add('winston2', function () {
  //   for (var i = 0; i < max; i++) {
  //     loggers.winston2.log('info', message);
  //   }
  // });

  suite.add('winston3', function () {
    loggers.winston3.write({
      level: 'info',
      message: message,
      meta: { ok: true }
    });
  });

  suite.add('bunyan', function () {
    loggers.bunyan.info({ message: message });
  });

  return suite;
};
