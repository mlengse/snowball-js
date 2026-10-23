const Snowball = require("../dist/Snowball");

const LANGUAGES = [
  "danish", "dutch", "english", "finnish", "french", "german",
  "hungarian", "indonesian", "italian", "norwegian", "portuguese",
  "romanian", "russian", "spanish", "swedish", "turkish",
];

function isStemmer(value) {
  return (
    value !== null &&
    value !== undefined &&
    typeof value.setCurrent === "function" &&
    typeof value.getCurrent === "function" &&
    typeof value.stem === "function"
  );
}

describe("Snowball API", () => {
  describe("constructor", () => {
    it("returns a stemmer instance for each supported language", () => {
      const languages = [
        "danish", "dutch", "english", "finnish", "french", "german",
        "hungarian", "indonesian", "italian", "norwegian", "portuguese",
        "romanian", "russian", "spanish", "swedish", "turkish",
      ];
      for (const lang of languages) {
        const stemmer = Snowball(lang);
        expect(stemmer).toBeDefined();
        expect(typeof stemmer.setCurrent).toBe("function");
        expect(typeof stemmer.getCurrent).toBe("function");
        expect(typeof stemmer.stem).toBe("function");
      }
    });

    it("is case-insensitive for language name", () => {
      const s1 = Snowball("English");
      const s2 = Snowball("english");
      s1.setCurrent("running");
      s1.stem();
      s2.setCurrent("running");
      s2.stem();
      expect(s1.getCurrent()).toBe(s2.getCurrent());
    });
  });

  describe("setCurrent / getCurrent", () => {
    it("sets and gets the current word", () => {
      const stemmer = Snowball("english");
      stemmer.setCurrent("hello");
      expect(stemmer.getCurrent()).toBe("hello");
    });

    it("getCurrent consumes the value (returns null after first call)", () => {
      const stemmer = Snowball("english");
      stemmer.setCurrent("hello");
      expect(stemmer.getCurrent()).toBe("hello");
      expect(stemmer.getCurrent()).toBeNull();
    });

    it("handles empty string", () => {
      const stemmer = Snowball("english");
      stemmer.setCurrent("");
      expect(stemmer.getCurrent()).toBe("");
    });

    it("handles unicode characters", () => {
      const stemmer = Snowball("german");
      stemmer.setCurrent("Möglichkeiten");
      stemmer.stem();
      expect(stemmer.getCurrent()).toBe("Moglich");
    });
  });

  describe("stem", () => {
    it("returns true on success", () => {
      const stemmer = Snowball("english");
      stemmer.setCurrent("running");
      expect(stemmer.stem()).toBe(true);
    });

    it("modifies the current word in-place", () => {
      const stemmer = Snowball("english");
      stemmer.setCurrent("running");
      stemmer.stem();
      expect(stemmer.getCurrent()).toBe("run");
    });
  });

  describe("reusability", () => {
    it("can stem multiple words sequentially", () => {
      const stemmer = Snowball("english");
      const words = ["running", "cats", "generously", "connected"];
      const expected = ["run", "cat", "generous", "connect"];
      for (let i = 0; i < words.length; i++) {
        stemmer.setCurrent(words[i]);
        stemmer.stem();
        expect(stemmer.getCurrent()).toBe(expected[i]);
      }
    });

    it("can be reused after getCurrent consumes value", () => {
      const stemmer = Snowball("english");
      stemmer.setCurrent("running");
      stemmer.stem();
      const first = stemmer.getCurrent();
      stemmer.setCurrent("cats");
      stemmer.stem();
      const second = stemmer.getCurrent();
      expect(first).toBe("run");
      expect(second).toBe("cat");
    });
  });

  describe("per-language entrypoints", () => {
    it("are callable as factories, matching their .d.ts and README", () => {
      for (const lang of LANGUAGES) {
        const LanguageStemmer = require(`../dist/languages/${lang}`);
        const stemmer = LanguageStemmer();
        expect(isStemmer(stemmer), `${lang} factory call`).toBe(true);
      }
    });

    it("are also usable with new", () => {
      for (const lang of LANGUAGES) {
        const LanguageStemmer = require(`../dist/languages/${lang}`);
        expect(isStemmer(new LanguageStemmer()), `${lang} new`).toBe(true);
      }
    });

    it("produce a working stemmer via the factory call", () => {
      const EnglishStemmer = require("../dist/languages/english");
      const stemmer = EnglishStemmer();
      stemmer.setCurrent("running");
      expect(stemmer.stem()).toBe(true);
      expect(stemmer.getCurrent()).toBe("run");
    });
  });
});

describe("entrypoint export parity (runtime)", () => {
  it("root ESM entry exposes a callable default and a matching named export", async () => {
    const mod = await import("../index.mjs");
    expect(typeof mod.default).toBe("function");
    expect(mod.Snowball).toBe(mod.default);
    const stemmer = mod.Snowball("english");
    stemmer.setCurrent("running");
    stemmer.stem();
    expect(stemmer.getCurrent()).toBe("run");
  });

  it.each(LANGUAGES)(
    "per-language ESM entry %s exposes a callable default and a matching named export",
    async (lang) => {
      const mod = await import(`../dist/languages/${lang}.mjs`);
      expect(typeof mod.default).toBe("function");
      const named = Object.keys(mod).find((key) => key !== "default");
      expect(named, `${lang} named export`).toBeDefined();
      expect(mod[named]).toBe(mod.default);
      expect(isStemmer(mod.default()), `${lang} factory call`).toBe(true);
    }
  );
});

describe("Among constructor validation", () => {
  const fs = require("fs");
  const path = require("path");
  const amongCode = fs.readFileSync(
    path.join(__dirname, "../stemmer/src/Among.js"),
    "utf8"
  );
  const Among = new Function(amongCode + "; return Among;")();

  it("initializes language stemmers containing Among instances correctly", () => {
    const EnglishStemmer = require("../dist/languages/english");
    expect(() => EnglishStemmer()).not.toThrow();
  });

  it("creates an Among instance when valid arguments are provided", () => {
    const among = new Among("test", 0, 1, null);
    expect(among.s_size).toBe(4);
    expect(among.s).toEqual([116, 101, 115, 116]);
    expect(among.substring_i).toBe(0);
    expect(among.result).toBe(1);
    expect(among.method).toBeNull();
  });

  it("throws an Error instance when invalid arguments are provided", () => {
    try {
      new Among(null, 0, 1);
      expect.fail("Should have thrown an error");
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toContain("Bad Among initialisation");
    }
  });

  it("throws an error when s parameter is invalid", () => {
    expect(() => new Among(null, 0, 1)).toThrow("Bad Among initialisation");
    expect(() => new Among(undefined, 0, 1)).toThrow("Bad Among initialisation");
    expect(() => new Among(123, 0, 1)).toThrow("Bad Among initialisation");
  });

  it("throws an error when substring_i parameter is invalid", () => {
    expect(() => new Among("test", null, 1)).toThrow("Bad Among initialisation");
    expect(() => new Among("test", undefined, 1)).toThrow("Bad Among initialisation");
    expect(() => new Among("test", "0", 1)).toThrow("Bad Among initialisation");
  });

  it("throws an error when result parameter is missing or falsy", () => {
    expect(() => new Among("test", 0, null)).toThrow("Bad Among initialisation");
    expect(() => new Among("test", 0, undefined)).toThrow("Bad Among initialisation");
    expect(() => new Among("test", 0, 0)).toThrow("Bad Among initialisation");
  });
});

describe("SnowballProgram slice_check validation", () => {
  const fs = require("fs");
  const path = require("path");
  const programCode = fs.readFileSync(
    path.join(__dirname, "../stemmer/src/SnowballProgram.js"),
    "utf8"
  );
  const SnowballProgram = new Function(programCode + "; return SnowballProgram;")();

  it("does not throw when slice state is valid", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("testing");
    expect(() => sbp.slice_check()).not.toThrow();
  });

  it("throws an Error when bra < 0", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("testing");
    sbp.bra = -1;
    expect(() => sbp.slice_check()).toThrow("faulty slice operation");
  });

  it("throws an Error when bra > ket", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("testing");
    sbp.bra = 5;
    sbp.ket = 3;
    expect(() => sbp.slice_check()).toThrow("faulty slice operation");
  });

  it("throws an Error when ket > limit", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("testing");
    sbp.ket = 10;
    expect(() => sbp.slice_check()).toThrow("faulty slice operation");
  });

  it("throws an Error when limit > current length", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("testing");
    sbp.limit = 20;
    expect(() => sbp.slice_check()).toThrow("faulty slice operation");
  });

  it("triggers slice_check in slice_from, slice_del, and slice_to on invalid state", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("testing");
    sbp.bra = -1;

    expect(() => sbp.slice_from("x")).toThrow("faulty slice operation");
    expect(() => sbp.slice_del()).toThrow("faulty slice operation");
    expect(() => sbp.slice_to()).toThrow("faulty slice operation");
  });

  it("performs slice_to correctly when state is valid", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("testing");
    sbp.bra = 0;
    sbp.ket = 4;
    expect(sbp.slice_to()).toBe("test");
  });
});

describe("SnowballProgram find_among and find_among_b direct unit tests", () => {
  const fs = require("fs");
  const path = require("path");
  const amongCode = fs.readFileSync(
    path.join(__dirname, "../stemmer/src/Among.js"),
    "utf8"
  );
  const programCode = fs.readFileSync(
    path.join(__dirname, "../stemmer/src/SnowballProgram.js"),
    "utf8"
  );
  const Among = new Function(amongCode + "; return Among;")();
  const SnowballProgram = new Function(programCode + "; return SnowballProgram;")();

  it("finds forward among entries correctly and updates cursor", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("testing");
    const v = [
      new Among("test", -1, 1),
      new Among("testing", -1, 2),
    ];
    // Binary search expects sorted amongs
    v.sort((a, b) => (a.s > b.s ? 1 : -1));

    const res = sbp.find_among(v, v.length);
    expect(res).toBe(2);
    expect(sbp.cursor).toBe(7);
  });

  it("finds backward among entries correctly and updates cursor", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("testing");
    sbp.cursor = 7;
    const v = [
      new Among("ing", -1, 1),
      new Among("ting", -1, 2),
    ];
    v.sort((a, b) => (a.s > b.s ? 1 : -1));

    const res = sbp.find_among_b(v, v.length);
    expect(res).toBe(2);
    expect(sbp.cursor).toBe(3);
  });

  it("executes method callback in find_among if defined", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("testing");
    let called = false;
    const method = () => {
      called = true;
      return true;
    };
    const v = [new Among("test", -1, 5, method)];

    const res = sbp.find_among(v, 1);
    expect(called).toBe(true);
    expect(res).toBe(5);
    expect(sbp.cursor).toBe(4);
  });

  it("returns 0 when no match is found", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("abc");
    const v = [new Among("xyz", -1, 1)];

    expect(sbp.find_among(v, 1)).toBe(0);
    expect(sbp.find_among_b(v, 1)).toBe(0);
  });
});

describe("SnowballProgram out_grouping direct unit tests", () => {
  const fs = require("fs");
  const path = require("path");
  const programCode = fs.readFileSync(
    path.join(__dirname, "../stemmer/src/SnowballProgram.js"),
    "utf8"
  );
  const SnowballProgram = new Function(programCode + "; return SnowballProgram;")();

  it("returns true and advances cursor when char < min", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("abc");
    const res = sbp.out_grouping([0xff], 98, 120);
    expect(res).toBe(true);
    expect(sbp.cursor).toBe(1);
  });

  it("returns true and advances cursor when char > max", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("z");
    const res = sbp.out_grouping([0xff], 97, 120);
    expect(res).toBe(true);
    expect(sbp.cursor).toBe(1);
  });

  it("returns true and advances cursor when char is in range [min, max] but not in grouping bit array", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("b");
    const res = sbp.out_grouping([0x01], 97, 100);
    expect(res).toBe(true);
    expect(sbp.cursor).toBe(1);
  });

  it("returns false and leaves cursor unchanged when char is in range [min, max] and is in grouping bit array", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("a");
    const res = sbp.out_grouping([0x01], 97, 100);
    expect(res).toBe(false);
    expect(sbp.cursor).toBe(0);
  });

  it("returns false and leaves cursor unchanged when cursor >= limit", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("a");
    sbp.cursor = 1;
    const res = sbp.out_grouping([0x00], 97, 100);
    expect(res).toBe(false);
    expect(sbp.cursor).toBe(1);
  });
});

describe("SnowballProgram eq_v_b direct unit tests", () => {
  const fs = require("fs");
  const path = require("path");
  const programCode = fs.readFileSync(
    path.join(__dirname, "../stemmer/src/SnowballProgram.js"),
    "utf8"
  );
  const SnowballProgram = new Function(programCode + "; return SnowballProgram;")();

  it("returns true and moves cursor backward when string matches backward", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("testing");
    sbp.cursor = 7;
    const result = sbp.eq_v_b("ing");
    expect(result).toBe(true);
    expect(sbp.cursor).toBe(4);
  });

  it("returns false and leaves cursor unchanged when string does not match backward", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("testing");
    sbp.cursor = 7;
    const result = sbp.eq_v_b("abc");
    expect(result).toBe(false);
    expect(sbp.cursor).toBe(7);
  });

  it("returns false when search string length exceeds available backward buffer limit", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("testing");
    sbp.cursor = 2;
    sbp.limit_backward = 0;
    const result = sbp.eq_v_b("test");
    expect(result).toBe(false);
    expect(sbp.cursor).toBe(2);
  });

  it("respects limit_backward boundary", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("testing");
    sbp.cursor = 7;
    sbp.limit_backward = 4;
    const result = sbp.eq_v_b("testing");
    expect(result).toBe(false);
    expect(sbp.cursor).toBe(7);
  });

  it("returns true and keeps cursor unchanged when search string is empty", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("testing");
    sbp.cursor = 4;
    const result = sbp.eq_v_b("");
    expect(result).toBe(true);
    expect(sbp.cursor).toBe(4);
  });

  it("delegates to eq_s_b with s.length and s", () => {
    const sbp = SnowballProgram();
    let passedLength = null;
    let passedString = null;
    sbp.eq_s_b = function(s_size, s) {
      passedLength = s_size;
      passedString = s;
      return true;
    };

    const target = "test_string";
    const result = sbp.eq_v_b(target);

    expect(passedLength).toBe(target.length);
    expect(passedString).toBe(target);
    expect(result).toBe(true);
  });
});

describe("SnowballProgram in_grouping_b direct unit tests", () => {
  const fs = require("fs");
  const path = require("path");
  const programCode = fs.readFileSync(
    path.join(__dirname, "../stemmer/src/SnowballProgram.js"),
    "utf8"
  );
  const SnowballProgram = new Function(programCode + "; return SnowballProgram;")();

  it("returns false and leaves cursor unchanged when cursor <= limit_backward", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("abc");
    sbp.cursor = 0;
    sbp.limit_backward = 0;
    const res = sbp.in_grouping_b([0xff], 97, 120);
    expect(res).toBe(false);
    expect(sbp.cursor).toBe(0);
  });

  it("returns false and leaves cursor unchanged when char at cursor - 1 < min", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("abc");
    sbp.cursor = 1;
    const res = sbp.in_grouping_b([0xff], 98, 120);
    expect(res).toBe(false);
    expect(sbp.cursor).toBe(1);
  });

  it("returns false and leaves cursor unchanged when char at cursor - 1 > max", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("z");
    sbp.cursor = 1;
    const res = sbp.in_grouping_b([0xff], 97, 120);
    expect(res).toBe(false);
    expect(sbp.cursor).toBe(1);
  });

  it("returns false and leaves cursor unchanged when char is in range [min, max] but bit is not set", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("b");
    sbp.cursor = 1;
    const res = sbp.in_grouping_b([0x01], 97, 100);
    expect(res).toBe(false);
    expect(sbp.cursor).toBe(1);
  });

  it("returns true and decrements cursor when char is in range [min, max] and bit is set", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("a");
    sbp.cursor = 1;
    const res = sbp.in_grouping_b([0x01], 97, 100);
    expect(res).toBe(true);
    expect(sbp.cursor).toBe(0);
  });

  it("respects custom limit_backward boundary", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("abc");
    sbp.cursor = 1;
    sbp.limit_backward = 1;
    const res = sbp.in_grouping_b([0xff], 97, 120);
    expect(res).toBe(false);
    expect(sbp.cursor).toBe(1);
  });
});


describe("SnowballProgram insert direct unit tests", () => {
  const fs = require("fs");
  const path = require("path");
  const programCode = fs.readFileSync(
    path.join(__dirname, "../stemmer/src/SnowballProgram.js"),
    "utf8"
  );
  const SnowballProgram = new Function(programCode + "; return SnowballProgram;")();

  it("updates bra, ket, limit, cursor, and current when c_bra <= bra", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("cat");
    sbp.bra = 1;
    sbp.ket = 3;
    sbp.cursor = 2;

    sbp.insert(0, 0, "super");

    expect(sbp.getCurrent()).toBe("supercat");
    expect(sbp.bra).toBe(6);
    expect(sbp.ket).toBe(8);
    expect(sbp.limit).toBe(8);
    expect(sbp.cursor).toBe(7);
  });

  it("updates bra and ket when c_bra is equal to bra", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("cat");
    sbp.bra = 1;
    sbp.ket = 3;
    sbp.cursor = 2;

    sbp.insert(1, 1, "X");

    expect(sbp.getCurrent()).toBe("cXat");
    expect(sbp.bra).toBe(2);
    expect(sbp.ket).toBe(4);
    expect(sbp.limit).toBe(4);
    expect(sbp.cursor).toBe(3);
  });

  it("keeps bra unchanged and updates ket, cursor, limit, and current when bra < c_bra <= ket", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("testing");
    sbp.bra = 0;
    sbp.ket = 7;
    sbp.cursor = 4;

    sbp.insert(2, 2, "123");

    expect(sbp.getCurrent()).toBe("te123sting");
    expect(sbp.bra).toBe(0);
    expect(sbp.ket).toBe(10);
    expect(sbp.limit).toBe(10);
    expect(sbp.cursor).toBe(7);
  });

  it("keeps bra and ket unchanged when c_bra > ket", () => {
    const sbp = SnowballProgram();
    sbp.setCurrent("testing");
    sbp.bra = 0;
    sbp.ket = 4;
    sbp.cursor = 2;

    sbp.insert(5, 5, "XYZ");

    expect(sbp.getCurrent()).toBe("testiXYZng");
    expect(sbp.bra).toBe(0);
    expect(sbp.ket).toBe(4);
    expect(sbp.limit).toBe(10);
    expect(sbp.cursor).toBe(2);
  });

  it("handles range replacement via insert with positive, zero, and negative adjustments", () => {
    const sbp1 = SnowballProgram();
    sbp1.setCurrent("abcdef");
    sbp1.bra = 1;
    sbp1.ket = 5;
    sbp1.cursor = 3;
    sbp1.insert(1, 3, "12345");
    expect(sbp1.getCurrent()).toBe("a12345def");
    expect(sbp1.bra).toBe(4);
    expect(sbp1.ket).toBe(8);

    const sbp2 = SnowballProgram();
    sbp2.setCurrent("abcdef");
    sbp2.bra = 1;
    sbp2.ket = 5;
    sbp2.cursor = 3;
    sbp2.insert(1, 4, "XYZ");
    expect(sbp2.getCurrent()).toBe("aXYZef");
    expect(sbp2.bra).toBe(1);
    expect(sbp2.ket).toBe(5);

    const sbp3 = SnowballProgram();
    sbp3.setCurrent("abcdef");
    sbp3.bra = 1;
    sbp3.ket = 5;
    sbp3.cursor = 3;
    sbp3.insert(1, 4, "X");
    expect(sbp3.getCurrent()).toBe("aXef");
    expect(sbp3.bra).toBe(-1);
    expect(sbp3.ket).toBe(3);
  });
});
