/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { createBuzz } from '../api/buzz';
import BuzzForm, { AttachmentItem, BuzzData } from "./BuzzForm";
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
import { SubmitHandler, useForm } from "react-hook-form";
import { image2Attach } from "../../utils/file";
import useImagesPreview from "../../hooks/useImagesPreview";
const BuzzFormWrap = () => {
	const buzzEntity = useAtomValue(buzzEntityAtom);
	const btcConnector = useAtomValue(btcConnectorAtom);

	const [isAdding, setIsAdding] = useState(false);
	const queryClient = useQueryClient();

	const buzzFormHandle = useForm<BuzzData>();
	const files = buzzFormHandle.watch("images");
	console.log(buzzFormHandle.getValues("images"));
	const [filesPreview, setFilesPreview] = useImagesPreview(files);
	const onClearImageUploads = () => {
		setFilesPreview([]);
		buzzFormHandle.setValue("images", [] as any);
	};

	const onCreateSubmit: SubmitHandler<BuzzData> = async (data) => {
		const images = data.images.length !== 0 ? await image2Attach(data.images) : [];

		await handleAddBuzz({
			content: data.content,
			images,
		});
		console.log("data images", data.images, filesPreview);
	};

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
				buzzFormHandle.reset();
				onClearImageUploads();

				const doc_modal = document.getElementById("new_buzz_modal") as HTMLDialogElement;
				doc_modal.close();
			}
		} catch (error) {
			console.log("error", error);
			const errorMessage = (error as any)?.message;
			const toastMessage = errorMessage.includes("Cannot read properties of undefined")
				? "User Canceled"
				: errorMessage;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			toast.warn(toastMessage);
		}
		setIsAdding(false);
	};

	return (
		<LoadingOverlay active={isAdding} spinner text="Buzz is Being Created...">
			<BuzzForm
				onCreateSubmit={onCreateSubmit}
				buzzFormHandle={buzzFormHandle}
				onClearImageUploads={onClearImageUploads}
				filesPreview={filesPreview}
			/>
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
