// PROTOTYPE test (not applied to source). CJS consumers reach the types via the merged namespace.
import Snowball = require("@mlengse/snowball-js");

export const stemmer: Snowball.Stemmer = Snowball("english");
export const language: Snowball.Language = "german";
