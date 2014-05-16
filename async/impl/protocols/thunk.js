﻿var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CPSProtocol = require('./cps');

var ThunkProtocol = (function (_super) {
    __extends(ThunkProtocol, _super);
    function ThunkProtocol(options) {
        _super.call(this);
    }
    ThunkProtocol.prototype.options = function (value) {
        return { constructor: this.constructor, acceptsCallback: false };
    };

    ThunkProtocol.prototype.invoke = function (func, this_, args) {
        var _this = this;
        return function (callback) {
            args.push(callback || nullFunc);
            _super.prototype.invoke.call(_this, func, this_, args);
        };
    };
    return ThunkProtocol;
})(CPSProtocol);

function nullFunc() {
}
module.exports = ThunkProtocol;
//# sourceMappingURL=thunk.js.map
