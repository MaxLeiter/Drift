import { DataTypeAbstract, ModelOptions } from 'sequelize';
/**
 * Sets model name from class by storing this
 * information through reflect metadata
 */
export declare function setModelName(target: any, modelName: string): void;
/**
 * Returns model name from class by restoring this
 * information from reflect metadata
 */
export declare function getModelName(target: any): string;
/**
 * Returns sequelize define options from class prototype
 * by restoring this information from reflect metadata
 */
export declare function getOptions(target: any): ModelOptions | undefined;
/**
 * Sets seuqlize define options to class prototype
 */
export declare function setOptions(target: any, options: ModelOptions<any>): void;
/**
 * Adds options be assigning new options to old one
 */
export declare function addOptions(target: any, options: ModelOptions<any>): void;
/**
 * Maps design types to sequelize data types;
 * @throws if design type cannot be automatically mapped to
 * a sequelize data type
 */
export declare function getSequelizeTypeByDesignType(target: any, propertyName: string): DataTypeAbstract;
/**
 * Resolves all model getters of specified options object
 * recursively.
 * So that {model: () => Person} will be converted to
 * {model: Person}
 */
export declare function resolveModelGetter(options: any): any;
