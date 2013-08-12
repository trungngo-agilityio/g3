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
    log = require('./log').Log.getLogger('g3LinkedList');

var g3LinkedList = oop.Base.extend({

  /**
   * The first link in the linked list
   */
  __head: null,

  /**
   * The last link in the linked list
   */
  __tail: null,

  /**
   * {boolean} True indicates that the same item couldn't be added to the list
   * twice.
   */
  __bNoDuplicate: false,

  /**
   * {boolean}
   * True indicates that the link mixin could be reused across all possible linked lists
   */
  __bShareLink: false,

  /**
   * The unique linked list identified to 
   */
  __id: 0,

  /**
   * {int} The total item available in the list
   */
  __nCnt: 0,

  ///////////////////////////////////////////////////////////////////////

  /**
   * Initializes a linked list data structure. In order to build the links
   * among list item, this object need to mixin a pair of <prev, next> pointers.
   * If the item is only used for maximum one list at a time, the mixin could be
   * reused. In this case, the argument bShareLink should be set to true.
   *
   * @param {boolean} bNoDuplicate
   *      True indicates that the the linked list wouldn't allow the same item
   *      could be addded to the list twice. If this argument is false, the
   *      bShareLink is couldn't be used. It is important to notice that, if
   *      this argument is true, the linked list performance would be a lot
   *      faster since link mixin could stored as in the item itself. The complexity
   *      for searching the link mixin for a given item is O(1). As a result, the
   *      remove(), insertBefore(), insertAfter() functions would have O(1) performance.
   *
   * @param {boolean} bShareLink
   *      True indicates that the link mixin should be reused (not need to be unique).
   */
  constructor: function(bNoDuplicate, bShareLink) {

    if (bNoDuplicate) {
      this.__bNoDuplicate = true;
      if (bShareLink) {
        this.__bShareLink = true;
      } else {
        // Gets the unique linked list id
        this.__id = "__LL_" + g3LinkedList.__idSeq++;
      }
    } else {
      g3Assert.isFalse(bShareLink, "E9390234234")
    }
  },

  ///////////////////////////////////////////////////////////////////////

  /**
   * Gets the total items available in the list
   * @return {int} The total item
   */
  getCount: function() {
    return this.__nCnt;
  },


  /**
   * Determines if the list is empty
   * @return {boolean} True if the list is empty. Otherwise, return false.
   */
  isEmpty: function() {
    return this.__nCnt == 0;
  },


  /**
   * Gets the first item in the linked list
   * @return {*} The item
   */
  getFirst: function() {
    var item = this.__head;
    if (item)
      return item.data;
    else
      return null;
  },


  /**
   * Gets the last item in the linked list
   * @return {*} The item
   */
  getLast: function() {
    var item = this.__tail;
    if (item)
      return item.data;
    else
      return null;
  },

  
  /**
   * Gets the item at the specified index
   * @param {int} nIndex
   *      The index. If the index is negative, gets the item from the end of the list
   * @return {*} The item at the specified index
   */
  getByIndex: function(nIndex) {
    var nCnt = this.__nCnt;
    g3Assert.isInRange(nIndex, -nCnt, nCnt-1, "E939203232");

    var item, i, bSearchTail;
    bSearchTail = (nIndex < 0 && nIndex > -nCnt/2) || (nIndex > nCnt/2);
    if (bSearchTail) {
      if (nIndex > 0)
        nIndex = nIndex - nCnt;

      item = this.__tail;
      for (i=nIndex+1; i<0; i++) {
        item = item.prev;
      }
    } else {
      if (nIndex < 0)
        nIndex = nIndex + nCnt;

      item = this.__head;
      for (i=0; i<nIndex; i++) {
        item = item.next;
      }
    }

    return item.data;
  },
  
  ///////////////////////////////////////////////////////////////////////



  /**
   * Adds the specified at the beginning of the list
   * @param {*} item
   *      The item to add
   * @return {boolean} Itself for chainability.
   */
  addFirst: function(item) {
    item = this.__getLink(item, false);

    this.__nCnt++;

    var head = this.__head,
      tail = this.__tail;

    if (head) {
      // Makes the current item as head
      item.next = head;
      item.prev = null;
      head.prev =  item;

      this.__head = item;
    } else {
      // Makes the current item as both head & tail
      item.prev = null;
      item.next = null;

      this.__head = item;
      this.__tail = item;
    }

    return this;
  },


  /**
   * Adds the specified item at the beginning of the list
   * @param {*} item
   *      The item to add
   * @return {*} Itself for chainability
   */
  addLast: function(item) {
    item = this.__getLink(item, false);

    this.__nCnt++;
    
    var head = this.__head,
      tail = this.__tail;

    if (tail) {
      // Makes the current item as tail
      item.next = null;
      item.prev = tail;
      tail.next =  item;

      this.__tail = item;
    } else {
      // Makes the current item as both head & tail
      item.prev = null;
      item.next = null;

      this.__head = item;
      this.__tail = item;
    }

    return this;
  },
  
  ///////////////////////////////////////////////////////////////////////
  // Insert
  ///////////////////////////////////////////////////////////////////////

  /**
   * Inserts the specified item at the specified index
   * @param {int} nIndex
   *      The insert index.
   * @param {*} item
   *      The item to insert
   * @return {g3LinkedList} Itself for chainability
   */
  insertAt: function(nIndex, item) {
    g3Assert.notNull(item, "E920987654");
    if (nIndex == this.__nCnt) {
      this.addLast(item);

    } else if (nIndex == 0) {
      this.addFirst(item);

    } else {
      var srcItem = this.getByIndex(nIndex);

      if (nIndex < 0) {
        // Inserts after the source item
        this.insertAfter(srcItem, item);
      } else {
        // Inserts before the source item
        this.insertBefore(srcItem, item);
      }
    }

    return this;
  },


  /**
   * Inserts the specified item before the specified source item
   * @param {*} srcItem
   *      The source item
   * @param {*} item
   *      The item to insert
   * @return {g3LinkedList} Itself for chainability
   */
  insertBefore: function(srcItem, item) {
    g3Assert.notNull(item, "E920934234");
    g3Assert.notNull(srcItem, "E92304234");

    this.__nCnt++;
    
    item = this.__getLink(item, false);
    srcItem = this.__getLink(srcItem, true);

    var prev = srcItem.prev;


    item.next = srcItem;
    srcItem.prev = item;

    item.prev = prev;
    if (prev) {
      prev.next = item;
    } else {
      this.__head = item;
    }

    return this;
  },


  /**
   * Inserts the specified item before the specified source item
   * @param {*} srcItem
   *      The source item
   * @param {*} item
   *      The item to insert
   * @return {g3LinkedList} Itself for chainability
   */
  insertAfter: function(srcItem, item) {
    g3Assert.notNull(item, "E92902912121");
    g3Assert.notNull(srcItem, "E23409234234");
    this.__nCnt++;

    item = this.__getLink(item, false);
    srcItem = this.__getLink(srcItem, true);

    var next = srcItem.next;

    item.prev = srcItem;
    srcItem.next = item;

    item.next = next;
    if (next) {
      next.prev = item;
    } else {
      this.__tail = item;
    }

    return this;
  },

  ///////////////////////////////////////////////////////////////////////

  /**
   * If the list is not empty,
   * remove and return the first item in the list.
   * @return {*} The first item
   */
  pollFirst: function() {
    if (this.__nCnt === 0) {
      return null;
    } else {
      // Remove head element
      var item = this.__head;
      this.remove(item);
      return item.data;
    }
  },


  /**
   * If the list is not empty,
   * remove and return the last item in the list.
   * @return {*} The last item
   */
  pollLast: function() {
    if (this.__nCnt === 0) {
      return null;
    } else {
      // Remove head element
      var item = this.__tail;
      this.remove(item);
      return item.data;
    }
  },
  
  peekFirst: function() {
    return this.getFirst();
    
  },
  
  peekLast: function() {
    return this.getLast();
  },
  
  ///////////////////////////////////////////////////////////////////////
  // Deleting
  ///////////////////////////////////////////////////////////////////////


  /**
   * Removes the specified item from the list.
   *
   * @param {*} item
   *      The item to remove
   * @return {g3LinkedList} Itself for chainability
   */
  remove: function(item) {

    // TODO this is slow. Hack for now
    if (!this.contains(item))
      return false;

    item = this.__getLink(item, true);
    g3Assert.isTrue(this.__nCnt>0, "E923042934234");
    
    this.__nCnt--;

    if (this.__nCnt == 0) {
      this.__head = null;
      this.__tail = null;

    } else {
      var prev = item.prev,
        next = item.next;
      
      if (prev) prev.next = next;
      else this.__head = next;

      if (next) next.prev = prev;
      else this.__tail = prev;
    }
    
    item.next = null;
    item.prev = null;

    return true;
  },
  

  /**
   * Clears the list
   * @return {g3LinkedList} Itself for chainability.
   */
  clear: function() {
    this.__nCnt = 0;
    this.__head = null;
    this.__tail = null;
    return this;
  },
  
  ///////////////////////////////////////////////////////////////////////

  /**
   * Reverse the list
   * @return {g3LinkedList} Itself for chainability
   */
  reverse: function() {
    var n = this.__nCnt;
    if (n<2) return this;

    var cur1 = this.__head.next,
      cur2 = this.__head,
      next,
      i;
    
    for (i=0; i<n-1; i++) {
      next = cur1.next;

      // Adds the current item (cur1) to the end
      cur1.next = cur2;
      cur2.prev = cur1;

      cur2 = cur1;
      cur1 = next;
    }

    // swap head & tail
    cur1 = this.__head;
    this.__head = this.__tail;
    this.__tail = cur1;

    this.__tail.next = null;
    this.__head.prev = null;
  },
  
  ///////////////////////////////////////////////////////////////////////
  // Looping
  ///////////////////////////////////////////////////////////////////////

  /**
   * Iterate through all items of the linked list.
   * 
   * @param {Function} callback
   *      The callback function which would be called at each looping
   *      step. The signature of this function is Function(item).
   *      If this function returns true after being call, the list
   *      will stop looping.
   *
   * @return {g3LinkedList} Itself for chainability
   */
  forEach: function(callback, bReverse) {
    g3Assert.isFunction(callback, "E09897615537");
    var item = (bReverse? this.__tail : this.__head),
      next = null;

    while (item) {
      // Caches the next item in the chain
      // just in case the current item is removed
      // while processing
      next = (bReverse? item.prev : item.next);
      if (callback(item.data))
        // Stop looping
        return this;
      
      item = next;
    }

    return this;
  },


  ///////////////////////////////////////////////////////////////////////
  // Searching
  ///////////////////////////////////////////////////////////////////////

  /**
   * Determines if the specified item exists in the list
   * @param {*} item
   *      The item to check
   * @return {boolean} True indicates that the specified item exists in
   *      the list. Otherwise return false.
   */
  contains: function(item) {
    return this.indexOf(item) >= 0;
  },

  /**
   * Gets the index of the item in the list.
   * @param {*} item
   *      The item to search for
   * @return {int} The index of the item
   */
  indexOf: function(item) {
    var nCnt = this.__nCnt;
    
    if (nCnt == 0) {
      return -1;
    } else {

      var cur = this.__head,
        i;
      for (i=0; i<nCnt; i++) {
        if (cur.data === item) return i;
        cur = cur.next;
      }
      
      return -1;
    }
  },

  /**
   * Gets the last index of item from the list.
   * @param {*} item
   *      The item to search for
   * @return {int} The index of the item
   */
  lastIndexOf: function(item) {
    var nCnt = this.__nCnt;

    if (nCnt == 0) {
      // No element found
      return -1;
    } else {

      var cur = this.__tail,
        i;
      for (i=nCnt-1; i>=0; i--) {
        if (cur.data === item) return i;
        cur = cur.prev;
      }

      return -1;
    }
  },


  ///////////////////////////////////////////////////////////////////////
  // Sorting
  ///////////////////////////////////////////////////////////////////////

  /**
   * Sorts the linked list
   * @param comparator
   */
  sort: function(comparator) {
    g3Assert.failTodo("E39022233");

  },

  ///////////////////////////////////////////////////////////////////////

  /**
   * Gets the link mixin for the given item.
   * @param {*} item
   *      The item
   */
  __getLink: function(item, bExist) {
    g3Assert.isObject(item, "E93203923232");
    var link = null;

    if (this.__bNoDuplicate) {
      if (this.__bShareLink) {
        link = item;
        if (link.data) return link
        else if (bExist) {
          g3Assert.fail("E92493824234");
        }

      } else {
        var id = this.__id;
        link = item[id];

        if (link) {
          return link;
        } else if (bExist) {
          g3Assert.fail("E829384234");
        }

        link = item[id] = {};
      }

      link.next = null;
      link.prev = null;
      link.data = item;
    } else {
      if (bExist) {
        // Will need to search the list to get the link
        var cur = this.__head;
        while (cur) {
          if (cur.data === item) {
            // Found the link
            link = cur;
            break;
          }
          cur = cur.next;
        }
        g3Assert.notNull(link, "E92903232");
      } else {
        // Creates a new link for the current item
        link = {
          prev: null,
          next: null,
          data: item
        };
      }
    }

    return link;
  },


  ///////////////////////////////////////////////////////////////////////


  /**
   * Converts the linked list to array
   * @return {Object[]} The array of items in the list.
   */
  toArray: function() {
    var a = [];
    if (!this.isEmpty()) {
      this.forEach(function(item) {
        a.push(item);
      });
    }

    return a;
  },

  ///////////////////////////////////////////////////////////////////////

  /**
   * Dumps the linked list to string.
   * The result would be similar to Array.toString
   * @return {String} The textual representation of the linked list
   */
  toString: function() {
    var sb = new g3.text.StringBuilder(),
      item = this.__head,
      nCnt = this.__nCnt,
      i;

    sb.append("[");
    if (nCnt > 0) {
      for (i=0; i<nCnt-1; i++) {
        sb.append(item.data);
        sb.append(",");
        item = item.next;
      }

      sb.append(item.data);
    }
    sb.append("]");

    return sb.toString();
  }
}, {

  /**
   * {int} The int sequencer used to allocate unique linked list id
   */
  __idSeq: 0
});


module.exports = g3LinkedList;