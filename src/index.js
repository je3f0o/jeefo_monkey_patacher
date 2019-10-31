/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-07-03
* Updated at  : 2019-09-13
* Author      : jeefo
* Purpose     :
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const to_string = function () {
    return Function.prototype.toString.toString();
};
to_string.toString = to_string;

class MonkeyPatcher {
    constructor (object, method_name, patcher) {
        const self            = this;
        const original_method = object[method_name];

        const _patcher = function () {
            return patcher.call(self, original_method, this, arguments);
        };

        const toString = function () {
            return original_method.toString();
        };

        toString.toString = to_string;
        _patcher.toString = toString;

        object[method_name] = _patcher;
    }

    patch (fn) {
        const self = this;
        return function () {
			return self.run(fn, this, arguments);
        };
    }

	run (fn, context, args) {
        let result;
		try {
			this.on_enter();
			result = fn.apply(context, args);
		} catch (e) {
			this.on_error(e);
		} finally {
			this.on_leave();
            return result;
		}
	}

    on_enter () {}
    on_error () {}
    on_leave () {}
}

module.exports = MonkeyPatcher;
