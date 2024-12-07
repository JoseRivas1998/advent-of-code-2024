import * as fs from 'node:fs/promises';

class Tile {
    readonly isObstacle: boolean;
    readonly placedObstacle: boolean = false;
    visitedDirections: Set<'North' | 'East' | 'South' | 'West'>;

    constructor(char: string) {
        this.isObstacle = char === '#' || char === 'O';
        this.placedObstacle = char === 'O';
        this.visitedDirections = new Set();
    }

    get visited() {
        if (this.isObstacle) return false;
        return this.visitedDirections.size > 0;
    }

    get char() {
        if (this.visited) return 'X';
        if (this.isObstacle) return this.placedObstacle ? 'O' : '#';
        return '.';
    }

    set visitedDirection(direction: 'North' | 'East' | 'South' | 'West') {
        this.visitedDirections.add(direction);
    }

}

type Player = {
    row: number;
    col: number;
    direction: 'North' | 'East' | 'South' | 'West';
    inLoop: boolean;
};

const render = (map: Tile[][], playerPosition: Player) => {
    const board = map.map((row, r) => row.map((tile, c) => {
        if (playerPosition?.row === r && playerPosition?.col === c) {
            switch (playerPosition.direction) {
                case 'North':
                    return '^';
                case 'East':
                    return '>';
                case 'South':
                    return 'v';
                case 'West':
                    return '<';
            }
        }
        return tile.char;
    }).join('')).join('\n');
    console.log(board)
}

const parseMap = (file: string[][], rows: number, cols: number) => {
    const map: Tile[][] = Array(rows).fill(undefined);

    let player: Player | null = null;

    for (let r = 0; r < rows; r++) {
        map[r] = Array(cols).fill(undefined);
        for (let c = 0; c < cols; c++) {
            map[r][c] = new Tile(file[r][c]);
            if (file[r][c] !== '.' && file[r][c] !== '#') {
                player = {
                    row: r,
                    col: c,
                    direction: 'North',
                    inLoop: false
                };
            }
        }
    }
    if (player === null) throw new Error('Player not found');

    return {map, player};
}

const step = (map: Tile[][], player: Player, rows: number, cols: number, debug: boolean = false) => {
    const {row, col, direction} = player;
    const nextRow = direction === 'North' ? row - 1 : (direction === 'South' ? row + 1 : row);
    const nextCol = direction === 'West' ? col - 1 : (direction === 'East' ? col + 1 : col);
    map[row][col].visitedDirection = direction;
    if (nextRow < 0 || nextRow >= rows || nextCol < 0 || nextCol >= cols) {
        player.row = nextRow;
        player.col = nextCol;
        return false;
    }
    if (debug) console.log({nextRow, nextCol, direction});
    if (map[nextRow][nextCol].visited && map[nextRow][nextCol].visitedDirections.has(direction)) {
        player.inLoop = true;
    }
    if (map[nextRow][nextCol].isObstacle) {
        switch (direction) {
            case 'North':
                player.direction = 'East';
                break;
            case 'East':
                player.direction = 'South';
                break;
            case 'South':
                player.direction = 'West';
                break;
            case 'West':
                player.direction = 'North';
                break;
        }
        return true;
    }
    player.row = nextRow;
    player.col = nextCol;
    return true;
}

const uniqueTilesOnExit = (map: Tile[][], player: Player, rows: number, cols: number, debug: boolean = false) => {
    let onMap: boolean = true;

    while (onMap && !player.inLoop) {
        onMap = step(map, player, rows, cols, debug);
    }
    if (player.inLoop) return -1;
    return map.reduce((acc, row) => acc + row.filter(tile => tile.visited).length, 0);
};

const file = (await fs.readFile('input.txt', 'utf-8'))
    .trim()
    .split(/\r?\n/)
    .map(line => line.trim().split(''));

const rows = file.length;
const cols = file[0].length;

let {map, player} = parseMap(file, rows, cols);
render(map, player);

const a = uniqueTilesOnExit(map, player, rows, cols);
const originalVisitMap = new Map(
        map.map((row, index) => {
            return [index, new Set(row.map((tile, index) => tile.visited ? index : -1).filter(index => index >= 0))];
        })
    )
console.log('a:', a);

let b = 0;

const step2 = parseMap(file, rows, cols);
map = step2.map;
player = step2.player;
const startingRow = player.row;
const startingCol = player.col;

for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        if (r === startingRow && c === startingCol) continue;
        if (map[r][c].isObstacle) continue;
        if (!(originalVisitMap.get(r)?.has(c) ?? false)) continue;
        map[r][c] = new Tile('O');
        const steps = uniqueTilesOnExit(map, player, rows, cols);
        if (steps === -1) {
            b++;
        }
        const step2 = parseMap(file, rows, cols);
        player = step2.player;
        map = step2.map;
        player = step2.player;
    }
}

console.log('b:', b);
