"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPropertyNames = exports.cloneRegExp = exports.deepAssign = void 0;
function deepAssign(target, ...sources) {
    sources.forEach((source) => {
        Object.getOwnPropertyNames(source).forEach((key) => assign(key, target, source));
        /* istanbul ignore next */
        if (Object.getOwnPropertySymbols) {
            Object.getOwnPropertySymbols(source).forEach((key) => assign(key, target, source));
        }
    });
    return target;
    function assign(key, _target, _source) {
        const sourceValue = _source[key];
        if (sourceValue !== void 0) {
            let targetValue = _target[key];
            if (Array.isArray(sourceValue)) {
                if (!Array.isArray(targetValue)) {
                    targetValue = [];
                }
                const length = targetValue.length;
                sourceValue.forEach((_, index) => assign(length + index, targetValue, sourceValue));
            }
            else if (typeof sourceValue === 'object') {
                if (sourceValue instanceof RegExp) {
                    targetValue = cloneRegExp(sourceValue);
                }
                else if (sourceValue instanceof Date) {
                    targetValue = new Date(sourceValue);
                }
                else if (sourceValue === null) {
                    targetValue = null;
                }
                else {
                    if (!targetValue) {
                        targetValue = Object.create(sourceValue.constructor.prototype);
                    }
                    deepAssign(targetValue, sourceValue);
                }
            }
            else {
                targetValue = sourceValue;
            }
            _target[key] = targetValue;
        }
    }
}
exports.deepAssign = deepAssign;
/**
 * I clone the given RegExp object, and ensure that the given flags exist on
 * the clone. The injectFlags parameter is purely additive - it cannot remove
 * flags that already exist on the
 *
 * @param input RegExp - I am the regular expression object being cloned.
 * @param injectFlags String( Optional ) - I am the flags to enforce on the clone.
 * @source https://www.bennadel.com/blog/2664-cloning-regexp-regular-expression-objects-in-javascript.htm
 */
function cloneRegExp(input, injectFlags) {
    const pattern = input.source;
    let flags = '';
    // Make sure the parameter is a defined string - it will make the conditional
    // logic easier to read.
    injectFlags = injectFlags || '';
    // Test for global.
    if (input.global || /g/i.test(injectFlags)) {
        flags += 'g';
    }
    // Test for ignoreCase.
    if (input.ignoreCase || /i/i.test(injectFlags)) {
        flags += 'i';
    }
    // Test for multiline.
    if (input.multiline || /m/i.test(injectFlags)) {
        flags += 'm';
    }
    // Return a clone with the additive flags.
    return new RegExp(pattern, flags);
}
exports.cloneRegExp = cloneRegExp;
function getAllPropertyNames(obj) {
    const names = [];
    const exists = {};
    do {
        // eslint-disable-next-line prefer-spread
        names.push.apply(names, Object.getOwnPropertyNames(obj));
        obj = Object.getPrototypeOf(obj);
    } while (obj !== Object.prototype);
    return names.filter((name) => {
        const isValid = !exists[name] && name !== 'constructor';
        exists[name] = true;
        return isValid;
    });
}
exports.getAllPropertyNames = getAllPropertyNames;
//# sourceMappingURL=object.js.map