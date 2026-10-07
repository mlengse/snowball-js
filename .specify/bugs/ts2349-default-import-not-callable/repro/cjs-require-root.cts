// Expected to FAIL under the reported defect: `import = require` should be callable.
import Snowball = require("@mlengse/snowball-js");

export const stemmer = Snowball("english");
