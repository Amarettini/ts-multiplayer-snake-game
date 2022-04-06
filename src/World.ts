export default class World {
  constructor(
    private borderX: number,
    private borderY: number,
    private borderW: number, // border width
    private borderH: number //  border height
  ) {}

  public resolveCollision(entityX: number, entityY: number): boolean {
    // true if position is valid, false otherwise
    // collision with rectangle world box
    if(
      entityY < this.borderY ||
      entityX >= this.borderW ||
      entityY >= this.borderH ||
      entityX < this.borderX
    ) {
      return false;
    }
    return true;
  }
}