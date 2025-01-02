// @ts-check
/**@constructor*/
function IndonesianStemmer() {
	var a_0 = [new Among("kah", -1, 1), new Among("lah", -1, 1),
			new Among("pun", -1, 1)], a_1 = [new Among("nya", -1, 1),
			new Among("ku", -1, 1), new Among("mu", -1, 1)], a_2 = [
			new Among("i", -1, 1, r_SUFFIX_I_OK), new Among("an", -1, 1,
			r_SUFFIX_AN_OK), new Among("kan", 1, 1, r_SUFFIX_KAN_OK)], a_3 = [
			new Among("di", -1, 1), new Among("ke", -1, 2), new Among("me",
			-1, 1), new Among("mem", 2, 5), new Among("men", 2, 1),
			new Among("meng", 4, 1), new Among("meny", 4, 3, r_VOWEL),
			new Among("pem", -1, 6), new Among("pen", -1, 2), new Among(
			"peng", 8, 2), new Among("peny", 8, 4, r_VOWEL), new Among(
			"ter", -1, 1)], a_4 = [new Among("be", -1, 3, r_KER),
			new Among("belajar", 0, 4), new Among("ber", 0, 3), new Among(
			"pe", -1, 1), new Among("pelajar", 3, 2), new Among("per", 3, 1)], g_vowel = [17, 65, 16], I_prefix, I_measure, sbp = new SnowballProgram();
	this.setCurrent = function(word) {
		sbp.setCurrent(word);
	};
	this.getCurrent = function() {
		return sbp.getCurrent();
	};
	function r_remove_particle() {
		sbp.ket = sbp.cursor;
		if (sbp.find_among_b(a_0, 3) == 0) {
			return false;
		}
		sbp.bra = sbp.cursor;
		sbp.slice_del();
		I_measure -= 1;
		return true;
	}

	function r_remove_possessive_pronoun() {
		sbp.ket = sbp.cursor;
		if (sbp.find_among_b(a_1, 3) == 0) {
			return false;
		}
		sbp.bra = sbp.cursor;
		sbp.slice_del();
		I_measure -= 1;
		return true;
	}

	function r_SUFFIX_KAN_OK() {
		if (!(I_prefix != 3)) {
			return false;
		}
		if (!(I_prefix != 2)) {
			return false;
		}
		return true;
	}

	function r_SUFFIX_AN_OK() {
		if (!(I_prefix != 1)) {
			return false;
		}
		return true;
	}

	function r_SUFFIX_I_OK() {
		if (!(I_prefix <= 2)) {
			return false;
		}
		{
			var v_1 = sbp.limit - sbp.cursor;
			lab0: {
				if (!(sbp.eq_s_b(1, "s"))) {
					break lab0;
				}
				return false;
			}
			sbp.cursor = sbp.limit - v_1;
		}
		return true;
	}

	function r_remove_suffix() {
		sbp.ket = sbp.cursor;
		if (sbp.find_among_b(a_2, 3) == 0) {
			return false;
		}
		sbp.bra = sbp.cursor;
		sbp.slice_del();
		I_measure -= 1;
		return true;
	}

	function r_VOWEL() {
		if (!(sbp.in_grouping(g_vowel, 97, 117))) {
			return false;
		}
		return true;
	}

	function r_KER() {
		if (!(sbp.out_grouping(g_vowel, 97, 117))) {
			return false;
		}
		if (!(sbp.eq_s(2, "er"))) {
			return false;
		}
		return true;
	}

	function r_remove_first_order_prefix() {
		var among_var;
		sbp.bra = sbp.cursor;
		among_var = sbp.find_among(a_3, 12);
		if (among_var == 0) {
			return false;
		}
		sbp.ket = sbp.cursor;
		switch (among_var) {
			case 1:
				sbp.slice_del();
				I_prefix = 1;
				I_measure -= 1;
				break;
			case 2:
				sbp.slice_del();
				I_prefix = 3;
				I_measure -= 1;
				break;
			case 3:
				I_prefix = 1;
				sbp.slice_from("s");
				I_measure -= 1;
				break;
			case 4:
				I_prefix = 3;
				sbp.slice_from("s");
				I_measure -= 1;
				break;
			case 5:
				I_prefix = 1;
				I_measure -= 1;
				lab0: {
					var v_1 = sbp.cursor;
					lab1: {
						var v_2 = sbp.cursor;
						if (!(sbp.in_grouping(g_vowel, 97, 117))) {
							break lab1;
						}
						sbp.cursor = v_2;
						sbp.slice_from("p");
						break lab0;
					}
					sbp.cursor = v_1;
					sbp.slice_del();
				}
				break;
			case 6:
				I_prefix = 3;
				I_measure -= 1;
				lab2: {
					var v_3 = sbp.cursor;
					lab3: {
						var v_4 = sbp.cursor;
						if (!(sbp.in_grouping(g_vowel, 97, 117))) {
							break lab3;
						}
						sbp.cursor = v_4;
						sbp.slice_from("p");
						break lab2;
					}
					sbp.cursor = v_3;
					sbp.slice_del();
				}
				break;
		}
		return true;
	}

	function r_remove_second_order_prefix() {
		var among_var;
		sbp.bra = sbp.cursor;
		among_var = sbp.find_among(a_4, 6);
		if (among_var == 0) {
			return false;
		}
		sbp.ket = sbp.cursor;
		switch (among_var) {
			case 1:
				sbp.slice_del();
				I_prefix = 2;
				I_measure -= 1;
				break;
			case 2:
				sbp.slice_from("ajar");
				I_measure -= 1;
				break;
			case 3:
				sbp.slice_del();
				I_prefix = 4;
				I_measure -= 1;
				break;
			case 4:
				sbp.slice_from("ajar");
				I_prefix = 4;
				I_measure -= 1;
				break;
		}
		return true;
	}

	this.stem = function() {
		I_measure = 0;
		var v_1 = sbp.cursor;
		lab0: {
			while (true) {
				var v_2 = sbp.cursor;
				lab1: {
					golab2: while (true) {
						lab3: {
							if (!(sbp.in_grouping(g_vowel, 97, 117))) {
								break lab3;
							}
							break golab2;
						}
						if (sbp.cursor >= sbp.limit) {
							break lab1;
						}
						sbp.cursor++;
					}
					I_measure += 1;
					continue;
				}
				sbp.cursor = v_2;
				break;
			}
		}
		sbp.cursor = v_1;
		if (!(I_measure > 2)) {
			return false;
		}
		I_prefix = 0;
		sbp.limit_backward = sbp.cursor;
		sbp.cursor = sbp.limit;
		var v_4 = sbp.limit - sbp.cursor;
		r_remove_particle();
		sbp.cursor = sbp.limit - v_4;
		if (!(I_measure > 2)) {
			return false;
		}
		var v_5 = sbp.limit - sbp.cursor;
		r_remove_possessive_pronoun();
		sbp.cursor = sbp.limit - v_5;
		sbp.cursor = sbp.limit_backward;
		if (!(I_measure > 2)) {
			return false;
		}
		lab4: {
			var v_6 = sbp.cursor;
			lab5: {
				var v_7 = sbp.cursor;
				if (!r_remove_first_order_prefix()) {
					break lab5;
				}
				var v_8 = sbp.cursor;
				lab6: {
					var v_9 = sbp.cursor;
					if (!(I_measure > 2)) {
						break lab6;
					}
					sbp.limit_backward = sbp.cursor;
					sbp.cursor = sbp.limit;
					if (!r_remove_suffix()) {
						break lab6;
					}
					sbp.cursor = sbp.limit_backward;
					sbp.cursor = v_9;
					if (!(I_measure > 2)) {
						break lab6;
					}
					if (!r_remove_second_order_prefix()) {
						break lab6;
					}
				}
				sbp.cursor = v_8;
				sbp.cursor = v_7;
				break lab4;
			}
			sbp.cursor = v_6;
			var v_10 = sbp.cursor;
			r_remove_second_order_prefix();
			sbp.cursor = v_10;
			var v_11 = sbp.cursor;
			lab7: {
				if (!(I_measure > 2)) {
					break lab7;
				}
				sbp.limit_backward = sbp.cursor;
				sbp.cursor = sbp.limit;
				if (!r_remove_suffix()) {
					break lab7;
				}
				sbp.cursor = sbp.limit_backward;
			}
			sbp.cursor = v_11;
		}
		return true;
	};
}
