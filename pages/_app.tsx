import { Navbar } from "@/components/NavBar";
import "@/styles/globals.css";
import type { AppProps, AppType } from "next/app";

const App: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <div>
      <Navbar />
      <Component {...pageProps} />
    </div>
  );
};

export default App;
