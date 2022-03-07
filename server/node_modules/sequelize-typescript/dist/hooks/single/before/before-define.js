"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeDefine = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function BeforeDefine(...args) {
    return (0, hooks_service_1.implementHookDecorator)('beforeDefine', args);
}
exports.BeforeDefine = BeforeDefine;
//# sourceMappingURL=before-define.js.map