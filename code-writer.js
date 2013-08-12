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
    g3Assert = require('./assert'),
    g3StringBuilder = require('./string-builder'),
    g3StringHelper = require('./string-helper');

var g3CodeWriter = oop.Base.extend({  

    __scopeStack: [],               // the stack of string builder
    __scope: null,                  // the current scope   

    /**
     * Initializes a new instance of g3CodeWriter object
     */
    constructor: function() {
        __scopeStack = [];
        this.openScope(false);
    },
	
    
    /**
     * Close the object and return its content
     */
	close: function() {
		while (this.__scopeStack.length > 1) {
			this.closeScope();
		}
		
		var content = this.__scope.toString();
		this.__scope = null;
		this.__scopeStack = null;
	
		return content;
	},


    /**
     * Writes a string
     */
	w: function(s) {
		this.__scope.__sb.append(s);
		return this;
	},


    /**
     * Writes a string for the specified number of times
     */
	ws: function(s, count) {
        var i, 
            scope = this.__scope;
            
        for (i=0; i<count; i++) {
            scope.__sb.append(s);
        }
        
        return this;
	},
	

    /**
     * Writes a tab character
     */
	tab: function() {
		this.w(StringHelper.TAB);
		return this;
	},
	

    /**
     * Writes a tab character for the specified number of times
     */
    tabs: function(count) {
		this.ws(StringHelper.TAB, count);
		return this;
	},


    /**
     * Write a new line
     */
	wln: function() {
		this.__scope.__sb.append(StringHelper.LINE_SEPARATOR);
		return this;
	},
	

    /**
     * Write a new line character for the specified number of times
     */
	wlns: function(lines) {
        var i, 
            scope = this.__scope;
        
        for (i=0; i<lines; i++) {
            scope.__sb.append(StringHelper.LINE_SEPARATOR);
        }
        
        return this;
	},
	

    /**
     * Writes a space character
     */
	space: function() {
		this.__scope.__sb.append(" ");
		return this;
	},
	


    /**
     * Write a space character for the specified number of times
     */
	spaces: function(count) {
		this.ws(" ", count);
		return this;
	},	
	

    /**
     * Opens an indented scope
     */
	openIndentedScope: function() {
		this.openScope(true, false);
		return this;
	},
	

    /**
     * Open a scope
     */
	openScope: function(isIndented) {
        var scope = this.__scope;
        
		if (scope != null) {
			this.__scopeStack.push(scope);
		}
    
		scope = new g3CodeWriter.Scope();
		scope.__isIndented = isIndented;
        
        this.__scope = scope;
		return this;
	},
	

    /**
     * Closes the current scope
     */
	closeScope: function() {
		if (this.__scopeStack.length > 1) {
			var s = this.__scope.toString();
			this.__scope = this.__scopeStack.pop();
			this.__scope.__sb.append(s);
		}
		return this;
	}
},
{
    
    /**
     * The internal Scope class of the g3CodeWriter object
     */
    Scope: oop.Base.extend({
        __sb: null,                 // the internal string builder object to store the generated code
        __isIndented: true,         // determines whether or not we should indented the generated code
        
        constructor: function() {
            this.__sb = new g3StringBuilder();
        },
    
        toString: function() {
            var s = this.__sb.toString();
            
            if (this.__isIndented) {
                s = g3StringHelper.tapify(s);
            }
            return s;
        }
    })
});

module.exports = g3CodeWriter;