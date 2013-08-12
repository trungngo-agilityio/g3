(function() {

  var isNode = typeof exports !== 'undefined';
  var assert = isNode? require('assert') : window.assert;

  /**
   * Wraps a function and make sure the
   */
  function noop(returnVal, callbackVals) {
    return function() {
      var args = arguments || [],
          n = args.length;

      assert.ok(n > 0, "E82739234. last argument must be a callback");
      var callbackArg = args[n-1];
      if (callbackArg && typeof callbackArg === 'function') {
        callbackArg.apply(this, callbackVals);
      }

      return returnVal;
    };
  }

  if (isNode) module.exports = noop;
  else {
    window.aop = window.aop || {};
    aop.noop = noop;
  }
})();

