import { Puzzle } from "../Puzzle.js";
import { PuzzleBlockUnique } from "../PuzzleBlockUnique.js";

describe('Block checking tests', () => {
    it('Check unique block 4123 must be true', () => {
        const p = new Puzzle(4);
        const blockTest = new PuzzleBlockUnique(p);
        
        blockTest.addCell(
            p.addCell(4),
            p.addCell(1),
            p.addCell(2),
            p.addCell(3),
        );  
    
        expect(blockTest.checkFast()).toBe(true);
    });
   
    it('Check unique block 4122 must be false', () => {
        const p = new Puzzle(4);
        const blockTest = new PuzzleBlockUnique(p);
        
        blockTest.addCell(
            p.addCell(4),
            p.addCell(1),
            p.addCell(2),
            p.addCell(2),
        );  
    
        expect(blockTest.checkFast()).toBe(false);
    });
});

//console.log(blockTest.checkFull());
