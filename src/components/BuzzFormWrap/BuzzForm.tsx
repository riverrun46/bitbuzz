/* eslint-disable @typescript-eslint/no-explicit-any */
import { Image } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import cls from "classnames";
import useImagesPreview from "../../hooks/useImagesPreview";

type IProps = {
	onSubmit: (buzz: BuzzData) => void;
};

export type BuzzData = {
	content: string;
	images: FileList;
};

const BuzzForm = ({ onSubmit }: IProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<BuzzData>();

	const files = watch("images");
	const [filesPreview] = useImagesPreview(files);

	const renderImages = (data: string[]) => {
		return (
			<div className="grid grid-cols-3 gap-1 place-items-center">
				{data.map((image) => {
					return (
						<img
							className="image"
							height={"50px"}
							width={"auto"}
							src={image}
							alt=""
							key={image}
						/>
					);
				})}
			</div>
		);
	};
	const onCreateSubmit: SubmitHandler<BuzzData> = (data) => {
		// onSubmit(data);
		console.log(
			"data",
			Array.from(data.images).map((file) => URL.createObjectURL(file))
		);
	};

	return (
		<form onSubmit={handleSubmit(onCreateSubmit)} className="mt-8 flex flex-col gap-6">
			<div className="flex flex-col gap-2 ">
				<div className="relative">
					<textarea
						className={cls(
							"textarea textarea-bordered border-white text-white bg-[black] textarea-sm h-[160px] w-full ",
							{
								"textarea-error": errors.content,
							}
						)}
						{...register("content", { required: true })}
					/>
					{errors.content && (
						<span className="text-error absolute left-0 top-[175px] text-sm">
							Buzz content can't be empty.
						</span>
					)}
				</div>
				<div
					onClick={() => {
						document.getElementById("addImage")!.click();
					}}
					className="btn btn-xs btn-outline font-normal text-white self-end"
				>
					<Image size={16} />
					Add image
				</div>
				<input
					type="file"
					multiple
					id="addImage"
					className="hidden"
					{...register("images")}
				/>
				{filesPreview && renderImages(filesPreview)}
			</div>
			<div className="flex flex-col gap-2">
				<div className="text-white font-normal text-[14px]">Set Price</div>
				<div className="relative">
					<input
						type="number"
						className="input input-bordered w-full text-white border-white bg-[black]"
					/>
					<select className="absolute right-2 top-3 select select-bordered select-xs  max-w-xs border-white text-white bg-[black] ">
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
