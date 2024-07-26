import User from '../model/user';

export default class UserMapper {

  constructor() { }

  public fromAny(value: any) {
    return new User(
      value.id,
      value.firstName,
      value.lastName,
      value.age,
      value.weight,
      value.smoker
    )
  }
}
