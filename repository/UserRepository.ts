import User from "../model/User.model";

class UserRepository {
    findUserByUsername(username: string) {
        const user = User.findOne({ where: { username: username } });
        return user;
    }
    findUserByEmail(email: string){
        const user = User.findOne({ where: { email } });
        return user;
    }
    findUserById(id: number){
        const user = User.findOne({ where: { id }});
        return user;
    }
}

export default new UserRepository();
