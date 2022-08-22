import { existsSync, ensureFileSync, join } from '../deps.ts'
import { Item } from './item.ts'

type ModelDb = Record<string, ModelTable>
type ModelTable = Array<ModelItem>
type ModelItem = {
    _id: string
    createdAt?: string | Date | unknown
    updatedAt?: string | Date | unknown
    [key: string]: string | number | boolean | Record<string, unknown> | Array<unknown> | unknown
}


export class JSONDatabase {
    #table: string

    constructor(table: string) {
        this.#table = table
    }

    async create(data: ModelItem): Promise<Item> {
        const dbData = await this.#getData()
        data._id = this.#randomId()
        dbData[this.#table].push(data)

        await Deno.writeTextFile(this.#path, JSON.stringify(dbData, null, 4))
        return new Item(this.#table, data)
    }

    async find(): Promise<ModelTable> {
        const dbData = await this.#getData()
        return dbData[this.#table]
    }

    async findById(id: string): Promise<Item> {
        const dbData = await this.#getData()
        const item = dbData[this.#table].find(item => item._id === id)!
        return new Item(this.#table, item)
    }

    async findByIdAndUpdate(id: string, data: ModelItem): Promise<Item> {
        const dbData = await this.#getData()
        const item = dbData[this.#table].find(item => item._id === id)!

        if (!item) throw new Error('Item not found')

        Object.assign(item, data)

        await Deno.writeTextFile(this.#path, JSON.stringify(dbData, null, 4))
        return new Item(this.#table, item)
    }

    async findByIdAndRemove(id: string): Promise<{ success: number }> {
        const dbData = await this.#getData()
        const item = dbData[this.#table].find(item => item._id === id)!

        if (!item) return { success: 0 }

        dbData[this.#table] = dbData[this.#table].filter(item => item._id !== id)

        await Deno.writeTextFile(this.#path, JSON.stringify(dbData, null, 4))
        return { success: 1 }
    }

    async #getData(): Promise<ModelDb> {
        if (!existsSync(this.#path)) {
            ensureFileSync(this.#path)
            Deno.writeTextFileSync(this.#path, '{}')
        }

        const dbContent = await Deno.readTextFile(this.#path)
        const dbData = dbContent === '' ? {} : JSON.parse(dbContent)

        if (!dbData[this.#table]) dbData[this.#table] = []

        return dbData
    }

    get #config(): Array<string> {
        const jsonConfig = join(Deno.cwd(), 'json.config.json')

        if (!existsSync(jsonConfig)) return ['./', 'jad.json']

        const config = JSON.parse(Deno.readTextFileSync(jsonConfig))

        return [config.path, config.db]
    }

    get #path(): string {
        const [path, db] = this.#config
        return join(path, db)
    }

    #randomId(len = 20) {
        let now = new Date().getTime()
        const rid = 'x'.repeat(len).replace(/[x]/g, () => {
            const random = (now + Math.random() * 16) % 16 | 0
            now = Math.floor(now / 16)

            return random.toString(16)
        })

        return rid
    }
}