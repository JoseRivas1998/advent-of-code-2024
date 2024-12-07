import * as fs from 'node:fs/promises';

const tests = (await fs.readFile('input.txt', 'utf-8'))
    .trim()
    .split(/\r?\n/)
    .map(line => line.split(':') as [string, string])
    .map(([target, values]): [number, number[]] => ([Number(target), values.trim().split(' ').map(v => v.trim()).filter(v => v.length > 0).map(v => Number(v))]));

const checkAddition = (target: number, values: number[]): boolean => {
    if (values.length <= 1) return false;
    if (values.length === 2) return values[0] + values[1] === target;
    return canBeMadeTrue(target, [values[0] + values[1], ...values.slice(2)]);
}

const checkMultiplication = (target: number, values: number[]): boolean => {
    if (values.length <= 1) return false;
    if (values.length === 2) return values[0] * values[1] === target;
    return canBeMadeTrue(target, [values[0] * values[1], ...values.slice(2)]);
}

const checkConcatenation = (target: number, values: number[]): boolean => {
    if (values.length <= 1) return false;
    if (values.length === 2) return Number(`${values[0]}${values[1]}`) === target;
    return canBeMadeTrue(target, [Number(`${values[0]}${values[1]}`), ...values.slice(2)]);
}

const canBeMadeTrue = (target: number, values: number[]): boolean => {
    if (checkAddition(target, values)) return true;
    if (checkMultiplication(target, values)) return true;
    return checkConcatenation(target, values);
}

const passingTests = tests.filter(([target, values]) => canBeMadeTrue(target, values))
    .reduce((acc, [target]) => acc + target, 0);

console.log('a:', passingTests);
