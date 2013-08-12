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
    g3Assert = require('./assert');


///////////////////////////////////////////////////////////////////////////////
// Log Level
///////////////////////////////////////////////////////////////////////////////

var g3LogLevel = {
    ERROR: 0,
    WARN : 1,
    INFO : 2,
    DEBUG: 3
}; 


///////////////////////////////////////////////////////////////////////////////
// Log class
///////////////////////////////////////////////////////////////////////////////
var g3Log = oop.Base.extend({
    name: "",                       // the log name
    __logLevel: g3LogLevel.DEBUG,       // the log level
    
  ///////////////////////////////////////////////////////////////////////
      
  /**
   * Constructs a new log object
   * @param {String} name
   * @param {g3LogLevel} logLevel
   *    The log level.
   */
    constructor: function(name, logLevel) {
        this.name = name;
        this.__logLevel = logLevel;
    },

  /**
   * Prints out an error message
   * @param {String} msg
   */
    error: function(msg) {
        if (this.__logLevel >= g3LogLevel.ERROR)
            this.__printOut(msg);
    },

  /**
   * Prints out a warning message
   * @param {String} msg
   */
    warn: function(msg) {
        if (this.__logLevel >= g3LogLevel.WARN)
            this.__printOut(msg);
    },

    // Prints out an info message
  /**
   * Prints out an info log message
   * @param {String} msg
   */
    info: function(msg) {
        if (this.__logLevel >= g3LogLevel.INFO)
            this.__printOut(msg);
    },
    
    // Prints out an debug message
    debug: function(msg) {
        if (this.__logLevel >= g3LogLevel.DEBUG)
            this.__printOut(msg);
    },

  /**
   * Sets the log level
   * @param {g3LogLevel} g3LogLevel
   */
  setLevel: function(logLevel) {
    this.__logLevel = g3LogLevel;
  },


    /**
     * Determines if the debug is enabled
     */
    isDebugEnabled: function() {
        return this.__logLevel >= g3LogLevel.DEBUG;
    },


  /**
   * Prints out the log message
   * @param {String} msg
   */
    __printOut: function(msg) {
        // dummy
    }
}, {
  
  ///////////////////////////////////////////////////////////////////////
  /**
   * Root logger
   * @param {g3Log} The root logger
   */
  __rootLog: null,
  
  /**
   * 
   * @param {Dictionary of String vs. g3Log} name
   */
  __logs: {},
  
  ///////////////////////////////////////////////////////////////////////

  /**
   * Gets logger for the specified logger name.
   * @param {String} name
   *    The logger is name.
   * @return {g3Log} The logger
   */
  getLogger: function(name) {
    g3Assert.notNull(name, "E29291221");
    
    var log = g3Log.__logs[name];
    if (log) return log;
    else return g3Log.__rootLog;
  },


    /**
     * Finds a log level settings in the given log configuration.
     * Example:
     *    g3LogConf = {
     *        // Matches exact logger name
     *        "g3.engine.sg.SoundEngine": "error",
     *
     *        // Matches all loggers under g3.engine.sg package
     *        "g3.engine.sg.*" : "none",
     *
     *        // Matches all loggers under g3.engine package (e.g, g3.engine.sg.SoundEngine & g3.engine.res.Sound)
     *        "g3.engine.**" : "warn",
     *
     *        // Mathces all loggers
     *        "*": "none"
     *    };
     *
     * @param {String} logName
     *      The log name
     * @param {*} conf
     *      The log configuration
     */
    getConfLogLevel: function(logName, conf) {
        var g3LogLevel = null,
            matchedRule = null;

        // The global log configuration is found.
        // Loops through all settings in this configuration to
        // see if the requested logger name matches any rule
        for (var ruleName in conf) {
            var rule = conf[ruleName];
            if (typeof rule === "string" && typeof ruleName === "string") {

                // This is a rule
                // Check if the current log name match this rule name
                if (logName === ruleName) {
                    //-----------------------------------------------------
                    // This is an exact match
                    // Example: "g3.engine.sg.SoundEngine: error"
                    //-----------------------------------------------------
                    matchedRule = rule;
                    break;

                } else if (ruleName === "*") {
                    //-----------------------------------------------------
                    // This is a global wildcard match
                    // Example: "*": none
                    //-----------------------------------------------------
                    matchedRule = rule;
                    break;

                } else {
                    var k=ruleName.length - 3;
                    if (k >= 0 && ruleName.substr(k, 3) === ".**") {
                        //-------------------------------------------------
                        // Matches all loggers under g3.engine package
                        // (e.g, g3.engine.sg.SoundEngine & g3.engine.res.Sound)
                        // Example: "g3.engine.** : warn",
                        //-------------------------------------------------
                        ruleName = ruleName.substr(0, k);

                        // Makes sure the logger name starts the reduced rule name
                        if (logName.length >= k && logName.substr(0, k) === ruleName) {
                            // Matches
                            matchedRule = rule;
                            break;
                        }
                    } else {

                        //-------------------------------------------------
                        // This could be a single package match
                        // Example: Matches all loggers under g3.engine.sg package
                        // "g3.engine.sg.* : "none",
                        //-------------------------------------------------
                        var k1 = ruleName.length - 2,
                            k2 = logName.length,
                            bOk = true;
                        while (k1>=0 && ruleName.substr(k1, 2) === ".*") {

                            // Removes the last package from the logger name
                            var k2 = logName.lastIndexOf(".", k2-1);
                            if (k2 < 0) {
                                bOk = false;
                                break;
                            }

                            k1-=2;
                        }

                        if (bOk && (ruleName.substr(0, k1+2) == logName.substr(0, k2))) {
                            // Matches
                            matchedRule = rule;
                            break;
                        } // if
                    } // else
                } // else
            } // if
        } // for

        if (matchedRule) {
            // Founds the match rule
            if (matchedRule === "none") g3LogLevel = g3LogLevel.NONE;
            else if (matchedRule === "debug") g3LogLevel = g3LogLevel.DEBUG;
            else if (matchedRule === "info") g3LogLevel = g3LogLevel.INFO;
            else if (matchedRule === "warn") g3LogLevel = g3LogLevel.WARN;
            else if (matchedRule === "error") g3LogLevel = g3LogLevel.ERROR;
            else {
                g3Assert.fail("E93920323234: Invalid log configuration");
            }
        } // if

        return g3LogLevel;
    },

  /**
   * Gets logger for the specified logger name.
   * @param {String} name
   *    The logger is name.
   * @param {g3LogLevel} The log level. This parameter is optional
   * @return {g3Log} The logger
   */
  addLogger: function(name, g3LogLevel) {
    g3Assert.notNull(name, "E29291221");
    
    var log = g3Log.__logs[name];
    if (log) {
      log.setLevel(logLevel);
    } else {
      log = g3Log.__logs[name] = new g3ConsoleLog(name, g3LogLevel);
    }
    return log;
  }
});


///////////////////////////////////////////////////////////////////////////////
// Null Logger
///////////////////////////////////////////////////////////////////////////////
/**
 * Implements a fastest logger as possible. This should be used for production. 
 */
var g3NullLog = g3Log.extend({
  constructor: function() {
        this.base("", g3LogLevel.ERROR);
    },
      
  debug: function(msg) {},
  info: function(msg) {},
  warn: function(msg) {},
  error: function(msg) {}
});

g3Log.__rootLog = new g3NullLog();

///////////////////////////////////////////////////////////////////////////////
// Console Logger
///////////////////////////////////////////////////////////////////////////////
/**
 * Implements a logger that prints out log messages to console
 */
ConsoleLog = g3ConsoleLog = g3Log.extend({
  
    __printOut: function(msg) {
    if (console && console.log)
      console.log("[" + this.name + "] " + msg);
    }
});

module.exports = {
  Log: g3Log,
  ConsoleLog: g3ConsoleLog,
  LogLevel: g3LogLevel
};

