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

// Other way of g3StringBuilder
// http://stackoverflow.com/questions/51185/are-javascript-strings-immutable-do-i-need-a-string-builder-in-js

var oop = require('./oop'),
    g3Assert = require('./assert'),
    g3ArrayHelper = require('./array-helper');


var g3StringBuilder = oop.Base.extend({

  /**
   * {String[]}
   * The list of items.
   */
  __items: null,
  
  ///////////////////////////////////////////////////////////////////////
  
  /**
   * Initializes the g3StringBuilder object
   */ 
  constructor: function(items) {
    if (items)
      this.__items = g3ArrayHelper.clone(items);
    else
      this.__items = [];
  }, 

  ///////////////////////////////////////////////////////////////////////

  /** 
   * Appends the specified text to the string builder object
   * @return {g3StringBuilder} Itself for chainability.
   */
  append: function (text) {
    if (text) {
      this.__items.push(text);
    }
    return this;
  },

  /** 
   * Gets the content of the string
   */
  toString: function() {
    return this.__items.join("");
  }
});

module.exports = g3StringBuilder;