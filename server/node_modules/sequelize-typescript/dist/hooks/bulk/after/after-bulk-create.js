"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfterBulkCreate = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function AfterBulkCreate(...args) {
    return (0, hooks_service_1.implementHookDecorator)('afterBulkCreate', args);
}
exports.AfterBulkCreate = AfterBulkCreate;
//# sourceMappingURL=after-bulk-create.js.map