'use strict';

module.exports = function () {
  //
  // TODO: More than simple tests or whatever.
  //
};

var suite = require('./lib/console.bench')();

suite.on('cycle', function cycle(e) {
  var details = e.target;

  // console.dir(e);
  // console.dir(details);

  console.log('Finished benchmarking: "%s"', details.name);
  console.log('Count (%d), Cycles (%d), Elapsed (%ds), Hz (%d)'
    , details.count
    , details.cycles
    , details.times.elapsed
    , details.hz
  );
}).on('complete', function completed() {
  console.log('Benchmark: "%s" is the fastest.'
    , this.filter('fastest').pluck('name')
  );

  var that = this;
  this.forEach(function (left, i) {
    that.forEach(function (right, j) {
      var faster = left.hz > right.hz ? left : right;
      var slower = left.hz < right.hz ? left : right;

      if (left !== right && j > i) {
        console.log('  - %s faster than %s by %d', faster.name, slower.name, (faster.hz / slower.hz).toFixed(4));
      }
    });
  });
}).run();
