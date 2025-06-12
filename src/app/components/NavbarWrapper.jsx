import Link from "next/link";
import getUserAuth from "../../../lib/getUserAuth";
import { logout } from "../../../actions/registration";

async function NavbarWrapper() {
  const user = await getUserAuth();

  return (
    <div className="bg-[#161616b8] text-white flex justify-between h-[50px] items-center px-[5%]">
      <div className="w-[fit-content]">
        <Link href="/">Title For logo here</Link>
      </div>
      <div className="flex justify-evenly w-[50%]">
        <Link href="/login">Add Post</Link>
        {user ? (
          <form action={logout}>
            <button className="nav-link cursor-pointer">Logout</button>
          </form>
        ) : (
          <>
            <Link href="/register">Register</Link>
            <Link href="/login">Login</Link>
          </>
        )}
      </div>
    </div>
  );
}
export default NavbarWrapper;
