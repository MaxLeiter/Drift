"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
const model_service_1 = require("../model/shared/model-service");
const Validator = (target, propertyName, descriptor) => {
    (0, model_service_1.addOptions)(target, {
        validate: {
            [propertyName]: descriptor.value,
        },
    });
};
exports.Validator = Validator;
//# sourceMappingURL=validator.js.map