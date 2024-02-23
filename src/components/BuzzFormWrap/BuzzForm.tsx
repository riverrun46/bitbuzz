/* eslint-disable @typescript-eslint/no-explicit-any */
import { Image } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import cls from "classnames";
import useImagesPreview from "../../hooks/useImagesPreview";
import { IsEncrypt, image2Attach } from "../../utils/file";
import { isNil } from "ramda";

export interface AttachmentItem {
	fileName: string;
	fileType: string;
	data: string;
	encrypt: IsEncrypt;
	sha256: string;
	size: number;
	url: string;
}

type IProps = {
	onSubmit: (buzz: { content: string; images: AttachmentItem[] }) => void;
};

export type BuzzData = {
	content: string;
	images: FileList;
};

const renderImages = (data: string[]) => {
	return (
		<div className="grid grid-cols-3 gap-2 place-items-center">
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

const BuzzForm = ({ onSubmit }: IProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
	} = useForm<BuzzData>();

	const files = watch("images");
	const [filesPreview, setFilesPreview] = useImagesPreview(files);

	const onCreateSubmit: SubmitHandler<BuzzData> = async (data) => {
		const images = data.images.length !== 0 ? await image2Attach(data.images) : [];

		onSubmit({
			content: data.content,
			images,
		});
		console.log("attachments", images);
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
				<div className="flex items-center self-end gap-2">
					{!isNil(files) && files.length !== 0 && (
						<div
							className="btn btn-xs btn-outline font-normal text-white"
							onClick={() => {
								setFilesPreview([]);
								setValue("images", [] as any);
							}}
						>
							clear current uploads
						</div>
					)}
					<div
						onClick={() => {
							document.getElementById("addImage")!.click();
						}}
						className="btn btn-xs btn-outline font-normal text-white "
					>
						<Image size={16} />
						Add image
					</div>
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
