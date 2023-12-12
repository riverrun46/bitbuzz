import { Sparkle } from "lucide-react";
import { useState } from "react";
import cls from "classnames";
import BuzzCard from "./BuzzCard";

const BuzzList = () => {
  const [showNewBuzz, setShowNewBuzz] = useState(true);
  return (
    <div>
      <div className="flex gap-2 items-center place-content-center mt-16">
        <Sparkle className="text-main" />
        <div className="text-white text-[36px] font-['Impact']">
          {"What's New Today"}
        </div>
        <Sparkle className="text-main" />
      </div>

      <div className="text-white flex mx-auto border border-white w-fit rounded-full mt-8">
        <div
          className={cls("btn w-[150px] h-[26px] cursor-pointer", {
            "btn-primary rounded-full": !showNewBuzz,
            "btn-outline border-none": showNewBuzz,
          })}
          onClick={() => setShowNewBuzz(false)}
        >
          Follow
        </div>
        <div
          className={cls("btn w-[150px] h-[26px] cursor-pointer", {
            "btn-primary rounded-full": showNewBuzz,
            "btn-outline border-none": !showNewBuzz,
          })}
          onClick={() => setShowNewBuzz(true)}
        >
          New
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <BuzzCard />
      </div>
    </div>
  );
};

export default BuzzList;
