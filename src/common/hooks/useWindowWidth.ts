import React from 'react';
import { useTheme, Theme } from '@mui/material/styles';

type compare = 'up' | 'down';
type breakpoint = keyof Theme['breakpoints']['values'];

type OneOrMoreProperties<Union extends string, Value> = {
    [Key in Union]: Record<Key, Value> & { [K in Exclude<Union, Key>]?: Value };
}[Union];

type Params<T> = OneOrMoreProperties<`${compare}_${breakpoint}`, { [K in keyof T[keyof T]]: T[keyof T][keyof T[keyof T]] }>;


export function useWindowWidth<T extends Params<T>>(variables: T) {
    const theme = useTheme();
    const [results, setResults] = React.useState<{ [K in keyof T[keyof T]]?: T[keyof T][keyof T[keyof T]] }>({});

    const onResize = () => {
        let res: typeof results = {};
        Object.keys(variables).forEach((key) => {
            const k = key as keyof Params<T>;
            const [compare, breakpoint] = (k.split('_') as [compare, breakpoint]);
            const condition = compare == 'down' ?
                window.innerWidth <= theme.breakpoints.values[breakpoint]
                : window.innerWidth > theme.breakpoints.values[breakpoint];
            if (condition) {
                res = (variables[k] as unknown as typeof results);
            };
        });
        setResults(res);
    };

    React.useEffect(() => {
        onResize();
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener('resize', onResize)
        };
    }, []);

    return results;
};
