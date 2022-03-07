import { ModelAttributeColumnOptions } from 'sequelize';
/**
 * Returns model attributes from class by restoring this
 * information from reflect metadata
 */
export declare function getAttributes(target: any): any | undefined;
/**
 * Sets attributes
 */
export declare function setAttributes(target: any, attributes: any): void;
/**
 * Adds model attribute by specified property name and
 * sequelize attribute options and stores this information
 * through reflect metadata
 */
export declare function addAttribute(target: any, name: string, options: any): void;
/**
 * Adds attribute options for specific attribute
 */
export declare function addAttributeOptions(target: any, propertyName: string, options: Partial<ModelAttributeColumnOptions>): void;
