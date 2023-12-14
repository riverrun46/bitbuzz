import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { fetchBuzz, updateBuzz } from "../api/buzz";
import BuzzForm from "../components/BuzzForm";
import { BuzzItem } from "../types";

const EditBuzz = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { id: tempId } = useParams();
	const id = tempId ?? "";
	const {
		isLoading,
		isError,
		data: buzz,
		error,
	} = useQuery({
		queryKey: ["buzz", id],
		queryFn: () => fetchBuzz(id),
	});
	const updateBuzzMutation = useMutation({
		mutationFn: updateBuzz,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["buzzes"] });
			navigate("/");
		},
	});

	if (isLoading) return <div>"loading..."</div>;
	if (isError) return <div>`Error: ${error.message}`</div>;

	const handleSubmit = (updatedBuzz: Omit<BuzzItem, "id">) => {
		updateBuzzMutation.mutate({ id, ...updatedBuzz });
	};

	return (
		<div>
			<BuzzForm onSubmit={handleSubmit} initialValue={buzz} />
		</div>
	);
};

export default EditBuzz;
