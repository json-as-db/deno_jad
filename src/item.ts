export class Item {
    #table: string

    constructor(table: string, obj: Record<string, unknown>) {
        this.#table = table
        for (const key in obj) {
            (this as Record<string, unknown>)[key] = obj[key]
        }
    }
}