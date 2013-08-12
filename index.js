var log = require('./log'),
	oop = require('./assert');

// g3 frameworks namespace
module.exports = {
	oop: {
		Base: oop.Base 
	},

	aop: require('./aop'),
	
	debug: {
		Assert : require('./assert'),
		Log : log.Log,
		LogLevel : log.LogLevel,
		ConsoleLog : log.ConsoleLog
	},

	data: {
		Enum : require('./enum'),
		Event : require('./event'),
		BitFlags : require('./bit-flags'),
		ArrayHelper : require('./array-helper'),
		LinkedList : require('./linked-list'),
		StringBuilder : require('./string-builder'),
		StringHelper : require('./string-helper'),
		CodeWriter : require('./code-writer')
	},

	fsm: {
		FrameTime : require('./frame-timer'),
		SimpleFsm : require('./simple-fsm'),
		SimpleFsmTree : require('./simple-fsm-tree')
	},

	app: {
		ConsoleApp : require('./console-app')
	}
};