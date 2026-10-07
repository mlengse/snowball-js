// Expected to FAIL under the reported defect: per-language ESM default import should be callable.
import EnglishStemmer from "@mlengse/snowball-js/english";

export const stemmer = EnglishStemmer();
