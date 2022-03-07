"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfterRestore = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function AfterRestore(...args) {
    return (0, hooks_service_1.implementHookDecorator)('afterRestore', args);
}
exports.AfterRestore = AfterRestore;
//# sourceMappingURL=after-restore.js.map