import React from "react";
import { useState } from "react";
import { BuzzNewForm } from "../types";
import { Image } from "lucide-react";
type IProps = {
	onSubmit: (buzz: BuzzNewForm) => void;
	initialValue?: BuzzNewForm;
};

const BuzzForm = ({ onSubmit, initialValue }: IProps) => {
	const [buzz, setBuzz] = useState({
		content: initialValue?.content ?? "",
		createTime: "",
	});

	const handleChangeInput: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
		setBuzz({
			...buzz,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		onSubmit(buzz);
		setBuzz({
			content: "",
			createTime: "",
		});
	};

	return (
		<form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<textarea
					className="textarea textarea-bordered border-white text-white bg-[black] textarea-sm h-[160px] w-full max-w-xs"
					onChange={handleChangeInput}
					name={"content"}
					value={buzz.content}
				/>
				<div className="btn btn-xs btn-outline font-normal text-white self-end">
					<Image size={16} />
					Add image
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<div className="text-white font-normal text-[14px]">Set Price</div>
				<div className="relative">
					<input
						type="number"
						className="input input-bordered w-full max-w-xs text-white border-white bg-[black]"
					/>
					<select className="absolute right-2 top-3 select select-bordered select-xs  max-w-xs border-white text-white bg-[black] ">
						{/* <option disabled selected>
							Choose Blockchain
						</option> */}
						<option>BTC</option>
						<option>MVC</option>
					</select>
				</div>
			</div>
			<button
				className="btn btn-primary btn-sm rounded-full font-medium w-[80px] flex self-center"
				type="submit"
			>
				Post
			</button>
		</form>
	);
};

export default BuzzForm;
