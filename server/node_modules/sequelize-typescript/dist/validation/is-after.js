"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsAfter = void 0;
const attribute_service_1 = require("../model/column/attribute-service");
/**
 * Only allow date strings after a specific date
 */
function IsAfter(date) {
    return (target, propertyName) => (0, attribute_service_1.addAttributeOptions)(target, propertyName, {
        validate: {
            isAfter: date,
        },
    });
}
exports.IsAfter = IsAfter;
//# sourceMappingURL=is-after.js.map