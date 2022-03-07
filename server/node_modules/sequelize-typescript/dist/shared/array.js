"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueFilter = exports.unique = void 0;
/**
 * Removes duplicates from specified array
 */
function unique(arr) {
    return arr.filter(exports.uniqueFilter);
}
exports.unique = unique;
/**
 * Returns true for items, that only exists once on an array
 */
const uniqueFilter = (item, index, arr) => arr.indexOf(item) === index;
exports.uniqueFilter = uniqueFilter;
//# sourceMappingURL=array.js.map