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
	g3log = require('./log');

var log = new g3log.ConsoleLog("g3ConsoleApp", g3log.LogLevel.INFO);


/**
 * The console application.
 */
var g3ConsoleApp = oop.Base.extend({

	/**
	 * {int} The number of frames per second.
     * Notes: the fps is very low.
	 */
	__nFps: 10,

	/**
	 * {float} The time stamp of last update
	 */
	__lastTimestamp : 0,

    /**
     * {boolean} True indicates that the console application is stopped
     */
    __bStopped: false,

	/**
	 * The application profiling data
	 */
	__profiling : null,

	///////////////////////////////////////////////////////////////////////
	// Abstract functions
	///////////////////////////////////////////////////////////////////////

	/**
	 * {Function} The handler called when the app is initialized.
	 * Concrete implementation of this class should override this method
	 * to initialize some of the app's parameters;
	 * The handler signature is "function ()";
	 */
	onInit: null,


	/**
	 * {Function} The handler called every app update.
	 * Concrete class shoud override this method.
	 * The handler signature is function ({float} fAppDeltaTime);
	 */
	onUpdate: null,

	///////////////////////////////////////////////////////////////////////

	/**
	 * Constructs a new console app
	 */
	constructor: function(opts) {

		opts = opts || {};
		this.__nFps = opts.nFps || this.__nFps;


		this.__profiling = {
			// FPS Profiling
			bFpsOn: true,			// FPS Profiling on?
			nCurFps: 0,				// Current FPS
			fResidueTime: 0
		};
		// Calls onInit handler
		if (this.onInit)
			this.onInit();
	},

	/**
	 * Starts the game engine
	 */
	start: function() {

		log.debug("Game Engine Start");

		// Runs the game loop
		var that = this;
		this.__lastTimestamp = Date.now();

		var fDelay = 1000.0 / this.__nFps;
		(function gameLoop() {
			that.__loop();

            if (!that.__bStopped)
		        setTimeout(gameLoop, fDelay);
		})();
	},


    /**
     * Stops the application
     */
    stop: function() {
        
        this.__bStopped = true;
    },


	/**
	 * Game Loop Updates
	 */
	__loop: function() {
		var now = Date.now();

		this.appDeltaTime = now - this.__lastTimestamp;

		// Profiles the FPS rate
		var profiling = this.__profiling;
		if (profiling && profiling.bFpsOn) {
			profiling.fResidueTime += this.appDeltaTime;
			profiling.nCurFps++;

			if (profiling.fResidueTime > 1000) {
				// One second has finished
				// print out current FPS rate
				log.info("FPS " + profiling.nCurFps);

				profiling.fResidueTime -= 1000;
				profiling.nCurFps = 0;
			}
		}

		// Uniform the time value to second unit
		var fTime = this.__fAppDeltaTime = this.appDeltaTime / 1000.0;
        // Calls app update event handler
        if (this.onUpdate)
            this.onUpdate(fTime);

        this.__lastTimestamp = now;
	},

	/**
	 * Gets the delta time since last update, in seconds.
	 * @return {float} The app delta time
	 */
	getAppDeltaTime: function() {
		return this.__fAppDeltaTime;
	}


}); // App

module.exports = g3ConsoleApp;
