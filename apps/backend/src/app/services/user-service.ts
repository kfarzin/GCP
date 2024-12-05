import { UserEntity } from '../models/db/user-entity';
import { BaseService } from './base-service';
import bcrypt from 'bcrypt';


export class UserService extends BaseService {

    getUserByEmail = async (email: string): Promise<UserEntity | null> => {
        const db = await this.getDb();
        const user = db.users.find(e => e.email === email);
        return user;
    }

    insertUserIfNotExists = async (email: string, password: string): Promise<UserEntity | boolean> => {
        try {
            const db = await this.getDb();
            const currentUser = await this.getUserByEmail(email);
            if (!currentUser) {
                const salt = await bcrypt.genSalt();
                const hashedPassword = await bcrypt.hash(password, salt);
                db.users.push({
                    email,
                    password: hashedPassword,
                })
                return true;
            }
            return false

        } catch {
            return false
        }
    }

    verifyUser = async (email: string, password: string): Promise<UserEntity | boolean> => {
        try {
            const user = await this.getUserByEmail(email);
            if (user) {                
                const passwordMatched = await bcrypt.compare(password, user.password);
                if (passwordMatched) {
                    return true
                }
            }
            return false
        } catch {
            return false
        }
    }
}