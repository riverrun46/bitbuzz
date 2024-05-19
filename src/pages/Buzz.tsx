import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getPinDetailByPid } from "../api/buzz";
import BackButton from "../components/Buttons/BackButton";
import BuzzCard from "../components/BuzzList/BuzzCard";
import { useAtomValue } from "jotai";
import { networkAtom } from "../store/user";

const Buzz = () => {
	const network = useAtomValue(networkAtom);

	const { id: tempId } = useParams();
	const id = tempId ?? "";

	const { isLoading, data: buzzDetailData } = useQuery({
		queryKey: ["protocol", id],
		queryFn: () => getPinDetailByPid({ pid: id!, network }),
	});

	return (
		<div>
			<BackButton />
			<div className="mt-6">
				{isLoading ? (
					<div className="grid place-items-center h-[200px]">
						<span className="loading loading-ring loading-lg grid text-white"></span>
					</div>
				) : (
					<BuzzCard buzzItem={buzzDetailData} />
				)}
			</div>
		</div>
	);
};

export default Buzz;
