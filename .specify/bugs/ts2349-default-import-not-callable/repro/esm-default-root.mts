// Expected to FAIL under the reported defect: ESM default import should be callable.
import Snowball from "@mlengse/snowball-js";

export const stemmer = Snowball("english");
