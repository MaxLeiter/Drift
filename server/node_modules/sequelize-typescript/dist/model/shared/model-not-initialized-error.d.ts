import { Model } from '../model/model';
export declare class ModelNotInitializedError extends Error {
    message: string;
    constructor(modelClass: typeof Model, additionalMessage: string);
}
