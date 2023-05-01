import Link from "next/link";
import Image from "next/image";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../utils/firebase";

export default function Nav() {
  const [user, loading] = useAuthState(auth);

  return (
    <nav className="mainNav">
      <Link href={"/"}>Logo</Link>
      {!user && (
        <Link className="bubbleBut" href={"/auth/login"}>
          Join now
        </Link>
      )}
      {user && (
        <>
          <Link className="projectButton" href={"/Projects"}>
            Projects
          </Link>

          <Link className="profileButton" href={"/dashboard"}>
            <h4>{user.displayName}</h4>
            <Image
              src={user.photoURL}
              width="46"
              height="46"
              alt="profile avatar"
            />
          </Link>
        </>
      )}
    </nav>
  );
}
