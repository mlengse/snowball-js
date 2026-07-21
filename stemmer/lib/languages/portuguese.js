/*!
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */

module.exports = PortugueseStemmer;
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
function PortugueseStemmer() {

		var a_0 = [new Among("", -1, 3), new Among("\u00E3", 0, 1),
				new Among("\u00F5", 0, 2)], a_1 = [new Among("", -1, 3),
				new Among("a~", 0, 1), new Among("o~", 0, 2)], a_2 = [
				new Among("ic", -1, -1), new Among("ad", -1, -1),
				new Among("os", -1, -1), new Among("iv", -1, 1)], a_3 = [
				new Among("ante", -1, 1), new Among("avel", -1, 1),
				new Among("\u00EDvel", -1, 1)], a_4 = [new Among("ic", -1, 1),
				new Among("abil", -1, 1), new Among("iv", -1, 1)], a_5 = [
				new Among("ica", -1, 1), new Among("\u00E2ncia", -1, 1),
				new Among("\u00EAncia", -1, 4), new Among("ira", -1, 9),
				new Among("adora", -1, 1), new Among("osa", -1, 1),
				new Among("ista", -1, 1), new Among("iva", -1, 8),
				new Among("eza", -1, 1), new Among("log\u00EDa", -1, 2),
				new Among("idade", -1, 7), new Among("ante", -1, 1),
				new Among("mente", -1, 6), new Among("amente", 12, 5),
				new Among("\u00E1vel", -1, 1), new Among("\u00EDvel", -1, 1),
				new Among("uci\u00F3n", -1, 3), new Among("ico", -1, 1),
				new Among("ismo", -1, 1), new Among("oso", -1, 1),
				new Among("amento", -1, 1), new Among("imento", -1, 1),
				new Among("ivo", -1, 8), new Among("a\u00E7a~o", -1, 1),
				new Among("ador", -1, 1), new Among("icas", -1, 1),
				new Among("\u00EAncias", -1, 4), new Among("iras", -1, 9),
				new Among("adoras", -1, 1), new Among("osas", -1, 1),
				new Among("istas", -1, 1), new Among("ivas", -1, 8),
				new Among("ezas", -1, 1), new Among("log\u00EDas", -1, 2),
				new Among("idades", -1, 7), new Among("uciones", -1, 3),
				new Among("adores", -1, 1), new Among("antes", -1, 1),
				new Among("a\u00E7o~es", -1, 1), new Among("icos", -1, 1),
				new Among("ismos", -1, 1), new Among("osos", -1, 1),
				new Among("amentos", -1, 1), new Among("imentos", -1, 1),
				new Among("ivos", -1, 8)], a_6 = [new Among("ada", -1, 1),
				new Among("ida", -1, 1), new Among("ia", -1, 1),
				new Among("aria", 2, 1), new Among("eria", 2, 1),
				new Among("iria", 2, 1), new Among("ara", -1, 1),
				new Among("era", -1, 1), new Among("ira", -1, 1),
				new Among("ava", -1, 1), new Among("asse", -1, 1),
				new Among("esse", -1, 1), new Among("isse", -1, 1),
				new Among("aste", -1, 1), new Among("este", -1, 1),
				new Among("iste", -1, 1), new Among("ei", -1, 1),
				new Among("arei", 16, 1), new Among("erei", 16, 1),
				new Among("irei", 16, 1), new Among("am", -1, 1),
				new Among("iam", 20, 1), new Among("ariam", 21, 1),
				new Among("eriam", 21, 1), new Among("iriam", 21, 1),
				new Among("aram", 20, 1), new Among("eram", 20, 1),
				new Among("iram", 20, 1), new Among("avam", 20, 1),
				new Among("em", -1, 1), new Among("arem", 29, 1),
				new Among("erem", 29, 1), new Among("irem", 29, 1),
				new Among("assem", 29, 1), new Among("essem", 29, 1),
				new Among("issem", 29, 1), new Among("ado", -1, 1),
				new Among("ido", -1, 1), new Among("ando", -1, 1),
				new Among("endo", -1, 1), new Among("indo", -1, 1),
				new Among("ara~o", -1, 1), new Among("era~o", -1, 1),
				new Among("ira~o", -1, 1), new Among("ar", -1, 1),
				new Among("er", -1, 1), new Among("ir", -1, 1),
				new Among("as", -1, 1), new Among("adas", 47, 1),
				new Among("idas", 47, 1), new Among("ias", 47, 1),
				new Among("arias", 50, 1), new Among("erias", 50, 1),
				new Among("irias", 50, 1), new Among("aras", 47, 1),
				new Among("eras", 47, 1), new Among("iras", 47, 1),
				new Among("avas", 47, 1), new Among("es", -1, 1),
				new Among("ardes", 58, 1), new Among("erdes", 58, 1),
				new Among("irdes", 58, 1), new Among("ares", 58, 1),
				new Among("eres", 58, 1), new Among("ires", 58, 1),
				new Among("asses", 58, 1), new Among("esses", 58, 1),
				new Among("isses", 58, 1), new Among("astes", 58, 1),
				new Among("estes", 58, 1), new Among("istes", 58, 1),
				new Among("is", -1, 1), new Among("ais", 71, 1),
				new Among("eis", 71, 1), new Among("areis", 73, 1),
				new Among("ereis", 73, 1), new Among("ireis", 73, 1),
				new Among("\u00E1reis", 73, 1), new Among("\u00E9reis", 73, 1),
				new Among("\u00EDreis", 73, 1), new Among("\u00E1sseis", 73, 1),
				new Among("\u00E9sseis", 73, 1), new Among("\u00EDsseis", 73, 1),
				new Among("\u00E1veis", 73, 1), new Among("\u00EDeis", 73, 1),
				new Among("ar\u00EDeis", 84, 1), new Among("er\u00EDeis", 84, 1),
				new Among("ir\u00EDeis", 84, 1), new Among("ados", -1, 1),
				new Among("idos", -1, 1), new Among("amos", -1, 1),
				new Among("\u00E1ramos", 90, 1), new Among("\u00E9ramos", 90, 1),
				new Among("\u00EDramos", 90, 1), new Among("\u00E1vamos", 90, 1),
				new Among("\u00EDamos", 90, 1), new Among("ar\u00EDamos", 95, 1),
				new Among("er\u00EDamos", 95, 1), new Among("ir\u00EDamos", 95, 1),
				new Among("emos", -1, 1), new Among("aremos", 99, 1),
				new Among("eremos", 99, 1), new Among("iremos", 99, 1),
				new Among("\u00E1ssemos", 99, 1), new Among("\u00EAssemos", 99, 1),
				new Among("\u00EDssemos", 99, 1), new Among("imos", -1, 1),
				new Among("armos", -1, 1), new Among("ermos", -1, 1),
				new Among("irmos", -1, 1), new Among("\u00E1mos", -1, 1),
				new Among("ar\u00E1s", -1, 1), new Among("er\u00E1s", -1, 1),
				new Among("ir\u00E1s", -1, 1), new Among("eu", -1, 1),
				new Among("iu", -1, 1), new Among("ou", -1, 1),
				new Among("ar\u00E1", -1, 1), new Among("er\u00E1", -1, 1),
				new Among("ir\u00E1", -1, 1)], a_7 = [new Among("a", -1, 1),
				new Among("i", -1, 1), new Among("o", -1, 1),
				new Among("os", -1, 1), new Among("\u00E1", -1, 1),
				new Among("\u00ED", -1, 1), new Among("\u00F3", -1, 1)], a_8 = [
				new Among("e", -1, 1), new Among("\u00E7", -1, 2),
				new Among("\u00E9", -1, 1), new Among("\u00EA", -1, 1)], g_v = [17,
				65, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 19, 12, 2], I_p2, I_p1, I_pV, sbp = new SnowballProgram();
		this.setCurrent = function(word) {
			sbp.setCurrent(word);
		};
		this.getCurrent = function() {
			return sbp.getCurrent();
		};
		function r_prelude() {
			var among_var;
			while (true) {
				sbp.bra = sbp.cursor;
				among_var = sbp.find_among(a_0, 3);
				if (among_var) {
					sbp.ket = sbp.cursor;
					switch (among_var) {
						case 1 :
							sbp.slice_from("a~");
							continue;
						case 2 :
							sbp.slice_from("o~");
							continue;
						case 3 :
							if (sbp.cursor >= sbp.limit)
								break;
							sbp.cursor++;
							continue;
					}
				}
				break;
			}
		}
		function habr2() {
			if (sbp.out_grouping(g_v, 97, 250)) {
				while (!sbp.in_grouping(g_v, 97, 250)) {
					if (sbp.cursor >= sbp.limit)
						return true;
					sbp.cursor++;
				}
				return false;
			}
			return true;
		}
		function habr3() {
			if (sbp.in_grouping(g_v, 97, 250)) {
				while (!sbp.out_grouping(g_v, 97, 250)) {
					if (sbp.cursor >= sbp.limit)
						return false;
					sbp.cursor++;
				}
			}
			I_pV = sbp.cursor;
			return true;
		}
		function habr4() {
			var v_1 = sbp.cursor, v_2, v_3;
			if (sbp.in_grouping(g_v, 97, 250)) {
				v_2 = sbp.cursor;
				if (habr2()) {
					sbp.cursor = v_2;
					if (habr3())
						return;
				} else
					I_pV = sbp.cursor;
			}
			sbp.cursor = v_1;
			if (sbp.out_grouping(g_v, 97, 250)) {
				v_3 = sbp.cursor;
				if (habr2()) {
					sbp.cursor = v_3;
					if (!sbp.in_grouping(g_v, 97, 250) || sbp.cursor >= sbp.limit)
						return;
					sbp.cursor++;
				}
				I_pV = sbp.cursor;
			}
		}
		function habr5() {
			while (!sbp.in_grouping(g_v, 97, 250)) {
				if (sbp.cursor >= sbp.limit)
					return false;
				sbp.cursor++;
			}
			while (!sbp.out_grouping(g_v, 97, 250)) {
				if (sbp.cursor >= sbp.limit)
					return false;
				sbp.cursor++;
			}
			return true;
		}
		function r_mark_regions() {
			var v_1 = sbp.cursor;
			I_pV = sbp.limit;
			I_p1 = I_pV;
			I_p2 = I_pV;
			habr4();
			sbp.cursor = v_1;
			if (habr5()) {
				I_p1 = sbp.cursor;
				if (habr5())
					I_p2 = sbp.cursor;
			}
		}
		function r_postlude() {
			var among_var;
			while (true) {
				sbp.bra = sbp.cursor;
				among_var = sbp.find_among(a_1, 3);
				if (among_var) {
					sbp.ket = sbp.cursor;
					switch (among_var) {
						case 1 :
							sbp.slice_from("\u00E3");
							continue;
						case 2 :
							sbp.slice_from("\u00F5");
							continue;
						case 3 :
							if (sbp.cursor >= sbp.limit)
								break;
							sbp.cursor++;
							continue;
					}
				}
				break;
			}
		}
		function r_RV() {
			return I_pV <= sbp.cursor;
		}
		function r_R1() {
			return I_p1 <= sbp.cursor;
		}
		function r_R2() {
			return I_p2 <= sbp.cursor;
		}
		function r_standard_suffix() {
			var among_var;
			sbp.ket = sbp.cursor;
			among_var = sbp.find_among_b(a_5, 45);
			if (!among_var)
				return false;
			sbp.bra = sbp.cursor;
			switch (among_var) {
				case 1 :
					if (!r_R2())
						return false;
					sbp.slice_del();
					break;
				case 2 :
					if (!r_R2())
						return false;
					sbp.slice_from("log");
					break;
				case 3 :
					if (!r_R2())
						return false;
					sbp.slice_from("u");
					break;
				case 4 :
					if (!r_R2())
						return false;
					sbp.slice_from("ente");
					break;
				case 5 :
					if (!r_R1())
						return false;
					sbp.slice_del();
					sbp.ket = sbp.cursor;
					among_var = sbp.find_among_b(a_2, 4);
					if (among_var) {
						sbp.bra = sbp.cursor;
						if (r_R2()) {
							sbp.slice_del();
							if (among_var == 1) {
								sbp.ket = sbp.cursor;
								if (sbp.eq_s_b(2, "at")) {
									sbp.bra = sbp.cursor;
									if (r_R2())
										sbp.slice_del();
								}
							}
						}
					}
					break;
				case 6 :
					if (!r_R2())
						return false;
					sbp.slice_del();
					sbp.ket = sbp.cursor;
					among_var = sbp.find_among_b(a_3, 3);
					if (among_var) {
						sbp.bra = sbp.cursor;
						if (among_var == 1)
							if (r_R2())
								sbp.slice_del();
					}
					break;
				case 7 :
					if (!r_R2())
						return false;
					sbp.slice_del();
					sbp.ket = sbp.cursor;
					among_var = sbp.find_among_b(a_4, 3);
					if (among_var) {
						sbp.bra = sbp.cursor;
						if (among_var == 1)
							if (r_R2())
								sbp.slice_del();
					}
					break;
				case 8 :
					if (!r_R2())
						return false;
					sbp.slice_del();
					sbp.ket = sbp.cursor;
					if (sbp.eq_s_b(2, "at")) {
						sbp.bra = sbp.cursor;
						if (r_R2())
							sbp.slice_del();
					}
					break;
				case 9 :
					if (!r_RV() || !sbp.eq_s_b(1, "e"))
						return false;
					sbp.slice_from("ir");
					break;
			}
			return true;
		}
		function r_verb_suffix() {
			var among_var, v_1;
			if (sbp.cursor >= I_pV) {
				v_1 = sbp.limit_backward;
				sbp.limit_backward = I_pV;
				sbp.ket = sbp.cursor;
				among_var = sbp.find_among_b(a_6, 120);
				if (among_var) {
					sbp.bra = sbp.cursor;
					if (among_var == 1)
						sbp.slice_del();
					sbp.limit_backward = v_1;
					return true;
				}
				sbp.limit_backward = v_1;
			}
			return false;
		}
		function r_residual_suffix() {
			var among_var;
			sbp.ket = sbp.cursor;
			among_var = sbp.find_among_b(a_7, 7);
			if (among_var) {
				sbp.bra = sbp.cursor;
				if (among_var == 1)
					if (r_RV())
						sbp.slice_del();
			}
		}
		function habr6(c1, c2) {
			if (sbp.eq_s_b(1, c1)) {
				sbp.bra = sbp.cursor;
				var v_1 = sbp.limit - sbp.cursor;
				if (sbp.eq_s_b(1, c2)) {
					sbp.cursor = sbp.limit - v_1;
					if (r_RV())
						sbp.slice_del();
					return false;
				}
			}
			return true;
		}
		function r_residual_form() {
			var among_var, v_1, v_2, v_3;
			sbp.ket = sbp.cursor;
			among_var = sbp.find_among_b(a_8, 4);
			if (among_var) {
				sbp.bra = sbp.cursor;
				switch (among_var) {
					case 1 :
						if (r_RV()) {
							sbp.slice_del();
							sbp.ket = sbp.cursor;
							v_1 = sbp.limit - sbp.cursor;
							if (habr6("u", "g"))
								habr6("i", "c")
						}
						break;
					case 2 :
						sbp.slice_from("c");
						break;
				}
			}
		}
		function habr1() {
			if (!r_standard_suffix()) {
				sbp.cursor = sbp.limit;
				if (!r_verb_suffix()) {
					sbp.cursor = sbp.limit;
					r_residual_suffix();
					return;
				}
			}
			sbp.cursor = sbp.limit;
			sbp.ket = sbp.cursor;
			if (sbp.eq_s_b(1, "i")) {
				sbp.bra = sbp.cursor;
				if (sbp.eq_s_b(1, "c")) {
					sbp.cursor = sbp.limit;
					if (r_RV())
						sbp.slice_del();
				}
			}
		}
		this.stem = function() {
			var v_1 = sbp.cursor;
			r_prelude();
			sbp.cursor = v_1;
			r_mark_regions();
			sbp.limit_backward = v_1;
			sbp.cursor = sbp.limit;
			habr1();
			sbp.cursor = sbp.limit;
			r_residual_form();
			sbp.cursor = sbp.limit_backward;
			r_postlude();
			return true;
		}

}
