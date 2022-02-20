import { BlockType, PuzzleBlock } from "./PuzzleBlock.js";
import { PuzzleBlockUnique } from "./PuzzleBlockUnique.js";
import { PuzzleCell } from "./PuzzleCell.js";
import { createRangeSet } from "./PuzzleUtils.js";
import { PuzzleViewText, readArrayNumber } from "./PuzzleView.js";

type BlockDescriptionBase = {
    group?: string,
    type: BlockType,
}

type BlockDescriptionArray = BlockDescriptionBase & {
    cells: Array<number>,
}

type BlockDescriptionString = BlockDescriptionBase & {
    cells: string,
}

type BlockDescription = BlockDescriptionArray | BlockDescriptionString;

type PuzzleDescription = {
    /**
     * array of puzzle blocks descriptions
     */
    blocks: Array<BlockDescription>,

    /**
     * array with task, where 0 = empty cells, > 0 inital task values
     */
    task: string,

    template?: string,

    /**
     * max number for each cell
     */
    size: number,
}

/**
 * Create puzzle from puzzle description
 */
export function createPuzzle(desc: PuzzleDescription) {
    const puzzle = new Puzzle(desc.size);
    
    //p.fieldSize = desc.fieldSize;
    //p.fieldType = desc.fieldType;

    /*
    if (p.fieldType === 'square') {
        p.fieldWidth = p.fieldSize[0];
        p.fieldHeight = p.fieldSize[1] || p.fieldWidth;
        p.fieldLength = p.fieldWidth * p.fieldHeight;
    }
    */

    const task = readArrayNumber(desc.task);
    task.forEach(value => puzzle.addCell(0));

    desc.blocks.forEach(blockDesc => {
        const currBlocks = puzzle.createBlocks(blockDesc);
        puzzle.addBlock(...currBlocks);
    });

    task.forEach((value, index) => {
        if (value > 0) puzzle.field[index].value = value;
    });
    puzzle.saveTask();

    const viewTemplate = 'template' in desc ? desc.template : desc.task;
    const view = new PuzzleViewText(viewTemplate, puzzle);

    return { puzzle, view };
}

export class Puzzle {
    field: Array<PuzzleCell> = [];
    defaultSize: number;
    blocks: Array<PuzzleBlock> = [];

    private _candidatesTemplate: Set<number>;

    constructor(defaultSize: number) {
        this.defaultSize = defaultSize;
        this._candidatesTemplate = createRangeSet(1, defaultSize);
    }

    public getCandidatesTemplate() {
        return new Set(this._candidatesTemplate);
    }

    public createBlocks(desc: BlockDescription): Array<PuzzleBlock> {
        const blockList: Array<PuzzleBlock> = [];
        readArrayNumber(desc.cells).forEach((blockIndex, cellIndex) => {
            if (blockIndex === 0) return;

            if (!blockList[blockIndex]) {
                blockList[blockIndex] = this.createBlock(desc.type);
            }

            const currBlock = blockList[blockIndex];
            const currCell = this.field[cellIndex];
            currBlock.addCell(currCell);
        });

        return blockList.filter(e => !!e);
    }

    public createBlock(type: BlockType): PuzzleBlock {
        if (type === 'unique') {
            return new PuzzleBlockUnique(this);
        }
    }

    public addBlock(...blocks: Array<PuzzleBlock>) {
        blocks.forEach(block => {
            this.blocks.push(block);
        });
    }

    public addCell(value: number) {
        const c = new PuzzleCell(this, value, this.defaultSize, this.field.length);
        this.field.push(c);
        return c;
    }

    public resetCandidates() {
        this.field.forEach(cell => cell.resetCandidates());
    }

    public reset() {
        this.field.forEach(cell => {
            cell.value = 0;
            cell.resetCandidates();
        });
    }    

    /**
     * mark all current active cells with value as "isTask"
     */
    public saveTask() {
        this.field.forEach(cell => cell.isTask = cell.isActive && cell.hasValue);
    }

    /**
     * clear solve
     */
    public clear() {
        this.field.forEach(cell => cell.clear());
    }

    /** 
     * return solve Array
     */
     public get solveArray() {
        return this.field
            .filter(cell => cell.isActive && !cell.isTask)
            .map(cell => cell.value)
        ;
    }

    /** 
     * return solve string
     */
    public get solveString() {
        return this.field
            .filter(cell => cell.isActive && !cell.isTask)
            .map(cell => cell.valueChar)
            .join('')
        ;
    }

    /** 
     * array with every cell's value number
     */
    public get valuesArray(): Array<number> {
        return this.field.map(cell => cell.value);
    }

    /** 
     * array with every cell's value number
     */
    public set valuesArray(newValues: Array<number>) {
        this.resetCandidates();
        newValues.forEach((newValue, index) => this.field[index].value = newValue);
    } 

    /** 
     * string with every cell's valueChar
     */
    public get valuesString() {
        return this.field
            .map(cell => cell.valueChar)
            .join('')
        ;
    } 

    /** 
     * string with every cell's valueChar
     */
    public set valuesString(newValues: string) {
        this.resetCandidates();
        newValues.split('').forEach((char, index) => this.field[index].valueChar = char);
    } 

    public get fieldLength() {
        return this.field.length;
    }

    /**
     * check all blocks filled right
     */
    public checkFast(): boolean {
        return this.blocks.every(block => block.checkFast());
    }

    /**
     * check all blocks filled right
     */
    public checkViaCandidates(): boolean {
        return this.field
            .filter(cell => !cell.hasValue)
            .map(cell => cell.candidates)
            .every(candidates => candidates.size > 0);
    }

    /**
     * check all active cells has value
     */
    public checkFull() {
        return this.field.every(cell => !cell.isActive || cell.hasValue);
    }
}