"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsBefore = void 0;
const attribute_service_1 = require("../model/column/attribute-service");
/**
 * Only allow date strings before a specific date
 */
function IsBefore(date) {
    return (target, propertyName) => (0, attribute_service_1.addAttributeOptions)(target, propertyName, {
        validate: {
            isBefore: date,
        },
    });
}
exports.IsBefore = IsBefore;
//# sourceMappingURL=is-before.js.map