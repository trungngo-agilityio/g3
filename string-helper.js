///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2010 AsNet Co., Ltd.
// All Rights Reserved. These instructions, statements, computer
// programs, and/or related material (collectively, the "Source")
// contain unpublished information propietary to AsNet Co., Ltd
// which is protected by US federal copyright law and by 
// international treaties. This Source may NOT be disclosed to 
// third parties, or be copied or duplicated, in whole or in 
// part, without the written consent of AsNet Co., Ltd.
///////////////////////////////////////////////////////////////////////////////

var g3Assert = require('./assert');

/**
 * Provides common utilities for string handling
 */
var g3StringHelper = {

  EMPTY: "",

  LINE_SEPARATOR: '\n',

  TAB: '\t',

  /**
   * Determines if the specified is null or empty
   */
  isNullOrEmpty: function(str) {
    return (!str || str.length == 0);
  },


  /**
   * Determines if the source string has the specified prefix
   */
  startsWith: function(sourceString, prefix) {
    g3Assert.notNull(sourceString, "E9384758293:Source string is null");
    g3Assert.notNull(prefix, "E8932098477:Prefix string is null");
    var sourceStringPrefix = sourceString.substr(0, prefix.length);
    if (sourceStringPrefix == prefix)
      return true;
    else
      return false;
  },

  /**
   * Determines if the source string has the specified suffix
   */
  endsWith: function(sourceString, suffix) {
    g3Assert.notNull(sourceString, "E0932948083:Source string is null");
    g3Assert.notNull(suffix, "E9387649028:Suffix string is null");
    var sourceStringSuffix = sourceString.substr(sourceString.length - suffix.length, suffix.length);
    if (sourceStringSuffix == suffix)
      return true;
    else
      return false;
  },


  /**
   * Trims all leading and ending whitespace character of the specified string.
   * http://blog.stevenlevithan.com/archives/faster-trim-javascript
   *
   * @param {String} str
   *      The string to trim
   */
  trim: function(str) {
    g3Assert.notNull(str, "E9843097589:The string to trim is null");
    var str = str.replace(/^\s\s*/, ''),
      ws = /\s/,
      i = str.length;

    while (ws.test(str.charAt(--i))){}
    return str.slice(0, i + 1);
  },

  /**
   * Replaces all instances of "whatString" with the specified "withString"
   */
  replaceAll: function(sourceString, whatString, withString) {
    g3Assert.notNull(sourceString, "E983098769:Source string is null");
    g3Assert.notNull(whatString, "E0938759384:What string is null");
    g3Assert.notNull(withString, "E8740295837:With String is null");
    var pieces = sourceString.split(whatString);
    return pieces.join(withString);
  },


  /**
   * Adds the specified tab characters to every line of the source text.
   */
  tapifyWithPrefix: function(sourceString, tabString) {
    g3Assert.notNull(sourceString, "E0293405923:Source string is null");
    g3Assert.notNull(tabString, "E0938475829:Tab string is null");
    if (!StringHelper.startsWith(sourceString, g3StringHelper.LINE_SEPARATOR))
      sourceString = this.LINE_SEPARATOR + sourceString;

    if (!StringHelper.endsWith(sourceString, g3StringHelper.LINE_SEPARATOR))
      sourceString = sourceString.substr(0, sourceString.length);

    sourceString = g3StringHelper.replaceAll(sourceString,
          g3StringHelper.LINE_SEPARATOR,
          g3StringHelper.LINE_SEPARATOR + tabString);

    return sourceString + g3StringHelper.LINE_SEPARATOR;
  },


  /**
   * Adds the tab character to the beginning of every line.
   */
  tapify: function(sourceString) {
    return this.tapifyWithPrefix(sourceString, g3StringHelper.TAB);
  },


  /*
   * Adds the specified character to the left of the source string until
   * it has the specified length.
   */
  __padding: function(srcString, character, length, isRight) {
    g3Assert.notNull(srcString, "E0938475920:Source string is null");
    g3Assert.notNull(character, "E9384758203:Character is null");
    //TODO: Fix never end looping when character is a empty string
    var str = srcString;
    while (str.length < length) {
      if (isRight)
        str = str + character;
      else
        str = character + str;
    }

    return str;
  },


  /**
   * Adds the specified character to the left of the source string until
   * it has the specified length.
   */
  paddingLeft: function(srcString, character, length) {
    return g3StringHelper.__padding(srcString, character, length, false);
  },


  /**
   * Adds the specified character to the right of the source string until
   * it has the specified length.
   */
  paddingRight: function(srcString, character, length) {
    return g3StringHelper.__padding(srcString, character, length, true);
  },


  /**
   * Stringify a JSON object
   * @param {*} obj
   */
  stringify : function (obj) {
      var t = typeof (obj);
      if (t != "object" || obj === null) {
        // simple data type
        if (t == "string") obj = '"' + obj + '"';
        return String(obj);
      } else {
        // recurse array or object
        var n, v, json = [], arr = (obj && obj.constructor == Array);

        for (n in obj) {
          v = obj[n];
          t = typeof(v);
          if (obj.hasOwnProperty(n)) {
            if (t == "string") v = '"' + v + '"'; else if (t == "object" && v !== null) v = g3StringHelper.stringify(v);
            json.push((arr ? "" : '"' + n + '":') + String(v));
          }
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
      }
  }
};

module.exports = g3StringHelper;
