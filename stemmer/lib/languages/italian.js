/*!
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */

module.exports = ItalianStemmer;
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
function ItalianStemmer() {

		var a_0 = [new Among("", -1, 7), new Among("qu", 0, 6),
				new Among("\u00E1", 0, 1), new Among("\u00E9", 0, 2),
				new Among("\u00ED", 0, 3), new Among("\u00F3", 0, 4),
				new Among("\u00FA", 0, 5)], a_1 = [new Among("", -1, 3),
				new Among("I", 0, 1), new Among("U", 0, 2)], a_2 = [
				new Among("la", -1, -1), new Among("cela", 0, -1),
				new Among("gliela", 0, -1), new Among("mela", 0, -1),
				new Among("tela", 0, -1), new Among("vela", 0, -1),
				new Among("le", -1, -1), new Among("cele", 6, -1),
				new Among("gliele", 6, -1), new Among("mele", 6, -1),
				new Among("tele", 6, -1), new Among("vele", 6, -1),
				new Among("ne", -1, -1), new Among("cene", 12, -1),
				new Among("gliene", 12, -1), new Among("mene", 12, -1),
				new Among("sene", 12, -1), new Among("tene", 12, -1),
				new Among("vene", 12, -1), new Among("ci", -1, -1),
				new Among("li", -1, -1), new Among("celi", 20, -1),
				new Among("glieli", 20, -1), new Among("meli", 20, -1),
				new Among("teli", 20, -1), new Among("veli", 20, -1),
				new Among("gli", 20, -1), new Among("mi", -1, -1),
				new Among("si", -1, -1), new Among("ti", -1, -1),
				new Among("vi", -1, -1), new Among("lo", -1, -1),
				new Among("celo", 31, -1), new Among("glielo", 31, -1),
				new Among("melo", 31, -1), new Among("telo", 31, -1),
				new Among("velo", 31, -1)], a_3 = [new Among("ando", -1, 1),
				new Among("endo", -1, 1), new Among("ar", -1, 2),
				new Among("er", -1, 2), new Among("ir", -1, 2)], a_4 = [
				new Among("ic", -1, -1), new Among("abil", -1, -1),
				new Among("os", -1, -1), new Among("iv", -1, 1)], a_5 = [
				new Among("ic", -1, 1), new Among("abil", -1, 1),
				new Among("iv", -1, 1)], a_6 = [new Among("ica", -1, 1),
				new Among("logia", -1, 3), new Among("osa", -1, 1),
				new Among("ista", -1, 1), new Among("iva", -1, 9),
				new Among("anza", -1, 1), new Among("enza", -1, 5),
				new Among("ice", -1, 1), new Among("atrice", 7, 1),
				new Among("iche", -1, 1), new Among("logie", -1, 3),
				new Among("abile", -1, 1), new Among("ibile", -1, 1),
				new Among("usione", -1, 4), new Among("azione", -1, 2),
				new Among("uzione", -1, 4), new Among("atore", -1, 2),
				new Among("ose", -1, 1), new Among("ante", -1, 1),
				new Among("mente", -1, 1), new Among("amente", 19, 7),
				new Among("iste", -1, 1), new Among("ive", -1, 9),
				new Among("anze", -1, 1), new Among("enze", -1, 5),
				new Among("ici", -1, 1), new Among("atrici", 25, 1),
				new Among("ichi", -1, 1), new Among("abili", -1, 1),
				new Among("ibili", -1, 1), new Among("ismi", -1, 1),
				new Among("usioni", -1, 4), new Among("azioni", -1, 2),
				new Among("uzioni", -1, 4), new Among("atori", -1, 2),
				new Among("osi", -1, 1), new Among("anti", -1, 1),
				new Among("amenti", -1, 6), new Among("imenti", -1, 6),
				new Among("isti", -1, 1), new Among("ivi", -1, 9),
				new Among("ico", -1, 1), new Among("ismo", -1, 1),
				new Among("oso", -1, 1), new Among("amento", -1, 6),
				new Among("imento", -1, 6), new Among("ivo", -1, 9),
				new Among("it\u00E0", -1, 8), new Among("ist\u00E0", -1, 1),
				new Among("ist\u00E8", -1, 1), new Among("ist\u00EC", -1, 1)], a_7 = [
				new Among("isca", -1, 1), new Among("enda", -1, 1),
				new Among("ata", -1, 1), new Among("ita", -1, 1),
				new Among("uta", -1, 1), new Among("ava", -1, 1),
				new Among("eva", -1, 1), new Among("iva", -1, 1),
				new Among("erebbe", -1, 1), new Among("irebbe", -1, 1),
				new Among("isce", -1, 1), new Among("ende", -1, 1),
				new Among("are", -1, 1), new Among("ere", -1, 1),
				new Among("ire", -1, 1), new Among("asse", -1, 1),
				new Among("ate", -1, 1), new Among("avate", 16, 1),
				new Among("evate", 16, 1), new Among("ivate", 16, 1),
				new Among("ete", -1, 1), new Among("erete", 20, 1),
				new Among("irete", 20, 1), new Among("ite", -1, 1),
				new Among("ereste", -1, 1), new Among("ireste", -1, 1),
				new Among("ute", -1, 1), new Among("erai", -1, 1),
				new Among("irai", -1, 1), new Among("isci", -1, 1),
				new Among("endi", -1, 1), new Among("erei", -1, 1),
				new Among("irei", -1, 1), new Among("assi", -1, 1),
				new Among("ati", -1, 1), new Among("iti", -1, 1),
				new Among("eresti", -1, 1), new Among("iresti", -1, 1),
				new Among("uti", -1, 1), new Among("avi", -1, 1),
				new Among("evi", -1, 1), new Among("ivi", -1, 1),
				new Among("isco", -1, 1), new Among("ando", -1, 1),
				new Among("endo", -1, 1), new Among("Yamo", -1, 1),
				new Among("iamo", -1, 1), new Among("avamo", -1, 1),
				new Among("evamo", -1, 1), new Among("ivamo", -1, 1),
				new Among("eremo", -1, 1), new Among("iremo", -1, 1),
				new Among("assimo", -1, 1), new Among("ammo", -1, 1),
				new Among("emmo", -1, 1), new Among("eremmo", 54, 1),
				new Among("iremmo", 54, 1), new Among("immo", -1, 1),
				new Among("ano", -1, 1), new Among("iscano", 58, 1),
				new Among("avano", 58, 1), new Among("evano", 58, 1),
				new Among("ivano", 58, 1), new Among("eranno", -1, 1),
				new Among("iranno", -1, 1), new Among("ono", -1, 1),
				new Among("iscono", 65, 1), new Among("arono", 65, 1),
				new Among("erono", 65, 1), new Among("irono", 65, 1),
				new Among("erebbero", -1, 1), new Among("irebbero", -1, 1),
				new Among("assero", -1, 1), new Among("essero", -1, 1),
				new Among("issero", -1, 1), new Among("ato", -1, 1),
				new Among("ito", -1, 1), new Among("uto", -1, 1),
				new Among("avo", -1, 1), new Among("evo", -1, 1),
				new Among("ivo", -1, 1), new Among("ar", -1, 1),
				new Among("ir", -1, 1), new Among("er\u00E0", -1, 1),
				new Among("ir\u00E0", -1, 1), new Among("er\u00F2", -1, 1),
				new Among("ir\u00F2", -1, 1)], g_v = [17, 65, 16, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 128, 128, 8, 2, 1], g_AEIO = [17, 65, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 128, 8, 2], g_CG = [17], I_p2, I_p1, I_pV, sbp = new SnowballProgram();
		this.setCurrent = function(word) {
			sbp.setCurrent(word);
		};
		this.getCurrent = function() {
			return sbp.getCurrent();
		};
		function habr1(c1, c2, v_1) {
			if (sbp.eq_s(1, c1)) {
				sbp.ket = sbp.cursor;
				if (sbp.in_grouping(g_v, 97, 249)) {
					sbp.slice_from(c2);
					sbp.cursor = v_1;
					return true;
				}
			}
			return false;
		}
		function r_prelude() {
			var among_var, v_1 = sbp.cursor, v_2, v_3, v_4;
			while (true) {
				sbp.bra = sbp.cursor;
				among_var = sbp.find_among(a_0, 7);
				if (among_var) {
					sbp.ket = sbp.cursor;
					switch (among_var) {
						case 1 :
							sbp.slice_from("\u00E0");
							continue;
						case 2 :
							sbp.slice_from("\u00E8");
							continue;
						case 3 :
							sbp.slice_from("\u00EC");
							continue;
						case 4 :
							sbp.slice_from("\u00F2");
							continue;
						case 5 :
							sbp.slice_from("\u00F9");
							continue;
						case 6 :
							sbp.slice_from("qU");
							continue;
						case 7 :
							if (sbp.cursor >= sbp.limit)
								break;
							sbp.cursor++;
							continue;
					}
				}
				break;
			}
			sbp.cursor = v_1;
			while (true) {
				v_2 = sbp.cursor;
				while (true) {
					v_3 = sbp.cursor;
					if (sbp.in_grouping(g_v, 97, 249)) {
						sbp.bra = sbp.cursor;
						v_4 = sbp.cursor;
						if (habr1("u", "U", v_3))
							break;
						sbp.cursor = v_4;
						if (habr1("i", "I", v_3))
							break;
					}
					sbp.cursor = v_3;
					if (sbp.cursor >= sbp.limit) {
						sbp.cursor = v_2;
						return;
					}
					sbp.cursor++;
				}
			}
		}
		function habr2(v_1) {
			sbp.cursor = v_1;
			if (!sbp.in_grouping(g_v, 97, 249))
				return false;
			while (!sbp.out_grouping(g_v, 97, 249)) {
				if (sbp.cursor >= sbp.limit)
					return false;
				sbp.cursor++;
			}
			return true;
		}
		function habr3() {
			if (sbp.in_grouping(g_v, 97, 249)) {
				var v_1 = sbp.cursor;
				if (sbp.out_grouping(g_v, 97, 249)) {
					while (!sbp.in_grouping(g_v, 97, 249)) {
						if (sbp.cursor >= sbp.limit)
							return habr2(v_1);
						sbp.cursor++;
					}
					return true;
				}
				return habr2(v_1);
			}
			return false;
		}
		function habr4() {
			var v_1 = sbp.cursor, v_2;
			if (!habr3()) {
				sbp.cursor = v_1;
				if (!sbp.out_grouping(g_v, 97, 249))
					return;
				v_2 = sbp.cursor;
				if (sbp.out_grouping(g_v, 97, 249)) {
					while (!sbp.in_grouping(g_v, 97, 249)) {
						if (sbp.cursor >= sbp.limit) {
							sbp.cursor = v_2;
							if (sbp.in_grouping(g_v, 97, 249)
									&& sbp.cursor < sbp.limit)
								sbp.cursor++;
							return;
						}
						sbp.cursor++;
					}
					I_pV = sbp.cursor;
					return;
				}
				sbp.cursor = v_2;
				if (!sbp.in_grouping(g_v, 97, 249) || sbp.cursor >= sbp.limit)
					return;
				sbp.cursor++;
			}
			I_pV = sbp.cursor;
		}
		function habr5() {
			while (!sbp.in_grouping(g_v, 97, 249)) {
				if (sbp.cursor >= sbp.limit)
					return false;
				sbp.cursor++;
			}
			while (!sbp.out_grouping(g_v, 97, 249)) {
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
				if (!among_var)
					break;
				sbp.ket = sbp.cursor;
				switch (among_var) {
					case 1 :
						sbp.slice_from("i");
						break;
					case 2 :
						sbp.slice_from("u");
						break;
					case 3 :
						if (sbp.cursor >= sbp.limit)
							return;
						sbp.cursor++;
						break;
				}
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
		function r_attached_pronoun() {
			var among_var;
			sbp.ket = sbp.cursor;
			if (sbp.find_among_b(a_2, 37)) {
				sbp.bra = sbp.cursor;
				among_var = sbp.find_among_b(a_3, 5);
				if (among_var && r_RV()) {
					switch (among_var) {
						case 1 :
							sbp.slice_del();
							break;
						case 2 :
							sbp.slice_from("e");
							break;
					}
				}
			}
		}
		function r_standard_suffix() {
			var among_var;
			sbp.ket = sbp.cursor;
			among_var = sbp.find_among_b(a_6, 51);
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
					sbp.slice_del();
					sbp.ket = sbp.cursor;
					if (sbp.eq_s_b(2, "ic")) {
						sbp.bra = sbp.cursor;
						if (r_R2())
							sbp.slice_del();
					}
					break;
				case 3 :
					if (!r_R2())
						return false;
					sbp.slice_from("log");
					break;
				case 4 :
					if (!r_R2())
						return false;
					sbp.slice_from("u");
					break;
				case 5 :
					if (!r_R2())
						return false;
					sbp.slice_from("ente");
					break;
				case 6 :
					if (!r_RV())
						return false;
					sbp.slice_del();
					break;
				case 7 :
					if (!r_R1())
						return false;
					sbp.slice_del();
					sbp.ket = sbp.cursor;
					among_var = sbp.find_among_b(a_4, 4);
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
				case 8 :
					if (!r_R2())
						return false;
					sbp.slice_del();
					sbp.ket = sbp.cursor;
					among_var = sbp.find_among_b(a_5, 3);
					if (among_var) {
						sbp.bra = sbp.cursor;
						if (among_var == 1)
							if (r_R2())
								sbp.slice_del();
					}
					break;
				case 9 :
					if (!r_R2())
						return false;
					sbp.slice_del();
					sbp.ket = sbp.cursor;
					if (sbp.eq_s_b(2, "at")) {
						sbp.bra = sbp.cursor;
						if (r_R2()) {
							sbp.slice_del();
							sbp.ket = sbp.cursor;
							if (sbp.eq_s_b(2, "ic")) {
								sbp.bra = sbp.cursor;
								if (r_R2())
									sbp.slice_del();
							}
						}
					}
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
				among_var = sbp.find_among_b(a_7, 87);
				if (among_var) {
					sbp.bra = sbp.cursor;
					if (among_var == 1)
						sbp.slice_del();
				}
				sbp.limit_backward = v_1;
			}
		}
		function habr6() {
			var v_1 = sbp.limit - sbp.cursor;
			sbp.ket = sbp.cursor;
			if (sbp.in_grouping_b(g_AEIO, 97, 242)) {
				sbp.bra = sbp.cursor;
				if (r_RV()) {
					sbp.slice_del();
					sbp.ket = sbp.cursor;
					if (sbp.eq_s_b(1, "i")) {
						sbp.bra = sbp.cursor;
						if (r_RV()) {
							sbp.slice_del();
							return;
						}
					}
				}
			}
			sbp.cursor = sbp.limit - v_1;
		}
		function r_vowel_suffix() {
			habr6();
			sbp.ket = sbp.cursor;
			if (sbp.eq_s_b(1, "h")) {
				sbp.bra = sbp.cursor;
				if (sbp.in_grouping_b(g_CG, 99, 103))
					if (r_RV())
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
			r_attached_pronoun();
			sbp.cursor = sbp.limit;
			if (!r_standard_suffix()) {
				sbp.cursor = sbp.limit;
				r_verb_suffix();
			}
			sbp.cursor = sbp.limit;
			r_vowel_suffix();
			sbp.cursor = sbp.limit_backward;
			r_postlude();
			return true;
		}

}
