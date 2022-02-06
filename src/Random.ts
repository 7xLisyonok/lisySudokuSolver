export class Random {
    /**
     * generate random int [from...to)
     */
    static int(from: number, to: number) {
        const len = to - from;
        return Math.floor(Math.random() * len) + from;
    }

    /**
     * generate two different(if its possible) random int [from...to)
     */
     static intPair(from: number, to: number) {
        let newRandom1 = Random.int(from, to);
        let newRandom2 = Random.int(from, to);

        while (newRandom1 === newRandom2) {
            if (to - from <= 1) break;
            newRandom2 = Random.int(from, to);
        }
        
        return [newRandom1, newRandom2];
    }

    /**
     * create mixer with random ints [from...to)
     */
    static intMixer(from: number, to: number): IntMixer {
        return new IntMixer(from, to);
    }
}



class IntMixer {
    private _arr: Array<number> = [];
    private _length: number


    constructor (
        private _from: number, 
        private _to: number
    ) {
        this._length = this._to - this._from;
        this.createArray();

        if (this._length  <= 0) {
            throw new Error("\x1b[31m\x1b[1m IntMixer length <= 0 \x1b[0m");
        }
    }

    private createArray() {
        this._arr = Array.from({ length: this._length }, (_, i) => i + this._from);
        
        for(let i1 = 0; i1 < this._arr.length; i1++) {
            const i2 = Random.int(0, this._arr.length);

            const i1Val = this._arr[i1];
            this._arr[i1] = this._arr[i2];
            this._arr[i2] = i1Val;
        }
    }

    has(count: number) {
        return this._arr.length >= count;
    }

    readLoop(count: number): Array<number> {
        if (this.has(count)) return this._arr.splice(-count);        
        const result = this._arr;
        this.createArray();
        result.push(...this.readLoop(count - result.length));
        return result;
    }
}