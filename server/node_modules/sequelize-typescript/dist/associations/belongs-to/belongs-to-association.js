"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BelongsToAssociation = void 0;
const base_association_1 = require("../shared/base-association");
const foreign_key_service_1 = require("../foreign-key/foreign-key-service");
const association_1 = require("../shared/association");
class BelongsToAssociation extends base_association_1.BaseAssociation {
    constructor(associatedClassGetter, options) {
        super(associatedClassGetter, options);
        this.options = options;
    }
    getAssociation() {
        return association_1.Association.BelongsTo;
    }
    getSequelizeOptions(model) {
        const associatedClass = this.getAssociatedClass();
        const foreignKey = (0, foreign_key_service_1.getForeignKeyOptions)(associatedClass, model, this.options.foreignKey);
        return Object.assign(Object.assign({}, this.options), { foreignKey });
    }
}
exports.BelongsToAssociation = BelongsToAssociation;
//# sourceMappingURL=belongs-to-association.js.map