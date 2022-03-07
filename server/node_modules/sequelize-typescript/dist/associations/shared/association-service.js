"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssociationsByRelation = exports.setAssociations = exports.getAssociations = exports.addAssociation = exports.getPreparedAssociationOptions = void 0;
require("reflect-metadata");
const ASSOCIATIONS_KEY = 'sequelize:associations';
function getPreparedAssociationOptions(optionsOrForeignKey) {
    let options = {};
    if (optionsOrForeignKey) {
        if (typeof optionsOrForeignKey === 'string') {
            options.foreignKey = optionsOrForeignKey;
        }
        else {
            options = Object.assign({}, optionsOrForeignKey);
        }
    }
    return options;
}
exports.getPreparedAssociationOptions = getPreparedAssociationOptions;
/**
 * Stores association meta data for specified class
 */
function addAssociation(target, association) {
    let associations = getAssociations(target);
    if (!associations) {
        associations = [];
    }
    associations.push(association);
    setAssociations(target, associations);
}
exports.addAssociation = addAssociation;
/**
 * Returns association meta data from specified class
 */
function getAssociations(target) {
    const associations = Reflect.getMetadata(ASSOCIATIONS_KEY, target);
    if (associations) {
        return [...associations];
    }
}
exports.getAssociations = getAssociations;
function setAssociations(target, associations) {
    Reflect.defineMetadata(ASSOCIATIONS_KEY, associations, target);
}
exports.setAssociations = setAssociations;
function getAssociationsByRelation(target, relatedClass) {
    const associations = getAssociations(target);
    return (associations || []).filter((association) => {
        const _relatedClass = association.getAssociatedClass();
        return (_relatedClass.prototype === relatedClass.prototype ||
            relatedClass.prototype instanceof _relatedClass);
    });
}
exports.getAssociationsByRelation = getAssociationsByRelation;
//# sourceMappingURL=association-service.js.map