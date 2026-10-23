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
