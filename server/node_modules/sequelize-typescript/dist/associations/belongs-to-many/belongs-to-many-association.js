"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BelongsToManyAssociation = void 0;
const base_association_1 = require("../shared/base-association");
const model_not_initialized_error_1 = require("../../model/shared/model-not-initialized-error");
const foreign_key_service_1 = require("../foreign-key/foreign-key-service");
const association_1 = require("../shared/association");
class BelongsToManyAssociation extends base_association_1.BaseAssociation {
    constructor(associatedClassGetter, options) {
        super(associatedClassGetter, options);
        this.options = options;
    }
    getAssociation() {
        return association_1.Association.BelongsToMany;
    }
    getSequelizeOptions(model, sequelize) {
        const options = Object.assign({}, this.options);
        const associatedClass = this.getAssociatedClass();
        const throughOptions = this.getThroughOptions(sequelize);
        const throughModel = typeof throughOptions === 'object' && typeof throughOptions.model !== 'string'
            ? throughOptions.model
            : undefined;
        options.through = throughOptions;
        options.foreignKey = (0, foreign_key_service_1.getForeignKeyOptions)(model, throughModel, this.options.foreignKey);
        options.otherKey = (0, foreign_key_service_1.getForeignKeyOptions)(associatedClass, throughModel, this.options.otherKey);
        return options;
    }
    getThroughOptions(sequelize) {
        const through = this.options.through;
        const throughModel = typeof through === 'object' ? through.model : through;
        const throughOptions = typeof through === 'object' ? Object.assign({}, through) : {};
        if (typeof throughModel === 'function') {
            const throughModelClass = sequelize.model(throughModel());
            if (!throughModelClass.isInitialized) {
                throw new model_not_initialized_error_1.ModelNotInitializedError(throughModelClass, 'Association cannot be resolved.');
            }
            throughOptions.model = throughModelClass;
        }
        else {
            return throughModel;
        }
        return throughOptions;
    }
}
exports.BelongsToManyAssociation = BelongsToManyAssociation;
//# sourceMappingURL=belongs-to-many-association.js.map