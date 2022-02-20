import { Puzzle } from "./Puzzle.js";
import { PuzzleCell } from "./PuzzleCell.js";

export type BlockType = 'unique'; // | 'sum' | 'more-less' | 'consecutive' | 'anti-consecutive';

export abstract class PuzzleBlock {
    readonly puzzle: Puzzle;
    private _cells = new Set<PuzzleCell>();

    /**
     * fast checking block for errors, must return true if block has not errors
     */
    public abstract checkFast(): boolean;

    /**
     * full checking block for errors, must return all wrong cells
     */
    public abstract checkFull(): PuzzleBlockCheckResult;

    /**
     * remove candidates for cell
     */
    /*
    public removeCandidates(candidatesList: Set<number>, cell: PuzzleCell): void {
        // no changes by default
        return;
    }
    */

    /**
     * some action when block's cell value change
     */
    public cellChange(cell: PuzzleCell, newValue: number, oldValue: number): void {
        // no changes by default
        return;
    }

    /**
     * some action when block's cell value change
     */
     public cellCandidatesChange(cell: PuzzleCell): void {
        // no changes by default
        return;
    }    

    constructor(puzzle: Puzzle) {
        this.puzzle = puzzle;
    }

    addCell(...cells: Array<PuzzleCell>) {
        cells.forEach(cell => {
            this._cells.add(cell);
            cell.isActive = true;
            cell.onChange((cell, newValue, oldValue) => this.cellChange(cell, newValue, oldValue));
            //cell.addBlock(this);
        });
    }

    public get cells() {
        return this._cells;
    }
}

export class PuzzleBlockCheckResult {
    result: boolean = true;
    wrongCells: Array<PuzzleCell> = [];
}