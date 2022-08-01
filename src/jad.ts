import { SchemaOptionsType, SchemaType, JADSchema } from './types/jad.d.ts'

/**
 * Create a new JAD Schema
*/
export class Schema implements JADSchema {
    schema!: SchemaType
    schemaOptions: SchemaOptionsType | undefined

    /**
     * @param schema
     * Creates a new Schema object
     * ```typescript
     * {
     *     name: 'String',
     *     age: {
     *         type: 'Number',
     *         required: true,
     *     }
     * }
     * ```
     * @param schemaOptions
     * Schema options
     * ```typescript
     * {
     *     timestamps: true,
     * }
    */
    constructor(schema: SchemaType, schemaOptions?: SchemaOptionsType) {
        this.schema = schema
        this.schemaOptions = schemaOptions
    }

    /**
     * Validate a value against the schema
     * @param value
     * Value to validate
    */
    validate(data: Record<string, unknown>): [boolean, string] {
        if (typeof data !== 'object') return [false, 'data is not an object']

        const schema = this.schema

        for (const dataKey in data) {
            if (!schema.hasOwnProperty(dataKey)) return [false, `schema has no property ${dataKey}`]
        }
        for (const key in schema) {
            const value = schema[key]
            const dataValue = data[key]

            if (typeof value === 'object' && !!dataValue) {
                if (value.required === true && typeof dataValue === 'undefined') return [false, `${key} is required`]
                if (value.type === 'String') {
                    if (typeof dataValue !== 'string') return [false, `${key} is not a string`]
                    if (value.minLength && dataValue.length < value.minLength) return [false, `${key} is too short`]
                    if (value.maxLength && dataValue.length > value.maxLength) return [false, `${key} is too long`]
                }
                if (value.type === 'Number') {
                    if (typeof dataValue !== 'number') return [false, `${key} is not a number`]
                    if (value.min && dataValue < value.min) return [false, `${key} is too low`]
                    if (value.max && dataValue > value.max) return [false, `${key} is too high`]
                }
                if (value.type === 'Date') {
                    if (typeof dataValue !== 'object') return [false, `${key} is not a date`]
                }
                if (value.type === 'Object') {
                    if (typeof dataValue !== 'object') return [false, `${key} is not an object`]
                }
                if (value.type === 'Array') {
                    if (typeof dataValue !== 'object') return [false, `${key} is not an array`]
                }
            } else if (typeof value === 'string' && !!dataValue) {
                if (value === 'String' && typeof dataValue !== 'string') return [false, `${key} is not a string`]
                if (value === 'Number' && typeof dataValue !== 'number') return [false, `${key} is not a number`]
                if (value === 'Date' && typeof dataValue !== 'object') return [false, `${key} is not a date`]
                if (value === 'Object' && typeof dataValue !== 'object') return [false, `${key} is not an object`]
                if (value === 'Array' && typeof dataValue !== 'object') return [false, `${key} is not an array`]
            }
        }

        return [true, '']
    }
}