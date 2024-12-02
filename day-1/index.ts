import * as fs from 'node:fs/promises';

const file = (await fs.readFile('day-1-input.txt', 'utf-8'))
    .split(/\r?\n/)
    .map(line => /(\d+)\s+(\d+)/.exec(line))
    .filter(match => match !== null)
    .map(match => [Number(match[1]), Number(match[2])])

const columnA = file.map(([a, _]) => a).sort((a, b) => a - b);
const columnB = file.map(([_, b]) => b).sort((a, b) => a - b);

const difference = columnA.reduce((acc, _, index) => acc + Math.abs(columnA[index] - columnB[index]), 0);
console.log('difference:', difference);

const scoreContributions = new Map(
    Array.from(
        columnB.reduce((acc, b) => acc.set(b, (acc.get(b) ?? 0) + 1), new Map<number, number>())
            .entries()
    ).map(([value, occurrences]) => [value, value * occurrences])
);
const similarityScore = columnA.reduce((acc, a) => acc + (scoreContributions.get(a) ?? 0), 0);
console.log('similarity score:', similarityScore);
