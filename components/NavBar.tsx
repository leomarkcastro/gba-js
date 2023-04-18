import { randomSpriteGenerator, AvatarStrategies } from "@/lib/avatars";
import { hashString } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AuthModal } from "./AuthModal";
import { ChevronDown, ChevronLeft } from "./icons";
import pb from "@/lib/pocketbase";

interface LinkData {
  name: string;
  link?: string;
  list?: LinkData[];
}

const Links: LinkData[] = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Games",
    list: [
      {
        name: "Train Ubusan",
        link: "/games/trainubusan",
      },
      {
        name: "Rock Paper Scissor",
        link: "/games/rockpaperscissors",
      },
    ],
  },
  {
    name: "About",
    link: "/about",
  },
];

function ConditionalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  // check if "game" exists in the url
  if (router.pathname.includes("/games/")) {
    return (
      <a className={className} href={href}>
        {children}
      </a>
    );
  }
  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}

function NavbarDataParser({
  data,
  isHorizontal,
}: {
  data: LinkData;
  isHorizontal: boolean;
}) {
  return (
    <li>
      <ConditionalLink href={data.link ? data.link : "#"}>
        {data.name}{" "}
        {data.list ? isHorizontal ? <ChevronLeft /> : <ChevronDown /> : <></>}
      </ConditionalLink>
      {data.list && (
        <ul className="rounded-md shadow-md bg-base-200">
          {data.list.map((item) => {
            return NavbarDataParser({ data: item, isHorizontal: isHorizontal });
          })}
        </ul>
      )}
    </li>
  );
}

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  // const isAuthenticated = useIsAuthenticated();
  // const auth = useAuthUser();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    const timeoutId = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  };

  const [userID, setUserID] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string | undefined>(undefined);

  useEffect(() => {
    setUserID(pb.authStore?.model?.id);
    setName(pb.authStore?.model?.name);
  }, []);

  return (
    <>
      <div
        className="fixed top-0 z-20 w-full h-12"
        onMouseEnter={handleMouseEnter}
      ></div>
      <div>
        <div
          className="d-navbar bg-base-200/50 shadow-md fixed top-0 transition-[top] z-30"
          style={
            {
              // top: isVisible ? "0" : "-100%",
            }
          }
          onMouseLeave={handleMouseLeave}
        >
          <div className="d-navbar-start">
            <div className="d-dropdown">
              <label tabIndex={0} className="d-btn d-btn-ghost lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </label>
              <ul
                tabIndex={0}
                className="p-2 mt-3 shadow d-menu d-menu-compact d-dropdown-content bg-base-100 rounded-box w-52"
              >
                {Links.map((item) => {
                  return NavbarDataParser({ data: item, isHorizontal: true });
                })}
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <p className="hidden px-4 text-xl normal-case sm:block">
                Online GBA
              </p>
              <p className="block px-4 text-xl normal-case sm:hidden">GBA</p>
            </div>
          </div>
          <div className="hidden d-navbar-center lg:flex">
            <ul className="px-1 d-menu d-menu-horizontal">
              {Links.map((item) => {
                return NavbarDataParser({ data: item, isHorizontal: false });
              })}
            </ul>
          </div>
          <div className="gap-2 d-navbar-end">
            {pb.authStore ? (
              <div className="d-dropdown d-dropdown-end">
                <label
                  tabIndex={0}
                  className="d-btn d-btn-ghost d-btn-circle d-avatar"
                >
                  <div className="w-10 rounded-full">
                    <img
                      src={randomSpriteGenerator({
                        seed: hashString(userID || "anon"),
                        strategy: AvatarStrategies.Thumbs,
                      })}
                    />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="p-2 mt-3 shadow d-menu d-menu-compact d-dropdown-content bg-base-100 rounded-box w-52"
                >
                  <li>
                    <ConditionalLink
                      className="justify-between"
                      href="/account/me"
                    >
                      Hello {name}!
                    </ConditionalLink>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        pb.authStore.clear();
                        window.location.reload();
                      }}
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            ) : (
              <label htmlFor="auth-modal" className="d-btn d-btn-primary">
                Sign In
              </label>
            )}
          </div>
        </div>
      </div>
      <AuthModal />
    </>
  );
}
