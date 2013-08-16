var log = require('./log'),
	oop = require('./oop');

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
		FlipQueue : require('./flip-queue'),
		Sequencer : require('./sequencer'),
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