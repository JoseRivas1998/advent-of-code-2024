import * as fs from 'node:fs/promises';

type Point = { x: number, y: number };

type FrequencyMap = Map<string, Tile[]>;

class Tile {
    readonly pos: Readonly<Point>;
    readonly freq: string | null;
    private antiFreqs: Set<string> = new Set();

    constructor(pos: Point, freq: string) {
        this.pos = pos;
        this.freq = freq === '.' ? null : freq;
    }

    toString() {
        return this.freq ?? (this.isAntinode ? '#' : '.');
    }

    get isAntinode() {
        return this.antiFreqs.size > 0;
    }

    get antinodeFrequencies() {
        return this.antiFreqs.size;
    }

    set antinode(value: string) {
        this.antiFreqs.add(value);
    }

}

class TilePair {
    readonly a: Readonly<Point>;
    readonly b: Readonly<Point>;
    readonly dX: number;
    readonly dY: number;
    readonly freq: string;

    constructor(a: Tile, b: Tile) {
        if (a.freq !== b.freq) throw new Error('Tiles must have the same frequency');
        if (a.freq === null) throw new Error('Tiles must have a frequency');
        this.a = a.pos;
        this.b = b.pos;
        this.dX = this.b.x - this.a.x;
        this.dY = this.b.y - this.a.y;
        this.freq = a.freq;
    }

}

function* generateAntinodes(pair: TilePair, file: Tile[][], width: number, height: number): Generator<Point & {
    freq: string
}> {
    const {a, dX, dY, freq} = pair;
    let x = a.x;
    let y = a.y;
    while (x >= 0 && x < width && y >= 0 && y < height) {
        yield {x, y, freq};
        x += dX;
        y += dY;
    }
}

const file = (await fs.readFile('input.txt', 'utf-8'))
    .trim()
    .split(/\r?\n/)
    .map(
        (line, y) => line.trim()
            .split('')
            .map((f, x) => new Tile({x, y}, f))
    )

const width = file[0].length;
const height = file.length;

const frequencies = file.flat().reduce((acc: FrequencyMap, tile) => {
    if (tile.freq === null) return acc;
    return acc.set(tile.freq, (acc.get(tile.freq) ?? []).concat(tile));
}, new Map<string, Tile[]>)

const pairs = [...frequencies.entries()].map(([, tiles]) => {
    return tiles.flatMap(tile => tiles.filter(other => other.pos.x !== tile.pos.x && other.pos.y !== tile.pos.y).map(other => new TilePair(tile, other)));
})

const antinodes = pairs.flatMap(
    row => row.flatMap(pair => [...generateAntinodes(pair, file, width, height)])
)
antinodes.forEach(({x, y, freq}) => file[y][x].antinode = freq);

console.log(file.map(row => row.join('')).join('\n'));

console.log('b:', file.map(row => row.filter(tile => tile.isAntinode).length).reduce((acc, count) => acc + count, 0));




