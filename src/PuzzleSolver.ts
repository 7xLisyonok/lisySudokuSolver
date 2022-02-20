import { Puzzle } from "./Puzzle.js";
import { PuzzleBlock } from "./PuzzleBlock.js";
import { PuzzleBlockUnique } from "./PuzzleBlockUnique.js";
import { PuzzleCell } from "./PuzzleCell.js";
import { SolverResult, SolverPart, Solve } from "./PuzzleSolverResult.js";
import { createRange } from "./PuzzleUtils.js";
import { numberToChar, PuzzleViewText } from "./PuzzleView.js";
import { Random } from "./Random.js";


import * as readline from "readline";


const HARDEST_NONE = 0;
const HARDEST_EASY = 1;
const HARDEST_FINE = 5;
const HARDEST_HARD = 20;

export class PuzzleSolver {
    private _puzzle: Puzzle;

    constructor(p: Puzzle) {
        this._puzzle = p;
    }

    public solve(view: PuzzleViewText) {
        //this._puzzle.solveString
        const solves: Array<Solve> = [];
        const tempSolves: Array<Solve> = [];
        tempSolves.push(this._puzzle.valuesArray);

        let tempSolvesProccessed = 0;
        const solvesRestart = this._puzzle.fieldLength * 4;
        
        while(tempSolves.length > 0) {
            tempSolvesProccessed++;
            if (tempSolvesProccessed % solvesRestart === 0) {
                console.log('solves found: %s, tempSolvesProccessed: %s, tempSolves.length: %s', solves.length, tempSolvesProccessed, tempSolves.length);
                //const lastSolve = tempSolves[tempSolves.length - 1];
                //console.log('last solve: ', lastSolve.map(v => numberToChar(v)).join(''));
                //const firstSolve = tempSolves[0];
                //console.log('first solve: ', firstSolve.map(v => numberToChar(v)).join(''));
            }
            let currTemp: Solve;
            //
            // TODO: Подумать не над счётчиком заполненных ячеек, отслеживать не количество промежуточных решений,
            // а в целом продвижение вперёд по решению, и если происходит долгое топтание на одном месте только тогда 
            // сбрасывать алгоритм.
            //
            if (tempSolvesProccessed % solvesRestart === 0) {
                //const rndElementh = Math.floor(tempSolves.length / 2);
                //currTemp = tempSolves.splice(rndElementh, 1)[0];
                currTemp = tempSolves.shift();
            } else {
                currTemp = tempSolves.pop();
            } 

            this._puzzle.valuesArray = currTemp;
            const iterationResult = this.solveViaLogic();
            const iterationValues: Solve = this._puzzle.valuesArray;
            
            readline.cursorTo(process.stdout, 0, 0);
            console.log('---------------------------------');
            console.log(view.render());
            console.log('---------------------------------');

            if (this._puzzle.checkFull()) {
                // TODO: Разобраться, нужно ли проверять решение тут?
                // Возможнно логика из-за отсутствия перебора, всегда решает верно и проверки заполненности достаточно.
                //if (this._puzzle.checkFast()) {
                    solves.push(iterationValues);
                //}
                if (solves.length === 1) break;
                continue;
            }

            /*if (!this._puzzle.checkViaCandidates()) {
                console.log('fail');
                continue;
            }*/
            const emptyValues = iterationValues.map((v, i) => ({ value: v, index: i })).filter(v => v.value === 0);
            //const rndCellIndex = emptyValues[rndValueIndex].index;
            //const rndValueIndex = Random.int(0, emptyValues.length);    // Случайный выбор следующей клетки
            //const rndValueIndex = 0;                                    // Заполнение клеток по порядку
            
            // Заполнение по минимальному количеству кандидатов
            const minCandidatesCellFirst = this._puzzle.field
                .filter(c => c.value === 0)
                .reduce((min, c) => {
                    return c.candidates.size < min.candidates.size ? c : min
                });
            if (minCandidatesCellFirst.candidates.size === 0) continue;
            

            const minCandidatesCellList = this._puzzle.field.filter(c => c.candidates.size === minCandidatesCellFirst.candidates.size);
            const minCandidatesCell = minCandidatesCellList[Random.int(0, minCandidatesCellList.length)];

            /*
            // Заполнение по минимальному количеству кандидатов
            const minCandidatesCell = this._puzzle.field
                .filter(c => c.value === 0)
                .reduce((min, c) => c.candidates.size < min.candidates.size ? c : min);
            */
            const rndCellIndex = minCandidatesCell.index;                                    

            //const rndCell = this._puzzle.field[rndCellIndex];
            //const rndCellIndex = iterationValues.findIndex(v => v === 0);
            const rndCell = this._puzzle.field[rndCellIndex];

            const candidates = Array.from(rndCell.candidates);
            if (candidates.length === 0) continue;
            Random.mixArray(candidates);

            const candidatesSolves = this.solveSplitWithArray(iterationValues, rndCellIndex, candidates);
            const filteredCandidatesSolves = candidatesSolves.filter(solveTest => {
                this._puzzle.valuesArray = solveTest;
                const result = this._puzzle.checkViaCandidates();
                return result;
            });

            tempSolves.push(...filteredCandidatesSolves);
        }

        console.log('tempSolvesProccessed: ', tempSolvesProccessed);
        console.log('solves: ', solves.map(solve => solve.map(v => numberToChar(v)).join('')));
    }

    private solveSplitWithSet(solve: Solve, index: number, candidates: Set<number>): Array<Solve> {
        return this.solveSplitWithArray(solve, index, Array.from(candidates));
    }

    private solveSplitWithArray(solve: Solve, index: number, candidates: Array<number>): Array<Solve> {
        return candidates.map(candidateValue => this.solveSplitOne(solve, index, candidateValue));
    }

    private solveSplitOne(solve: Solve, index: number, candidateValue: number): Solve {
        const newSolve = solve.slice();
        newSolve[index] = candidateValue;
        return newSolve;
    }

    public solveViaLogic(): SolverResult {
        const result = new SolverResult();

        do {
            do {} while(result.addPart(this.solveViaBlocksOnce()) )
        } while( result.addPart(this.solveViaCellsOnce()) )

        return result;
    }

    /**
     * solve puzzle via blocks features
     */
    public solveViaBlocksOnce(): SolverPart {
        const result = new SolverPart(HARDEST_EASY);
        this._puzzle.blocks.map(block => result.changed.push(...this.solveViaBlock(block)));
        return result;
    }    

    /**
     * solve puzzle via cell's candidates
     */
    public solveViaCellsOnce(): SolverPart {
        let solvedCellsCount = 0;
        const result = new SolverPart(HARDEST_FINE);
        this._puzzle.field.forEach(cell => {
            if (!cell.isActive) return;

            const candidates = cell.candidates;
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
            const cellCandidates = cell.candidates;
            cellCandidates.forEach(cValue => blockCandidates[cValue - 1].cells.push(cell));
        });

        /*const hasBadBlockCandidates = blockCandidates.filter(bc => bc.cells.length === 0 && bc.value > 0);
        if (hasBadBlockCandidates.length > 2) {
            console.log(blockCandidates);
            throw new Error(" FAIL ");
        }*/

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

