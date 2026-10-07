// Control: named import was fixed by 1.0.2 and must PASS. Proves declarations are real,
// not degraded to `any` (otherwise the failing cells below would be meaningless).
import { Snowball } from "@mlengse/snowball-js";

export const stemmer = Snowball("english");

// @ts-expect-error - bogus member must not exist on Stemmer
export const control = stemmer.bogusMethod();
