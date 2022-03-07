"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BelongsTo = void 0;
const belongs_to_association_1 = require("./belongs-to-association");
const association_service_1 = require("../shared/association-service");
function BelongsTo(associatedClassGetter, optionsOrForeignKey) {
    return (target, propertyName) => {
        const options = (0, association_service_1.getPreparedAssociationOptions)(optionsOrForeignKey);
        if (!options.as)
            options.as = propertyName;
        (0, association_service_1.addAssociation)(target, new belongs_to_association_1.BelongsToAssociation(associatedClassGetter, options));
    };
}
exports.BelongsTo = BelongsTo;
//# sourceMappingURL=belongs-to.js.map