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


/**
 * This class helps to convert dynamic frame rate to 
 * fixed frame rate.
 */
var g3FrameTimer = oop.Base.extend({
  
  /**
   * {float} The minimum delta frame time.
   */ 
  __fDeltaMaxFrameTime: 0,    
  
  /**
   * {float} The original expected delta frame time.
   */
  __fDeltaFrameTime: 0,   

  /**
   * {float} The adjusted delta frame time.
   */
  __fAdjustedDeltaFrameTime: 0,
  
  /**
   * {int} The expected number of frames per second
   */ 
  __nFps: 0,    
  
  /**
   * 
   * {Function} The handler which is called on every time the timer ticks.
   *  Its signature is 'function({g3.fps.FrameTimer} timer, {float} fDeltaTime)'.
   */
  __tickHandler: null,
  
  ///////////////////////////////////////////////////////////////////////
  
  /**
   * Initializes a new instance frame timer object
   * @param {int} nFps
   *    The expected number of frame per seconds
   * @param {Function} tickHandler
   *    The tick handler
   */
  constructor: function(nFps, tickHandler) {
    // stores the expected frame rate
    this.__nFps = nFps;
    this.__tickHandler = tickHandler;
    
    // computes the delta timer per frame (in second unit)
    this.__fAdjustedDeltaFrameTime = this.__fDeltaFrameTime = 1.0 / nFps; 
    
  }, 
  
  
  /**
   * Updates the timer with the specified app time.
   * 
   * @param {float} fDeltaTime 
   *    The delta time between current update and the last update.
   * @return {boolean} Returns true if the timer advances to the new frame.
   */
  update: function (fDeltaTime) {
    
    // check if we have enough one frame
    if (fDeltaTime < this.__fAdjustedDeltaFrameTime)
    {
      // the accumulative time is not enough for one frame yet
      // we lower the expected delta time
      this.__fAdjustedDeltaFrameTime -= fDeltaTime;
  
      // Notifies caller that the timer hasn't advance for one more frame
      return false;
    }
    else
    {
      // Publish events
      if (this.__tickHandler)
        this.__tickHandler(this, this.__fDeltaFrameTime);
  
      // the accumulative time is enough for one frame
      // We raise the expected delta time for next frames
      this.__fAdjustedDeltaFrameTime = this.__fAdjustedDeltaFrameTime + this.__fDeltaFrameTime - fDeltaTime;
  
      // Notifies caller that the timer has been advanced for one more frame
      return true;
    }
  },

  /**
   * Gets the number of frames per seconds that this timer is running
   * @return {int} The FPS
   */
  getFps: function() {
    return this.__nFps;     
  },

  /**
   * Sets the timer ticked event handler.
   * @param {Function} handler.
   *    The function({g3.fps.FrameTimer} timer, {float} fDeltaTime) handler.
   * @return {g3.fps.FrameTime} Itself for chainability. 
   */
  setTickHandler: function(handler) {
    this.__tickHandler = handler;
  },


  ///////////////////////////////////////////////////////////////////////
    // UpdateEvent Handler
  ///////////////////////////////////////////////////////////////////////

    /**
     * Handles the onUpdate event
     *
     * @param {Object} source
     *      The source of this event
     * @param {float} fDeltaTime
     *      The delta time since last update.
     */
    onUpdate: function (source, fDeltaTime) {
        this.update(fDeltaTime);
    }
});

module.exports = g3FrameTimer;