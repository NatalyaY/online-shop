const unify = <T>(...args: T[][]): T[] => {
    const total = args.flat();
    const uniq = [...new Set(total.map(r => JSON.stringify(r)))];
    return uniq.map(id => JSON.parse(id));
};

export default unify;