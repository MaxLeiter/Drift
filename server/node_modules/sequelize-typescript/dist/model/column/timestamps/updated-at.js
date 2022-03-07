"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatedAt = void 0;
const model_service_1 = require("../../shared/model-service");
function UpdatedAt(target, propertyName) {
    (0, model_service_1.addOptions)(target, {
        updatedAt: propertyName,
        timestamps: true,
    });
}
exports.UpdatedAt = UpdatedAt;
//# sourceMappingURL=updated-at.js.map