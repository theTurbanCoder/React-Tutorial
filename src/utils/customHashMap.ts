type KeyValuePair<K, V> = [K, V]

type bucket<K, V> = Array<KeyValuePair<K, V>>


class CustomHashMap<K, V> {

    private table: (bucket<K, V> | undefined)[]
    private capacity: number
    private size: number
    private resizeThreshold: number

    constructor(initialCapacity: number = 101) {
        this.table = new Array(initialCapacity).fill(undefined)
        this.capacity = initialCapacity
        this.size = 0
        this.resizeThreshold = 0.75
    }



    private _hash = (key: K) => {

        const k = String(key)
        let hashv = 0

        const P = 31 // prime number multiplier 

        for (let i = 0; i < k.length; i++) {

            const char = k[i]

            const code = char.charCodeAt(0)

            hashv = (hashv * P) + code

        }

        const index = hashv % this.capacity
        return index

    }


    private _resize = () => {
        if (this.size / this.capacity > this.resizeThreshold) {
            console.log(`Resizing... Load Factor: ${this.size / this.capacity}`);

            const newCap = this.capacity * 2

            const oldCap = this.capacity


            const oldTable = this.table

            this.capacity = newCap


            const newTable = new Array(this.capacity).fill(undefined)

            this.table = newTable


            for (const bucket of oldTable) {

                if (bucket) {

                    for (const [key, value] of bucket) {

                        this.add(key, value)

                    }


                }


            }

        }
    }


    add = (key: K, value: V) => {

        const index = this._hash(key)

        let bucket = this.table[index]

        /**
         *  bucket can be null / undefined 
        */

        if (bucket === undefined) {
            this.table[index] = [[key, value]]
            this.size++
            this._resize()
            return
        }


        for (let i = 0; i < bucket.length; i++) {


            const [bk, _] = bucket[i]

            if (bk === key) {
                bucket[i][1] = value
                return
            }
        }


        bucket.push([key, value])
        this.size++
        this._resize()

    }

    has = (index: number): boolean => {

        if (this.table[index]) {
            return true
        }

        return false
    }

    get = (key: K): V | undefined => {

        const index = this._hash(key)
        if (this.has(index)) {

            const bucket = this.table[index]
            if (bucket) {
                for (let i = 0; i < bucket.length; i++) {


                    const [k, value] = bucket[i]

                    if (k === key) {
                        return value
                    }

                }
            }

            return undefined
        }

        return undefined
    }

    delete = (key: K): boolean => {

        const index = this._hash(key)
        if (!this.has(index)) {
            return false
        }


        const bucket = this.table[index]
        if (bucket) {
            for (let i = 0; i < bucket.length; i++) {

                if (bucket[i][0] === key) {
                    bucket.splice(i, 1)
                    this.size--

                    if (bucket.length === 0) {
                        this.table[index] = undefined
                    }
                    return true
                }

            }
        }


        return false

    }
}