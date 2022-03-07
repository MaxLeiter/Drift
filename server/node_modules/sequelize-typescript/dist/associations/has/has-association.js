"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HasAssociation = void 0;
const base_association_1 = require("../shared/base-association");
const foreign_key_service_1 = require("../foreign-key/foreign-key-service");
class HasAssociation extends base_association_1.BaseAssociation {
    constructor(associatedClassGetter, options, association) {
        super(associatedClassGetter, options);
        this.options = options;
        this.association = association;
    }
    getAssociation() {
        return this.association;
    }
    getSequelizeOptions(model) {
        const options = Object.assign({}, this.options);
        const associatedClass = this.getAssociatedClass();
        options.foreignKey = (0, foreign_key_service_1.getForeignKeyOptions)(model, associatedClass, options.foreignKey);
        return options;
    }
}
exports.HasAssociation = HasAssociation;
//# sourceMappingURL=has-association.js.map