import { JADOptions } from './jad.d.ts'
import { ModelTable } from './model.d.ts'

declare class JADSchema {

    /** 
     * Creates a new schema
    */
    constructor(options: JADOptions)

    /** 
     * Validate data against schema
     * @param data Data to validate
     * @returns True if data is valid, false otherwise
    */
    validate(data: Record<string, unknown>): boolean
}

export function model() {
    function get(): Promise<ModelTable>
}