import { JSONDatabase } from './src/database.ts'

const db = new JSONDatabase('users')

console.log(await db.findById('1'))