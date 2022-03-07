"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeBulkCreate = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function BeforeBulkCreate(...args) {
    return (0, hooks_service_1.implementHookDecorator)('beforeBulkCreate', args);
}
exports.BeforeBulkCreate = BeforeBulkCreate;
//# sourceMappingURL=before-bulk-create.js.map