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

var g3Assert = require('./assert'),
    g3SimpleFsm = require('./simple-fsm'),
    g3LinkedList = require('./linked-list');

///////////////////////////////////////////////////////////////////////////

var States = {
  onWaitChildrenKilled: function(owner, fsm) {
    if (!fsm.hasChild()) {
      if (fsm.__noChildProg) {
        fsm.setExecProgramCall(fsm.__noChildProg);
      } else {
        // Kills this fsm
        fsm.killMe();
      }
    }
  }
};

///////////////////////////////////////////////////////////////////////////

/**
 * This class implements a simple finite state machine.
 */
var g3SimpleFsmTree = g3SimpleFsm.extend({


  /**
   * {g3SimpleFsmTree}
   */
  __parent: null,

  /**
   * {g3LinkedList.<g3SimpleFsmTree>} The list of child fsms
   */
  __children: null,
  
  /**
   * {Function}  The program to be called when
   * all children has been killed
   */
  __noChildProg: null,

  ///////////////////////////////////////////////////////////////////////

  /**
   * Constructs the with the specified owner
   */
  constructor: function(owner, startProg) {
    this.base(owner, startProg);
  },

  ///////////////////////////////////////////////////////////////////////
  
  /**
   * Updates the FSM with the specified delta app time
   * @param {float} fDeltaAppTime
   */
  update: function(fDeltaAppTime) {
    this.base(fDeltaAppTime);

    var children = this.__children;
    if (children) {
      // Updates all children
      children.forEach(function(fsm) {
        fsm.update(fDeltaAppTime);
      });
    }
  },

  ///////////////////////////////////////////////////////////////////////
  // Birth
  ///////////////////////////////////////////////////////////////////////
  birth: function(owner, startProg) {
    var children = this.__children;
    if (!children) {
      children = this.__children = new g3LinkedList(true, true);
    }

    // Creates a new fsm and add into the child fsm list
    var fsm = new g3SimpleFsmTree(owner, startProg);
    children.addLast(fsm);
    fsm.__parent = this;

    return fsm;
  },

  ///////////////////////////////////////////////////////////////////////
  // Kill
  ///////////////////////////////////////////////////////////////////////

  /**
   * Overrides the g3SimpleFsm.finish() function
   */
  finish: function() {
    if (this.__parent)
      this.killMe();
    else
      // Call the base finish method
      this.base();
  },


  /**
   * Kills the current fsm.
   * This function couldn't be called for root fsm.
   */
  killMe: function() {
    var parent = this.__parent;
    g3Assert.notNull(parent, "E9392303232");
    parent.kill(this);
  },

  /**
   * Kills the specified fsm
   * @param {g3SimpleFsmTree} fsm
   */
  kill: function(fsm) {
    g3Assert.notNull("E9393032423425");

    fsm.__bFinished = true;
    fsm.setExecProgramOff();

    var children = this.__children;
    var bOk = children.remove(fsm);
    
    fsm.__parent = null;
  },

  /**
   * Kills all child fsm
   */
  killChildren: function() {
    this.__children = null;
  },


  ///////////////////////////////////////////////////////////////////////

  /**
   * Determines if this tree has any child.
   * @return {boolean} True if there is at least one child fsm.
   *      Otherwise, return false.
   */
  hasChild: function() {
    var children = this.__children;
    return children && !children.isEmpty();
  },

  /**
   * Determines if the current node is a root node.
   * @return {boolean} True if the tree node is root node.
   */
  isRoot: function() {
    return this.__parent == null;
  },

  ///////////////////////////////////////////////////////////////////////

  /**
   * Sleep and waits for all children killed.
   * @param {Function) prog
   *      The callback prog which will continue to be run
   *      after all children are killed
   * This function couldn't be called for root fsm.
   */
  waitChildrenKilled: function(prog) {
    g3Assert.notNull(prog, "E839234234");
    g3Assert.notNull(this.__parent, "E9392034234");

    this.__noChildProg = prog;

    this.setExecProgram(States.onWaitChildrenKilled);
  },


  /**
   * Sleeps and kill itself when all children are killed.
   * This function couldn't be called for root fsm.
   */
  killMeWhenChildrenKilled: function() {
    g3Assert.notNull(this.__parent, "E94093902032");
    this.__noChildProg = null;

    this.setExecProgramOff(States.onWaitChildrenKilled);
  }
});


module.exports = g3SimpleFsmTree;