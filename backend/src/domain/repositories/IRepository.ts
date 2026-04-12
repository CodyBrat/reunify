export interface IRepository<T> {
    findById(id: string): Promise<T | null>;
    findAll(): Promise<T[]>;
    save(entity: T): Promise<T>;
    update(id: string, entity: T): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}
