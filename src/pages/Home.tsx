import { useAtomValue } from "jotai";
import BuzzList from "../components/BuzzList";
import { userInfoAtom } from "../store/user";
import { checkMetaidInitStillPool } from "../utils/wallet";
import { isNil } from "ramda";
// import RecommendUsers from "../components/RecommendUsers";

const Home = () => {
	const userInfo = useAtomValue(userInfoAtom);

	const stillPool = isNil(userInfo) ? false : checkMetaidInitStillPool(userInfo);
	return (
		<main className="relative">
			{/* <RecommendUsers /> */}
			{stillPool && (
				<div className="absolute text-[13px] top-[-20px] text-main">
					<div>
						Your MetaID TX hasn't been confirmed yet. You can start using the platform
						once your MetaID TX is confirmed.
					</div>
					<div
						className="cursor-pointer underline"
						onClick={() => {
							window.open(
								`https://mempool.space/zh/testnet/tx/${userInfo?.rootTxId ?? ""}`,
								"_blank"
							);
						}}
					>
						View TX.
					</div>
				</div>
			)}
			<BuzzList />
		</main>
	);

	// return (
	//   <main className='h-full place-content-center overflow-hidden'>
	//     <img
	//       src='/orbuzz_home_img.png'
	//       width={650}
	//       height={600}
	//       alt='Picture of the home'
	//       className='absolute top-[10rem]'
	//     />
	//     <div className='flex flex-col items-center mt-[12rem]'>
	//       <div className="text-main font-['impact'] text-[120px]">BIT DID</div>
	//       <div className='text-[white]'>Claim your DID on bitcoin</div>
	//       <div
	//         className='btn btn-primary rounded-full mt-[8rem] text-[20px] font-medium	w-[220px]'
	//         onClick={onWalletConnectStart}
	//       >
	//         Connect Wallet
	//       </div>
	//     </div>
	//   </main>
	// );
};

export default Home;
