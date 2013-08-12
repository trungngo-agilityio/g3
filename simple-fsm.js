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
 * This class implements a simple finite state machine.
 */
var g3SimpleFsm = oop.Base.extend({
	
	/**
	 * {Object} The owner of this object
	 */ 
	__owner: null,
	
	
	/**
	 * {Function} The current exec program (state) for this object 
	 */ 
	__execProg: null,
	
	/**
	 * {Function} The previous exec program (state) of this object
	 */ 
	__prevExecProg: null,
	
	/**
	 * {Function}  The exit program for this object
	 */
	__exitProg: null,

	/**
	 * {float} The sleeps time for this object
	 */ 
	_fSleep: 0,

	/**
	 * The current alarm time
	 */ 
	__fAlarmTime: 0,

	/**
	 * {float} The the time that the alarm is set to ring
	 */ 
	__fAlarmRingTime: -1,

	/**
	 * {float} The time eslapsed
	 */  
	__fDeltaTime: 0,

	/**
	 * Determines if we need the FSM has just changed state
	 */ 
	__bExit: false,
	
	
	/**
	 * Determines if the fsm has finished.
	 */
	__bFinished: false,
	
	///////////////////////////////////////////////////////////////////////
	

	/**
	 * Constructs the with the specified owner
	 */
	constructor: function(owner, startProg) {
		this.__owner = owner;
		this.__execProg = startProg;
	},

	/**
	 * Updates the FSM with the specified delta app time
	 * @param {float} fDeltaAppTime
	 */
	update: function(fDeltaAppTime) {
		if (this.__bFinished)
			// The fsm has been finished
			return;
			
		if (fDeltaAppTime == undefined)
			fDeltaAppTime = 1;
		
		
		var owner = this.__owner;	
		this.__fDeltaTime = fDeltaAppTime;

		// checking for sleep time
		if (this.__fSleep > 0) {	
			this.__fSleep -= fDeltaAppTime;
			if (this.__fSleep < 0) this.__fSleep = 0;
			return;
		}

		// updates the alarm time
		if (this.__fAlarmTime < this.__fAlarmRingTime) {
			this.__fAlarmTime += this.__fDeltaTime;
		}
		
		if (this.__bExit && this.__pExitProg) {
			// The current state has been changed
			// we need to execute the exit function
			// of the current state
			this.__exitProg(owner, this);
			this.__exitProg = null;
		}
		

		if (this.__execProg) {
			// Executes the current state
			this.__execProg(owner, this);
			this.__fDeltaTime = 0;
		}
	},
	
	
	/**
	 * Finish the fsm
	 */
	finish: function() {
		this.__bFinished = true;
		this.setExecProgramOff();
		return this;
	},
	
	
	/**
	 * Determines if the fsm has finished.
	 * @return {boolean} True indicates that the fsm has finished.
	 */
	isFinished: function() {
		return this.__bFinished;
	},


	/**
	 * Sleeps the execution for the specified number of frames
	 * @param {float} fSleep
	 */
	sleep : function(fSleep) {
		this.__fSleep = fSleep;
		return this;
	},

	/**
	 * Sets the exec program for this state machine
	 * @param {Function} prog
	 */
	setExecProgram: function(prog) {
		this.__bFinished = false;
		
		if (this.__execProg != prog) {
			// State changed detected
			this.__bExit = true;
			this.__pPrevExecProg = this.__execProg;
			this.__execProg = prog;
		}

		return this;
	},


	/**
	 * Sets the exec program for this state machine.
	 * @param {Function} prog
	 */
	setExecProgramCall: function(prog) {
		this.setExecProgram(prog);
		this.update(0);
		return this;
	},


	/** 
	 * Turns off the exec program
	 */
	setExecProgramOff: function() {
		this.__subFsm = this.__execProg = null;
		return this;
	},


	/**
	 * Sets the exit program
	 * @param {Function} prog
	 */
	setExitProgram: function(prog) {
		this.__exitProg = prog;
		return this;
	},
	
	
	/**
	 * Turns off the exit program 
	 */
	setExitProgramOff: function() {
		this.__exitProg = null;
		return this;
	},


	/**
	 * Gets  the delta time for this update
	 * @return {float} The current delta time
	 */
	getDeltaTime: function() {
		return this.__fDeltaTime;
	},
	
	
	/**
	 * Determines if the state machine is at the specified state.
	 * @param {Function} prog
	 * @return {boolean} True if the current exec program the same with
	 * the specified program 
	 */
	isAtState: function(prog) {
		return this.__execProg == prog;
	},


	/**
	 * Sets up the alarm so that it will ring after the specified alarm time 
	 * eslapsed.
	 * @param {float} fAlarmRingTime
	 *		The alarm ring time.
	 */
	setAlarmRingTime: function(fAlarmRingTime) {
		this.__fAlarmRingTime = fAlarmRingTime;
		this.__fAlarmTime = 0;
		return this;
	},


	/**
	 * Turns alarm off
	 */
	setAlarmOff: function() {
		this.__fAlarmRingTime = 0;
		this.__fAlarmTime = 0;
		return this;
	},

	/**
	 * Determines if the alarm is ringing
	 * @return {boolean} True if the alarm is ringing
	 */
	isAlarmRinging: function() {
		return this.__fAlarmRingTime > 0 && this.__fAlarmTime >= this.__fAlarmRingTime;
	},


    /**
     * Gets the current alarm time
     * @return {float} The alarm time.
     */
    getAlarmTime: function() {
        return this.__fAlarmTime;
    },


    /**
     * Gets the remaining time before the alarm rings
     * @return {float} The remaining alarm time.
     */
    getAlarmRemainingTime: function() {
        if (this.__fAlarmRingTime > 0) {
            var fTime = this.__fAlarmRingTime - this.__fAlarmTime;
            if (fTime < 0) fTime = 0;
            return fTime;
        } else {
            return 0;
        }
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

module.exports = g3SimpleFsm;
