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

var oop = require('./oop'),
    g3Assert = require('./assert'),
    g3ArrayHelper = require('./array-helper');


var g3Event = oop.Base.extend({


  /**
   * {Object[]} The list of listeners
   */
  __listeners : null,

  /**
   * {boolean}
   * True indicates that the publishing event is still running.
   * This field is used to make sure that listener could be removed
   * from the listeners list while the event object is publishing events.
   */
  __bPublishing: false,
  
  /**
   * {boolean} True indicates that the __listeners array need to be compacted
   */
  __bNeedCompact: false,    


  ///////////////////////////////////////////////////////////////////////
  
  /**
   * Initializes a new instance of Runtime Event object
   */
  constructor: function() {
    this.__listeners = [];
  },

  ///////////////////////////////////////////////////////////////////////

  
  /**
   * Adds an listener for this event.
   * @param {Object} listener
   * @return {g3Event} Itself for chainability.
   */
  addListener: function(listener) {
    this.__listeners.push(listener);
    return this;
  },
  
  /**
   * Removes an listener for this event
   * @param {Object} listener
   * @return {g3Event} Itself for chainability.
   */
  removeListener: function(listener) {
    var listeners = this.__listeners,
      k = g3ArrayHelper.indexOf(listeners, listener);
      
    if (k < 0) return this;
    else {
      this.__bNeedCompact = true;
      listeners[k] = null;
    }
    return this;
  },

  /**
   * Removes all listeners of this event.
   * @return {g3Event} Itself for chainability.
   */   
  removeAllListeners: function() {
    // This will help to stop the publish() method
    // if the event is publishing
    this.__bPublishing = false;
    
    // Clears the array of listeners
    this.__listeners = [];
    
    return this;
  },
  
  /**
   * Publish the event
   * @param {Function} publishHandler 
   *    The delegate function that handles the publish event
   */
  publish: function(publishHandler){
    var listeners = this.__listeners,
      count = listeners.length,
      listener,
      i;

    // Publish the event to all registered listeners
    this.__bPublishing = true;      
    this.__bNeedCompact = false;
    
    for (i = 0; i < count && this.__bPublishing; i++) {
      listener = listeners[i];
      
      if (listener) {
        // Invokes pb
        publishHandler(listener);
      }
    }
    this.__bPublishing = false;     
    
    // Tries to compact the array
    this.__compact();
  },
  
  
  /**
   * Compacts the listener list
   */
  __compact: function() {
    if (!this.__bNeedCompact) return;
    this.__bNeedCompact = true;
    
    // The listeners array has been modified 
    var listeners = this.__listeners,
      count = listeners.length,
      newListeners = [];
      
    for (i = 0; i < count; i++) {
      listener = listeners[i];
      if (listener) newListeners.push(listener);
    } // for
    
    this.__listeners = newListeners;
  }
});

module.exports = g3Event;