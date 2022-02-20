import { Puzzle } from "./Puzzle.js";
import { PuzzleBlock } from "./PuzzleBlock.js";
import { createRangeSet } from "./PuzzleUtils.js";
import * as events from "events";

/**
 *  events: 
 *      change
 *      changeCandidates
 */
export class PuzzleCell extends events.EventEmitter{
    //readonly puzzle: Puzzle;
    readonly size: number;
    private _index: number;
    private _value: number = 0;
    //private _blocks: Array<PuzzleBlock> = [];

    private _candidatesTemplate: Set<number>;   // template for reset
    private _candidates: Set<number>;           // current candidates list

    public isTask: boolean = false;
    public isActive: boolean = false;

    constructor(puzzle: Puzzle, value: number, size: number, _index: number) {
        super();

        //this.puzzle = puzzle;
        //throw "231";
        this._value = value;
        this._index = _index;
        this.size = size;
        this._candidatesTemplate = createRangeSet(1, size);
        this.resetCandidates();
    }

    public resetCandidates() {
        this._candidates = new Set(this._candidatesTemplate);
    }

    public removeCandidate(candidate: number) {
        if (this._candidates.has(candidate)) {
            this._candidates.delete(candidate);
            this.emit('changeCandidates');
        }
    }

    public get candidates() { 
        if (this._value !== 0) return new Set<number>();
        return this._candidates;
    }

    public get index() {
        return this._index;
    }

    public get value() {
        return this._value;
    }

    public set value(newValue) {
        const oldValue = this._value;
        this._value = newValue;
        this.emit('change', this, newValue, oldValue);
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
/*
    public get bloks() {
        return this._blocks;
    }
*/
/*
    public addBlock(block: PuzzleBlock) {
        this._blocks.push(block);
    }
*/
    public getCandidatesTemplate() {
        return new Set(this._candidatesTemplate);
    }

    /*public getCandidates() {*/
        //if (this._value !== 0) return new Set<number>();
        //return this._candidates;
        /*
        if (this.value !== 0) return new Set<number>();
        const candidates = this.getCandidatesTemplate();
        this._blocks.forEach(block => block.removeCandidates(candidates, this));
        return candidates;
        */
    /*}*/


    /**
     * clear solve
     */
     public clear() {
        if (!this.isActive) return;
        if (this.isTask) return;
        this.value = 0;
    }

    /**
     * add change listener
     * @param listener 
     */
    public onChange(listener: (...args: any[]) => void) {
        this.on('change', listener);
    }

    /**
     * add change candidates listener
     * @param listener 
     */
    public onChangeCandidates(listener: (...args: any[]) => void) {
        this.on('changeCandidates', listener);
    }    
}