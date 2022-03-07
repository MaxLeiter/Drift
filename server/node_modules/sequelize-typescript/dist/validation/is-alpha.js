"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsAlpha = void 0;
const attribute_service_1 = require("../model/column/attribute-service");
/**
 * Will only allow letters
 */
function IsAlpha(target, propertyName) {
    (0, attribute_service_1.addAttributeOptions)(target, propertyName, {
        validate: {
            isAlpha: true,
        },
    });
}
exports.IsAlpha = IsAlpha;
//# sourceMappingURL=is-alpha.js.map