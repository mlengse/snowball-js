/*!
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */

module.exports = SwedishStemmer;
/*!
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */

function Among(s, substring_i, result, method) {
	if ((!s && s != "") || (!substring_i && (substring_i != 0)) || !result)
		throw ("Bad Among initialisation: s:" + s + ", substring_i: "
				+ substring_i + ", result: " + result);
	this.s_size = s.length;
	this.s = this.toCharArray(s);
	this.substring_i = substring_i;
	this.result = result;
	this.method = method;
}
Among.prototype.toCharArray = function(s) {
	var sLength = s.length, charArr = new Array(sLength);
	for (var i = 0; i < sLength; i++)
		charArr[i] = s.charCodeAt(i);
	return charArr;
}
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
			if (this.cursor < this.limit) {
				var ch = current.charCodeAt(this.cursor);
				if (ch <= max && ch >= min) {
					ch -= min;
					if (s[ch >> 3] & (0X1 << (ch & 0X7))) {
						this.cursor++;
						return true;
					}
				}
			}
			return false;
		},
		in_grouping_b : function(s, min, max) {
			if (this.cursor > this.limit_backward) {
				var ch = current.charCodeAt(this.cursor - 1);
				if (ch <= max && ch >= min) {
					ch -= min;
					if (s[ch >> 3] & (0X1 << (ch & 0X7))) {
						this.cursor--;
						return true;
					}
				}
			}
			return false;
		},
		out_grouping : function(s, min, max) {
			if (this.cursor < this.limit) {
				var ch = current.charCodeAt(this.cursor);
				if (ch > max || ch < min) {
					this.cursor++;
					return true;
				}
				ch -= min;
				if (!(s[ch >> 3] & (0X1 << (ch & 0X7)))) {
					this.cursor++;
					return true;
				}
			}
			return false;
		},
		out_grouping_b : function(s, min, max) {
			if (this.cursor > this.limit_backward) {
				var ch = current.charCodeAt(this.cursor - 1);
				if (ch > max || ch < min) {
					this.cursor--;
					return true;
				}
				ch -= min;
				if (!(s[ch >> 3] & (0X1 << (ch & 0X7)))) {
					this.cursor--;
					return true;
				}
			}
			return false;
		},
		eq_s : function(s_size, s) {
			if (this.limit - this.cursor < s_size)
				return false;
			for (var i = 0; i < s_size; i++)
				if (current.charCodeAt(this.cursor + i) != s.charCodeAt(i))
					return false;
			this.cursor += s_size;
			return true;
		},
		eq_s_b : function(s_size, s) {
			if (this.cursor - this.limit_backward < s_size)
				return false;
			for (var i = 0; i < s_size; i++)
				if (current.charCodeAt(this.cursor - s_size + i) != s
						.charCodeAt(i))
					return false;
			this.cursor -= s_size;
			return true;
		},
		find_among : function(v, v_size) {
			var i = 0, j = v_size, c = this.cursor, l = this.limit, common_i = 0, common_j = 0, first_key_inspected = false;
			while (true) {
				var k = i + ((j - i) >> 1), diff = 0, common = common_i < common_j
						? common_i
						: common_j, w = v[k];
				for (var i2 = common; i2 < w.s_size; i2++) {
					if (c + common == l) {
						diff = -1;
						break;
					}
					diff = current.charCodeAt(c + common) - w.s[i2];
					if (diff)
						break;
					common++;
				}
				if (diff < 0) {
					j = k;
					common_j = common;
				} else {
					i = k;
					common_i = common;
				}
				if (j - i <= 1) {
					if (i > 0 || j == i || first_key_inspected)
						break;
					first_key_inspected = true;
				}
			}
			while (true) {
				var w = v[i];
				if (common_i >= w.s_size) {
					this.cursor = c + w.s_size;
					if (!w.method)
						return w.result;
					var res = w.method();
					this.cursor = c + w.s_size;
					if (res)
						return w.result;
				}
				i = w.substring_i;
				if (i < 0)
					return 0;
			}
		},
		find_among_b : function(v, v_size) {
			var i = 0, j = v_size, c = this.cursor, lb = this.limit_backward, common_i = 0, common_j = 0, first_key_inspected = false;
			while (true) {
				var k = i + ((j - i) >> 1), diff = 0, common = common_i < common_j
						? common_i
						: common_j, w = v[k];
				for (var i2 = w.s_size - 1 - common; i2 >= 0; i2--) {
					if (c - common == lb) {
						diff = -1;
						break;
					}
					diff = current.charCodeAt(c - 1 - common) - w.s[i2];
					if (diff)
						break;
					common++;
				}
				if (diff < 0) {
					j = k;
					common_j = common;
				} else {
					i = k;
					common_i = common;
				}
				if (j - i <= 1) {
					if (i > 0 || j == i || first_key_inspected)
						break;
					first_key_inspected = true;
				}
			}
			while (true) {
				var w = v[i];
				if (common_i >= w.s_size) {
					this.cursor = c - w.s_size;
					if (!w.method)
						return w.result;
					var res = w.method();
					this.cursor = c - w.s_size;
					if (res)
						return w.result;
				}
				i = w.substring_i;
				if (i < 0)
					return 0;
			}
		},
		replace_s : function(c_bra, c_ket, s) {
			var adjustment = s.length - (c_ket - c_bra), left = current
					.substring(0, c_bra), right = current.substring(c_ket);
			current = left + s + right;
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
				throw ("faulty slice operation");
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
function SwedishStemmer() {

		var a_0 = [new Among("a", -1, 1), new Among("arna", 0, 1),
				new Among("erna", 0, 1), new Among("heterna", 2, 1),
				new Among("orna", 0, 1), new Among("ad", -1, 1),
				new Among("e", -1, 1), new Among("ade", 6, 1),
				new Among("ande", 6, 1), new Among("arne", 6, 1),
				new Among("are", 6, 1), new Among("aste", 6, 1),
				new Among("en", -1, 1), new Among("anden", 12, 1),
				new Among("aren", 12, 1), new Among("heten", 12, 1),
				new Among("ern", -1, 1), new Among("ar", -1, 1),
				new Among("er", -1, 1), new Among("heter", 18, 1),
				new Among("or", -1, 1), new Among("s", -1, 2),
				new Among("as", 21, 1), new Among("arnas", 22, 1),
				new Among("ernas", 22, 1), new Among("ornas", 22, 1),
				new Among("es", 21, 1), new Among("ades", 26, 1),
				new Among("andes", 26, 1), new Among("ens", 21, 1),
				new Among("arens", 29, 1), new Among("hetens", 29, 1),
				new Among("erns", 21, 1), new Among("at", -1, 1),
				new Among("andet", -1, 1), new Among("het", -1, 1),
				new Among("ast", -1, 1)], a_1 = [new Among("dd", -1, -1),
				new Among("gd", -1, -1), new Among("nn", -1, -1),
				new Among("dt", -1, -1), new Among("gt", -1, -1),
				new Among("kt", -1, -1), new Among("tt", -1, -1)], a_2 = [
				new Among("ig", -1, 1), new Among("lig", 0, 1),
				new Among("els", -1, 1), new Among("fullt", -1, 3),
				new Among("l\u00F6st", -1, 2)], g_v = [17, 65, 16, 1, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 24, 0, 32], g_s_ending = [119, 127, 149], I_x, I_p1, sbp = new SnowballProgram();
		this.setCurrent = function(word) {
			sbp.setCurrent(word);
		};
		this.getCurrent = function() {
			return sbp.getCurrent();
		};
		function r_mark_regions() {
			var v_1, c = sbp.cursor + 3;
			I_p1 = sbp.limit;
			if (0 <= c || c <= sbp.limit) {
				I_x = c;
				while (true) {
					v_1 = sbp.cursor;
					if (sbp.in_grouping(g_v, 97, 246)) {
						sbp.cursor = v_1;
						break;
					}
					sbp.cursor = v_1;
					if (sbp.cursor >= sbp.limit)
						return;
					sbp.cursor++;
				}
				while (!sbp.out_grouping(g_v, 97, 246)) {
					if (sbp.cursor >= sbp.limit)
						return;
					sbp.cursor++;
				}
				I_p1 = sbp.cursor;
				if (I_p1 < I_x)
					I_p1 = I_x;
			}
		}
		function r_main_suffix() {
			var among_var, v_2 = sbp.limit_backward;
			if (sbp.cursor >= I_p1) {
				sbp.limit_backward = I_p1;
				sbp.cursor = sbp.limit;
				sbp.ket = sbp.cursor;
				among_var = sbp.find_among_b(a_0, 37);
				sbp.limit_backward = v_2;
				if (among_var) {
					sbp.bra = sbp.cursor;
					switch (among_var) {
						case 1 :
							sbp.slice_del();
							break;
						case 2 :
							if (sbp.in_grouping_b(g_s_ending, 98, 121))
								sbp.slice_del();
							break;
					}
				}
			}
		}
		function r_consonant_pair() {
			var v_1 = sbp.limit_backward;
			if (sbp.cursor >= I_p1) {
				sbp.limit_backward = I_p1;
				sbp.cursor = sbp.limit;
				if (sbp.find_among_b(a_1, 7)) {
					sbp.cursor = sbp.limit;
					sbp.ket = sbp.cursor;
					if (sbp.cursor > sbp.limit_backward) {
						sbp.bra = --sbp.cursor;
						sbp.slice_del();
					}
				}
				sbp.limit_backward = v_1;
			}
		}
		function r_other_suffix() {
			var among_var, v_2;
			if (sbp.cursor >= I_p1) {
				v_2 = sbp.limit_backward;
				sbp.limit_backward = I_p1;
				sbp.cursor = sbp.limit;
				sbp.ket = sbp.cursor;
				among_var = sbp.find_among_b(a_2, 5);
				if (among_var) {
					sbp.bra = sbp.cursor;
					switch (among_var) {
						case 1 :
							sbp.slice_del();
							break;
						case 2 :
							sbp.slice_from("l\u00F6s");
							break;
						case 3 :
							sbp.slice_from("full");
							break;
					}
				}
				sbp.limit_backward = v_2;
			}
		}
		this.stem = function() {
			var v_1 = sbp.cursor;
			r_mark_regions();
			sbp.limit_backward = v_1;
			sbp.cursor = sbp.limit;
			r_main_suffix();
			sbp.cursor = sbp.limit;
			r_consonant_pair();
			sbp.cursor = sbp.limit;
			r_other_suffix();
			return true;
		}

}
