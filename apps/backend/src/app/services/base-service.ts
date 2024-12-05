import { UserEntity } from '../models/db/user-entity'

export type DbStructure = {
    users: UserEntity[],
}
let dbInstance = null;

export class BaseService {

    getDbInstance = () => {        
        if(dbInstance === null) {
            dbInstance = { users: [] } as DbStructure;            
            return dbInstance;            
        }        
        return dbInstance;
    }

    getDb = async (): Promise<DbStructure> => {        
        return this.getDbInstance();
    }
}