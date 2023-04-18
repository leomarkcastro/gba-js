import { useEffect } from "react";
import GameBoyAdvance from "gbajs";

export default function Page() {
  useEffect(() => {
    const load = setTimeout(async () => {
      let gba = new GameBoyAdvance();

      gba.logLevel = gba.LOG_ERROR;

      console.log("loading bios");
      const biosResponse = await fetch("/gba/gba_bios.bin");
      const biosBuf = await biosResponse.arrayBuffer();
      gba.setBios(biosBuf);
      console.log("bios loaded");
      gba.setCanvasMemory();

      // get buffer from url
      const gbaResponse = await fetch(
        "/gba/6e828267e0b3e5a94760f4747f9188e327189c088c0109de4ebeeef6b6546856.GBA"
      );

      console.log("loading rom");
      const gbaBuffer = await gbaResponse.arrayBuffer();
      gba.setRom(gbaBuffer);

      console.log("rom loaded");
      // gba.loadSavedataFromFile("/path/to/game.sav");
      gba.runStable();

      let idx = 0;
      // setInterval(function () {
      //   let keypad = gba.keypad;
      //   keypad.press(keypad.A);

      //   // setTimeout(function () {
      //   //   /* pngjs: https://github.com/lukeapage/pngjs */
      //   //   let png = gba.screenshot();
      //   //   png.pack().pipe(fs.createWriteStream("gba" + idx + ".png"));
      //   // }, 200);
      // }, 2000);
    }, 100);
    return () => {
      clearTimeout(load);
    };
  }, []);

  return <p>GbaJS</p>;
}
