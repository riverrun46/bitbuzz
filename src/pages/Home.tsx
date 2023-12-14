import BuzzList from "../components/BuzzList";
import RecommendUsers from "../components/RecommendUsers";
import { connectedAtom } from "../store/user";
import { useAtom } from "jotai";

const Home = () => {
	const [connected, setConnected] = useAtom(connectedAtom);

	const onWalletConnectStart = () => {
		setConnected(true);
	};
	if (connected) {
		return (
			<main className="">
				<RecommendUsers />
				<BuzzList />
			</main>
		);
	}
	return (
		<main className="h-full place-content-center overflow-hidden">
			<img
				src="src/image/orbuzz_home_img.png"
				width={650}
				height={600}
				alt="Picture of the home"
				className="absolute top-[10rem]"
			/>
			<div className="flex flex-col items-center mt-[12rem]">
				<div className="text-main font-['impact'] text-[120px]">ORDID</div>
				<div className="text-[white]">Claim your DID on bitcoin</div>
				<div
					className="btn btn-primary rounded-full mt-[8rem] text-[20px] font-medium	w-[220px]"
					onClick={onWalletConnectStart}
				>
					Connect Wallet
				</div>
			</div>
		</main>
	);
};

export default Home;
