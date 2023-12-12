import { useAtom } from "jotai";
import { PencilLine } from "lucide-react";
import { Link } from "react-router-dom";

import { connectedAtom } from "../store/user";

const Navbar = () => {
  const [connected, setConnected] = useAtom(connectedAtom);
  return (
    <div className="navbar p-3 bg-main absolute top-0">
      <div className="container flex justify-between">
        <Link to={"/"} className="text-[30px] font-normal	font-['Impact']">
          ORBUZZ
        </Link>

        <div className="flex items-center gap-2">
          <PencilLine
            className="border rounded-full text-main bg-[black] p-2 cursor-pointer"
            size={45}
          />
          {connected ? (
            <img
              src="https://picsum.photos/200"
              alt="user avatar"
              className="rounded-full self-start"
              width={45}
              height={45}
            />
          ) : (
            <div className="btn btn-outline hover:bg-[black] hover:text-main rounded-full font-medium w-[180px]">
              Connect Wallet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
