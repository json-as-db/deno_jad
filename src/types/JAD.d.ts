export class JADSchema {
    /** 
     * Creates a new schema
     * ```typescript
     * const schema = new JADSchema({
     *    name: 'String',
     *    lastName: {
     *       type: 'String',
     *      required: true
     *    }
     * }, {
     *   timestamp: true
     * })
     * ```
    */
    constructor(schema: SchemaType, schemaOptions?: SchemaOptionsType)

    /** 
     * Validate data against schema
     * @param data Data to validate
     * @returns True if data is valid, false otherwise
    */
    validate(data: Record<string, unknown>): [boolean, string]
}

export type SchemaType = Record<string, 'String' | 'Number' | 'Date' | 'Object' | 'Array' | SchemaTypeOptions>
export type SchemaTypeOptions = {
    type: 'String' | 'Number' | 'Date' | 'Object' | 'Array'
    required?: boolean
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
}
export type SchemaOptionsType = {
    timestamps?: boolean
}