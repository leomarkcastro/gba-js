import { HeadComponent } from "@/components/global/HeadComponents";
import LoginButton from "@/components/auth/LoginButton";
import Link from "next/link";

export default function Home(test: { test: string }) {
  return (
    <>
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-0 right-0 w-screen h-screen overflow-hidden">
          <div id="stars"></div>
          <div id="stars2"></div>
          <div id="stars3"></div>
        </div>
        <div className="relative min-h-screen d-hero">
          <div className="text-center d-hero-content">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">GBA Games</h1>
              <p className="py-6">
                Play Anywhere. Progress Saved and Transferred!
              </p>
              <Link href="/play" className="d-btn d-btn-primary">
                View Game Selection
              </Link>
              <br />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
