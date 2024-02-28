// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { createBuzz } from '../api/buzz';
import BuzzForm, { AttachmentItem } from "./BuzzForm";
// import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay-ts";
// import dayjs from 'dayjs';
import { buzzEntityAtom } from "../../store/buzz";
import { useAtomValue } from "jotai";
import { isEmpty, isNil } from "ramda";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { btcConnectorAtom } from "../../store/user";
import { sleep } from "../../utils/time";
import { CreateOptions } from "@metaid/metaid/dist/core/entity/btc";
const BuzzFormWrap = () => {
	const buzzEntity = useAtomValue(buzzEntityAtom);
	const btcConnector = useAtomValue(btcConnectorAtom);

	const [isAdding, setIsAdding] = useState(false);
	const queryClient = useQueryClient();

	const handleAddBuzz = async (buzz: { content: string; images: AttachmentItem[] }) => {
		setIsAdding(true);
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const finalBody: any = { content: buzz.content };
			if (!isEmpty(buzz.images)) {
				const fileOptions: CreateOptions[] = [];

				const fileEntity = await btcConnector!.use("file");

				for (const image of buzz.images) {
					// console.log("image.data", Buffer.from(image.data, "hex").toString("base64"));
					fileOptions.push({
						body: Buffer.from(image.data, "hex").toString("base64"),
						contentType: "image/jpeg",
						encoding: "base64",
					});
				}
				const imageRes = await fileEntity.create({
					options: fileOptions,
					noBroadcast: "no",
				});
				console.log("imageRes", imageRes);
				finalBody.attachments = imageRes.revealTxIds.map(
					(rid) => "metafile://" + rid + "i0"
				);
			}
			await sleep(5000);

			console.log("finalBody", finalBody);

			const createRes = await buzzEntity!.create({
				options: [{ body: JSON.stringify(finalBody) }],
				noBroadcast: "no",
			});
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

// 	const handleAddBuzz = (buzz: BuzzNewForm) => {kl
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
