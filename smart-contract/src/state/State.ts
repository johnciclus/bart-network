export class State {

  static serialize(data) {
    return Buffer.from(JSON.stringify(data));
  }

  static deserialize(data: Buffer) {
    return JSON.parse(data.toString());
  }
}
