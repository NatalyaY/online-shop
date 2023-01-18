const isArgsWithID = <T>(args: any): args is (T & { _id: any })[] => {
    return Boolean(args[0]?._id)
}

const unify = <T>(...args: T[][]): T[] => {
    const total = args.flat();

    if (isArgsWithID<T>(total)) {
        const uniqIds: { [K: string]: 1 } = {};
        return total.filter(({ _id }) => (!uniqIds[_id.toString()] && (uniqIds[_id.toString()] = 1)));
    };

    const uniq = [...new Set(total.map(r => JSON.stringify(r)))];
    return uniq.map(id => JSON.parse(id));
};

export default unify;