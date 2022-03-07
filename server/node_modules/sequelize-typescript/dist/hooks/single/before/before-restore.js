"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeRestore = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function BeforeRestore(...args) {
    return (0, hooks_service_1.implementHookDecorator)('beforeRestore', args);
}
exports.BeforeRestore = BeforeRestore;
//# sourceMappingURL=before-restore.js.map