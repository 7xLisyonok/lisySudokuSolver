import { PuzzleCell } from "./PuzzleCell.js";

export type Solve = Array<number>;

export class SolverPart {
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

export class SolverResult {
    solves: Array<Solve> = [];
    parts: Array<SolverPart> = [];

    constructor(...parts: Array<SolverPart>) {
        this.addPart(...parts);
    }

    addPart(...parts: Array<SolverPart>): number {
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