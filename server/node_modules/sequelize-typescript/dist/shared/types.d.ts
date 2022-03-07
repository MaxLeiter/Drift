export declare type Diff<T extends string | symbol | number, U extends string | symbol | number> = ({
    [P in T]: P;
} & {
    [P in U]: never;
} & {
    [x: string]: never;
})[T];
export declare type Omit<T, K extends keyof T> = {
    [P in Diff<keyof T, K>]: T[P];
};
export declare type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};
export declare type NonAbstract<T> = {
    [P in keyof T]: T[P];
};
export declare type Constructor<T> = new (...args: any[]) => T;
