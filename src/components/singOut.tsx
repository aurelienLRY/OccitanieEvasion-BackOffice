/*libraries*/
import React from "react";
import { signOut } from "next-auth/react";

/*icons*/
import { FaSignOutAlt } from "react-icons/fa";

export default function SingOutBtn() {
  return (
    <div className="flex justify-center items-center fixed bottom-3 right-0 p-1 bg-stone-700 rounded-s-lg opacity-70 hover:opacity-100 transition-opacity duration-300">
      <div className="group relative">
        <button
          onClick={() => signOut()}
          className=" text-white text-sm p-2 rounded-md "
        >
          <FaSignOutAlt />
        </button>
        <div className="hidden group-hover:block absolute -top-10 -left-20 bg-gray-500 p-1 text-white  rounded-md text-xs font-light ">
          se déconnecter
        </div>
      </div>
    </div>
  );
}

