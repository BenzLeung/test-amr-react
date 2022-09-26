/**
 * @file A Simple Timer
 * @author Benz(https://github.com/BenzLeung)
 * @date 2022-09-25
 * Created by JetBrains WebStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

export class Timer {
  private _id: number = 0;
  public constructor(
    private _fn: Function,
    private _interval: number,
  ) {}
  public start() {
    if (this._id) {
      this.stop();
    }
    this._id = window.setInterval(this._fn, this._interval);
  }
  public stop() {
    if (this._id) {
      window.clearInterval(this._id);
      this._id = 0;
    }
  }
  public setFunction(fn: Function) {
    this._fn = fn;
  }
  public setInterval(interval: number) {
    this._interval = interval;
  }
}

export default Timer;
