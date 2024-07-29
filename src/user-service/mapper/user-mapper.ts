import User from '../dto/user';
import UserEntity from '../entity/user-entity';

export default class UserMapper {

  public toUserEntity(user: User): UserEntity {
    return {
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      age: user.age,
      weight: user.weight,
      smoker: user.smoker,
    }
  }

  public fromUserEntity(userEntity: UserEntity): User {
    return {
      id: userEntity.id,
      firstName: userEntity.first_name,
      lastName: userEntity.last_name,
      age: userEntity.age,
      weight: userEntity.weight,
      smoker: userEntity.smoker,
    }
  }
}
