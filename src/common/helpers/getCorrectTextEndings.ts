'use strict';

export default function getCorrectTextEndings({ qty, textsArr }: { qty: number, textsArr: string[] }) {
    let text = textsArr[(qty % 100 > 4 && qty % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(qty % 10 < 5) ? Math.abs(qty) % 10 : 5]] || textsArr[2];
    return text;
}