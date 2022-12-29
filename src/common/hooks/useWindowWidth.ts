import React from 'react';
import { useTheme, Theme } from '@mui/material/styles';

type compare = 'up' | 'down';
type breakpoint = keyof Theme['breakpoints']['values'];

type OneOrMoreProperties<Union extends string, Value> = {
    [Key in Union]: Record<Key, Value> & { [K in Exclude<Union, Key>]?: Value };
}[Union];

type Params<T> = OneOrMoreProperties<`${compare}_${breakpoint}`, { [K in keyof T[keyof T]]: T[keyof T][keyof T[keyof T]] }>;

export function useDebouncedFunctionwithState(func: Function, delay: number) {
    const [timerId, setTimerId] = React.useState<NodeJS.Timeout | null>(null);

    return (...args: any[]) => {
        timerId && clearTimeout(timerId);
        setTimerId(setTimeout(() => func(...args), delay));
    };
};

export function useDebouncedFunction(func: Function, delay: number) {
    let timerId: NodeJS.Timeout | null = null;

    return (...args: any[]) => {
        timerId && clearTimeout(timerId);
        timerId = setTimeout(() => func(...args), delay);
    };
};

export function useWindowWidth<T extends Params<T>>(variables: T) {
    const theme = useTheme();
    const [results, setResults] = React.useState<{ [K in keyof T[keyof T]]?: T[keyof T][K] extends () => void ? ReturnType<T[keyof T][K]> : T[keyof T][K] }>({});

    const onResize = () => {
        let res: typeof results = {};
        Object.keys(variables).forEach((key) => {
            const k = key as keyof Params<T>;
            const [compare, breakpoint] = (k.split('_') as [compare, breakpoint]);
            const condition = compare == 'down' ?
                window.innerWidth <= theme.breakpoints.values[breakpoint]
                : window.innerWidth > theme.breakpoints.values[breakpoint];
            if (condition) {
                const result = Object.fromEntries(Object.entries(variables[k]!).map(entry => {
                    const [key, value] = entry;
                    return [key, typeof value == 'function' ? value() : value];
                }))
                res = (result as unknown as typeof results);
            };
        });
        setResults(res);
    };

    const debouncedOnResize = useDebouncedFunction(onResize, 100);

    React.useEffect(() => {
        onResize();
        window.addEventListener("resize", debouncedOnResize);
        return () => {
            window.removeEventListener('resize', debouncedOnResize)
        };
    }, []);

    return results;
};
