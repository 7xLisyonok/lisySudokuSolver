import { createPuzzle } from '7x-sudoku-solver';

// простой: 000000012000035000000600070700000300000400800100000000000120000080000040050000600
//          6738945..9127..486845.129.3.98261.54526.73.91.34589267469..87352.73561.93.1947.28
//          673894512912735486845612973798261354526473891134589267469128735287356149351947628

// нормальный: 000000012003600000000007000410020000000500300700000600280000040000300500000000000
// сложный: 000000012008030000000000040120500000000004700060000000507000300000620000000100000

export const example = createPuzzle({
    task: '000000012008030000000000040120500000000004700060000000507000300000620000000900005',

/*
    task: `
       ┌─────┬─────┬─────┐
       │. . .│. . .│. 1 2│
       │. . 8│. 3 .│. . .│
       │. . .│. . .│. 4 .│
       ├─────┼─────┼─────┤
       │1 2 .│5 . .│. . .│
       │. . .│. . 4│7 . .│
       │. 6 .│. . .│. . .│
       ├─────┼─────┼─────┤
       │5 . 7│. . .│3 . .│
       │. . .│6 2 .│. . .│
       │. . .│9 . .│. . 5│
       └─────┴─────┴─────┘
    `,
*/
    size: 9,
    
    blocks: [
        {
            group: 'horizontal lines',
            type: 'unique',
            cells: `
                1 1 1 1 1 1 1 1 1
                2 2 2 2 2 2 2 2 2 
                3 3 3 3 3 3 3 3 3 
                4 4 4 4 4 4 4 4 4 
                5 5 5 5 5 5 5 5 5 
                6 6 6 6 6 6 6 6 6 
                7 7 7 7 7 7 7 7 7 
                8 8 8 8 8 8 8 8 8 
                9 9 9 9 9 9 9 9 9 
            `,
        },
        {
            group: 'vertical lines',
            type: 'unique',
            cells: `
                1 2 3 4 5 6 7 8 9
                1 2 3 4 5 6 7 8 9
                1 2 3 4 5 6 7 8 9
                1 2 3 4 5 6 7 8 9
                1 2 3 4 5 6 7 8 9
                1 2 3 4 5 6 7 8 9
                1 2 3 4 5 6 7 8 9
                1 2 3 4 5 6 7 8 9
                1 2 3 4 5 6 7 8 9
            `,
        },
        
        {
            group: 'classic sudoku blocks',
            type: 'unique',
            cells: `
                1 1 1 2 2 2 3 3 3
                1 1 1 2 2 2 3 3 3
                1 1 1 2 2 2 3 3 3
                4 4 4 5 5 5 6 6 6
                4 4 4 5 5 5 6 6 6
                4 4 4 5 5 5 6 6 6
                7 7 7 8 8 8 9 9 9
                7 7 7 8 8 8 9 9 9
                7 7 7 8 8 8 9 9 9
            `,
        },
    ],
});