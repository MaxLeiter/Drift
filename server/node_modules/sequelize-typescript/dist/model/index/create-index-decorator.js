"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIndexDecorator = void 0;
const index_service_1 = require("./index-service");
function createIndexDecorator(options = {}) {
    let indexId;
    return ((...args) => {
        if (args.length >= 2) {
            const [target, propertyName] = args;
            const fieldOptions = { name: propertyName };
            indexId = (0, index_service_1.addFieldToIndex)(target, fieldOptions, options, indexId);
            return;
        }
        return (target, propertyName) => {
            const fieldOptions = Object.assign({ name: propertyName }, args[0]);
            indexId = (0, index_service_1.addFieldToIndex)(target, fieldOptions, options, indexId);
        };
    });
}
exports.createIndexDecorator = createIndexDecorator;
//# sourceMappingURL=create-index-decorator.js.map