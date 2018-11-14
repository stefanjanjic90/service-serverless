export type DeepPartialEntity<T> = {
    [Property in keyof T]?: DeepPartialEntity<T[Property]>;
}



