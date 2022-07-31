export interface JADModel {
    /** 
     * Get all data from table
     */
    get(): Promise<ModelTable>

    /**
     * Get data from table by id
     */
    getById(id: string): Promise<ModelItem>

    /**
     * Create new data in table
    */
    create(data: ModelItem): Promise<ModelItem>

    /**
     * Update data in table by id
     */
    updateById(id: string, data: ModelItem): Promise<void>

    /**
     * Delete data in table by id
     */
    deleteById(id: string): Promise<void>
}

export type ModelDb = Record<string, ModelTable>
export type ModelTable = Array<ModelItem>
export type ModelItem = Record<string, string | number | boolean>