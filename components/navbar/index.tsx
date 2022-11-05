import React from "react";
import { HiPlusSm } from "react-icons/hi";

const Navbar = () => {
  return (
    <div className="fixed inset-x-0 top-0 flex h-12 items-center justify-between border-b px-6">
      <p className="cursor-pointer font-bold">Trava</p>
      <div className="flex items-center">
        <button className="flex items-center rounded-md bg-slate-900 px-3 py-1 text-sm text-white outline-none hover:bg-slate-800">
          <HiPlusSm className="mr-1" />
          New
        </button>
      </div>
    </div>
  );
};

export default Navbar;
