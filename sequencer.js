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
// Log class
///////////////////////////////////////////////////////////////////////////////
var g3Sequencer = oop.Base.extend({
  constructor: function(opts) {
    opts = opts || {
      start: 0
    };

    this._id = opts.start;
  },


  next: function() {
    return this._id++;
  }
});

module.exports = g3Sequencer;