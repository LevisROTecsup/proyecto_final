const allowTrueExpressions = ["true", true, "1", 1, "si"]

function parseToBool(value) {
  let isBool = false;

  if (allowTrueExpressions.includes(value)) {
    isBool = true;
  }

  return isBool;
}

module.exports = parseToBool;