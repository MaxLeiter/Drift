import { IndexOptions, IndexFieldOptions } from './index-service';
declare type IndexDecoratorOptions = IndexOptions & Pick<IndexFieldOptions, Exclude<keyof IndexFieldOptions, 'name'>>;
export declare function Index(name: string): Function;
export declare function Index(options: IndexDecoratorOptions): Function;
export declare function Index(target: any, propertyName: string, propertyDescriptor?: PropertyDescriptor): void;
export declare function annotateModelWithIndex(target: any, propertyName: string, optionsOrName?: IndexDecoratorOptions | string, indexId?: string | number): string | number;
export {};
