import fs from "node:fs/promises";

const file = await fs.readFile('input.txt', 'utf-8');

const instructions = file.match(/((do\(\))|(don't\(\))|(mul\(\d{1,3},\d{1,3}\)))/g);
if (instructions === null || instructions.length === 0) {
    console.log('No instructions found');
    process.exit(1);
}

const result = instructions.reduce((acc, instruction) => {
    if (instruction === 'do()') return {...acc, enabled: true};
    if (instruction === 'don\'t()') return {...acc, enabled: false};
    if (!acc.enabled) return acc;
    const match = instruction.match(/^mul\((\d+?),(\d+?)\)$/);
    if (match === null) return acc;
    return {...acc, sum: acc.sum + Number(match[1]) * Number(match[2])};
}, {enabled: true, sum: 0});

console.log('sum:', result.sum);

