"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// --------------------------------------------------
// IMPORT MODULES
// --------------------------------------------------
var fs = require('fs'); // --------------------------------------------------
// DEFINE CLASS
// --------------------------------------------------


var Neauxp =
/*#__PURE__*/
function () {
  _createClass(Neauxp, null, [{
    key: "MESSAGES",
    get: function get() {
      return {
        ERROR: {
          INVALID_FILES: 'Whoops, please ensure that the `run()` method is invoked with an array of file paths.',
          INVALID_OPTS: 'Whoops, please ensure that Neauxp is invoked with a valid options object.',
          INVALID_PATTERNS: 'Whoops, please ensure that Neauxp includes a valid `patterns` object.'
        },
        RESPONSE: {
          HAS_MATCHES: 'Whoops, please review and address the following violations.',
          NO_MATCHES: 'Yay, no violations found!'
        }
      };
    }
  }]);

  function Neauxp(options) {
    _classCallCheck(this, Neauxp);

    if (!options || _typeof(options) !== 'object') {
      throw new Error(Neauxp.MESSAGES.ERROR.INVALID_OPTS);
    }

    this.settings = Object.assign({}, options);
  }

  _createClass(Neauxp, [{
    key: "run",
    value: function run() {
      var _this = this;

      var files = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var output = {};
      return new Promise(function (resolve, reject) {
        if (!_this.settings.patterns || _typeof(_this.settings.patterns) !== 'object' || !Object.keys(_this.settings.patterns).length) {
          reject(Neauxp.MESSAGES.ERROR.INVALID_PATTERNS);
          return;
        }

        if (!Array.isArray(files) || !files.length) {
          reject(Neauxp.MESSAGES.ERROR.INVALID_FILES);
          return;
        }

        files.filter(function (fileName) {
          return fs.lstatSync(fileName).isFile();
        }).forEach(function (fileName) {
          var patterns = Object.keys(_this.settings.patterns).filter(function (key) {
            return fileName.match(key);
          }).map(function (key) {
            return _this.settings.patterns[key];
          }).reduce(function (acc, arr) {
            return _toConsumableArray(acc).concat(_toConsumableArray(arr));
          }, []);
          var content = fs.readFileSync("".concat(process.cwd(), "/").concat(fileName), {
            encoding: 'utf-8'
          });
          var matches = patterns.map(function (pattern) {
            return content.match(pattern);
          }).filter(function (match) {
            return !!match;
          }).reduce(function (acc, arr) {
            return _toConsumableArray(acc).concat(_toConsumableArray(arr));
          }, []);
          output = _objectSpread({}, output, matches && matches.length ? _defineProperty({}, fileName, matches) : {});
        });
        Object.keys(output).length ? resolve({
          matches: output,
          msg: Neauxp.MESSAGES.RESPONSE.HAS_MATCHES
        }) : resolve({
          matches: null,
          msg: Neauxp.MESSAGES.RESPONSE.NO_MATCHES
        });
      });
    }
  }]);

  return Neauxp;
}(); // --------------------------------------------------
// PUBLIC API
// --------------------------------------------------


module.exports = Neauxp;
