import * as fs from 'node:fs/promises';

const file = await fs.readFile('input.txt', 'utf-8');

const instructions = file.match(/(mul\(\d{1,3},\d{1,3}\))/g);
if (instructions === null || instructions.length === 0) {
    console.log('No instructions found');
    process.exit(1);
}

const sum = instructions.map(instruction => instruction.match(/^mul\((\d+?),(\d+?)\)$/))
    .filter(match => match !== null)
    .map(match => Number(match[1]) * Number(match[2]))
    .reduce((acc, curr) => acc + curr, 0);

console.log('sum:', sum)
