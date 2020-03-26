import { Colors } from 'vima';

// Script scope
(function() {

  function makeWorld(canvas: HTMLCanvasElement, initd: number, targd: number) {

    // Create the 2D context used for drawing
    let context: CanvasRenderingContext2D = canvas.getContext('2d')!;

    // Set the proper size
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    let totalTime: number = 0;
    let previousTime: number = new Date().getTime() / 1000.0;
    let timeFloor: number = 0;

    /**
     * Clears the global context
     * @param color Color to use for clearing
     */
    function clear(color: string) {
      context.fillStyle = color;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    let seg: number = 0;
    let positions: number[] = [];
    function create() {
      positions = [];
      seg = 0;
      for (let i = 0; i < 10; ++i) {
        positions.push(canvas.width / 2 + initd * (i - 4.5));
      }

      initd = positions[1] - positions[0];
    }
    create();

    function relax(i: number) {
      let diff: number = positions[i + 1] - positions[i] - targd;
      positions[i] += diff / 2;
      positions[i + 1] -= diff / 2;
    }

    function work() {
      relax(seg);
      seg += 1;
      if (seg === positions.length - 1) {
        seg = 0;
      }
    }

    let playing: boolean = false;
    canvas.addEventListener('click', () => {
      playing = !playing;
    });
    canvas.addEventListener('dblclick', () => {
      playing = false;
      create();
    })


    function looper() {
      const time: number = new Date().getTime() / 1000;
      const dt: number = Math.min(time - previousTime, 1); // Cap dt at 1 second
      previousTime = time;
      totalTime += dt;

      if (Math.floor(totalTime * 5) > timeFloor && playing) {
        work();
        timeFloor = Math.floor(totalTime * 5);
      }

      clear(Colors.backgroundColor.value.toCSS(false));

      for (let i: number = 0; i < positions.length - 1; ++i) {
        const p1: number = positions[i];
        const p2: number = positions[i + 1];
        context.fillStyle = 'salmon';
        context.fillRect(p1, 0, p2 - p1, canvas.height);
        let perc: number = 1 - Math.abs(Math.abs(p2 - p1) - targd) / Math.abs(targd - initd);
        if (perc < 0) {
          context.fillStyle = `rgba(250, 138, 124, ${ -perc })`;
          context.fillRect(p1, 0, p2 - p1, canvas.height);
        } else {
          context.fillStyle = `rgba(30, 144, 255, ${ perc })`;
          context.fillRect(p1, 0, p2 - p1, canvas.height);
        }
      }

      for (let x of positions) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
        context.strokeStyle = Colors.backgroundColor.value.toCSS(false);
        context.lineWidth = 1;
        context.stroke();
      }

      context.beginPath();
      context.moveTo(positions[0], 0);
      context.lineTo(positions[positions.length - 1], 0);
      context.moveTo(positions[0], canvas.height);
      context.lineTo(positions[positions.length - 1], canvas.height);
      context.lineWidth = 1;
      context.strokeStyle = Colors.backgroundColor.value.toCSS(false);
      context.stroke();

      window.requestAnimationFrame(looper);
    }

    looper();
  }

  // Acquire the necessary HTML elements
  let canvas: HTMLCanvasElement =
    document.getElementById('canvas') as HTMLCanvasElement;

  makeWorld(canvas, canvas.clientWidth / 9, canvas.clientWidth / 18);

  })();
