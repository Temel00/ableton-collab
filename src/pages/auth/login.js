import {FcGoogle} from "react-icons/fc";
import {AiFillFacebook} from "react-icons/ai";
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {auth} from "../../../utils/firebase";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {useAuthState} from "react-firebase-hooks/auth";

export default function Login() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  //Sign in with google
  const googleProvider = new GoogleAuthProvider();
  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result.user);
      route.push("/projects");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      route.push("/Projects");
    } else {
      console.log("login");
    }
  }, [user]);

  return (
    <div className="loginBG">
      <h2>Join Today</h2>
      <div>
        <h3>Sign in with one of the providers</h3>
      </div>
      <div className="buttonBin">
        <button onClick={GoogleLogin}>
          <FcGoogle />
          Sign in with Google
        </button>
        <button>
          <AiFillFacebook />
          Sign in with Facebook
        </button>
      </div>
    </div>
  );
}
