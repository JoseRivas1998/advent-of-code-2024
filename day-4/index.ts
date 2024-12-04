import * as fs from 'node:fs/promises';


const fileText = (await fs.readFile('input.txt', 'utf-8'))
    .trim()
    .split(/\r?\n/)
    .map(line => line.trim().split(''));

const cols = fileText[0].length;
const rows = fileText.length;
const a = () => {

    const isValid = (str: string) => str === 'XMAS' || str === 'SAMX';

    let sum = 0;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col <= cols - 4; col++) {
            if (isValid(fileText[row].slice(col, col + 4).join(''))) sum++;
        }
    }
    for (let col = 0; col < cols; col++) {
        for (let row = 0; row <= rows - 4; row++) {
            if (isValid(fileText.slice(row, row + 4).map(row => row[col]).join(''))) sum++;
        }
    }

    for (let row = 0; row <= rows - 4; row++) {
        for (let col = 0; col <= cols - 4; col++) {
            sum += [
                `${fileText[row][col]}${fileText[row + 1][col + 1]}${fileText[row + 2][col + 2]}${fileText[row + 3][col + 3]}`,
                `${fileText[row + 3][col]}${fileText[row + 2][col + 1]}${fileText[row + 1][col + 2]}${fileText[row][col + 3]}`,
            ].filter(isValid).length;
        }
    }
    console.log('a:', sum);
}

const b = () => {
    const isValid = (str: string) => str === 'MAS' || str === 'SAM';
    let sum = 0;
    for (let row = 1; row < rows - 1; row++) {
        for (let col = 1; col < cols - 1; col++) {
            const neighborhood = fileText.slice(row - 1, row + 2).map(row => row.slice(col - 1, col + 2));
            const masses = [
                `${neighborhood[0][0]}${neighborhood[1][1]}${neighborhood[2][2]}`,
                `${neighborhood[0][2]}${neighborhood[1][1]}${neighborhood[2][0]}`,
            ].filter(isValid);
            if (masses.length === 2) sum++;
        }
    }
    console.log('b:', sum);
};

a();
b();
