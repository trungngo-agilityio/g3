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

var g3Assert = require('./assert');

/**
 * Provides common utilities for array handling
 */
var g3ArrayHelper = {

  /**
   * Creates a new float array.
   * @param {int} nCapacity
   * @return {Array} A new array
   */
  newFloatArray: function(nCapacity) {
    g3Assert.isZeroOrPositive(nCapacity, "E123456789");
    return new Array(nCapacity);
  },

  ///////////////////////////////////////////////////////////////////////

  /**
   * Determines if the specified array is null or empty
   */
  isNullOrEmpty: function(a) {
    return (!a || a.length == 0);
  },

  ///////////////////////////////////////////////////////////////////////

  /**
   * Gets the size of an array
   * @param {Array} a
   *    The array
   */
  size: function(a) {
    if (a) return a.length;
    else return 0;
  },
  
  ///////////////////////////////////////////////////////////////////////

  /**
   * Gets the index the specified element in the array.
   * Returns:
   *    An integer, which is the index.
   *    -1 if no the element doesn't exist in the array.
   */
  indexOf: function(arr, element) {
    var i;
    g3Assert.notNull(arr,"E123456798");
    for (i=0; i<arr.length; i++) {
      if (arr[i] == element)
        return i;
    }
    
    return -1;
  },


  /**
   * Determines if the specified array contains the specified element.
   * Returns:
   *    True if the element is found.
   */
  contains: function(arr, element) {
    return g3ArrayHelper.indexOf(arr, element) >= 0;
  },

  ///////////////////////////////////////////////////////////////////////

  /**
   * Shalow clone the array
   * @param {Object[]} a
   */
  clone: function(a) {
    g3Assert.notNull(a,"E123456799");
    var n = a.length,
      r = new Array(n),
      i;
      
    for (i=0; i<n; i++) {
      r[i] = a[i];
    }
    return r;
  },


  /**
   * Copies the source to destination array
   * @param {Array} src
   *    The source array
   * @param {Array} dest
   *    The destination array
   */
  copy: function(src, dest) {
    g3Assert.notNull(src,"E123456998");
    g3Assert.notNull(dest,"E123466798");
    var n = src.length,
      i;
      
    for (i=0; i<n; i++) {
      dest[i] = src[i];
    }
    dest.length = n;
  },


  /**
   * Fills the array with the specified value.
   * @param {Array} a
   *    The array.
   * @param {Object} val
   *    The value to fill.
   * @param {Object} nStart
   *    The starting index. This parameter is optional.
   *    If it is not specified, the start index is zero.
   * @param {Object} nEnd
   *    The ending index. This parameter is optional.
   *    If it is not specified, the end index is the array size.
   * @return {Array} The original array.
   */
  fill: function(a, val, nStart, nEnd) {
    g3Assert.notNull(a,"E123456458");
    var n = a.length,
      i;

    if (nStart === undefined)
      nStart = 0;
    else
      g3Assert.isTrue(0 <= nStart && nStart < n, "E0987123654");

    if (nEnd === undefined)
      nEnd = n - 1;
    else
      g3Assert.isTrue(0 <= nEnd && nEnd < n, "E08971123764");

    for (i=nStart; i<=nEnd; i++) {
      a[i] = val;
    }
  },

  ///////////////////////////////////////////////////////////////////////

  /**
   * Adds the specified item to the end of the specifed array "arr"
   */
  addLast: function(arr, item) {
    arr.push(item);
  },
  
  
  /**
   * Add the specified item to the beginning of the specifed array "arr"
   */
  addFirst: function(arr, item) {
  },
  
  
  /**
   * Add all items of the arr2 to the end of the arr1
   */
  addAll: function(arr1, arr2) {
    g3Assert.notNull(arr1,"E123456798");
    g3Assert.notNull(arr2,"E12346543798");
    // add all items of the arr2 to the end of arr1
    var n1 = arr1.length,
      n2 = arr2.length,
      i;

    arr1.length += n2;
    for (i=0; i<n2; i++) {
      arr1[n1+i] = arr2[i];
    }
  },


  /**
   * Removes an item from the specified array
   */
  remove: function(arr, item) {
    g3Assert.notNull(arr,"E122326798");
    var k = g3ArrayHelper.indexOf(arr, item);
    if (k < 0) return false;
    else {
      arr.splice(k, 1);
      return true;
    }
  },
  
  
  /**
   * Removes an range of object from the specified array.
   * 
   * @param {Array} arr
   *    The array 
   * @param {int} nFromIdx
   *    The starting index of the remove range
   * @param {int} nToIdx
   *    The ending index of the remove range
   * 
   * @see http://ejohn.org/blog/javascript-array-remove/
   * Example:
   *    // Remove the second item from the array
   *    g3ArrayHelper.remove(arr, 1);
   *    // Remove the second-to-last item from the array
   *    g3ArrayHelper.remove(arr, -2);
   *    // Remove the second and third items from the array
   *    g3ArrayHelper.remove(arr, 1,2);
   *    // Remove the last and second-to-last items from the array
   *    g3ArrayHelper.remove(arr, -2,-1);
   */
  removeByRange: function(arr, nFromIdx, nToIdx) {
    g3Assert.notNull(arr, "E8390582928303");
    var rest = arr.slice((nToIdx || nFromIdx) + 1 || arr.length);
    arr.length = nFromIdx < 0 ? arr.length + nFromIdx : nFromIdx;
    return arr.push.apply(arr, rest);
  },

  ///////////////////////////////////////////////////////////////////////

  /**
   * Clears the array.
   * @param {Array} arr
   */
  clear: function(arr) {
    g3Assert.notNull(arr,"E1222426798");
    arr.length = 0;
  },

  ///////////////////////////////////////////////////////////////////////
  
  /**
   * Loops through all elements of an array. For each element, invoke the
   * specified callback handler.
   * @param {Object[]} arr
   *      The array
   * @param {Function(Object)}fp
   *      The callback handler
   */
  forEach: function(arr, fp) {
    g3Assert.isFunction(fp, "E1237656798");
    if (!arr) return;

    var n = arr.length, i;
    for (i = 0; i < n; i++) {
      var item = arr[i];
      
      if (item) {
        var result = fp(item);
        if (result) return result;
      }
    }
    return null;
  }
};


module.exports = g3ArrayHelper;
