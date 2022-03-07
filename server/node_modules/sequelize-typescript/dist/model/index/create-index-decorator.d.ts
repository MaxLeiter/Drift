import { IndexOptions, IndexFieldOptions } from './index-service';
interface IndexDecorator {
    (fieldOptions: Pick<IndexFieldOptions, Exclude<keyof IndexFieldOptions, 'name'>>): Function;
    (target: any, propertyName: string, propertyDescriptor?: PropertyDescriptor): void;
}
export declare function createIndexDecorator(options?: IndexOptions): IndexDecorator;
export {};
