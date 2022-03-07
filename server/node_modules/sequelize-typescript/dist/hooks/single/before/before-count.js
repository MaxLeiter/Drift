"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeCount = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function BeforeCount(...args) {
    return (0, hooks_service_1.implementHookDecorator)('beforeCount', args);
}
exports.BeforeCount = BeforeCount;
//# sourceMappingURL=before-count.js.map