import { Puzzle } from "./Puzzle.js";
import { PuzzleBlock } from "./PuzzleBlock.js";
import { PuzzleBlockUnique } from "./PuzzleBlockUnique.js";
import { PuzzleCell } from "./PuzzleCell.js";
import { createRange } from "./PuzzleUtils.js";

const HARDEST_NONE = 0;
const HARDEST_EASY = 1;
const HARDEST_FINE = 5;
const HARDEST_HARD = 20;

export class PuzzleSolver {
    private _puzzle: Puzzle;

    constructor(p: Puzzle) {
        this._puzzle = p;
    }

    public solveViaLogic(): PuzzleSolverResult {
        const result = new PuzzleSolverResult();

        do {
            do {} while( result.addPart(this.solveViaBlocksOnce()) )
        } while( result.addPart(this.solveViaCellsOnce()) )

        return result;
    }

    /**
     * solve puzzle via blocks features
     */
    public solveViaBlocksOnce(): PuzzleSolverPart {
        const result = new PuzzleSolverPart(HARDEST_EASY);
        this._puzzle.blocks.map(block => result.changed.push(...this.solveViaBlock(block)));
        return result;
    }    

    /**
     * solve puzzle via cell's candidates
     */
    public solveViaCellsOnce(): PuzzleSolverPart {
        let solvedCellsCount = 0;
        const result = new PuzzleSolverPart(HARDEST_FINE);
        this._puzzle.field.forEach(cell => {
            if (!cell.isActive) return;

            const candidates = cell.getCandidates();
            if (candidates.size === 1) {
                const [value] = candidates;
                cell.value = value;
                result.changed.push(cell);
                solvedCellsCount++;
            }
        });

        return result;
    }

    public solveViaBlock(block: PuzzleBlock): Array<PuzzleCell> {
        if (block instanceof PuzzleBlockUnique) return this.solveViaBlockUnique(block);
        return [];
    }

    public solveViaBlockUnique(block: PuzzleBlockUnique): Array<PuzzleCell> {
        if (block.cells.size !== block.puzzle.defaultSize) return [];

        const blockCandidates = Array.from({ length: this._puzzle.defaultSize }, (value, index) => {
            return {
                value: index + 1,
                cells: new Array<PuzzleCell>(),
            };
        });

        block.cells.forEach(cell => {
            const cellCandidates = cell.getCandidates();
            cellCandidates.forEach(candidate => blockCandidates[candidate - 1].cells.push(cell));
        });

        const goodBlockCandidates = blockCandidates.filter(bc => bc.cells.length === 1);
        const result: Array<PuzzleCell> = [];
        goodBlockCandidates.forEach(block => {
            const cell = block.cells[0];
            cell.value = block.value;
            result.push(cell);
        });
        return result;
    }
}


class PuzzleSolverResult {
    parts: Array<PuzzleSolverPart> = [];

    constructor(...parts: Array<PuzzleSolverPart>) {
        this.addPart(...parts);
    }

    addPart(...parts: Array<PuzzleSolverPart>): number {
        let partsChanges: number = 0;

        parts.forEach(part => {
            this.parts.push(part);
            partsChanges += part.changeCount;
        });

        return partsChanges;
    }

    public get changeCount(): number {
        return this.parts.reduce<number>((sum, part) => sum + part.changeCount, 0);
    }    

    public get hardest(): number {
        return this.parts.reduce<number>((sum, part) => sum + part.changeCount * part.hardest, 0);
    }
}

class PuzzleSolverPart {
    hardest: number;

    changed: Array<PuzzleCell> = [];

    constructor(hardest: number) {
        this.hardest = hardest;
    }
    
    public get changeCount(): number {
        return this.changed.length;
    }

    public get isEmpty(): boolean {
        return this.changeCount === 0;
    }
}