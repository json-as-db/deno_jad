import { SchemaOptionsType, SchemaType } from './types/jad.d.ts'

export class Schema {
    schema!: SchemaType
    schemaOptions: SchemaOptionsType | undefined

    construnctor(schema: SchemaType, schemaOptions?: SchemaOptionsType) {
        this.schema = schema
        this.schemaOptions = schemaOptions
    }

    validate(data: Record<string, unknown>): boolean {
        if (typeof data !== 'object') return false

        const schema = this.schema

        for (const key in data) {
            const value = schema[key]

            if (!schema.hasOwnProperty(key)) return false

            const dataValue = data[key]

            if (typeof value === 'object') {
                if (value.required === true && typeof dataValue === 'undefined') return false
                if (value.type === 'String') {
                    if (typeof dataValue !== 'string') return false
                    if (value.minLength && dataValue.length < value.minLength) return false
                    if (value.maxLength && dataValue.length > value.maxLength) return false
                }
                if (value.type === 'Number') {
                    if (typeof dataValue !== 'number') return false
                    if (value.min && dataValue < value.min) return false
                    if (value.max && dataValue > value.max) return false
                }
                if (value.type === 'Date') {
                    if (typeof dataValue !== 'object') return false
                }
                if (value.type === 'Object') {
                    if (typeof dataValue !== 'object') return false
                }
                if (value.type === 'Array') {
                    if (typeof dataValue !== 'object') return false
                }
            } else if (typeof value === 'string') {
                if (value === 'String' && typeof dataValue !== 'string') return false
                if (value === 'Number' && typeof dataValue !== 'number') return false
                if (value === 'Date' && typeof dataValue !== 'object') return false
                if (value === 'Object' && typeof dataValue !== 'object') return false
                if (value === 'Array' && typeof dataValue !== 'object') return false
            }
        }

        return true
    }
}