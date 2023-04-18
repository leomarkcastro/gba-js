import pb from "@/lib/pocketbase";
import GameBoyAdvance from "gbajs";
import { useEffect, useRef, useState } from "react";
import { useRunOnce } from "./hooks/useRunOnce";
import { m } from "framer-motion";

export default function GBALoader({ record }) {
  const recordParsed = JSON.parse(record);

  const canvasRef = useRef(null);
  const parentCanvasRef = useRef(null);

  const [saveDataToInject, setSaveDataToInject] = useState(null);
  const gba = useRef(null);

  const [gameRunning, setGameRunning] = useState(false);
  const gameRunningRef = useRef(gameRunning);
  const [saveLoadStatus, setSaveLoadStatus] = useState(0);

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
      gba.current = new GameBoyAdvance();
      gba.current.keypad.eatInput = true;
      gba.current.setLogger(function (level, error) {
        console.log(error);
        gba.current.pause();
        // let screen = document.getElementById("screen");
      });
      // gba.reportFPS = function (x) {
      //   console.log(x);
      // };
      window.gba = gba;
    } catch (exception) {
      gba.current = null;
    }
  }

  async function loadBIOS() {
    if (gba.current && FileReader) {
      // =================================
      console.log("Loading GBA BIOS");
      // =================================
      const ctx = canvasRef.current;
      // gba.setCanvas(ctx);
      gba.current.setCanvasMemory();

      gba.current.logLevel = gba.current.LOG_DEBUG;

      const biosResponse = await fetch("/gba/bios.bin");
      const biosBuf = await biosResponse.arrayBuffer();
      gba.current.setBios(biosBuf);

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
      `https://gbacloud-server.app02.xyzapps.xyz/api/files/${recordParsed.collectionId}/${recordParsed.id}/${recordParsed.gba_rom}`
    );
    const gameBuf = await gameResponse.arrayBuffer();

    gba.current.setRom(gameBuf);
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

    gba.current.setSavedata(saveBuf);
  }

  async function runGame() {
    // =================================
    console.log(" >>> Running GBA Game");
    // =================================
    gba.current.runStable();
  }

  async function drawPixel() {
    const ctx = canvasRef.current.getContext("2d");
    // resize canvas to match parent

    setInterval(() => {
      const gbaPixelData = gba.current.context.pixelData;
      const myImageData = ctx.createImageData(
        gbaPixelData.width,
        gbaPixelData.height
      );
      myImageData.data.set(gbaPixelData.data);

      ctx.putImageData(myImageData, 0, 0);
    }, 1000 / 60);
  }

  async function interceptKeyPress() {
    const keypad = gba.current.keypad;
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
    // =================================
    console.log(" >>> Starting GBA Game");
    // =================================
    await loadGame();
    // await loadSAV();
    if (saveDataToInject) {
      await parseAndInjectSaveData(saveDataToInject);
      setSaveDataToInject(null);
    }
    await runGame();
    await drawPixel();
    await interceptKeyPress();
    setGameRunning(true);
    gameRunningRef.current = true;
    saveRoutine();
  }

  function saveRoutine() {
    setTimeout(async () => {
      if (gameRunningRef.current) {
        uploadGameSave();
        saveRoutine();
      }
    }, 15000);
  }

  async function downloadSaveData() {
    gba.current.downloadSavedata();
  }

  const [paused, setPaused] = useState(false);

  async function pauseUnpauseGame() {
    // =================================
    console.log("<< Freezing/Unfreezing GBA Game >>");
    // =================================
    if (paused) {
      gba.current.runStable();
      setPaused(false);
    } else {
      gba.current.pause();
      setPaused(true);
    }
  }

  async function serializeSaveData() {
    let sram = gba.current.mmu.save;
    try {
      return {
        code: gba.current.mmu.cart.code,
        data: gba.current.encodeBase64(sram.view),
      };
    } catch (e) {
      gba.current.WARN("Could not store savedata! " + e);
    }
  }

  async function parseAndInjectSaveData(data) {
    try {
      if (data) {
        // console.log(data);
        gba.current.decodeSavedata(data);
        return true;
      }
    } catch (e) {
      gba.current.WARN("Could not retrieve savedata! " + e);
    }
    return false;
  }

  async function uploadGameSave() {
    setSaveLoadStatus(2);
    let existingSave = false;
    try {
      const queryString = `user="${pb.authStore.model.id}"&&game="${recordParsed.id}"`;
      // console.log(queryString);
      const record = await pb
        .collection("games_save")
        .getFirstListItem(queryString);

      if (record) {
        existingSave = record;
      }
    } catch (err) {}
    const saveData = await serializeSaveData();
    const data = {
      user: pb.authStore.model.id,
      game: recordParsed.id,
      saveData: saveData.data,
    };

    // console.log(data);
    if (existingSave) {
      await pb.collection("games_save").update(existingSave.id, data);
    } else {
      await pb.collection("games_save").create(data);
    }
    setSaveLoadStatus(0);
  }

  async function fetchCloudSave() {
    // =================================
    console.log(" << Fetching Cloud Save >>");
    // =================================
    try {
      setSaveLoadStatus(1);
      const queryString = `user="${pb.authStore.model.id}"&&game="${recordParsed.id}"`;
      // console.log(queryString);
      const record = await pb
        .collection("games_save")
        .getFirstListItem(queryString);

      const saveData = record.saveData;

      setSaveDataToInject(saveData);
    } catch (err) {
      console.log(err);
    }
    setSaveLoadStatus(0);
  }

  function onKeyInteraction(keyCode, isDown = true) {
    const keypad = gba.current.keypad;
    if (isDown) keypad.keydown(keypad[keyCode]);
    else keypad.keyup(keypad[keyCode]);
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

  useRunOnce(() => {
    fetchCloudSave();
  });

  return (
    <div className="flex-col block ">
      <div className="p-2">
        <p className="text-center animate-pulse">
          {saveLoadStatus == 1 && "🟢 Loading Save From Internet"}
          {saveLoadStatus == 1 && "🟢 Uploading Save"}
        </p>
      </div>
      <div
        ref={parentCanvasRef}
        className="flex-1 mx-auto border border-black shadow-md"
        style={{
          maxWidth: "100vw",
          aspectRatio: "3/2",
          maxHeight: "70vh",
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

      <div className="flex gap-2 m-2 mx-auto w-fit">
        {!gameRunning ? (
          <>
            <button className="d-btn d-btn-primary" onClick={startGame}>
              Play
            </button>
          </>
        ) : (
          <>
            <button
              className="d-btn d-btn-primary d-btn-sm"
              onClick={pauseUnpauseGame}
            >
              Pause / Unpase
            </button>
          </>
        )}
      </div>

      <svg
        width="320"
        height="265"
        viewBox="0 0 320 265"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex w-full h-[37vh] md:flex-0 md:hidden"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect width="320" height="265" fill="#b6b6b6" />
        {/* A */}
        <circle
          cx="258"
          cy="42"
          r="25"
          fill="#0d9b2e"
          onPointerDown={() => {
            onKeyInteraction("A");
          }}
          onPointerUp={() => {
            onKeyInteraction("A", false);
          }}
        />
        {/* B */}
        <circle
          cx="225"
          cy="102"
          r="25"
          fill="#122699"
          onPointerDown={() => {
            onKeyInteraction("B");
          }}
          onPointerUp={() => {
            onKeyInteraction("B", false);
          }}
        />
        {/* L */}
        <circle
          cx="225"
          cy="164"
          r="25"
          fill="#158fa1"
          onPointerDown={() => {
            onKeyInteraction("L");
          }}
          onPointerUp={() => {
            onKeyInteraction("L", false);
          }}
        />
        {/* R */}
        <circle
          cx="258"
          cy="224"
          r="25"
          fill="#94159d"
          onPointerDown={() => {
            onKeyInteraction("R");
          }}
          onPointerUp={() => {
            onKeyInteraction("R", false);
          }}
        />
        {/* up */}
        <rect
          x="70"
          y="32"
          width="40"
          height="50"
          fill="#7f522a"
          onPointerDown={() => {
            onKeyInteraction("UP");
          }}
          onPointerUp={() => {
            onKeyInteraction("UP", false);
          }}
        />
        {/* down */}
        <rect
          x="70"
          y="122"
          width="40"
          height="50"
          fill="#440c0c"
          onPointerDown={() => {
            onKeyInteraction("DOWN");
          }}
          onPointerUp={() => {
            onKeyInteraction("DOWN", false);
          }}
        />
        {/* left */}
        <rect
          x="20"
          y="82"
          width="50"
          height="40"
          fill="#1e621e"
          onPointerDown={() => {
            onKeyInteraction("LEFT");
          }}
          onPointerUp={() => {
            onKeyInteraction("LEFT", false);
          }}
        />
        {/* right */}
        <rect
          x="110"
          y="82"
          width="50"
          height="40"
          fill="#19246f"
          onPointerDown={() => {
            onKeyInteraction("RIGHT");
          }}
          onPointerUp={() => {
            onKeyInteraction("RIGHT", false);
          }}
        />
        {/* start */}
        <rect
          x="110"
          y="199"
          width="50"
          height="40"
          fill="#651562"
          onPointerDown={() => {
            onKeyInteraction("START");
          }}
          onPointerUp={() => {
            onKeyInteraction("START", false);
          }}
        />
        {/* select */}
        <rect
          x="20"
          y="199"
          width="50"
          height="40"
          fill="#8d1b3a"
          onPointerDown={() => {
            onKeyInteraction("SELECT");
          }}
          onPointerUp={() => {
            onKeyInteraction("SELECT", false);
          }}
        />
      </svg>
    </div>
  );
}
