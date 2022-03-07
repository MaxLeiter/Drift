"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unique = void 0;
const attribute_service_1 = require("../attribute-service");
function Unique(...args) {
    if (args.length === 1) {
        const [options] = args;
        return (_target, _propertyName) => {
            annotate(_target, _propertyName, options);
        };
    }
    const [target, propertyName] = args;
    annotate(target, propertyName);
}
exports.Unique = Unique;
function annotate(target, propertyName, option = true) {
    (0, attribute_service_1.addAttributeOptions)(target, propertyName, {
        unique: option,
    });
}
//# sourceMappingURL=unique.js.map