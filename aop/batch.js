(function() {

  var isNode = typeof exports !== 'undefined';

  var assert = isNode? require('assert') : window.assert;

  /**
   * Wraps a function and make sure the
   */
  function batch(fn, computeBatchId, lru) {
    assert.ok(fn, "E3889234234. fn is required");
    assert.ok(computeBatchId, "E8848494334. computeBatchId is required");

    var cache = {};

    return function() {
      var args = arguments || [],
          n = args.length;

      assert.ok(n > 0, "E82739234. last argument must be a callback");

      var key = computeBatchId.apply(null, args),
          d = cache[key] || [],
          callbackArg;

      callbackArg = args[n-1];
      assert.ok(callbackArg && typeof callbackArg === 'function',
        "E887667899. Last argument must be a callback");

      d.push(callbackArg);
      if (d.length === 1) {
        // This is the first time the request is called
        cache[key] = d;

        args[n-1] = function() {
          var i=0;
          while (i<d.length) {
            callbackArg = d[i++];
            callbackArg.apply(null, arguments);
          }
          delete cache[key];
        };

        // Executes
        fn.apply(null, args);
      }
    };
  }

  if (isNode) module.exports = batch;
  else {
    window.aop = window.aop || {};
    aop.batch = batch;
  }
})();

