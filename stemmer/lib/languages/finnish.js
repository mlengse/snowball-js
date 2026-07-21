/*!
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */

module.exports = FinnishStemmer;
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
function FinnishStemmer() {

		var a_0 = [new Among("pa", -1, 1), new Among("sti", -1, 2),
				new Among("kaan", -1, 1), new Among("han", -1, 1),
				new Among("kin", -1, 1), new Among("h\u00E4n", -1, 1),
				new Among("k\u00E4\u00E4n", -1, 1), new Among("ko", -1, 1),
				new Among("p\u00E4", -1, 1), new Among("k\u00F6", -1, 1)], a_1 = [
				new Among("lla", -1, -1), new Among("na", -1, -1),
				new Among("ssa", -1, -1), new Among("ta", -1, -1),
				new Among("lta", 3, -1), new Among("sta", 3, -1)], a_2 = [
				new Among("ll\u00E4", -1, -1), new Among("n\u00E4", -1, -1),
				new Among("ss\u00E4", -1, -1), new Among("t\u00E4", -1, -1),
				new Among("lt\u00E4", 3, -1), new Among("st\u00E4", 3, -1)], a_3 = [
				new Among("lle", -1, -1), new Among("ine", -1, -1)], a_4 = [
				new Among("nsa", -1, 3), new Among("mme", -1, 3),
				new Among("nne", -1, 3), new Among("ni", -1, 2),
				new Among("si", -1, 1), new Among("an", -1, 4),
				new Among("en", -1, 6), new Among("\u00E4n", -1, 5),
				new Among("ns\u00E4", -1, 3)], a_5 = [new Among("aa", -1, -1),
				new Among("ee", -1, -1), new Among("ii", -1, -1),
				new Among("oo", -1, -1), new Among("uu", -1, -1),
				new Among("\u00E4\u00E4", -1, -1),
				new Among("\u00F6\u00F6", -1, -1)], a_6 = [new Among("a", -1, 8),
				new Among("lla", 0, -1), new Among("na", 0, -1),
				new Among("ssa", 0, -1), new Among("ta", 0, -1),
				new Among("lta", 4, -1), new Among("sta", 4, -1),
				new Among("tta", 4, 9), new Among("lle", -1, -1),
				new Among("ine", -1, -1), new Among("ksi", -1, -1),
				new Among("n", -1, 7), new Among("han", 11, 1),
				new Among("den", 11, -1, r_VI), new Among("seen", 11, -1, r_LONG),
				new Among("hen", 11, 2), new Among("tten", 11, -1, r_VI),
				new Among("hin", 11, 3), new Among("siin", 11, -1, r_VI),
				new Among("hon", 11, 4), new Among("h\u00E4n", 11, 5),
				new Among("h\u00F6n", 11, 6), new Among("\u00E4", -1, 8),
				new Among("ll\u00E4", 22, -1), new Among("n\u00E4", 22, -1),
				new Among("ss\u00E4", 22, -1), new Among("t\u00E4", 22, -1),
				new Among("lt\u00E4", 26, -1), new Among("st\u00E4", 26, -1),
				new Among("tt\u00E4", 26, 9)], a_7 = [new Among("eja", -1, -1),
				new Among("mma", -1, 1), new Among("imma", 1, -1),
				new Among("mpa", -1, 1), new Among("impa", 3, -1),
				new Among("mmi", -1, 1), new Among("immi", 5, -1),
				new Among("mpi", -1, 1), new Among("impi", 7, -1),
				new Among("ej\u00E4", -1, -1), new Among("mm\u00E4", -1, 1),
				new Among("imm\u00E4", 10, -1), new Among("mp\u00E4", -1, 1),
				new Among("imp\u00E4", 12, -1)], a_8 = [new Among("i", -1, -1),
				new Among("j", -1, -1)], a_9 = [new Among("mma", -1, 1),
				new Among("imma", 0, -1)], g_AEI = [17, 1, 0, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 8], g_V1 = [17, 65, 16, 1, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 8, 0, 32], g_V2 = [17, 65, 16, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 8, 0, 32], g_particle_end = [17, 97, 24, 1, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 32], B_ending_removed, S_x, I_p2, I_p1, sbp = new SnowballProgram();
		this.setCurrent = function(word) {
			sbp.setCurrent(word);
		};
		this.getCurrent = function() {
			return sbp.getCurrent();
		};
		function r_mark_regions() {
			I_p1 = sbp.limit;
			I_p2 = I_p1;
			if (!habr1()) {
				I_p1 = sbp.cursor;
				if (!habr1())
					I_p2 = sbp.cursor;
			}
		}
		function habr1() {
			var v_1;
			while (true) {
				v_1 = sbp.cursor;
				if (sbp.in_grouping(g_V1, 97, 246))
					break;
				sbp.cursor = v_1;
				if (v_1 >= sbp.limit)
					return true;
				sbp.cursor++;
			}
			sbp.cursor = v_1;
			while (!sbp.out_grouping(g_V1, 97, 246)) {
				if (sbp.cursor >= sbp.limit)
					return true;
				sbp.cursor++;
			}
			return false;
		}
		function r_R2() {
			return I_p2 <= sbp.cursor;
		}
		function r_particle_etc() {
			var among_var, v_1;
			if (sbp.cursor >= I_p1) {
				v_1 = sbp.limit_backward;
				sbp.limit_backward = I_p1;
				sbp.ket = sbp.cursor;
				among_var = sbp.find_among_b(a_0, 10);
				if (among_var) {
					sbp.bra = sbp.cursor;
					sbp.limit_backward = v_1;
					switch (among_var) {
						case 1 :
							if (!sbp.in_grouping_b(g_particle_end, 97, 246))
								return;
							break;
						case 2 :
							if (!r_R2())
								return;
							break;
					}
					sbp.slice_del();
				} else
					sbp.limit_backward = v_1;
			}
		}
		function r_possessive() {
			var among_var, v_1, v_2;
			if (sbp.cursor >= I_p1) {
				v_1 = sbp.limit_backward;
				sbp.limit_backward = I_p1;
				sbp.ket = sbp.cursor;
				among_var = sbp.find_among_b(a_4, 9);
				if (among_var) {
					sbp.bra = sbp.cursor;
					sbp.limit_backward = v_1;
					switch (among_var) {
						case 1 :
							v_2 = sbp.limit - sbp.cursor;
							if (!sbp.eq_s_b(1, "k")) {
								sbp.cursor = sbp.limit - v_2;
								sbp.slice_del();
							}
							break;
						case 2 :
							sbp.slice_del();
							sbp.ket = sbp.cursor;
							if (sbp.eq_s_b(3, "kse")) {
								sbp.bra = sbp.cursor;
								sbp.slice_from("ksi");
							}
							break;
						case 3 :
							sbp.slice_del();
							break;
						case 4 :
							if (sbp.find_among_b(a_1, 6))
								sbp.slice_del();
							break;
						case 5 :
							if (sbp.find_among_b(a_2, 6))
								sbp.slice_del();
							break;
						case 6 :
							if (sbp.find_among_b(a_3, 2))
								sbp.slice_del();
							break;
					}
				} else
					sbp.limit_backward = v_1;
			}
		}
		function r_LONG() {
			return sbp.find_among_b(a_5, 7);
		}
		function r_VI() {
			return sbp.eq_s_b(1, "i") && sbp.in_grouping_b(g_V2, 97, 246);
		}
		function r_case_ending() {
			var among_var, v_1, v_2;
			if (sbp.cursor >= I_p1) {
				v_1 = sbp.limit_backward;
				sbp.limit_backward = I_p1;
				sbp.ket = sbp.cursor;
				among_var = sbp.find_among_b(a_6, 30);
				if (among_var) {
					sbp.bra = sbp.cursor;
					sbp.limit_backward = v_1;
					switch (among_var) {
						case 1 :
							if (!sbp.eq_s_b(1, "a"))
								return;
							break;
						case 2 :
						case 9 :
							if (!sbp.eq_s_b(1, "e"))
								return;
							break;
						case 3 :
							if (!sbp.eq_s_b(1, "i"))
								return;
							break;
						case 4 :
							if (!sbp.eq_s_b(1, "o"))
								return;
							break;
						case 5 :
							if (!sbp.eq_s_b(1, "\u00E4"))
								return;
							break;
						case 6 :
							if (!sbp.eq_s_b(1, "\u00F6"))
								return;
							break;
						case 7 :
							v_2 = sbp.limit - sbp.cursor;
							if (!r_LONG()) {
								sbp.cursor = sbp.limit - v_2;
								if (!sbp.eq_s_b(2, "ie")) {
									sbp.cursor = sbp.limit - v_2;
									break;
								}
							}
							sbp.cursor = sbp.limit - v_2;
							if (sbp.cursor <= sbp.limit_backward) {
								sbp.cursor = sbp.limit - v_2;
								break;
							}
							sbp.cursor--;
							sbp.bra = sbp.cursor;
							break;
						case 8 :
							if (!sbp.in_grouping_b(g_V1, 97, 246)
									|| !sbp.out_grouping_b(g_V1, 97, 246))
								return;
							break;
					}
					sbp.slice_del();
					B_ending_removed = true;
				} else
					sbp.limit_backward = v_1;
			}
		}
		function r_other_endings() {
			var among_var, v_1, v_2;
			if (sbp.cursor >= I_p2) {
				v_1 = sbp.limit_backward;
				sbp.limit_backward = I_p2;
				sbp.ket = sbp.cursor;
				among_var = sbp.find_among_b(a_7, 14);
				if (among_var) {
					sbp.bra = sbp.cursor;
					sbp.limit_backward = v_1;
					if (among_var == 1) {
						v_2 = sbp.limit - sbp.cursor;
						if (sbp.eq_s_b(2, "po"))
							return;
						sbp.cursor = sbp.limit - v_2;
					}
					sbp.slice_del();
				} else
					sbp.limit_backward = v_1;
			}
		}
		function r_i_plural() {
			var v_1;
			if (sbp.cursor >= I_p1) {
				v_1 = sbp.limit_backward;
				sbp.limit_backward = I_p1;
				sbp.ket = sbp.cursor;
				if (sbp.find_among_b(a_8, 2)) {
					sbp.bra = sbp.cursor;
					sbp.limit_backward = v_1;
					sbp.slice_del();
				} else
					sbp.limit_backward = v_1;
			}
		}
		function r_t_plural() {
			var among_var, v_1, v_2, v_3, v_4, v_5;
			if (sbp.cursor >= I_p1) {
				v_1 = sbp.limit_backward;
				sbp.limit_backward = I_p1;
				sbp.ket = sbp.cursor;
				if (sbp.eq_s_b(1, "t")) {
					sbp.bra = sbp.cursor;
					v_2 = sbp.limit - sbp.cursor;
					if (sbp.in_grouping_b(g_V1, 97, 246)) {
						sbp.cursor = sbp.limit - v_2;
						sbp.slice_del();
						sbp.limit_backward = v_1;
						v_3 = sbp.limit - sbp.cursor;
						if (sbp.cursor >= I_p2) {
							sbp.cursor = I_p2;
							v_4 = sbp.limit_backward;
							sbp.limit_backward = sbp.cursor;
							sbp.cursor = sbp.limit - v_3;
							sbp.ket = sbp.cursor;
							among_var = sbp.find_among_b(a_9, 2);
							if (among_var) {
								sbp.bra = sbp.cursor;
								sbp.limit_backward = v_4;
								if (among_var == 1) {
									v_5 = sbp.limit - sbp.cursor;
									if (sbp.eq_s_b(2, "po"))
										return;
									sbp.cursor = sbp.limit - v_5;
								}
								sbp.slice_del();
								return;
							}
						}
					}
				}
				sbp.limit_backward = v_1;
			}
		}
		function r_tidy() {
			var v_1, v_2, v_3, v_4;
			if (sbp.cursor >= I_p1) {
				v_1 = sbp.limit_backward;
				sbp.limit_backward = I_p1;
				v_2 = sbp.limit - sbp.cursor;
				if (r_LONG()) {
					sbp.cursor = sbp.limit - v_2;
					sbp.ket = sbp.cursor;
					if (sbp.cursor > sbp.limit_backward) {
						sbp.cursor--;
						sbp.bra = sbp.cursor;
						sbp.slice_del();
					}
				}
				sbp.cursor = sbp.limit - v_2;
				sbp.ket = sbp.cursor;
				if (sbp.in_grouping_b(g_AEI, 97, 228)) {
					sbp.bra = sbp.cursor;
					if (sbp.out_grouping_b(g_V1, 97, 246))
						sbp.slice_del();
				}
				sbp.cursor = sbp.limit - v_2;
				sbp.ket = sbp.cursor;
				if (sbp.eq_s_b(1, "j")) {
					sbp.bra = sbp.cursor;
					v_3 = sbp.limit - sbp.cursor;
					if (!sbp.eq_s_b(1, "o")) {
						sbp.cursor = sbp.limit - v_3;
						if (sbp.eq_s_b(1, "u"))
							sbp.slice_del();
					} else
						sbp.slice_del();
				}
				sbp.cursor = sbp.limit - v_2;
				sbp.ket = sbp.cursor;
				if (sbp.eq_s_b(1, "o")) {
					sbp.bra = sbp.cursor;
					if (sbp.eq_s_b(1, "j"))
						sbp.slice_del();
				}
				sbp.cursor = sbp.limit - v_2;
				sbp.limit_backward = v_1;
				while (true) {
					v_4 = sbp.limit - sbp.cursor;
					if (sbp.out_grouping_b(g_V1, 97, 246)) {
						sbp.cursor = sbp.limit - v_4;
						break;
					}
					sbp.cursor = sbp.limit - v_4;
					if (sbp.cursor <= sbp.limit_backward)
						return;
					sbp.cursor--;
				}
				sbp.ket = sbp.cursor;
				if (sbp.cursor > sbp.limit_backward) {
					sbp.cursor--;
					sbp.bra = sbp.cursor;
					S_x = sbp.slice_to();
					if (sbp.eq_v_b(S_x))
						sbp.slice_del();
				}
			}
		}
		this.stem = function() {
			var v_1 = sbp.cursor;
			r_mark_regions();
			B_ending_removed = false;
			sbp.limit_backward = v_1;
			sbp.cursor = sbp.limit;
			r_particle_etc();
			sbp.cursor = sbp.limit;
			r_possessive();
			sbp.cursor = sbp.limit;
			r_case_ending();
			sbp.cursor = sbp.limit;
			r_other_endings();
			sbp.cursor = sbp.limit;
			if (B_ending_removed) {
				r_i_plural();
				sbp.cursor = sbp.limit;
			} else {
				sbp.cursor = sbp.limit;
				r_t_plural();
				sbp.cursor = sbp.limit;
			}
			r_tidy();
			return true;
		}

}
