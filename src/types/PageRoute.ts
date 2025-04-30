// type Params<P> = P extends Record<string, any> ? Promise<P> : never;

// export type PageRoute<P = Record<string, any>> = {
//     params: Params<P>;
//     // searchParams?: URLSearchParams;
// };