"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfterDefine = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function AfterDefine(...args) {
    return (0, hooks_service_1.implementHookDecorator)('afterDefine', args);
}
exports.AfterDefine = AfterDefine;
//# sourceMappingURL=after-define.js.map