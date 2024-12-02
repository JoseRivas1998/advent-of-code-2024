import * as fs from 'node:fs/promises';

class PuzzleReport {

    private allIncreasing: boolean = true;
    private allDecreasing: boolean = true;
    private isGradual: boolean = true;
    public levels: number[];

    constructor(levels: number[]) {
        this.levels = [...levels];
        this.analyze(levels);
    }

    private analyze(levels: number[], allowRemovals: boolean = true): void {
        this.allIncreasing = true;
        this.allDecreasing = true;
        this.isGradual = true;
        if (levels.length <= 1) {
            return;
        }
        for (let i = 1; i < levels.length && this.isSafe; i++) {
            const diff = levels[i] - levels[i - 1];
            const absDiff = Math.abs(diff);
            this.allIncreasing = this.allIncreasing && diff > 0;
            this.allDecreasing = this.allDecreasing && diff < 0;
            this.isGradual = this.isGradual && absDiff >= 1 && absDiff <= 3;
        }
        if (!allowRemovals) return;
        if (this.isSafe) {
            return;
        }
        const originalLevels = [...levels];
        for (let i = 0; i < levels.length && !this.isSafe; i++) {
            const levelsWithoutI = levels.filter((_, index) => index !== i);
            this.analyze(levelsWithoutI, false);
            if (this.isSafe) {
                this.levels = [...levelsWithoutI];
            } else {
                this.levels = [...originalLevels];
            }
        }
    }

    get isSafe() {
        return this.isGradual && (this.allDecreasing || this.allIncreasing);
    }

}

const data = (await fs.readFile('input.txt', 'utf-8'))
    .trim()
    .split(/\r?\n/)
    .map(line => line.split(/\s+/).map(Number))
    .map(level => new PuzzleReport(level));

const safe = data.filter(report => report.isSafe).length;
console.log('safe:', safe);
