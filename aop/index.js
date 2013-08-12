var advice = require('./advice'),
    _ = require('underscore');

module.exports = {
  weave: advice.weave,
  before: advice.before,
  after: advice.after,
  around: advice.around,
  limiter: require('./limiter'),
  limit: require('./limiter').limit,
  batch: require('./batch'),
  noop: require('./noop'),


  /**
   * throttle(function, wait)
   * Creates and returns a new, throttled version of the passed function,
   * that, when invoked repeatedly, will only actually call the original
   * function at most once per every wait milliseconds. Useful for rate-limiting
   * events that occur faster than you can keep up with.
   */
  throttle: _.throttle,

  /**
   * debounce(function, wait, [immediate])
   * Creates and returns a new debounced version of the passed function that
   * will postpone its execution until after wait milliseconds have elapsed
   * since the last time it was invoked. Useful for implementing behavior that
   * should only happen after the input has stopped arriving. For example:
   * rendering a preview of a Markdown comment, recalculating a layout after
   * the window has stopped being resized, and so on.
   *
   * Pass true for the immediate parameter to cause debounce to trigger the
   * function on the leading instead of the trailing edge of the wait interval.
   * Useful in circumstances like preventing accidental double-clicks on a
   * "submit" button from firing a second time.
   */
   debounce: _.debounce,

  /**
   * once(function)
   * Creates a version of the function that can only be called one time.
   * Repeated calls to the modified function will have no effect, returning
   * the value from the original call. Useful for initialization functions,
   * instead of having to set a boolean flag and then check it later.
   */
  once: _.once

};