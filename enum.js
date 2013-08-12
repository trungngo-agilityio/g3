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

var oop = require('./oop');


var g3Enum = oop.Base.extend({
  
  /**
   * {int} The enum id.
   */
  __id: 0,
  
  /**
   * {String} The enum name.
   */
  __name: null,
  
  
  /**
   * 
   * @param {Object} id
   * @param {Object} name
   */
  constructor: function(id, name) {
    this.__id = id;
    this.__name = name;
  },
  
  
  /**
   * @return {int} The runtime enum id.
   */
  getId: function() {
    return this.__id;
  },
  
  /**
   * @return {String} The runtime enum name.
   */
  getName: function() {
    return this.__name;
  },
  
  ///////////////////////////////////////////////////////////////////////
  
  /**
   * Determines if the current enum is the same with the specified enum.
   * @param {g3.data.RuntimeEnum} e
   *    The runtime enum to compare with
   * @return {boolean} True if the specified enum is the same.
   */
  isSame: function(e) {
    return this === e;
  },
  
  /**
   * Determines if the current enum is the not same with the specified enum.
   * @param {g3.data.RuntimeEnum} e
   *    The runtime enum to compare with
   * @return {boolean} True if the specified enum is not the same.
   */
  notSame: function(e) {
    return this !== e;
  },
  
  ///////////////////////////////////////////////////////////////////////
      
  /**
   * Gets the human readable string for debugging purposes.
   * @return {String}
   */   
  toString: function() {
    return this.__name;
  }
  
});

module.exports = g3Enum;
