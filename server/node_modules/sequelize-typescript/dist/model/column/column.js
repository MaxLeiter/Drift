"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Column = void 0;
const attribute_service_1 = require("./attribute-service");
const data_type_service_1 = require("../../sequelize/data-type/data-type-service");
const model_service_1 = require("../shared/model-service");
function Column(...args) {
    // In case of no specified options, we infer the
    // sequelize data type by the type of the property
    if (args.length >= 2) {
        const target = args[0];
        const propertyName = args[1];
        const propertyDescriptor = args[2];
        annotate(target, propertyName, propertyDescriptor);
        return;
    }
    return (target, propertyName, propertyDescriptor) => {
        annotate(target, propertyName, propertyDescriptor !== null && propertyDescriptor !== void 0 ? propertyDescriptor : Object.getOwnPropertyDescriptor(target, propertyName), args[0]);
    };
}
exports.Column = Column;
function annotate(target, propertyName, propertyDescriptor, optionsOrDataType = {}) {
    let options;
    if ((0, data_type_service_1.isDataType)(optionsOrDataType)) {
        options = {
            type: optionsOrDataType,
        };
    }
    else {
        options = Object.assign({}, optionsOrDataType);
        if (!options.type) {
            options.type = (0, model_service_1.getSequelizeTypeByDesignType)(target, propertyName);
        }
    }
    if (propertyDescriptor) {
        if (propertyDescriptor.get) {
            options.get = propertyDescriptor.get;
        }
        if (propertyDescriptor.set) {
            options.set = propertyDescriptor.set;
        }
    }
    (0, attribute_service_1.addAttribute)(target, propertyName, options);
}
//# sourceMappingURL=column.js.map