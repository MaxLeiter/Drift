"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeBulkDestroy = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function BeforeBulkDestroy(...args) {
    return (0, hooks_service_1.implementHookDecorator)('beforeBulkDestroy', args);
}
exports.BeforeBulkDestroy = BeforeBulkDestroy;
//# sourceMappingURL=before-bulk-destroy.js.map