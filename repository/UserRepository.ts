import User from "../model/User.model";

class UserRepository {
    findUserByUsername(username: string) {
        const user = User.findOne({ where: { username: username } });
        return user;
    }
}

export default new UserRepository();
