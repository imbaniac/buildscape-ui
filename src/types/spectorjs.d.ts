declare module 'spectorjs' {
  export namespace SPECTOR {
    export class Spector {
      constructor();
      displayUI(): void;
      captureCanvas(canvas: HTMLCanvasElement): void;
      getFps(): number;
      getCaptures(): any[];
      captureNextFrame(delay?: number): void;
      capture(): void;
      startCapture(): void;
      stopCapture(): void;
      setMarker(marker: string): void;
    }
  }
}