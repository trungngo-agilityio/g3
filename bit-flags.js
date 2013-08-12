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
 * This class provides functionalities to deal with 32-bit vector easily
 */
var g3BitFlags = oop.Base.extend({
    
    e: 0,
    
	/**
	 * Constructs a new bit flag object.
	 * @param {g3BitFlags or uint} flags
	 * 		The initial bit flag value.
	 */
    constructor: function(flags) {
		if (flags) {
			if (flags.e) flags = flags.e;
			this.e = flags;
		}
    }, 

	/**
	 * @return {uint} The bit flag value
	 */
    value: function() {
        return this.e;
    },
       
    
	/**
	 * @return {int} The total number of one bits in this vector.
	 * This is efficiently computed.
	 */
    count: function() {
		var e = this.e,
			bc = g3BitFlags.__BYTE_COUNTS,
        	b1 = bc[ e        & 0x000000FF],
        	b2 = bc[(e >> 8)  & 0x000000FF],
        	b3 = bc[(e >> 16) & 0x000000FF],
        	b4 = bc[(e >> 24) & 0x000000FF];
			
        return b1 + b2 + b3 + b4;
    },

	/**
	 * Clears the bit flags
	 * @return {g3BitFlags} Itself for chainability.
	 */
    clear: function() {
        this.e = 0;
		return this;
    },


    /**
	 * Turns all bits in the specified bit flags on.
	 * @param {g3BitFlags or uint} flags
	 * 		The bit flags
	 * @return {g3BitFlags} Itself for chainability.
	 */
    on: function(flags) {
		if (flags.e) flags = flags.e;
        this.e |= flags;
		return this;
    },

    
	/**
	 * Turns all bits in the specified bit flags off.
	 * @param {g3BitFlags or uint} flags
	 * 		The bit flags
	 * @return {g3BitFlags} Itself for chainability.
	 */
    off: function(flags) {
		if (flags.e) flags = flags.e;
        this.e &= ~(flags);
		return this;
    },


	/**
	 * Updates the bit flags
	 * @param {uint} flags
	 * @param {boolean} bOn
	 */
    update: function(flags, bOn) {
		if (flags.e) flags = flags.e;
        if (bOn)
            this.on(flags);
        else
            this.off(flags);
    },


	/**
	 * Checks if any bits in the specified bit flags is on.
	 * @param {g3BitFlags or uint} flags
	 * 		The bit flags
	 * @return {boolean} True if the there is at least one bit specified
	 * in the bit flags is turned on.
	 */
    chk: function(flags) {
		if (flags.e) flags = flags.e;
        return ((this.e & (flags)) > 0);
    },


	/**
	 * Checks if all bits in the specified bit flags are on.
	 * @param {g3BitFlags or uint} flags
	 * 		The bit flags
	 * @return {boolean} True if the all bits specified
	 * in the bit flags are turned on.
	 */
    chkAll: function(flags) {
		if (flags.e) flags = flags.e;
        return ((this.e & (flags)) == flags);
    },

	/**
	 * Checks if this bit flags is the same with the specified bit flags
	 * @param {g3BitFlags or uint} flags
	 * 		The bit flags
	 * @return {boolean} True if they are the same. Otherwise, return true.
	 */
	equ: function(flags) {
		if (flags.e) flags = flags.e;
		return this.e == flags;
	},

	/**
	 * Xors all bits in the specified bit flags.
	 * @param {g3BitFlags or uint} flags
	 * 		The bit flags
	 * @return {g3BitFlags} Itself for chainability.
	 */
    xor: function(flags) {
		if (flags.e) flags = flags.e;
        this.e ^= (flags);
		return this;
    },

	/**
	 * Sets the bit flags.
	 * @param {g3BitFlags or uint} flags
	 * 		The bit flags
	 * @return {g3BitFlags} Itself for chainability.
	 */
    set: function(flags) {
		if (flags.e) flags = flags.e;
        this.e = flags;
		return this;
    },


	/**
	 * Sets the bit ...
	 * @param {g3BitFlags or uint} flags
	 * 		he bit flags
	 * @param {g3BitFlags or uint} masks
	 * 		The mask of accepted bits
	 */
    setWithMask: function(flags, masks) {
		if (flags.e) flags = flags.e;
		if (masks.e) masks = masks.e;
        this.e = flags & masks;
		return this;
    }
},

///////////////////////////////////////////////////////////////////////////////
// BitFlags class - Static Interface
///////////////////////////////////////////////////////////////////////////////
{
    // lookup table for quickly counting the number of one bits 
    // in a bit flags.
    __BYTE_COUNTS : [
          0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4, 
          1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 
          1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 
          2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 
          1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 
          2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 
          2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 
          3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 
          1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 
          2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 
          2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 
          3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 
          2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 
          3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 
          3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 
          4, 5, 5, 6, 5, 6, 6, 7, 5, 6, 6, 7, 6, 7, 7, 8
    ],
	
	
	// byte 1
	BIT_00 : (1<<0),
	BIT_01 : (1<<1),
	BIT_02 : (1<<2),
	BIT_03 : (1<<3),
	BIT_04 : (1<<4),
	BIT_05 : (1<<5),
	BIT_06 : (1<<6),
	BIT_07 : (1<<7),
	
	// byte 2
	BIT_08 : (1<<8),
	BIT_09 : (1<<9),
	BIT_10 : (1<<10),
	BIT_11 : (1<<11),
	BIT_12 : (1<<12),
	BIT_13 : (1<<13),
	BIT_14 : (1<<14),
	BIT_15 : (1<<15),
	
	// byte 3
	BIT_16 : (1<<16),
	BIT_17 : (1<<17),
	BIT_18 : (1<<18),
	BIT_19 : (1<<19),
	BIT_20 : (1<<20),
	BIT_21 : (1<<21),
	BIT_22 : (1<<22),
	BIT_23 : (1<<23),
	
	// byte 4
	BIT_24 : (1<<24),
	BIT_25 : (1<<25),
	BIT_26 : (1<<26),
	BIT_27 : (1<<27),
	BIT_28 : (1<<28),
	BIT_29 : (1<<29),
	BIT_30 : (1<<30)
	// BIT_31 doesn't work - it is a negative number.
});

module.exports = g3BitFlags;