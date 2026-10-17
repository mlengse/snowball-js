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
