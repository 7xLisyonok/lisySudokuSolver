import { Puzzle } from "./Puzzle.js";
import { PuzzleBlock } from "./PuzzleBlock.js";
import { createRangeSet } from "./PuzzleUtils.js";

export class PuzzleCell {
    readonly puzzle: Puzzle;
    readonly size: number;
    private _index: number;
    private _value: number = 0;
    private _blocks: Array<PuzzleBlock> = [];
    private _candidatesTemplate: Set<number>;
    public isTask: boolean = false;

    constructor(puzzle: Puzzle, value: number, size: number, _index: number) {
        this.puzzle = puzzle;
        this._value = value;
        this.size = size;
        this._candidatesTemplate = createRangeSet(1, size);
    }

    public get index() {
        return this._index;
    }

    public get value() {
        return this._value;
    }

    public set value(newValue) {
        this._value = newValue;
    }

    public get valueChar() {
        if (!this.isActive) return '.';
        if (this.value === 0) return '.';
        return this.value.toString(36);
    }

    public set valueChar(newValue: string) {
        if (newValue === '.') this.value = 0;
        else this.value = parseInt(newValue, 36);
    }

    public get hasValue() {
        return this.value !== 0;
    }

    public get bloks() {
        return this._blocks;
    }

    public addBlock(block: PuzzleBlock) {
        this._blocks.push(block);
    }

    public getCandidatesTemplate() {
        return new Set(this._candidatesTemplate);
    }

    public getCandidates() {
        if (this.value !== 0) return new Set<number>();
        const candidates = this.getCandidatesTemplate();
        this._blocks.forEach(block => block.removeCandidates(candidates, this));
        return candidates;
    }

    /** 
     * is this cell part of puzzle
     */
    public get isActive(): boolean {
        return this._blocks.length > 0;
    }

    /**
     * clear solve
     */
     public clear() {
        if (!this.isActive) return;
        if (this.isTask) return;
        this.value = 0;
    }

}