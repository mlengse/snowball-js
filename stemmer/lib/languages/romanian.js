/*!
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */

module.exports = RomanianStemmer;
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
function RomanianStemmer() {

		var a_0 = [new Among("", -1, 3), new Among("I", 0, 1), new Among("U", 0, 2)], a_1 = [
				new Among("ea", -1, 3), new Among("a\u0163ia", -1, 7),
				new Among("aua", -1, 2), new Among("iua", -1, 4),
				new Among("a\u0163ie", -1, 7), new Among("ele", -1, 3),
				new Among("ile", -1, 5), new Among("iile", 6, 4),
				new Among("iei", -1, 4), new Among("atei", -1, 6),
				new Among("ii", -1, 4), new Among("ului", -1, 1),
				new Among("ul", -1, 1), new Among("elor", -1, 3),
				new Among("ilor", -1, 4), new Among("iilor", 14, 4)], a_2 = [
				new Among("icala", -1, 4), new Among("iciva", -1, 4),
				new Among("ativa", -1, 5), new Among("itiva", -1, 6),
				new Among("icale", -1, 4), new Among("a\u0163iune", -1, 5),
				new Among("i\u0163iune", -1, 6), new Among("atoare", -1, 5),
				new Among("itoare", -1, 6), new Among("\u0103toare", -1, 5),
				new Among("icitate", -1, 4), new Among("abilitate", -1, 1),
				new Among("ibilitate", -1, 2), new Among("ivitate", -1, 3),
				new Among("icive", -1, 4), new Among("ative", -1, 5),
				new Among("itive", -1, 6), new Among("icali", -1, 4),
				new Among("atori", -1, 5), new Among("icatori", 18, 4),
				new Among("itori", -1, 6), new Among("\u0103tori", -1, 5),
				new Among("icitati", -1, 4), new Among("abilitati", -1, 1),
				new Among("ivitati", -1, 3), new Among("icivi", -1, 4),
				new Among("ativi", -1, 5), new Among("itivi", -1, 6),
				new Among("icit\u0103i", -1, 4), new Among("abilit\u0103i", -1, 1),
				new Among("ivit\u0103i", -1, 3),
				new Among("icit\u0103\u0163i", -1, 4),
				new Among("abilit\u0103\u0163i", -1, 1),
				new Among("ivit\u0103\u0163i", -1, 3), new Among("ical", -1, 4),
				new Among("ator", -1, 5), new Among("icator", 35, 4),
				new Among("itor", -1, 6), new Among("\u0103tor", -1, 5),
				new Among("iciv", -1, 4), new Among("ativ", -1, 5),
				new Among("itiv", -1, 6), new Among("ical\u0103", -1, 4),
				new Among("iciv\u0103", -1, 4), new Among("ativ\u0103", -1, 5),
				new Among("itiv\u0103", -1, 6)], a_3 = [new Among("ica", -1, 1),
				new Among("abila", -1, 1), new Among("ibila", -1, 1),
				new Among("oasa", -1, 1), new Among("ata", -1, 1),
				new Among("ita", -1, 1), new Among("anta", -1, 1),
				new Among("ista", -1, 3), new Among("uta", -1, 1),
				new Among("iva", -1, 1), new Among("ic", -1, 1),
				new Among("ice", -1, 1), new Among("abile", -1, 1),
				new Among("ibile", -1, 1), new Among("isme", -1, 3),
				new Among("iune", -1, 2), new Among("oase", -1, 1),
				new Among("ate", -1, 1), new Among("itate", 17, 1),
				new Among("ite", -1, 1), new Among("ante", -1, 1),
				new Among("iste", -1, 3), new Among("ute", -1, 1),
				new Among("ive", -1, 1), new Among("ici", -1, 1),
				new Among("abili", -1, 1), new Among("ibili", -1, 1),
				new Among("iuni", -1, 2), new Among("atori", -1, 1),
				new Among("osi", -1, 1), new Among("ati", -1, 1),
				new Among("itati", 30, 1), new Among("iti", -1, 1),
				new Among("anti", -1, 1), new Among("isti", -1, 3),
				new Among("uti", -1, 1), new Among("i\u015Fti", -1, 3),
				new Among("ivi", -1, 1), new Among("it\u0103i", -1, 1),
				new Among("o\u015Fi", -1, 1), new Among("it\u0103\u0163i", -1, 1),
				new Among("abil", -1, 1), new Among("ibil", -1, 1),
				new Among("ism", -1, 3), new Among("ator", -1, 1),
				new Among("os", -1, 1), new Among("at", -1, 1),
				new Among("it", -1, 1), new Among("ant", -1, 1),
				new Among("ist", -1, 3), new Among("ut", -1, 1),
				new Among("iv", -1, 1), new Among("ic\u0103", -1, 1),
				new Among("abil\u0103", -1, 1), new Among("ibil\u0103", -1, 1),
				new Among("oas\u0103", -1, 1), new Among("at\u0103", -1, 1),
				new Among("it\u0103", -1, 1), new Among("ant\u0103", -1, 1),
				new Among("ist\u0103", -1, 3), new Among("ut\u0103", -1, 1),
				new Among("iv\u0103", -1, 1)], a_4 = [new Among("ea", -1, 1),
				new Among("ia", -1, 1), new Among("esc", -1, 1),
				new Among("\u0103sc", -1, 1), new Among("ind", -1, 1),
				new Among("\u00E2nd", -1, 1), new Among("are", -1, 1),
				new Among("ere", -1, 1), new Among("ire", -1, 1),
				new Among("\u00E2re", -1, 1), new Among("se", -1, 2),
				new Among("ase", 10, 1), new Among("sese", 10, 2),
				new Among("ise", 10, 1), new Among("use", 10, 1),
				new Among("\u00E2se", 10, 1), new Among("e\u015Fte", -1, 1),
				new Among("\u0103\u015Fte", -1, 1), new Among("eze", -1, 1),
				new Among("ai", -1, 1), new Among("eai", 19, 1),
				new Among("iai", 19, 1), new Among("sei", -1, 2),
				new Among("e\u015Fti", -1, 1), new Among("\u0103\u015Fti", -1, 1),
				new Among("ui", -1, 1), new Among("ezi", -1, 1),
				new Among("\u00E2i", -1, 1), new Among("a\u015Fi", -1, 1),
				new Among("se\u015Fi", -1, 2), new Among("ase\u015Fi", 29, 1),
				new Among("sese\u015Fi", 29, 2), new Among("ise\u015Fi", 29, 1),
				new Among("use\u015Fi", 29, 1),
				new Among("\u00E2se\u015Fi", 29, 1), new Among("i\u015Fi", -1, 1),
				new Among("u\u015Fi", -1, 1), new Among("\u00E2\u015Fi", -1, 1),
				new Among("a\u0163i", -1, 2), new Among("ea\u0163i", 38, 1),
				new Among("ia\u0163i", 38, 1), new Among("e\u0163i", -1, 2),
				new Among("i\u0163i", -1, 2), new Among("\u00E2\u0163i", -1, 2),
				new Among("ar\u0103\u0163i", -1, 1),
				new Among("ser\u0103\u0163i", -1, 2),
				new Among("aser\u0103\u0163i", 45, 1),
				new Among("seser\u0103\u0163i", 45, 2),
				new Among("iser\u0103\u0163i", 45, 1),
				new Among("user\u0103\u0163i", 45, 1),
				new Among("\u00E2ser\u0103\u0163i", 45, 1),
				new Among("ir\u0103\u0163i", -1, 1),
				new Among("ur\u0103\u0163i", -1, 1),
				new Among("\u00E2r\u0103\u0163i", -1, 1), new Among("am", -1, 1),
				new Among("eam", 54, 1), new Among("iam", 54, 1),
				new Among("em", -1, 2), new Among("asem", 57, 1),
				new Among("sesem", 57, 2), new Among("isem", 57, 1),
				new Among("usem", 57, 1), new Among("\u00E2sem", 57, 1),
				new Among("im", -1, 2), new Among("\u00E2m", -1, 2),
				new Among("\u0103m", -1, 2), new Among("ar\u0103m", 65, 1),
				new Among("ser\u0103m", 65, 2), new Among("aser\u0103m", 67, 1),
				new Among("seser\u0103m", 67, 2), new Among("iser\u0103m", 67, 1),
				new Among("user\u0103m", 67, 1),
				new Among("\u00E2ser\u0103m", 67, 1),
				new Among("ir\u0103m", 65, 1), new Among("ur\u0103m", 65, 1),
				new Among("\u00E2r\u0103m", 65, 1), new Among("au", -1, 1),
				new Among("eau", 76, 1), new Among("iau", 76, 1),
				new Among("indu", -1, 1), new Among("\u00E2ndu", -1, 1),
				new Among("ez", -1, 1), new Among("easc\u0103", -1, 1),
				new Among("ar\u0103", -1, 1), new Among("ser\u0103", -1, 2),
				new Among("aser\u0103", 84, 1), new Among("seser\u0103", 84, 2),
				new Among("iser\u0103", 84, 1), new Among("user\u0103", 84, 1),
				new Among("\u00E2ser\u0103", 84, 1), new Among("ir\u0103", -1, 1),
				new Among("ur\u0103", -1, 1), new Among("\u00E2r\u0103", -1, 1),
				new Among("eaz\u0103", -1, 1)], a_5 = [new Among("a", -1, 1),
				new Among("e", -1, 1), new Among("ie", 1, 1),
				new Among("i", -1, 1), new Among("\u0103", -1, 1)], g_v = [17, 65,
				16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 32, 0, 0, 4], B_standard_suffix_removed, I_p2, I_p1, I_pV, sbp = new SnowballProgram();
		this.setCurrent = function(word) {
			sbp.setCurrent(word);
		};
		this.getCurrent = function() {
			return sbp.getCurrent();
		};
		function habr1(c1, c2) {
			if (sbp.eq_s(1, c1)) {
				sbp.ket = sbp.cursor;
				if (sbp.in_grouping(g_v, 97, 259))
					sbp.slice_from(c2);
			}
		}
		function r_prelude() {
			var v_1, v_2;
			while (true) {
				v_1 = sbp.cursor;
				if (sbp.in_grouping(g_v, 97, 259)) {
					v_2 = sbp.cursor;
					sbp.bra = v_2;
					habr1("u", "U");
					sbp.cursor = v_2;
					habr1("i", "I");
				}
				sbp.cursor = v_1;
				if (sbp.cursor >= sbp.limit) {
					break;
				}
				sbp.cursor++;
			}
		}
		function habr2() {
			if (sbp.out_grouping(g_v, 97, 259)) {
				while (!sbp.in_grouping(g_v, 97, 259)) {
					if (sbp.cursor >= sbp.limit)
						return true;
					sbp.cursor++;
				}
				return false;
			}
			return true;
		}
		function habr3() {
			if (sbp.in_grouping(g_v, 97, 259)) {
				while (!sbp.out_grouping(g_v, 97, 259)) {
					if (sbp.cursor >= sbp.limit)
						return true;
					sbp.cursor++;
				}
			}
			return false;
		}
		function habr4() {
			var v_1 = sbp.cursor, v_2, v_3;
			if (sbp.in_grouping(g_v, 97, 259)) {
				v_2 = sbp.cursor;
				if (habr2()) {
					sbp.cursor = v_2;
					if (!habr3()) {
						I_pV = sbp.cursor;
						return;
					}
				} else {
					I_pV = sbp.cursor;
					return;
				}
			}
			sbp.cursor = v_1;
			if (sbp.out_grouping(g_v, 97, 259)) {
				v_3 = sbp.cursor;
				if (habr2()) {
					sbp.cursor = v_3;
					if (sbp.in_grouping(g_v, 97, 259) && sbp.cursor < sbp.limit)
						sbp.cursor++;
				}
				I_pV = sbp.cursor;
			}
		}
		function habr5() {
			while (!sbp.in_grouping(g_v, 97, 259)) {
				if (sbp.cursor >= sbp.limit)
					return false;
				sbp.cursor++;
			}
			while (!sbp.out_grouping(g_v, 97, 259)) {
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
				among_var = sbp.find_among(a_0, 3);
				if (among_var) {
					sbp.ket = sbp.cursor;
					switch (among_var) {
						case 1 :
							sbp.slice_from("i");
							continue;
						case 2 :
							sbp.slice_from("u");
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
		function r_step_0() {
			var among_var, v_1;
			sbp.ket = sbp.cursor;
			among_var = sbp.find_among_b(a_1, 16);
			if (among_var) {
				sbp.bra = sbp.cursor;
				if (r_R1()) {
					switch (among_var) {
						case 1 :
							sbp.slice_del();
							break;
						case 2 :
							sbp.slice_from("a");
							break;
						case 3 :
							sbp.slice_from("e");
							break;
						case 4 :
							sbp.slice_from("i");
							break;
						case 5 :
							v_1 = sbp.limit - sbp.cursor;
							if (!sbp.eq_s_b(2, "ab")) {
								sbp.cursor = sbp.limit - v_1;
								sbp.slice_from("i");
							}
							break;
						case 6 :
							sbp.slice_from("at");
							break;
						case 7 :
							sbp.slice_from("a\u0163i");
							break;
					}
				}
			}
		}
		function r_combo_suffix() {
			var among_var, v_1 = sbp.limit - sbp.cursor;
			sbp.ket = sbp.cursor;
			among_var = sbp.find_among_b(a_2, 46);
			if (among_var) {
				sbp.bra = sbp.cursor;
				if (r_R1()) {
					switch (among_var) {
						case 1 :
							sbp.slice_from("abil");
							break;
						case 2 :
							sbp.slice_from("ibil");
							break;
						case 3 :
							sbp.slice_from("iv");
							break;
						case 4 :
							sbp.slice_from("ic");
							break;
						case 5 :
							sbp.slice_from("at");
							break;
						case 6 :
							sbp.slice_from("it");
							break;
					}
					B_standard_suffix_removed = true;
					sbp.cursor = sbp.limit - v_1;
					return true;
				}
			}
			return false;
		}
		function r_standard_suffix() {
			var among_var, v_1;
			B_standard_suffix_removed = false;
			while (true) {
				v_1 = sbp.limit - sbp.cursor;
				if (!r_combo_suffix()) {
					sbp.cursor = sbp.limit - v_1;
					break;
				}
			}
			sbp.ket = sbp.cursor;
			among_var = sbp.find_among_b(a_3, 62);
			if (among_var) {
				sbp.bra = sbp.cursor;
				if (r_R2()) {
					switch (among_var) {
						case 1 :
							sbp.slice_del();
							break;
						case 2 :
							if (sbp.eq_s_b(1, "\u0163")) {
								sbp.bra = sbp.cursor;
								sbp.slice_from("t");
							}
							break;
						case 3 :
							sbp.slice_from("ist");
							break;
					}
					B_standard_suffix_removed = true;
				}
			}
		}
		function r_verb_suffix() {
			var among_var, v_1, v_2;
			if (sbp.cursor >= I_pV) {
				v_1 = sbp.limit_backward;
				sbp.limit_backward = I_pV;
				sbp.ket = sbp.cursor;
				among_var = sbp.find_among_b(a_4, 94);
				if (among_var) {
					sbp.bra = sbp.cursor;
					switch (among_var) {
						case 1 :
							v_2 = sbp.limit - sbp.cursor;
							if (!sbp.out_grouping_b(g_v, 97, 259)) {
								sbp.cursor = sbp.limit - v_2;
								if (!sbp.eq_s_b(1, "u"))
									break;
							}
						case 2 :
							sbp.slice_del();
							break;
					}
				}
				sbp.limit_backward = v_1;
			}
		}
		function r_vowel_suffix() {
			var among_var;
			sbp.ket = sbp.cursor;
			among_var = sbp.find_among_b(a_5, 5);
			if (among_var) {
				sbp.bra = sbp.cursor;
				if (r_RV() && among_var == 1)
					sbp.slice_del();
			}
		}
		this.stem = function() {
			var v_1 = sbp.cursor;
			r_prelude();
			sbp.cursor = v_1;
			r_mark_regions();
			sbp.limit_backward = v_1;
			sbp.cursor = sbp.limit;
			r_step_0();
			sbp.cursor = sbp.limit;
			r_standard_suffix();
			sbp.cursor = sbp.limit;
			if (!B_standard_suffix_removed) {
				sbp.cursor = sbp.limit;
				r_verb_suffix();
				sbp.cursor = sbp.limit;
			}
			r_vowel_suffix();
			sbp.cursor = sbp.limit_backward;
			r_postlude();
			return true;
		}

}
