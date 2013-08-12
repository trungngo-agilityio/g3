
var assert = require('assert'),
    limiter = require('limiter');

var confByName = {};

function config(name, tokensPerInterval, interval) {

  var conf = new limiter.RateLimiter(tokensPerInterval, interval);
  confByName[name] = conf;
}

function limit(fn, name, tokens) {
  assert.ok(fn, "E8928394234. fn is required");
  assert.ok(typeof fn === 'function', 'fn must be a function');
  assert.ok(name, "E8923849234. name is required");


  var conf = confByName[name];
  if (!conf) return fn;
  if (!tokens) tokens = 1;

  return function() {
    var self = this,
        args = arguments;

    conf.removeTokens(tokens, function() {
      console.log("Remove ", tokens, " tokens");
      return fn.apply(self, args);
    });
  };
}


module.exports = {
  limit: limit,
  config: config
};
