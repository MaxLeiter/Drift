"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfterBulkRestore = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function AfterBulkRestore(...args) {
    return (0, hooks_service_1.implementHookDecorator)('afterBulkRestore', args);
}
exports.AfterBulkRestore = AfterBulkRestore;
//# sourceMappingURL=after-bulk-restore.js.map