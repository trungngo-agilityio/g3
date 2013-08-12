/**
 * Weaves aspect behavior for a single function
 */
function weave(fp, advice) {
  return function() {
    
    var ret,

      // "That" is the target object of the advised function
      that = this,

      // The call context object, which would be shared
      // with advice implementation
      ctx = {
        target: that,

        // The list of arguments sent to the advised function
        args: [],

        // The current value returned by the advised function
        // This value would be updated after "around" & "after"
        // advices are called.
        ret: null
      },

      adviceArgs=[ctx],
      orgArgs=ctx.args,
      n = arguments.length,
      i;

    // Coppies the argument array
    for (i=0; i<n; i++) {
      orgArgs.push(arguments[i]);
      adviceArgs.push(arguments[i]);
    }

    // Executes "before" advice
    if (advice.before) advice.before.apply(null, adviceArgs);

    // Executes "around" advice
    if (advice.around) {

      // Passes the "proceed" function into
      // around advice implementation.
      // If ctx.proceed is called, the original
      // function would be callled.
      ctx.proceed = function() {
        var ret = fp.apply(that, ctx.args);
        return ret;
      };

      ret = advice.around.apply(null, adviceArgs);
    } else {
      ret = fp.apply(that, arguments);
    }

    // Executes "after" advice
    if (advice.after) {
      if (ctx.proceed) delete ctx.proceed;
      ctx.ret = ret;

      advice.after.apply(null, adviceArgs);
    }
    return ret;
  };
}

function before(fp, beforeFp) {
  return weave(fp, {
    before: beforeFp
  });
}

function after(fp, afterFp) {
  return weave(fp, {
    after: afterFp
  });
}

function around(fp, aroundFp) {
  return weave(fp, {
    around: aroundFp
  });
}


module.exports = {
  weave: weave,
  around: around,
  before: before,
  after: after
}