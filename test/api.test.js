const Snowball = require("../dist/Snowball");

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
});
