var g3Assert = {
  
  /**
   * {boolean} True indicates that at least one assertion has been thrown
   */
  __bAsserted: false,

  ///////////////////////////////////////////////////////////////////////////////

  /**
   * Determines if there is at least one assertion has been thrown
   * @return {boolean} True if one assertion has been thrown. Otherwise,
   * return false.
   */
  isFailed: function() {
    return g3Assert.__bAsserted;
  },
  
  ///////////////////////////////////////////////////////////////////////////////
  // Always Fail Assertion
  ///////////////////////////////////////////////////////////////////////////////

      /**
       * Assertion fails without any condition.
       *
       * @param {String} message
       *      The message to be printed out
       */
  fail: function(message) {
    this.__printMsg(message);
  },
  
  ///////////////////////////////////////////////////////////////////////////////
  // Boolean condition assertion
  ///////////////////////////////////////////////////////////////////////////////

      /**
       * Makes sure the given condition is true.
       *
       * @param {String} message
       *      The message to be printed out when the assertion fails
       */
  isTrue: function(condition, message) {
    if (!condition)
      this.__printMsg(message);
  },


      /**
       * Makes sure the given condition is false.
       *
       * @param {String} message
       *      The message to be printed out when the assertion fails
       */
  isFalse: function(condition, message) {
    if (condition)
      this.__printMsg(message);
  },


  ///////////////////////////////////////////////////////////////////////////////
  // Pointer/Reference assertion
  ///////////////////////////////////////////////////////////////////////////////

      /**
       * Makes sure the given object is null.
       *
       * @param {*} p
       *      The object to test
       * @param {String} message
       *      The message to be printed out when the assertion fails
       */
  isNull: function(p, message) {
    if (p != null) 
      this.__printMsg(message);
  },
  

      /**
       * Makes sure the given object is not null.
       * @param {*} p
       *      The object to test  
       *
       * @param {String} message
       *      The message to be printed out when the assertion fails
       */
  notNull: function(p, message) {
    if (p == null)
      this.__printMsg(message);
  },
  
  
  ///////////////////////////////////////////////////////////////////////////////
  // String assertion
  ///////////////////////////////////////////////////////////////////////////////
  
      /**
       * Makes sure the given string or array is either null or empty.
       *
       * @param {String|Array} s
       *      The String or array to test
       * @param {String} message
       *      The message to be printed out when the assertion fails
       */
  isNullOrEmpty: function(s, message) {
    if (!(s == null || s == "" || s.length == 0))
      this.__printMsg(message);
  },


      /**
       * Makes sure the given string or array is neither null nor empty.
       *
       * @param {String|Array} s
       *      The String or array to test
       * @param {String} message
       *      The message to be printed out when the assertion fails
       */
  notNullOrEmpty: function(s, message) {
    if (s == null || s == '' || s.length == 0)
      this.__printMsg(message);
  },
  
  
  ///////////////////////////////////////////////////////////////////////////////
  // Number assertion
  ///////////////////////////////////////////////////////////////////////////////

      /**
       * Asserts fail if the specified number is not in the specified range.
       * @param {Number} n
       *      The number to test
       * @param {Number} start
       *      The start of the range
       * @param {Number} end
       *      The end of the range
       * @param {String} message
       *      The message to be printed out when the assertion fails
       */
  isInRange: function(n, start, end, message) {
    if (n < start || n > end)
      this.__printMsg(message);
  },
  
  
      /**
       * Asserts fail if the specified number is in the specified range.
       * @param {Number} n
       *      The number to test
       * @param {Number} start
       *      The start of the range
       * @param {Number} end
       *      The end of the range
       * @param {String} message
       *      The message to be printed out when the assertion fails
       */
  isNotInRange: function(n, start, end, message) {
    if (start <= n || n <= end)
      this.__printMsg(message);
  },
  
  
      /**
       * Makes sure the specified number is the positive number.
       * @param {Number} n
       *      The number to test
       * @param {String} message
       *      The message to be printed out when the assertion fails
       */
  isPositive: function(n, message) {
    if (n <= 0)
      this.__printMsg(message);
  },
  
  
      /**
       * Makes sure the specified number is the zero or positive number.
       * @param {Number} n
       *      The number to test
       * @param {String} message
       *      The message to be printed out when the assertion fails
       */
  isZeroOrPositive: function(n, message) {
    if (n < 0)
      this.__printMsg(message);
  },


      /**
       * Makes sure the specified number is negative number.
       * @param {Number} n
       *      The number to test
       * @param {String} message
       *      The message to be printed out when the assertion fails
       */
  isNegative: function(n, message) {
    if (n >= 0)
      this.__printMsg(message);
  },


      /**
       * Makes sure the specified number is the zero or negative number.
       * @param {Number} n
       *      The number to test
       * @param {String} message
       *      The message to be printed out when the assertion fails
       */
  isZeroOrNegative: function(n, message) {
    if (n > 0)
      this.__printMsg(message);
  },
  
  ///////////////////////////////////////////////////////////////////////////////
  // Collection
  ///////////////////////////////////////////////////////////////////////////////
      /**
       * @param {String} message
       *      The message to be printed out when the assertion fails
       */
  hasSize: function(c, n, message) {
    if (c.length != n)
      this.__printMsg(message);
  },
  
  ///////////////////////////////////////////////////////////////////////////////
  // Type
  ///////////////////////////////////////////////////////////////////////////////
      isFunction: function(fp, message) {
          if (typeof fp != "function")
              this.__printMsg(message);
      },
      
      isObject: function(obj, message) {
          if (typeof obj != "object")
              this.__printMsg(message);
      },


//    typeOf: function(o, clazz, message) {
//      if (!(o instanceof clazz))
//        this.__printMsg(message);
//    },
  
  ///////////////////////////////////////////////////////////////////////////////
  // Mics
  ///////////////////////////////////////////////////////////////////////////////
  
      /**
       * @param {String} message
       *      The message to be printed out when the assertion fails
       */
  failTodo: function(message) {
    this.__printMsg("TODO: " + message);
  },

      /**
       * @param {String} message
       *      The message to be printed out when the assertion fails
       */
  failNotSupported: function(message) {
    this.__printMsg("Not Supported: " + message);
  },

  /**
   * @param {String} message
   *      The message to be printed out when the assertion fails
   */
  failOverride: function(message) {
      this.__printMsg("Abstract Function: " + message);
  },
      
  ///////////////////////////////////////////////////////////////////////////////

      /**
       * @param {String} message
       *      The message to be printed out when the assertion fails
       */
  __printMsg: function(message) {
    var s = "ASSERT: " + message;
    
      console.log(s);
      console.trace();
      g3Assert.__bAsserted = true;
      throw s;
  }
};

module.exports = g3Assert;

