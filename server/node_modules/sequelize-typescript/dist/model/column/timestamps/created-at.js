"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatedAt = void 0;
const model_service_1 = require("../../shared/model-service");
function CreatedAt(target, propertyName) {
    (0, model_service_1.addOptions)(target, {
        createdAt: propertyName,
        timestamps: true,
    });
}
exports.CreatedAt = CreatedAt;
//# sourceMappingURL=created-at.js.map