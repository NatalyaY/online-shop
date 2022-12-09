export default function compareObjects(obj1: object, obj2: object) {
    return JSON.stringify(Object.fromEntries(Object.entries(obj1).map(e => [e[0], "" + e[1]]).sort())) ==
        JSON.stringify(Object.fromEntries(Object.entries(obj2).map(e => [e[0], "" + e[1]]).sort()))
}