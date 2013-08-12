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

(function() {
	var ArrayHelper = g3.data.ArrayHelper,
		log = g3Log.getLogger('g3.data.FlipFloatArray');
		
	g3.data.FlipFloatArray = Base.extend({
		
		__e1: null,
		__e2: null,
		
		/** 
		 * {boolean} True indicates that e1 is previous array.
		 * Otherwise, e2 is the previous array.
		 */
		__bFlip: false,
		
		/**
		 * Constructs a new flipable float array
		 * @param {int} nCapacity 
		 * 		The initial capacity
		 */
		constructor: function(nCapacity) {
			this.__e1 = ArrayHelper.newFloatArray(nCapacity);	
			this.__e2 = ArrayHelper.newFloatArray(nCapacity); 	
		},
		
		/**
		 * Flips the current array to the previous array
		 */
		flip: function() {
			this.__bFlip = !this.__bFlip;
		},
		
		/**
		 * Gets the current array.
		 * @return {Array} The array
		 */
		getCurrent: function() {
			if (this.__bFlip) return this.__e2;
			else return this.__e1;
		},
		
		/**
		 * Gets the previous array
		 * @return {Array} The array
		 */
		getPrevious: function() {
			if (this.__bFlip) return this.__e1;
			else return this.__e2;
		},
		
		/**
		 * Clears the current array.
		 */
		clear: function() {
			// Fills the current array with zero
			ArrayHelper.fill(this.getCurrent(), 0);
		}
	});
})();

