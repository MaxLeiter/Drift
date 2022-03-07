"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfterFind = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function AfterFind(...args) {
    return (0, hooks_service_1.implementHookDecorator)('afterFind', args);
}
exports.AfterFind = AfterFind;
//# sourceMappingURL=after-find.js.map