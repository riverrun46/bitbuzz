import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Buzz from "./pages/Buzz";
import Home from "./pages/Home";
import EditBuzz from "./pages/EditBuzz";
import { ToastContainer, toast } from "react-toastify";
import "./globals.css";
import "./react-toastify.css";
// import "react-toastify/dist/ReactToastify.css";
import { MetaletWalletForBtc, btcConnect } from "@metaid/metaid";

import { useAtom, useSetAtom } from "jotai";
import {
	btcConnectorAtom,
	connectedAtom,
	networkAtom,
	userInfoAtom,
	walletAtom,
	walletRestoreParamsAtom,
} from "./store/user";
import { buzzEntityAtom } from "./store/buzz";
import { errors } from "./utils/errors";
import { isNil } from "ramda";
import { checkMetaletInstalled } from "./utils/wallet";
import { conirmMetaletTestnet } from "./utils/wallet";
import CreateMetaIDModal from "./components/MetaIDFormWrap/CreateMetaIDModal";
import EditMetaIDModal from "./components/MetaIDFormWrap/EditMetaIDModal";
import { useCallback, useEffect } from "react";
import { BtcNetwork } from "./api/request";

function App() {
	const [connected, setConnected] = useAtom(connectedAtom);
	const setWallet = useSetAtom(walletAtom);
	const [btcConnector, setBtcConnector] = useAtom(btcConnectorAtom);
	const [network, setNetwork] = useAtom(networkAtom);
	const setUserInfo = useSetAtom(userInfoAtom);
	const [walletParams, setWalletParams] = useAtom(walletRestoreParamsAtom);

	const setBuzzEntity = useSetAtom(buzzEntityAtom);

	const onLogout = () => {
		setConnected(false);
		setBtcConnector(null);
		setBuzzEntity(null);
		setUserInfo(null);
		setWalletParams(undefined);
		window.metaidwallet.removeListener("accountsChanged");
		window.metaidwallet.removeListener("networkChanged");
	};

	const onWalletConnectStart = async () => {
		console.log("onWalletConnectStart", window.metaidwallet);
		await checkMetaletInstalled();
		const _wallet = await MetaletWalletForBtc.create();
		const _network = (await window.metaidwallet.getNetwork()).network;
		setNetwork(_network);
		console.log("onWalletConnectStart", _wallet);
		setWallet(_wallet);
		setWalletParams({
			address: _wallet.address,
			pub: _wallet.pub,
		});
		await conirmMetaletTestnet();
		if (isNil(_wallet?.address)) {
			toast.error(errors.NO_METALET_LOGIN, {
				className: "!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg",
			});
			throw new Error(errors.NO_METALET_LOGIN);
		}

		//////////////////////////
		const _btcConnector = await btcConnect({
			network,
			wallet: _wallet,
		});

		setBtcConnector(_btcConnector);

		// const doc_modal = document.getElementById(
		//   'create_metaid_modal'
		// ) as HTMLDialogElement;
		// doc_modal.showModal();
		// console.log("getUser", await _btcConnector.getUser());
		const resUser = await _btcConnector.getUser({ network });
		console.log("user now", resUser);
		if (!resUser?.name) {
			const doc_modal = document.getElementById("create_metaid_modal") as HTMLDialogElement;
			doc_modal.showModal();
		} else {
			setUserInfo(resUser);
			setConnected(true);
			setBuzzEntity(await _btcConnector.use("buzz"));
			console.log("your btc address: ", _btcConnector.address);
		}
	};

	const getBuzzEntity = async () => {
		const _btcConnector = await btcConnect({ network });
		setBtcConnector(_btcConnector);
		const _buzzEntity = await _btcConnector.use("buzz");
		setBuzzEntity(_buzzEntity);
	};

	useEffect(() => {
		getBuzzEntity();
	}, []);
	const handleBeforeUnload = async () => {
		if (!isNil(walletParams)) {
			const _wallet = MetaletWalletForBtc.restore({
				...walletParams,
				internal: window.metaidwallet,
			});
			console.log("refeshing wallet", _wallet);
			setWallet(_wallet);
			const _btcConnector = await btcConnect({ wallet: _wallet, network: network });
			setBtcConnector(_btcConnector);
			setUserInfo(_btcConnector.user);
			// setConnected(true);
			console.log("refetch user", _btcConnector.user);
		}
	};

	const wrapHandleBeforeUnload = useCallback(handleBeforeUnload, [walletParams, setUserInfo]);

	useEffect(() => {
		setTimeout(() => {
			wrapHandleBeforeUnload();
		}, 1000);
	}, [wrapHandleBeforeUnload]);

	const handleAcccountsChanged = () => {
		onLogout();
		toast.error(
			"Wallet Account Changed ---- You have been automatically logged out of your current MetaID account. Please login again..."
		);
	};

	const handleNetworkChanged = async (network: BtcNetwork) => {
		console.log("network", network);
		if (connected) {
			onLogout();
		}
		toast.error("Wallet Network Changed  ");
		setNetwork(network ?? "testnet");
	};

	useEffect(() => {
		setTimeout(() => {
			if (!isNil(window?.metaidwallet)) {
				if (connected) {
					window.metaidwallet.on("accountsChanged", handleAcccountsChanged);
				}

				window.metaidwallet.on("networkChanged", handleNetworkChanged);
			}
		}, 1000);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [connected, window?.metaidwallet]);

	return (
		<div className="relative overflow-auto">
			<Navbar
				onWalletConnectStart={onWalletConnectStart}
				onLogout={onLogout}
				btcConnector={btcConnector!}
			/>

			<div className="container pt-[100px] bg-[black] text-white h-screen">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/buzz/:id" element={<Buzz />} />
					<Route path="/buzz/:id/edit" element={<EditBuzz />} />
				</Routes>
			</div>
			<ToastContainer
				position="top-left"
				toastStyle={{
					position: "absolute",
					top: "80px",
					left: "120px",
					width: "380px",
				}}
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
				closeButton={false}
			/>

			<CreateMetaIDModal
				btcConnector={btcConnector!}
				onWalletConnectStart={onWalletConnectStart}
			/>
			<EditMetaIDModal btcConnector={btcConnector!} />
		</div>
	);
}

export default App;
