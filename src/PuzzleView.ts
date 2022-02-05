import { Puzzle } from "./Puzzle.js";
import { PuzzleCell } from "./PuzzleCell.js";

const IS_CELL_REG = /[0-9A-Za-z\.]/;
const IS_CELL_EMPTY = /[\.]/;

type TextTemplatePart = {
    type: 'raw' | 'cell';
    value: string;
    cell?: PuzzleCell;
}

const numberToCharBase = 36;
const colorEnd = '\x1b[0m';
const colorStart: Array<string> = [
    '', 
    '\x1b[31m',
    '\x1b[32m',
    '\x1b[33m',
    '\x1b[34m',
    '\x1b[35m',
    '\x1b[36m',
    '\x1b[43m\x1b[30m',
    '\x1b[47m\x1b[30m',
    '\x1b[46m\x1b[30m',
    '\x1b[31m',
    '\x1b[32m',
    '\x1b[33m',
    '\x1b[34m',
    '\x1b[35m',
    '\x1b[36m',
    '\x1b[43m\x1b[30m',
    '\x1b[47m\x1b[30m',
    '\x1b[46m\x1b[30m', 
];

export const numberToCharColored = (n: number) => {    
    const colorIndex = n % colorStart.length;
    const value = (n - colorIndex) / colorStart.length;
    const valueStr = value.toString(numberToCharBase).toUpperCase();

    if (colorIndex === 0) return valueStr;
    return colorStart[colorIndex] + valueStr + colorEnd;
};

export const numberToChar = (n: number) => n.toString(numberToCharBase).toUpperCase();
export const charToNumber = (c: string) => Number.parseInt(c, numberToCharBase);

export function readArrayNumber(originalString: string | Array<number>): Array<number> {
    if (typeof originalString !== 'string') return originalString;

    return originalString
        .split('')
        .filter(e => IS_CELL_REG.test(e))
        .map(e => IS_CELL_EMPTY.test(e) ? '0' : e)
        .map(charToNumber)
    ;        
}

export class TextTemplate {
    private _templateOriginal: string;
    private _template: Array<TextTemplatePart>;

    constructor(template: string) {
        this._templateOriginal = template;
        const templateArr = TextTemplate.trimTemplate(template).split('');

        let cellIndex = 0;
        this._template = templateArr.map<TextTemplatePart>(char => {
            if (PuzzleViewText.isCellChar(char)) {
                return {
                    type: 'cell',
                    value: null,
                }
            }

            return {
                type: 'raw',
                value: char,
            }            
        });
    }

    private renderBase(values: Array<string>): string {
        let templateIndex = 0;
        const preparedArr = this._template.map((part, index) => {
            return (part.type === 'cell') ? values[templateIndex++] : part.value;
        });

        return preparedArr.join('');
    }

    render(values: Array<string>): string {
        return this.renderBase(values);
    }

    renderNumbers(values: Array<number>): string {
        const preparedValues = values.map(v => numberToChar(v));
        return this.renderBase(preparedValues);
    }    

    renderNumbersColored(values: Array<number>): string {
        const preparedValues = values.map(v => numberToCharColored(v));
        return this.renderBase(preparedValues);
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

export class PuzzleViewText {    
    private _puzzle: Puzzle;
    private _textTemplate: TextTemplate;
    //private _cells

    constructor(template: string, puzzle: Puzzle) {
        this._puzzle = puzzle;
        const templateArr = TextTemplate.trimTemplate(template).split('');
        this._textTemplate = new TextTemplate(template);
    }

    static isCellChar(char: string) {
        return IS_CELL_REG.test(char);
    }

    render(): string {
        const values = this._puzzle.field.map(cell => cell.valueChar);
        return this._textTemplate.render(values);
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
}