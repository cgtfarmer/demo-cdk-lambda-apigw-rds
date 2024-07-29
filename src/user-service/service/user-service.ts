import User from '../dto/user';
import UserEntity from '../entity/user-entity';
import UserMapper from '../mapper/user-mapper';
import UserRepository from '../repository/user-repository';

export default class UserService {

  private readonly userRepository: UserRepository;

  private readonly userMapper: UserMapper;

  constructor(userRepository: UserRepository, userMapper: UserMapper) {
    this.userRepository = userRepository;
    this.userMapper = userMapper;
  }

  public async findAll() {
    console.log(`[UserService#findAll]`);

    const results = await this.userRepository.findAll();

    const users = results.map(e => this.userMapper.fromUserEntity(e));

    return users;
  }

  public async findById(id: number) {
    console.log(`[UserService#findById] ${id}`);

    const result: UserEntity = await this.userRepository.findById(id);

    const user = this.userMapper.fromUserEntity(result);

    return user;
  }

  public async create(user: User) {
    console.log(`[UserService#create] ${JSON.stringify(user)}`);

    const userEntity = this.userMapper.toUserEntity(user);

    const result = await this.userRepository.create(userEntity);

    const formattedResult = this.userMapper.fromUserEntity(result);

    return formattedResult;
  }

  public async update(user: User) {
    console.log(`[UserService#update] ${JSON.stringify(user)}`);

    const userEntity = this.userMapper.toUserEntity(user);

    const result = await this.userRepository.update(userEntity);

    const formattedResult = this.userMapper.fromUserEntity(result);

    return formattedResult;
  }

  public async destroy(id: number) {
    console.log(`[UserService#destroy] ${id}`);

    await this.userRepository.destroy(id);
  }
}
