"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeSync = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function BeforeSync(...args) {
    return (0, hooks_service_1.implementHookDecorator)('beforeSync', args);
}
exports.BeforeSync = BeforeSync;
//# sourceMappingURL=before-sync.js.map