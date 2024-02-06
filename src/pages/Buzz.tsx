// import { useQuery } from "@tanstack/react-query";
// import { useParams } from "react-router-dom";
// import { fetchBuzz } from "../api/buzz";
import BackButton from '../components/BackButton';
// import BuzzCard from "../components/BuzzList/BuzzCard";

const Buzz = () => {
  // const { id: tempId } = useParams();
  // const id = tempId ?? "";
  // const { isLoading, data: buzz } = useQuery({
  // 	queryKey: ["buzz", id],
  // 	queryFn: () => fetchBuzz(id),
  // });

  return (
    <div>
      <BackButton />
      <div>To Do change to buzz detail</div>
      {/* <div className="mt-6">
				{isLoading ? (
					<div className="grid place-items-center h-[200px]">
						<span className="loading loading-ring loading-lg grid text-white"></span>
					</div>
				) : (
					<BuzzCard buzzItem={buzz} />
					
				)}
			</div> */}
    </div>
  );
};

export default Buzz;
