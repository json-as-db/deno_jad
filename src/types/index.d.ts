import { SchemaOptionsType, SchemaType } from './jad.d.ts'
import { JADModel } from './model.d.ts'

declare module 'JAD' {
    /**
     * Create a new Schema
    */
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

    /**
     * Creates a new model
    */
    export function model(): JADModel
}