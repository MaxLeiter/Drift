"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BelongsToMany = void 0;
const belongs_to_many_association_1 = require("./belongs-to-many-association");
const association_service_1 = require("../shared/association-service");
function BelongsToMany(associatedClassGetter, throughOrOptions, foreignKey, otherKey) {
    return (target, propertyName) => {
        let options = { foreignKey, otherKey };
        if (typeof throughOrOptions === 'string' || typeof throughOrOptions === 'function') {
            options.through = throughOrOptions;
        }
        else {
            options = Object.assign({}, throughOrOptions);
        }
        if (!options.as)
            options.as = propertyName;
        (0, association_service_1.addAssociation)(target, new belongs_to_many_association_1.BelongsToManyAssociation(associatedClassGetter, options));
    };
}
exports.BelongsToMany = BelongsToMany;
//# sourceMappingURL=belongs-to-many.js.map