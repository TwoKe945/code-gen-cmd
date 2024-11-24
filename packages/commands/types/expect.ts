export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

// 使用 Equal 来实现 Expect
export type Expect<X, Y> = Equal<X, Y> extends true ? true : false;
