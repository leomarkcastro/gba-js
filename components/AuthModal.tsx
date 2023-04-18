import authMeFx from "@/lib/fetch/auth/me";
import sigInFx from "@/lib/fetch/auth/signIn";
import signUpFx from "@/lib/fetch/auth/signUp";
import pb from "@/lib/pocketbase";
import { motion, AnimatePresence } from "framer-motion";
import { useReducer, useState } from "react";

interface IAuthState {
  signIn: {
    username: string;
    password: string;
  };
  signUp: {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
  };
}

interface IAuthAction {
  type: string;
  payload: {
    username?: string;
    password?: string;
    confirmPassword?: string;
    email?: string;
  };
}

export function AuthModal() {
  const [isSigningIn, setIsSignIn] = useState(true);

  const [auth, authDispatch] = useReducer(
    (state: IAuthState, action: IAuthAction) => {
      return {
        ...state,
        [action.type]: {
          // @ts-ignore
          ...state[action.type],
          ...action.payload,
        },
      };
    },
    {
      signIn: {
        username: "",
        password: "",
      },
      signUp: {
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
      },
    }
  );

  async function signInCB() {
    try {
      await sigInFx(auth.signIn.username, auth.signIn.password);

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  async function signUpCB() {
    try {
      if (auth.signUp.password !== auth.signUp.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      await signUpFx(auth.signUp.email, auth.signUp.password, {
        name: auth.signUp.username,
        username: auth.signUp.username,
      });

      const signinResponse = await sigInFx(
        auth.signUp.email,
        auth.signUp.password
      );

      const authResponse = await authMeFx();

      window.location.reload();

      console.log(authResponse);
    } catch (err) {
      alert(err);
    }
  }

  return (
    <>
      <input type="checkbox" id="auth-modal" className="d-modal-toggle" />
      <label htmlFor="auth-modal" className="cursor-pointer d-modal">
        <label className="relative d-modal-box bg-base-200" htmlFor="">
          <AnimatePresence initial={false} mode="wait">
            {isSigningIn && (
              <motion.div
                key="login"
                className="w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-4xl text-center d-card-body text-primary">
                  Login
                </p>
                <div className="flex flex-col w-full p-4 mx-auto">
                  <div className="w-full d-form-control">
                    <label className="d-label">
                      <span className="d-label-text">Email</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="w-full d-input d-input-bordered"
                      onChange={(e) =>
                        authDispatch({
                          type: "signIn",
                          payload: { username: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="w-full d-form-control">
                    <label className="d-label">
                      <span className="d-label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Type here"
                      className="w-full d-input d-input-bordered"
                      onChange={(e) =>
                        authDispatch({
                          type: "signIn",
                          payload: { password: e.target.value },
                        })
                      }
                    />
                  </div>
                  <br />
                  <button
                    className="d-btn d-btn-block d-btn-primary"
                    onClick={signInCB}
                  >
                    Sign In
                  </button>
                  <button
                    className="d-btn d-btn-block d-btn-primary d-btn-ghost d-btn-sm"
                    onClick={() => setIsSignIn(false)}
                  >
                    Sign Up
                  </button>
                </div>
              </motion.div>
            )}
            {!isSigningIn && (
              <motion.div
                key="signup"
                className="w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-4xl text-center d-card-body text-primary">
                  Sign Up
                </p>
                <div className="flex flex-col w-full p-4 mx-auto">
                  <div className="w-full d-form-control">
                    <label className="d-label">
                      <span className="d-label-text">Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="w-full d-input d-input-bordered"
                      onChange={(e) =>
                        authDispatch({
                          type: "signUp",
                          payload: { username: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="w-full d-form-control">
                    <label className="d-label">
                      <span className="d-label-text">Email</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="w-full d-input d-input-bordered"
                      onChange={(e) =>
                        authDispatch({
                          type: "signUp",
                          payload: { email: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="w-full d-form-control">
                    <label className="d-label">
                      <span className="d-label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Type here"
                      className="w-full d-input d-input-bordered"
                      onChange={(e) =>
                        authDispatch({
                          type: "signUp",
                          payload: { password: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="w-full d-form-control">
                    <label className="d-label">
                      <span className="d-label-text">Confirm Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Type here"
                      className="w-full d-input d-input-bordered"
                      onChange={(e) =>
                        authDispatch({
                          type: "signUp",
                          payload: { confirmPassword: e.target.value },
                        })
                      }
                    />
                  </div>
                  <br />
                  <button
                    className="d-btn d-btn-block d-btn-primary"
                    onClick={signUpCB}
                  >
                    Sign Up
                  </button>
                  <button
                    className="d-btn d-btn-block d-btn-primary d-btn-ghost d-btn-sm"
                    onClick={() => setIsSignIn(true)}
                  >
                    Already Have An Account?
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </label>
      </label>
    </>
  );
}
