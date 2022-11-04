import React from "react";
import { HiPlusSm } from "react-icons/hi";

const Navbar = () => {
  return (
    <div className="fixed inset-x-0 top-0 flex h-14 items-center justify-between border-b px-6">
      <p className="cursor-pointer font-bold">Trava</p>
      <div className="flex items-center  text-2xl"></div>
    </div>
  );
};

export default Navbar;
