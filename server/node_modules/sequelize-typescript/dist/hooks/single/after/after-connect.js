"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfterConnect = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function AfterConnect(...args) {
    return (0, hooks_service_1.implementHookDecorator)('afterConnect', args);
}
exports.AfterConnect = AfterConnect;
//# sourceMappingURL=after-connect.js.map