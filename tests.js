var oop = require('./oop');
var g3 = require('./index');
// 	g3log = require('./log'),
// 	g3Assert = require('./assert'),
// 	g3SimpleFsm = require('./simple-fsm'),
// 	g3SimpleFsmTree = require('./simple-fsm-tree'),
// 	g3ConsoleApp = require('./console-app');

var log = new g3.debug.ConsoleLog("App", g3.debug.LogLevel.INFO);

//g3Assert.fail("E93903093");

var App = g3.app.ConsoleApp.extend({

	onInit: function() {
		this._fsm = new g3.fsm.SimpleFsmTree(this, this.actStart);
		this._fsm.birth(this, this.actExecSub1);
		this._fsm.birth(this, this.actExecSub2);
	},

	onUpdate: function(fDeltaTime) {
		log.info('HERE2');
		this._fsm.update(fDeltaTime);
	},

	actStart: function(app, fsm) {
		log.info("fsm Start")
		fsm
			.setAlarmRingTime(2)
			.setExecProgram(app.actExec1);
	},

	actExec1: function(app, fsm) {
		log.info("fsm Execute");
		if (fsm.isAlarmRinging()) {
			log.info("Alarm ringing")
			fsm.setExecProgram(app.actExec2);
		}
	},

	actExec2: function() {
		log.info("fsm Execute 2");
	},

	actExecSub1: function() {
		log.info("fsm Execute Sub 1");

	},

	actExecSub2: function() {
		log.info("fsm Execute Sub 2");

	}


});

var app = new App({
	nFps: 2
})

app.start();