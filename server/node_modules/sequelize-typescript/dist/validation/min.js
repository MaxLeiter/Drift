"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Min = void 0;
const attribute_service_1 = require("../model/column/attribute-service");
/**
 * Only allow values >= limit
 */
function Min(limit) {
    return (target, propertyName) => (0, attribute_service_1.addAttributeOptions)(target, propertyName, {
        validate: {
            min: limit,
        },
    });
}
exports.Min = Min;
//# sourceMappingURL=min.js.map