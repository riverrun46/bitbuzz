// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { createBuzz } from '../api/buzz';
import BuzzForm, { BuzzData } from "./BuzzForm";
// import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay-ts";
// import dayjs from 'dayjs';
import { buzzEntityAtom } from "../../store/buzz";
import { useAtomValue } from "jotai";
import { isNil } from "ramda";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
function sleep(time: number) {
	return new Promise((resolve) => setTimeout(resolve, time));
}
const BuzzFormWrap = () => {
	const buzzEntity = useAtomValue(buzzEntityAtom);
	const [isAdding, setIsAdding] = useState(false);
	const queryClient = useQueryClient();

	const handleAddBuzz = async (buzz: BuzzData) => {
		setIsAdding(true);
		try {
			const createRes = await buzzEntity?.create({ body: buzz.content });
			console.log("create res for inscribe", createRes);
			if (!isNil(createRes?.revealTxIds[0])) {
				await sleep(5000);
				queryClient.invalidateQueries({ queryKey: ["buzzes"] });
				toast.success("create buzz successfully");

				const doc_modal = document.getElementById("new_buzz_modal") as HTMLDialogElement;
				doc_modal.close();
			}
		} catch (error) {
			console.log("error", error);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			toast.warn((error as any)?.message ?? "too-long-mempool-chain");
		}
		setIsAdding(false);
	};

	return (
		<LoadingOverlay active={isAdding} spinner text="Buzz is Creating...">
			<BuzzForm onSubmit={handleAddBuzz} />{" "}
		</LoadingOverlay>
	);
};

export default BuzzFormWrap;

// const AddBuzz = () => {
// 	const queryClient = useQueryClient();

// 	const createBuzzMutation = useMutation({
// 		mutationFn: createBuzz,
// 		onSuccess: async () => {
// 			await queryClient.invalidateQueries({ queryKey: ["buzzes"] });
// 			toast.success("create buzz success!");
// 			const doc_modal = document.getElementById("new_buzz_modal") as HTMLDialogElement;
// 			doc_modal.close();
// 		},
// 	});

// 	const handleAddBuzz = (buzz: BuzzNewForm) => {
// 		const id = uuidv4();
// 		createBuzzMutation.mutate({
// 			...buzz,
// 			id,
// 			createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
// 			user: "vae",
// 			isFollowed: false,
// 			txid: id,
// 		});
// 	};

// 	return (
// 		<LoadingOverlay active={createBuzzMutation.isPending} spinner text="Buzz is Creating...">
// 			<BuzzForm onSubmit={handleAddBuzz} initialValue={{ content: "", createTime: "" }} />{" "}
// 		</LoadingOverlay>
// 	);
// };

// export default AddBuzz;
