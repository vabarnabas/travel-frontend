import React from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { MdAirplaneTicket } from "react-icons/md";
import { BiSearch } from "react-icons/bi";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();

  return (
    <div className="fixed inset-x-0 top-0 flex h-14 items-center justify-between border-b bg-white px-6">
      <p
        onClick={() => router.push("/")}
        className="flex cursor-pointer items-center text-lg font-bold"
      >
        <MdAirplaneTicket className="mr-1 text-sky-500" />
        Trava
      </p>
      <div className="relative flex items-center">
        <BiSearch className="absolute left-3" />
        <input
          type="text"
          className="rounded-md border py-1.5 pl-8 pr-3 text-sm outline-none"
          placeholder="Search for a location..."
        />
      </div>
      <div className="flex items-center">
        <button
          onClick={() => router.push("/trips/form")}
          className="flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white outline-none hover:bg-slate-800"
        >
          <FaTelegramPlane className="mr-2" />
          New Trip
        </button>
      </div>
    </div>
  );
};

export default Navbar;
