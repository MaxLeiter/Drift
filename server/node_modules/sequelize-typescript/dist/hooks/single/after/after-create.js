"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfterCreate = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function AfterCreate(...args) {
    return (0, hooks_service_1.implementHookDecorator)('afterCreate', args);
}
exports.AfterCreate = AfterCreate;
//# sourceMappingURL=after-create.js.map