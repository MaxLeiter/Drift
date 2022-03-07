"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowNull = void 0;
const attribute_service_1 = require("../attribute-service");
function AllowNull(...args) {
    if (args.length === 1) {
        const allowNull = args[0];
        return (target, propertyName) => (0, attribute_service_1.addAttributeOptions)(target, propertyName, { allowNull });
    }
    else {
        const target = args[0];
        const propertyName = args[1];
        (0, attribute_service_1.addAttributeOptions)(target, propertyName, {
            allowNull: true,
        });
    }
}
exports.AllowNull = AllowNull;
//# sourceMappingURL=allow-null.js.map