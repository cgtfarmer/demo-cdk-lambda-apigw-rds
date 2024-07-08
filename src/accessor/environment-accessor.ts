
export default class EnvironmentAccessor {

  public get(key: string) {
    const value: string | undefined = process.env[key];

    if (!value) throw new Error(`${key} is undefined`);

    return value;
  }
}
