"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrimaryKey = void 0;
const attribute_service_1 = require("../attribute-service");
/**
 * Sets primary key option true for annotated property.
 */
function PrimaryKey(target, propertyName) {
    (0, attribute_service_1.addAttributeOptions)(target, propertyName, {
        primaryKey: true,
    });
}
exports.PrimaryKey = PrimaryKey;
//# sourceMappingURL=primary-key.js.map