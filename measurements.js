var dryUnits = [
  {unit: "gram", minimum: 1, divisible: 1},
  {unit: "tsp", minimum: 0, divisible: 0.25},
  {unit: "tbsp", minimum: 1, divisible: 0.5},
  {unit: "ounce", minimum: 1, divisible: 1},
  {unit: "cup", minimum: 1, divisible: 0.5}
];

var weightUnits = [
  {unit: "gram", minimum: 1, divisible: 1},
  {unit: "tsp", minimum: 0, divisible: 0.25},
  {unit: "tbsp", minimum: 1, divisible: 0.5},
  {unit: "ounce", minimum: 0.25, divisible: 0.25},
  {unit: "pound", minimum: 1, divisible: 0.25}
];

var liquidUnits = [
  {unit: "tsp", minimum: 0, divisible: 0.25},
  {unit: "tbsp", minimum: 1, divisible: 0.5},
  {unit: "ounce", minimum: 1, divisible: 1},
  {unit: "cup", minimum: 1, divisible: 0.5},
  {unit: "liter", minimum: 1, divisible: 0.5},
  {unit: "gallon", minimum: 1, divisible: 1}
];

// Here are the grams/unit
var rates = {
  "gram": 1,
  "tsp": 5,
  "tbsp": 15,
  "ounce": 28.35,
  "cup": 226.8,
  "pound": 453.6,
  "liter": 1000,
  "gallon": 3520
};


function getKind(kind)
{
    switch (kind) {
    case "dry": return dryUnits;
    case "weight": return weightUnits;
    case "volume": return liquidUnits;
    }
    throw new Error("Unexpected units kind: " + kind);
}


function division(unit, qty, kind)
{
    var divisible = null;
    var formatDivision = function(qty, divis) {
        if (0 != qty / divis % 1) {
            throw new Error("Unexpected fraction: " + qty + " " + unit + " can be divided by " + divis);
        }
        if (0 == (qty / divis) % 2 && 0 == (1 / divis) % 2) {
            divis = divis * 2;
        }
        return qty / divis + "/" + 1 / divis;
    };
    getKind(kind).forEach(function(measure) {
        if (measure.unit == unit) {
            divisible = measure.divisible;
        }
    });
    if (1 > qty) {
        return formatDivision(qty, divisible);
    }
    if (1 < qty) {
        rem = qty % 1;
        return (qty - rem) + " " + formatDivision(rem, divisible);
    }
}

function pluralize(unit, qty, kind)
{
    var article = ("ounce" == unit) ? "an" : "a";
    if (qty < 1 && 0 < qty) {
        return division(unit, qty, kind) + " of " + article + " " + unit;
    }
    if (1 == qty) {
        return article + " " +  unit;
    }
    if (1 < qty && 0 != qty % 1) {
        return division(unit, qty, kind) + " " + unit + "s";
    }
    if (1 < qty && 0 == qty % 1) {
        return qty + " " + unit + "s";
    }
    throw new Error("Unexpected qty");
}

function generate(qty, kind)
{
    var unit = getUnit(qty, kind);
    var unitQty = round(qty / rates[unit.unit], unit);
    return pluralize(unit.unit, unitQty, kind);
}

function round(qty, unit)
{
    divisible = unit.divisible;
    quot = qty - qty % 1;
    rem = qty % 1;
    roundedRem = Math.round(rem / divisible) * divisible;
    return quot + roundedRem;
}


function approximate(qty, test, divisible)
{
    if (1 == divisible) {
        var divisors = [1];
    } else {
        var divisors = (0.25 == divisible) ? [1, 0.25, 0.5, 0.75] : [1, 0.5];
    }
    var approximation = null;
    divisors.forEach(function (divisor) {
        var proportion = test * divisor / qty;
        if (proportion <= 1.1 && proportion >= 0.9) {
            approximation = test * divisor;
        }
    });
    return approximation;
}


function getUnit (qty, kind)
{
    var measure = null;
    getKind(kind).forEach(function(unit) {
        var rate = rates[unit.unit];
        var approximation = approximate(qty, rate, unit.divisible);
        if (approximation && rate / approximation >= unit.minimum) {
            measure = unit;
        } else { if (qty >= rate) {
            measure = unit;
        }}
    });
    if (measure) {
        return measure;
    }
    throw new Error("Unexpected qty");
}

exports.pluralize = pluralize;
exports.getUnit = getUnit;
exports.division = division;
exports.approximate = approximate;
exports.generate = generate;
