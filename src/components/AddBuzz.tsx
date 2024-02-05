import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBuzz } from "../api/buzz";
import BuzzForm from "./BuzzForm";
import { v4 as uuidv4 } from "uuid";
import { BuzzNewForm } from "../types";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay-ts";
import dayjs from "dayjs";

const AddBuzz = () => {
	const queryClient = useQueryClient();

	const createBuzzMutation = useMutation({
		mutationFn: createBuzz,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["buzzes"] });
			toast.success("create buzz success!");
			const doc_modal = document.getElementById("new_buzz_modal") as HTMLDialogElement;
			doc_modal.close();
		},
	});

	const handleAddBuzz = (buzz: BuzzNewForm) => {
		const id = uuidv4();
		createBuzzMutation.mutate({
			...buzz,
			id,
			createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
			user: "vae",
			isFollowed: false,
			txid: id,
		});
	};

	return (
		<LoadingOverlay active={createBuzzMutation.isPending} spinner text="Buzz is Creating...">
			<BuzzForm onSubmit={handleAddBuzz} initialValue={{ content: "", createTime: "" }} />{" "}
		</LoadingOverlay>
	);
};

export default AddBuzz;
