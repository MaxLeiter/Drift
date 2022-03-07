"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeBulkRestore = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function BeforeBulkRestore(...args) {
    return (0, hooks_service_1.implementHookDecorator)('beforeBulkRestore', args);
}
exports.BeforeBulkRestore = BeforeBulkRestore;
//# sourceMappingURL=before-bulk-restore.js.map