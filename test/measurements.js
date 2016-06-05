var measurements = require("../measurements");

exports.units = function(test) {
    test.equal(measurements.getUnit(3, "dry").unit, "gram");
    test.equal(measurements.getUnit(1, "dry").unit, "gram");
    test.equal(measurements.getUnit(5, "dry").unit, "tsp");
    test.equal(measurements.getUnit(9, "dry").unit, "tsp");
    test.equal(measurements.getUnit(110, "dry").unit, "cup");
    test.equal(measurements.getUnit(200, "dry").unit, "ounce");
    test.equal(measurements.getUnit(216, "dry").unit, "cup");
    test.equal(measurements.getUnit(1666, "dry").unit, "cup");
    test.equal(measurements.getUnit(1666, "volume").unit, "liter");
    test.throws(function () { measurements.getUnit(-15, "volume");}, Error);
    test.done();
}

exports.plurality = function(test) {
    test.equal(measurements.pluralize("gram", 1, "dry"), "a gram");
    test.equal(measurements.pluralize("ounce", 10, "dry"), "10 ounces");
    test.equal(measurements.pluralize("tsp", 0.25, "dry"), "1/4 of a tsp");
    test.equal(measurements.pluralize("cup", 1.5, "dry"), "1 1/2 cups");
    test.throws(function () { measurements.pluralize("ounce", -1, "volume");}, Error);
    test.done();
}

exports.division = function(test) {
    test.equal(measurements.division("tsp", 0.25, "volume"), "1/4");
    test.equal(measurements.division("tsp", 1.25, "volume"), "1 1/4");
    test.equal(measurements.division("tsp", 1.5, "volume"), "1 1/2");
    test.throws(function () { measurements.division("tsp", 0.3, "dry");}, Error);
    test.throws(function () { measurements.division("tbsp", 0.25, "volume");}, Error);
    test.throws(function () { measurements.division("ounce", 1.5, "volume");}, Error);
    test.done();
}

exports.approximation = function(test) {
    test.ok(measurements.approximate(214, 226.8, 0.5));
    test.ok(!measurements.approximate(200, 226.8, 0.5));
    test.ok(measurements.approximate(214, 226.8, 0.5));
    test.ok(measurements.approximate(1.2, 5, 0.25));
    test.done();
}

exports.generate = function(test) {
    test.equal(measurements.generate(200, "dry"), "7 ounces");
    test.equal(measurements.generate(220, "dry"), "a cup");
    test.equal(measurements.generate(110, "dry"), "1/2 of a cup");
    test.equal(measurements.generate(29, "dry"), "an ounce");
    test.equal(measurements.generate(666, "weight"), "1 1/2 pounds");
    test.equal(measurements.generate(1337, "weight"), "3 pounds");
    test.equal(measurements.generate(1.2, "volume"), "1/4 of a tsp");
    test.equal(measurements.generate(6.3, "volume"), "1 1/4 tsps");
    test.throws(function () { measurements.generate(-420, "volume")}, Error);
    test.throws(function () { measurements.generate(0, "volume")}, Error);
    test.throws(function () { measurements.generate("many", "volume")}, Error);
    test.done();
}
