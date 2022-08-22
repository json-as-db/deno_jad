import { Schema } from './schema.ts'
import { existsSync, ensureFileSync, join } from '../deps.ts'
import { ModelDb, JADModel, ModelItem } from '../types/model.d.ts'

/**
 * Create a new JAD Model
 * @param table
 * The table name in the database
 * @param schema
 * The JAD Schema for the model
*/
export function model(table: string, schema: Schema): JADModel {
    if (!table) throw new Error('table is required')
    if (!schema) throw new Error('schema is required')

    const [path, db] = getJsonConfig()
    const dbPath = join(Deno.cwd(), path, db)

    if (!existsSync(dbPath)) {
        ensureFileSync(dbPath)
        Deno.writeTextFileSync(dbPath, '{}')
    }

    async function getData() {
        const dbContent = await Deno.readTextFile(dbPath)
        const dbData = dbContent === '' ? {} : JSON.parse(dbContent)

        if (!dbData[table]) dbData[table] = []

        return dbData as ModelDb
    }

    async function get() {
        const dbData = await getData()
        return dbData[table]
    }

    async function getById(id: string) {
        const dbData = await getData()
        return dbData[table].find(item => item._id === id)!
    }

    async function create(data: ModelItem) {
        const dbData = await getData()
        const [isValidated, errors] = schema.validate(data)

        if (!isValidated) throw new Error(errors)

        data._id = randomId()

        if (schema.schemaOptions?.timestamps) {
            data.createdAt = new Date()
            data.updatedAt = new Date()
        }

        dbData[table].push(data)

        await Deno.writeTextFile(dbPath, JSON.stringify(dbData, null, 4))
        return data
    }

    async function updateById(id: string, data: ModelItem) {
        const dbData = await getData()
        const item = dbData[table].find(item => item._id === id)!

        if (!item) throw new Error('item not found')

        const [isValidated, errors] = schema.validate(data)

        if (!isValidated) throw new Error(errors)

        if (schema.schemaOptions?.timestamps) {
            item.updatedAt = new Date()
        }

        Object.assign(item, data)

        await Deno.writeTextFile(dbPath, JSON.stringify(dbData, null, 4))
    }

    async function deleteById(id: string) {
        const dbData = await getData()
        const item = await getById(id)

        if (!item) throw new Error('item not found')

        dbData[table] = dbData[table].filter(item => item.id !== id)

        await Deno.writeTextFile(dbPath, JSON.stringify(dbData, null, 4))
    }


    return {
        get,
        getById,
        create,
        updateById,
        deleteById
    }
}

function getJsonConfig() {
    const jsonConfig = join(Deno.cwd(), 'jad.config.json')

    if (!existsSync(jsonConfig)) return ['./', 'jad.json']

    const configContent = Deno.readTextFileSync(jsonConfig)
    const config = JSON.parse(configContent)

    return [config.path, config.db]
}

export function randomId(len = 20) {
    let now = new Date().getTime()
    const rid = 'x'.repeat(len).replace(/[x]/g, () => {
        const random = (now + Math.random() * 16) % 16 | 0
        now = Math.floor(now / 16)

        return random.toString(16)
    })

    return rid
}
