import * as fs from 'node:fs/promises';

const disk = (await fs.readFile('input.txt', 'utf-8')).trim().split('').map(Number)
    .flatMap((n, index): string[] => index % 2 === 0 ? Array(n).fill(`${index / 2}`) : Array(n).fill('.'))

const checksum = (fileSystem: string[]) => fileSystem.reduce((acc, v, index) => v === '.' ? acc : acc + (Number(v) * index), 0);

const a = (originalDisk: string[]) => {
    const modifiedDisk = [...originalDisk];
    for (let i = modifiedDisk.length - 1; i >= 0; i--) {
        if (modifiedDisk[i] === '.') continue;
        const j = modifiedDisk.findIndex((v, index) => v === '.' && index < i);
        if (j === -1) break;
        modifiedDisk[j] = modifiedDisk[i];
        modifiedDisk[i] = '.';
    }

    console.log('checksum:', checksum(modifiedDisk))
};

const b = (originalDisk: string[]) => {
    const modifiedDisk = [...originalDisk];
    let fileId = modifiedDisk.map(v => v === '.' ? -1 : Number(v)).reduce((acc, v) => Math.max(acc, v), -Infinity);
    while (fileId >= 0) {
        const fileStart = modifiedDisk.findIndex(v => v === `${fileId}`);
        const fileEnd = modifiedDisk.findLastIndex(v => v === `${fileId}`);
        const fileLength = fileEnd - fileStart + 1;
        const nextFileStart = modifiedDisk.findIndex((value, freeStart) => {
            if (value !== '.') return false;
            if (freeStart > 0 && modifiedDisk[freeStart - 1] === '.') return false;
            if (freeStart >= fileStart) return false;
            const freeEnd = modifiedDisk.findIndex((s, j) => s !== '.' && j > freeStart);
            const freeLength = freeEnd - freeStart;
            return freeLength >= fileLength;
        })
        if (nextFileStart !== -1) {
            for (let i = 0; i < fileLength; i++) {
                modifiedDisk[nextFileStart + i] = `${fileId}`;
                modifiedDisk[fileStart + i] = '.';
            }
        }
        fileId--;
    }
    console.log('checksum:', checksum(modifiedDisk))
}

a(disk);
b(disk);
