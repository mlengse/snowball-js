/*!
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */

function SnowballProgram() {
	var current;
	function find_among_internal(self, v, v_size, backward) {
		var i = 0, j = v_size, c = self.cursor, limit = backward ? self.limit_backward : self.limit, common_i = 0, common_j = 0, first_key_inspected = false;
		while (true) {
			var k = i + ((j - i) >> 1), diff = 0, common = common_i < common_j
					? common_i
					: common_j, w = v[k], ws = w.s, ws_size = w.s_size; // Hoist properties for faster loop access
			if (backward) {
				// Incremental cursor position tracking eliminates repeated addition/subtraction inside loop
				var c_common = c - common;
				for (var i2 = ws_size - 1 - common; i2 >= 0; i2--) {
					if (c_common === limit) {
						diff = -1;
						break;
					}
					diff = current.charCodeAt(c_common - 1) - ws.charCodeAt(i2);
					if (diff)
						break;
					common++;
					c_common--;
				}
			} else {
				var c_common = c + common;
				for (var i2 = common; i2 < ws_size; i2++) {
					if (c_common === limit) {
						diff = -1;
						break;
					}
					diff = current.charCodeAt(c_common) - ws.charCodeAt(i2);
					if (diff)
						break;
					common++;
					c_common++;
				}
			}
			if (diff < 0) {
				j = k;
				common_j = common;
			} else {
				i = k;
				common_i = common;
			}
			if (j - i <= 1) {
				if (i > 0 || j === i || first_key_inspected)
					break;
				first_key_inspected = true;
			}
		}
		while (true) {
			var w = v[i];
			if (common_i >= w.s_size) {
				self.cursor = backward ? c - w.s_size : c + w.s_size;
				if (!w.method)
					return w.result;
				var res = w.method();
				self.cursor = backward ? c - w.s_size : c + w.s_size;
				if (res)
					return w.result;
			}
			i = w.substring_i;
			if (i < 0)
				return 0;
		}
	}
	return {
		bra : 0,
		ket : 0,
		limit : 0,
		cursor : 0,
		limit_backward : 0,
		setCurrent : function(word) {
			current = word;
			this.cursor = 0;
			this.limit = word.length;
			this.limit_backward = 0;
			this.bra = this.cursor;
			this.ket = this.limit;
		},
		getCurrent : function() {
			var result = current;
			current = null;
			return result;
		},
		in_grouping : function(s, min, max) {
			var cursor = this.cursor; // Hoist this.cursor to local variable for faster property lookup
			if (cursor < this.limit) {
				var ch = current.charCodeAt(cursor);
				if (ch <= max && ch >= min) {
					ch -= min;
					if (s[ch >> 3] & (1 << (ch & 7))) {
						this.cursor = cursor + 1;
						return true;
					}
				}
			}
			return false;
		},
		in_grouping_b : function(s, min, max) {
			var cursor = this.cursor; // Hoist this.cursor to local variable for faster property lookup
			if (cursor > this.limit_backward) {
				var ch = current.charCodeAt(cursor - 1);
				if (ch <= max && ch >= min) {
					ch -= min;
					if (s[ch >> 3] & (1 << (ch & 7))) {
						this.cursor = cursor - 1;
						return true;
					}
				}
			}
			return false;
		},
		out_grouping : function(s, min, max) {
			var cursor = this.cursor; // Hoist this.cursor to local variable for faster property lookup
			if (cursor < this.limit) {
				var ch = current.charCodeAt(cursor);
				if (ch > max || ch < min) {
					this.cursor = cursor + 1;
					return true;
				}
				ch -= min;
				if (!(s[ch >> 3] & (1 << (ch & 7)))) {
					this.cursor = cursor + 1;
					return true;
				}
			}
			return false;
		},
		out_grouping_b : function(s, min, max) {
			var cursor = this.cursor; // Hoist this.cursor to local variable for faster property lookup
			if (cursor > this.limit_backward) {
				var ch = current.charCodeAt(cursor - 1);
				if (ch > max || ch < min) {
					this.cursor = cursor - 1;
					return true;
				}
				ch -= min;
				if (!(s[ch >> 3] & (1 << (ch & 7)))) {
					this.cursor = cursor - 1;
					return true;
				}
			}
			return false;
		},
		eq_s : function(s_size, s) {
			var cursor = this.cursor; // Hoist this.cursor to local variable for faster property lookup
			if (this.limit - cursor < s_size)
				return false;
			if (!current.startsWith(s, cursor))
				return false;
			this.cursor = cursor + s_size;
			return true;
		},
		eq_s_b : function(s_size, s) {
			var cursor = this.cursor; // Hoist this.cursor to local variable for faster property lookup
			if (cursor - this.limit_backward < s_size)
				return false;
			var start = cursor - s_size; // Pre-calculate string start offset
			if (!current.startsWith(s, start))
				return false;
			this.cursor = start;
			return true;
		},
		find_among : function(v, v_size) {
			return find_among_internal(this, v, v_size, false);
		},
		find_among_b : function(v, v_size) {
			return find_among_internal(this, v, v_size, true);
		},
		replace_s : function(c_bra, c_ket, s) {
			var adjustment = s.length - (c_ket - c_bra);
			current = current.slice(0, c_bra) + s + current.slice(c_ket);
			this.limit += adjustment;
			if (this.cursor >= c_ket)
				this.cursor += adjustment;
			else if (this.cursor > c_bra)
				this.cursor = c_bra;
			return adjustment;
		},
		slice_check : function() {
			if (this.bra < 0 || this.bra > this.ket || this.ket > this.limit
					|| this.limit > current.length)
				throw new Error("faulty slice operation");
		},
		slice_from : function(s) {
			this.slice_check();
			this.replace_s(this.bra, this.ket, s);
		},
		slice_del : function() {
			this.slice_from("");
		},
		insert : function(c_bra, c_ket, s) {
			var adjustment = this.replace_s(c_bra, c_ket, s);
			if (c_bra <= this.bra)
				this.bra += adjustment;
			if (c_bra <= this.ket)
				this.ket += adjustment;
		},
		slice_to : function() {
			this.slice_check();
			return current.substring(this.bra, this.ket);
		},
		eq_v_b : function(s) {
			return this.eq_s_b(s.length, s);
		}
	};
}
