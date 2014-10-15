/**
    Helper functions for testing
*/
var grape = require('grape');

module.exports = function isAbout(t, actual, expected, message) {

    var precision = 20;

    var ok = Math.abs(expected - actual) < precision;

    if (!ok) {
       message = (message || "") + " Expected " + actual + " to be close to " + expected + " (Difference: " + (actual - expected) + ", Precision: " + precision + ")";
    }

    t._assert({
        ok: ok,
        message : message,
        operator : 'closeTo',
        expected : expected,
        actual : actual
      });
};