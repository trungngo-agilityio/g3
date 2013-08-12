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
 * Provides common utilities for array handling
 */
var g3FlipQueue = oop.Base.extend({
	
	/**
	 * {Array} in queue
	 */
	__inQ: null,
	
	/**
	 * {Array} out queue
	 */
	__outQ: null,
	
	/**
	 * {int} The number of items available in in queue
	 */
	__inCnt: 0,
	
	/**
	 * {int} The number of items available in out queue
	 */
	__outCnt: 0,
	
	/**
	 * {int} The current index for next poll/peek in out queue 
	 */
	__outIdx: 0,
	
	///////////////////////////////////////////////////////////////////////
	
	/**
	 * Initializes the
	 */
	constructor: function() {
		this.__inQ = [];
		this.__outQ = [];
	},
	
	///////////////////////////////////////////////////////////////////////
    
	/**
	 *  Inserts the specified element into this queue
	 */
	offer: function(o) {
		this.__inQ[this.__inCnt++] = o;
	},
	
	/**
	 *  Retrieves, but does not remove, the head of this queue, returning null if this queue is empty.
	 */
	peek: function() {
		if (this.__outIdx < this.__outCnt)
			return this.__outQ[this.__outIdx];
		else	
			return null;
	},
	
	/**
	 * Retrieves and removes the head of this queue, or null if this queue is empty.
	 */
	poll: function() {
		if (this.__outIdx < this.__outCnt)
			return this.__outQ[this.__outIdx++];
		else	
			return null;
	},
	
	/**
	 * Flips the input and output queue
	 * @return {g3FlipQueue} Itself for chainability
	 */
	flip: function() {
		this.__outQ = this.__inQ;
		this.__inQ = [];
			
		this.__outCnt = this.__inCnt;
		this.__inCnt = this.__outIdx = 0;
		return this;
	}
});


module.exports = g3FlipQueue;
