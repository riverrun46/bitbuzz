import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Buzz from "./pages/Buzz";
import Home from "./pages/Home";
import EditBuzz from "./pages/EditBuzz";
import { ToastContainer, toast } from "react-toastify";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { MetaletWalletForBtc, btcConnect } from "@metaid/metaid";
import { BtcConnector } from "@metaid/metaid/dist/core/connector/btc";
import { useAtom, useSetAtom } from "jotai";
import { btcConnectorAtom, connectedAtom, userInfoAtom } from "./store/user";
import { buzzEntityAtom } from "./store/buzz";
import { errors } from "./utils/errors";
import { isNil } from "ramda";
import { checkMetaletInstalled } from "./utils/wallet";
import CreateMetaIDForm from "./components/CreateMetaIDFormWrap";

function App() {
	const setConnected = useSetAtom(connectedAtom);
	const [btcConnector, setBtcConnector] = useAtom(btcConnectorAtom);
	const setBuzzEntity = useSetAtom(buzzEntityAtom);
	const setUserInfo = useSetAtom(userInfoAtom);
	const onWalletConnectStart = async () => {
		await checkMetaletInstalled();

		const _wallet = await MetaletWalletForBtc.create();
		if (isNil(_wallet?.address)) {
			toast.warn(errors.NO_METALET_LOGIN);
			throw new Error(errors.NO_METALET_LOGIN);
		}
		const _btcConnector: BtcConnector = await btcConnect(_wallet);
		console.log("btc connector", _wallet);

		setBtcConnector(_btcConnector as BtcConnector);

		if (!_btcConnector.hasMetaid()) {
			const doc_modal = document.getElementById("create_metaid_modal") as HTMLDialogElement;
			doc_modal.showModal();
		} else {
			setUserInfo(await _btcConnector.getUser());
			setConnected(true);
			setBuzzEntity(await _btcConnector.use("buzz"));
			console.log("your btc address: ", _btcConnector.address);
		}
	};

	const handleTest = () => {
		const doc_modal = document.getElementById("create_metaid_modal") as HTMLDialogElement;
		doc_modal.showModal();
	};

	return (
		<div className="relative">
			<Navbar onWalletConnectStart={onWalletConnectStart} />

			<div className="container pt-[100px] bg-[black] text-white h-screen overflow-auto">
				<button
					className="btn btn-active btn-accent text-[blue] absolute top-3 left-2"
					onClick={handleTest}
				>
					Test Button
				</button>
				<Routes>
					<Route
						path="/"
						element={<Home onWalletConnectStart={onWalletConnectStart} />}
					/>
					<Route path="/buzz/:id" element={<Buzz />} />
					<Route path="/buzz/:id/edit" element={<EditBuzz />} />
				</Routes>
			</div>
			<ToastContainer
				position="bottom-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
			<dialog id="create_metaid_modal" className="modal">
				<div className="modal-box bg-[#191C20] py-5 w-[480px]">
					<form method="dialog">
						{/* if there is a button in form, it will close the modal */}
						<button className="border border-white text-white btn btn-xs btn-circle absolute right-5 top-5.5">
							✕
						</button>
					</form>
					<h3 className="font-medium text-white text-[16px] text-center">
						Set Up Profile
					</h3>
					<CreateMetaIDForm btcConnector={btcConnector!} />
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		</div>
	);
}

export default App;
