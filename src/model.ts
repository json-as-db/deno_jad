import { Schema } from './jad.ts'
import { existsSync, ensureFileSync, join } from '../deps.ts'
import { ModelDb, JADModel, ModelItem } from './types/model.d.ts'

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
        const dbData = JSON.parse(dbContent)

        if (!dbData[table]) dbData[table] = []

        return dbData as ModelDb
    }

    async function get() {
        const dbData = await getData()
        return dbData[table]
    }

    async function getById(id: string) {
        const dbData = await getData()
        return dbData[table].find(item => item.id === id)!
    }

    async function create(data: ModelItem) {
        try {
            const dbData = await getData()
            const [isValidated, errors] = schema.validate(data)

            if (!isValidated) throw new Error(errors)

            data._id = crypto.randomUUID()

            if (schema.schemaOptions?.timestamps) {
                data.createdAt = new Date()
                data.updatedAt = new Date()
            }

            dbData[table].push(data)

            await Deno.writeTextFile(dbPath, JSON.stringify(dbData))
            return data
        } catch (error) {
            throw error
        }
    }

    async function updateById(id: string, data: ModelItem) {
        try {
            const dbData = await getData()
            const item = dbData[table].find(item => item.id === id)!

            if (!item) throw new Error('item not found')

            const [isValidated, errors] = schema.validate(data)

            if (!isValidated) throw new Error(errors)

            if (schema.schemaOptions?.timestamps) {
                item.updatedAt = new Date()
            }
            Object.assign(item, data)

            await Deno.writeTextFile(dbPath, JSON.stringify(dbData))
        } catch (error) {
            throw error
        }
    }

    async function deleteById(id: string) {
        try {
            const dbData = await getData()
            const item = dbData[table].find(item => item.id === id)!

            if (!item) throw new Error('item not found')

            dbData[table] = dbData[table].filter(item => item.id !== id)

            await Deno.writeTextFile(dbPath, JSON.stringify(dbData))
        } catch (error) {
            throw error
        }
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

    if (!existsSync(jsonConfig)) return ['./', 'jad.db.json']

    const configContent = Deno.readTextFileSync(jsonConfig)
    const config = JSON.parse(configContent)

    return [config.path, config.db]
}