import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const RootLayout = () => {
  return (
    <main className="flex flex-col gap-2">
      <NavBar />
      <Outlet />
    </main>
  );
};

export default RootLayout;
