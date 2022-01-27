import { Puzzle } from "./Puzzle.js";
import { PuzzleCell } from "./PuzzleCell.js";

const IS_CELL_REG = /[0-9A-Za-z\.]/;
const IS_CELL_EMPTY = /[\.]/;

type TemplatePart = {
    type: 'raw' | 'cell';
    value: string;
    cell?: PuzzleCell;
}

export function readArrayNumber(originalString: string | Array<number>): Array<number> {
    if (typeof originalString !== 'string') return originalString;

    return originalString
        .split('')
        .filter(e => IS_CELL_REG.test(e))
        .map(e => IS_CELL_EMPTY.test(e) ? '0' : e)
        .map(e => Number.parseInt(e, 36))
    ;        
}

export class PuzzleViewText {    
    private _templateOriginal: string;
    private _template: Array<TemplatePart>;
    private _puzzle: Puzzle;
    //private _cells

    constructor(template: string, puzzle: Puzzle) {
        this._puzzle = puzzle;
        this._templateOriginal = template;
        const templateArr = PuzzleViewText.trimTemplate(template).split('');

        let cellIndex = 0;
        this._template = templateArr.map<TemplatePart>(char => {
            if (PuzzleViewText.isCellChar(char)) {
                
                return {
                    type: 'cell',
                    value: null,
                    cell: puzzle.field[cellIndex++]
                }
            }

            return {
                type: 'raw',
                value: char,
            }            
        });
    }

    static isCellChar(char: string) {
        return IS_CELL_REG.test(char);
    }

    render(): string {
        const preparedArr = this._template.map((part, index) => {
            if (part.type === 'cell') return part.cell.valueChar;
            return part.value;
        });

        return preparedArr.join('');
    }

    renderBlocks(): string {
        const oldValues = this._puzzle.valuesString;
        
        const renderResultArr: Array<string> = [];
        const setValues = (value: number) => {
            return (cell: PuzzleCell) => cell.value = value;
        };

        this._puzzle.field.forEach(setValues(0));
        this._puzzle.blocks.forEach(block => {
            block.cells.forEach(setValues(1));
            renderResultArr.push('---------');
            renderResultArr.push(this.render())
            block.cells.forEach(setValues(0));
        });
        renderResultArr.push('---------');
        this._puzzle.valuesString = oldValues;

        const renderResult = renderResultArr.join('\n').replace(/1/g, '\x1b[33m#\x1b[0m');
        return renderResult;
    }

    static trimTemplate(template: string): string {
        const templateLines = template.split('\n').filter(line => line.trim().length > 0);
        
        const templateLinesInfo = templateLines.map(line => {
            const trimLine = line.trim();
            return {
                spaceCount: line.indexOf(trimLine),
                length: trimLine.length,
            }
        });
    
        const minSpaceCount = Math.min.apply(null, templateLinesInfo.map(line => line.spaceCount));
        const maxLineLength = Math.max.apply(null, templateLinesInfo.map(line => line.length));
        const templplateLinesClear = templateLines.map((line) => {
            return line.substring(minSpaceCount, maxLineLength + minSpaceCount);
        });
    
        return templplateLinesClear.join('\n');
    }
    
}