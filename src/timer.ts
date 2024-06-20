export class Timer {
  private startTime: number = 0;
  private elapsedTime: number = 0;
  private setTimeId: number | null = null;

  private timer = document.getElementById('timer');
  constructor() {}

  public start() {
    // const time: Date = new Date(Date.now() - this.startTime);
    // const minutes: string = String(time.getMinutes()).padStart(2, '0');
    // const seconds: string = String(time.getSeconds()).padStart(2, '0');

    // this.timeNumberMinutes.text(`0`).padStart(2, '0');
    // this.timeNumberSeconds.text(String(`. ${+seconds % 60}`).padStart(2, '0'));

    if (this.setTimeId === null) {
      this.startTime = Date.now() - this.elapsedTime;
      this.setTimeId = window.setInterval(() => {
        this.elapsedTime = Date.now() - this.startTime;
        const seconds = Math.floor(this.elapsedTime / 1000);
        const minutes = Math.floor(seconds / 60);

        const strSeconds = String(seconds % 60).padStart(2, '0');
        const strMinutes = String(minutes % 60).padStart(2, '0');

        // this.timeNumberSeconds.text(`.${strSeconds}`);
        // this.timeNumberMinutes.text(`${strMinutesm}`);

        this.timer!.textContent = `${strMinutes}:${strSeconds}`;
      }, 1000);

      // window.setTimeout(() => {
      //   this.start();
      // }, 100);

      // this.timeNumberMinutes.text(`${minutes}`);
      // this.timeNumberSeconds.text(`.${seconds}`);
    }
  }

  public pause = () => {
    if (this.setTimeId !== null) {
      clearInterval(this.setTimeId);
      this.setTimeId = null;
    }
  };

  public reset = () => {
    this.pause();
    this.setTimeId = null;
    this.elapsedTime = 0;
    this.timer!.textContent = '00:00';
  };

  public switchTimer = () => {
    if (this.setTimeId === null) {
      this.start();
    } else {
      this.pause();
    }
  };
}
