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

    /**
     * randomly change array's elements order
     */
    static mixArray<T>(array: Array<T>): void {
        for(let i1 = 0; i1 < array.length; i1++) {
            const i2 = Random.int(0, array.length);

            const i1Val = array[i1];
            array[i1] = array[i2];
            array[i2] = i1Val;
        }
    }
}


// TODO: extends IntMixer from array?
class IntMixer {
    private _arr: Array<number> = [];
    private _length: number
    forEach = this._arr.forEach
    map = this._arr.map

    constructor (
        private _from: number, 
        private _to: number
    ) {
        this._length = this._to - this._from;
        this.createArray();

        if (this._length  <= 0) {
            throw new Error("IntMixer length <= 0");
        }
    }

    private createArray() {
        this._arr = Array.from({ length: this._length }, (_, i) => i + this._from);
        Random.mixArray(this._arr);
    }

    has(count: number) {
        return this._arr.length >= count;
    }

    read(): number | undefined {
        return this._arr.pop();
    }

    readLoop(count: number): Array<number> {
        if (this.has(count)) return this._arr.splice(-count);        
        const result = this._arr;
        this.createArray();
        result.push(...this.readLoop(count - result.length));
        return result;
    }
}