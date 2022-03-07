"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeCreate = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function BeforeCreate(...args) {
    return (0, hooks_service_1.implementHookDecorator)('beforeCreate', args);
}
exports.BeforeCreate = BeforeCreate;
//# sourceMappingURL=before-create.js.map