"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveModelGetter = exports.getSequelizeTypeByDesignType = exports.addOptions = exports.setOptions = exports.getOptions = exports.getModelName = exports.setModelName = void 0;
const model_1 = require("../model/model");
const data_type_service_1 = require("../../sequelize/data-type/data-type-service");
const MODEL_NAME_KEY = 'sequelize:modelName';
const OPTIONS_KEY = 'sequelize:options';
/**
 * Sets model name from class by storing this
 * information through reflect metadata
 */
function setModelName(target, modelName) {
    Reflect.defineMetadata(MODEL_NAME_KEY, modelName, target);
}
exports.setModelName = setModelName;
/**
 * Returns model name from class by restoring this
 * information from reflect metadata
 */
function getModelName(target) {
    return Reflect.getMetadata(MODEL_NAME_KEY, target);
}
exports.getModelName = getModelName;
/**
 * Returns sequelize define options from class prototype
 * by restoring this information from reflect metadata
 */
function getOptions(target) {
    const options = Reflect.getMetadata(OPTIONS_KEY, target);
    if (options) {
        return Object.assign({}, options);
    }
}
exports.getOptions = getOptions;
/**
 * Sets seuqlize define options to class prototype
 */
function setOptions(target, options) {
    Reflect.defineMetadata(OPTIONS_KEY, Object.assign({}, options), target);
}
exports.setOptions = setOptions;
/**
 * Adds options be assigning new options to old one
 */
function addOptions(target, options) {
    let _options = getOptions(target);
    if (!_options) {
        _options = {};
    }
    setOptions(target, Object.assign(Object.assign(Object.assign({}, _options), options), { validate: Object.assign(Object.assign({}, (_options.validate || {})), (options.validate || {})) }));
}
exports.addOptions = addOptions;
/**
 * Maps design types to sequelize data types;
 * @throws if design type cannot be automatically mapped to
 * a sequelize data type
 */
function getSequelizeTypeByDesignType(target, propertyName) {
    const type = Reflect.getMetadata('design:type', target, propertyName);
    const dataType = (0, data_type_service_1.inferDataType)(type);
    if (dataType) {
        return dataType;
    }
    throw new Error(`Specified type of property '${propertyName}'
            cannot be automatically resolved to a sequelize data type. Please
            define the data type manually`);
}
exports.getSequelizeTypeByDesignType = getSequelizeTypeByDesignType;
/**
 * Resolves all model getters of specified options object
 * recursively.
 * So that {model: () => Person} will be converted to
 * {model: Person}
 */
function resolveModelGetter(options) {
    const maybeModelGetter = (value) => typeof value === 'function' && value.length === 0;
    const isModel = (value) => value && value.prototype && value.prototype instanceof model_1.Model;
    const isOptionObjectOrArray = (value) => value && typeof value === 'object';
    return Object.keys(options).reduce((acc, key) => {
        const value = options[key];
        if (maybeModelGetter(value)) {
            const maybeModel = value();
            if (isModel(maybeModel)) {
                acc[key] = maybeModel;
            }
        }
        else if (isOptionObjectOrArray(value)) {
            acc[key] = resolveModelGetter(value);
        }
        return acc;
    }, Array.isArray(options) ? [...options] : Object.assign({}, options));
}
exports.resolveModelGetter = resolveModelGetter;
//# sourceMappingURL=model-service.js.map