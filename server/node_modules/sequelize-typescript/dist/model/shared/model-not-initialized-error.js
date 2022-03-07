"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelNotInitializedError = void 0;
class ModelNotInitializedError extends Error {
    constructor(modelClass, additionalMessage) {
        super();
        this.message =
            `Model not initialized: ${additionalMessage} "${modelClass.name}" ` +
                `needs to be added to a Sequelize instance.`;
    }
}
exports.ModelNotInitializedError = ModelNotInitializedError;
//# sourceMappingURL=model-not-initialized-error.js.map