import { PuzzleBlock, PuzzleBlockCheckResult } from "./PuzzleBlock.js";
import { PuzzleCell } from "./PuzzleCell.js";

export class PuzzleBlockUnique extends PuzzleBlock {
    checkFast() {
        const valuesList = new Set();

        return Array.from(this.cells).every(cell => {
            if (cell.value === 0) return true;

            if (valuesList.has(cell.value)) return false;

            valuesList.add(cell.value);
            return true;
        });
    }

    checkFull() {
        const valuesList = [];

        this.cells.forEach(cell => {
            if (cell.value === 0) return;

            if (cell.value in valuesList) {
                valuesList[cell.value]++;
            } else {
                valuesList[cell.value] = 1;
            }
        });

        const badValuesList = valuesList.map((count, value) => count > 1 ? value : null).filter(e => !!e);

        const cr = new PuzzleBlockCheckResult();        
        if (badValuesList.length === 0) {
            cr.result = true;
        } else {
            cr.result = false;
            cr.wrongCells = Array.from(this.cells).filter(cell => badValuesList.indexOf(cell.value) !== -1);
        }
        return cr;
    }

    override removeCandidates(candidatesList: Set<number>, cell: PuzzleCell) {
        this.cells.forEach(blockCell => {
            if (blockCell === cell) return;
            if (blockCell.value === 0) return;
            candidatesList.delete(blockCell.value);
        })
    }

    override solve(): Array<PuzzleCell> {
        //const 

        return [];
    }
}