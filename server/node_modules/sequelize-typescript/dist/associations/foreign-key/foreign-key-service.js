"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getForeignKeys = exports.addForeignKey = exports.getForeignKeyOptions = void 0;
const FOREIGN_KEYS_KEY = 'sequelize:foreignKeys';
function getForeignKeyOptions(relatedClass, classWithForeignKey, foreignKey) {
    let foreignKeyOptions = {};
    if (typeof foreignKey === 'string') {
        foreignKeyOptions.name = foreignKey;
    }
    else if (foreignKey && typeof foreignKey === 'object') {
        foreignKeyOptions = Object.assign({}, foreignKey);
    }
    if (!foreignKeyOptions.name && classWithForeignKey) {
        const foreignKeys = getForeignKeys(classWithForeignKey.prototype) || [];
        for (const key of foreignKeys) {
            if (key.relatedClassGetter() === relatedClass ||
                relatedClass.prototype instanceof key.relatedClassGetter()) {
                foreignKeyOptions.name = key.foreignKey;
                break;
            }
        }
    }
    if (!foreignKeyOptions.name) {
        throw new Error(`Foreign key for "${relatedClass.name}" is missing ` +
            `on "${classWithForeignKey.name}".`);
    }
    return foreignKeyOptions;
}
exports.getForeignKeyOptions = getForeignKeyOptions;
/**
 * Adds foreign key meta data for specified class
 */
function addForeignKey(target, relatedClassGetter, foreignKey) {
    let foreignKeys = getForeignKeys(target);
    if (!foreignKeys) {
        foreignKeys = [];
    }
    foreignKeys.push({
        relatedClassGetter,
        foreignKey,
    });
    setForeignKeys(target, foreignKeys);
}
exports.addForeignKey = addForeignKey;
/**
 * Returns foreign key meta data from specified class
 */
function getForeignKeys(target) {
    const foreignKeys = Reflect.getMetadata(FOREIGN_KEYS_KEY, target);
    if (foreignKeys) {
        return [...foreignKeys];
    }
}
exports.getForeignKeys = getForeignKeys;
/**
 * Sets foreign key meta data
 */
function setForeignKeys(target, foreignKeys) {
    Reflect.defineMetadata(FOREIGN_KEYS_KEY, foreignKeys, target);
}
//# sourceMappingURL=foreign-key-service.js.map