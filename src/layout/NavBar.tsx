import toast from "react-hot-toast";
import { LuLogOut } from "react-icons/lu";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="pt-4 md:px-10 p-2 flex items-center justify-between">
      <Link className="md:text-xl text-lg font-semibold" to="/">
        Task Manager
      </Link>
      <nav className="flex md:gap-5 gap-4 md:text-lg text-base">
        <Link to="about" className="hover:text-rose-500 ">
          About
        </Link>
        <button
          className="hover:text-rose-500"
          onClick={() => toast.success("Does not work right now")}
        >
          <LuLogOut />
        </button>
        <div className="md:flex gap-1 hidden">
          <img
            src="https://cdn-icons-png.flaticon.com/512/219/219983.png"
            alt="user image"
            className="w-6 h-6 rounded-md "
          />
          <p>Rahul Mijar</p>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
