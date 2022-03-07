"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForeignKey = void 0;
const foreign_key_service_1 = require("./foreign-key-service");
function ForeignKey(relatedClassGetter) {
    return (target, propertyName) => {
        (0, foreign_key_service_1.addForeignKey)(target, relatedClassGetter, propertyName);
    };
}
exports.ForeignKey = ForeignKey;
//# sourceMappingURL=foreign-key.js.map