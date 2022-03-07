"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsNull = void 0;
const attribute_service_1 = require("../model/column/attribute-service");
/**
 * Only allows null
 */
function IsNull(target, propertyName) {
    (0, attribute_service_1.addAttributeOptions)(target, propertyName, {
        validate: {
            isNull: true,
        },
    });
}
exports.IsNull = IsNull;
//# sourceMappingURL=is-null.js.map