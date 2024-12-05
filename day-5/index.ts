import * as fs from 'node:fs/promises';


const groups = (await fs.readFile('input.txt', 'utf-8')).trim().split(/\r?\n\r?\n/).map(group => group.trim().split(/\r?\n/))

const orderingRules = groups[0].map(rule => rule.match(/(\d+)\|(\d+)/))
    .filter(rule => rule !== null)
    .map(rule => [Number(rule[1]), Number(rule[2])])
    .reduce((acc, [before, after]) => {
        if (!acc.has(before)) {
            acc.set(before, new Set<number>());
        }
        acc.get(before)!.add(after);
        return acc;
    }, new Map<number, Set<number>>())

console.log(orderingRules);

const pageCanGoBefore = (page: number, other: number) => {
    if (!orderingRules.has(other)) return true;
    return !orderingRules.get(other)!.has(page);
}

const updates = groups[1].map(group => group.split(',').map(s => s.trim()).filter(s => s.length > 0).map(s => Number(s)));

const pageValid = (page: number, index: number, update: number[]) => {
    return index === update.length - 1 || !update.slice(index + 1, update.length).some(other => !pageCanGoBefore(page, other));
}


const {validUpdates, invalidUpdates} = updates.reduce((acc: {validUpdates: number[][], invalidUpdates: number[][]}, update) => {
    const updateValid = update.every(pageValid);
    const validUpdates = updateValid ? [...acc.validUpdates, update] : acc.validUpdates;
    const invalidUpdates = updateValid ? acc.invalidUpdates : [...acc.invalidUpdates, update];
    return {validUpdates, invalidUpdates};
}, {validUpdates: [], invalidUpdates: []});

const midSum = (arr: number[][]) => arr.map(update => update[Math.floor(update.length / 2)]).reduce((acc, page) => acc + page, 0);

console.log('a:', midSum(validUpdates));

for (let i = 0; i < invalidUpdates.length; i++) {
    for (let j = 0; j < invalidUpdates[i].length; j++) {
        const page = invalidUpdates[i][j];
        const offendingPageIndex = invalidUpdates[i].findIndex((other, index) => index > j && !pageCanGoBefore(page, other));
        if (offendingPageIndex !== -1){
            invalidUpdates[i][j] = invalidUpdates[i][offendingPageIndex];
            invalidUpdates[i][offendingPageIndex] = page;
            j--;
        }
    }
}

console.log('b:', midSum(invalidUpdates));
