import GameBoyAdvance from "gbajs";
import { useEffect, useRef } from "react";

export default function Page() {
  let gba;
  let runCommands = [];

  const canvasRef = useRef(null);
  const parentCanvasRef = useRef(null);

  function loadRom(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "arraybuffer";

    xhr.onload = function () {
      callback(xhr.response);
    };
    xhr.send();
  }

  function loadGBA() {
    try {
      // =================================
      console.log("Loading GBAJS");
      // =================================
      gba = new GameBoyAdvance();
      gba.keypad.eatInput = true;
      gba.setLogger(function (level, error) {
        console.log(error);
        gba.pause();
        // let screen = document.getElementById("screen");
      });
      // gba.reportFPS = function (x) {
      //   console.log(x);
      // };
    } catch (exception) {
      gba = null;
    }
  }

  async function loadBIOS() {
    if (gba && FileReader) {
      // =================================
      console.log("Loading GBA BIOS");
      // =================================
      const ctx = canvasRef.current;
      // gba.setCanvas(ctx);
      gba.setCanvasMemory();

      gba.logLevel = gba.LOG_DEBUG;

      const biosResponse = await fetch("/gba/bios.bin");
      const biosBuf = await biosResponse.arrayBuffer();
      gba.setBios(biosBuf);

      // if (!gba.audio.context) {
      //   // Remove the sound box if sound isn't available
      //   let soundbox = document.getElementById("sound");
      //   soundbox.parentElement.removeChild(soundbox);
      // }

      // if (window.navigator.appName == "Microsoft Internet Explorer") {
      //   // Remove the pixelated option if it doesn't work
      //   let pixelatedBox = document.getElementById("pixelated");
      //   pixelatedBox.parentElement.removeChild(pixelatedBox);
      // }
    } else {
      // let dead = document.getElementById("controls");
      // dead.parentElement.removeChild(dead);
    }
  }

  async function loadGame() {
    // =================================
    console.log("Loading GBA Game");
    // =================================
    // let dead = document.getElementById("loader");
    // dead.value = "";
    // let load = document.getElementById("select");
    // load.textContent = "Loading...";
    // load.removeAttribute("onclick");
    // let pause = document.getElementById("pause");
    // pause.textContent = "PAUSE";

    const gameResponse = await fetch(
      "/gba/6e828267e0b3e5a94760f4747f9188e327189c088c0109de4ebeeef6b6546856.GBA"
    );
    const gameBuf = await gameResponse.arrayBuffer();

    gba.setRom(gameBuf);
  }

  async function loadSAV() {
    // =================================
    console.log("Loading GBA Game Save");
    // =================================
    // let dead = document.getElementById("loader");
    // dead.value = "";
    // let load = document.getElementById("select");
    // load.textContent = "Loading...";
    // load.removeAttribute("onclick");
    // let pause = document.getElementById("pause");
    // pause.textContent = "PAUSE";

    const saveResponse = await fetch("/gba/aw2.SAV");
    const saveBuf = await saveResponse.arrayBuffer();

    gba.setSavedata(saveBuf);
  }

  async function runGame() {
    // =================================
    console.log(" >>> Running GBA Game");
    // =================================
    gba.runStable();
    window.gba = gba;
  }

  async function drawPixel() {
    const ctx = canvasRef.current.getContext("2d");
    // resize canvas to match parent

    setInterval(() => {
      const gbaPixelData = gba.context.pixelData;
      const myImageData = ctx.createImageData(
        gbaPixelData.width,
        gbaPixelData.height
      );
      myImageData.data.set(gbaPixelData.data);

      ctx.putImageData(myImageData, 0, 0);
    }, 1000 / 60);
  }

  async function interceptKeyPress() {
    const keypad = gba.keypad;
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a":
          keypad.keydown(keypad.LEFT);
          break;
        case "d":
          keypad.keydown(keypad.RIGHT);
          break;
        case "w":
          keypad.keydown(keypad.UP);
          break;
        case "s":
          keypad.keydown(keypad.DOWN);
          break;
        case "i":
          keypad.keydown(keypad.L);
          break;
        case "o":
          keypad.keydown(keypad.R);
          break;
        case "k":
          keypad.keydown(keypad.A);
          break;
        case "l":
          keypad.keydown(keypad.B);
          break;
        case "Enter":
          keypad.keydown(keypad.START);
          break;
        case "Backspace":
          keypad.keydown(keypad.SELECT);
          break;
        default:
          break;
      }
    });

    document.addEventListener("keyup", (e) => {
      switch (e.key) {
        case "a":
          keypad.keyup(keypad.LEFT);
          break;
        case "d":
          keypad.keyup(keypad.RIGHT);
          break;
        case "w":
          keypad.keyup(keypad.UP);
          break;
        case "s":
          keypad.keyup(keypad.DOWN);
          break;
        case "i":
          keypad.keyup(keypad.L);
          break;
        case "o":
          keypad.keyup(keypad.R);
          break;
        case "k":
          keypad.keyup(keypad.A);
          break;
        case "l":
          keypad.keyup(keypad.B);
          break;
        case "Enter":
          keypad.keyup(keypad.START);
          break;
        case "Backspace":
          keypad.keyup(keypad.SELECT);
          break;
        default:
          break;
      }
    });
  }

  async function startGame() {
    await loadGame();
    // await loadSAV();
    await runGame();
    await drawPixel();
    await interceptKeyPress();
  }

  async function downloadSaveData() {
    gba.downloadSavedata();
  }

  useEffect(() => {
    if (!canvasRef.current) return;
    const load = setTimeout(async () => {
      await loadGBA();
      await loadBIOS();
      // await startGame();
    }, 100);
    return () => {
      clearTimeout(load);
    };
  }, [canvasRef]);

  return (
    <div>
      <p className="p-2 text-2xl text-center">GbaJS</p>
      <button onClick={startGame}>Play</button>
      <button onClick={downloadSaveData}>Download Save Data</button>
      <div
        ref={parentCanvasRef}
        className="mx-auto border border-black shadow-md"
        style={{
          height: "80vh",
          aspectRatio: "3/2",
        }}
      >
        <canvas
          className="w-full h-full mx-auto"
          ref={canvasRef}
          id="screen"
          width={240}
          height={160}
        ></canvas>
      </div>
    </div>
  );
}
