import authMeFx from "@/lib/fetch/auth/me";
import sigInFx from "@/lib/fetch/auth/signIn";
import signUpFx from "@/lib/fetch/auth/signUp";

export function LoginToProceed() {
  async function playAnonymously() {
    const random_name = Math.random().toString(36).substring(7);
    const auth_signUp = {
      email: `anon_${random_name}_anon@x3game.com`,
      password: `${random_name}_pass`,
      username: `${random_name}`,
    };
    try {
      const signUpResponse = await signUpFx(
        auth_signUp.email,
        auth_signUp.password,
        {
          name: auth_signUp.username,
        }
      );

      await sigInFx(auth_signUp.email, auth_signUp.password);

      window.location.reload();
    } catch (err) {
      alert(err);
    }
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="mt-8 shadow-xl d-card w-96 bg-base-100">
        <figure>
          <img
            src="https://www.thesimpledollar.com/wp-content/uploads/2020/04/TheSimpleDollar-Fun-With-Friends.png"
            alt="fun"
          />
        </figure>
        <div className="d-card-body">
          <h2 className="d-card-title">Save Your Moment!</h2>
          <p>
            Save your progress, collect rewards and connect with friends. All
            with just one X3 Account!
          </p>
          <div className="justify-end d-card-actions">
            <label htmlFor="auth-modal" className="d-btn d-btn-primary">
              Sign In Now
            </label>
            <button className="d-btn d-btn-primary" onClick={playAnonymously}>
              Play Anonymously
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
