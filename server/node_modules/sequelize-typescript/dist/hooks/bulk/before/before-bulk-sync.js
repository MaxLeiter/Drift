"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeBulkSync = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function BeforeBulkSync(...args) {
    return (0, hooks_service_1.implementHookDecorator)('beforeBulkSync', args);
}
exports.BeforeBulkSync = BeforeBulkSync;
//# sourceMappingURL=before-bulk-sync.js.map