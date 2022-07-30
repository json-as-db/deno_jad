import { join } from 'deno-path'
import { JADSchema } from './jad.ts'
import { existsSync, ensureFileSync } from 'deno-fs'
import { ModelDb } from './types/model.d.ts'

export function model(table: string, schema: JADSchema) {
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

    return {
        get,
    }
}

function getJsonConfig() {
    const jsonConfig = join(Deno.cwd(), 'jad.config.json')

    if (!existsSync(jsonConfig)) return ['./', 'jad.db.json']

    const configContent = Deno.readTextFileSync(jsonConfig)
    const config = JSON.parse(configContent)

    return [config.path, config.db]
}