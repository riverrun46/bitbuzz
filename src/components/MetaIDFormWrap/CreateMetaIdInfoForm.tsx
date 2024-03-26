/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, SubmitHandler } from "react-hook-form";
import cls from "classnames";
import { Image } from "lucide-react";
import useImagesPreview from "../../hooks/useImagesPreview";
import { isEmpty, isNil } from "ramda";
import { image2Attach } from "../../utils/file";
import { MetaidUserInfo } from "./CreateMetaIDFormWrap";

export type UserInfo = {
	name: string;
	avatar: FileList;
	bio?: string;
};

type IProps = {
	onSubmit: (userInfo: MetaidUserInfo) => void;
	initialValues?: {
		name?: string;
		bio?: string | undefined;
	};
};

const CreateMetaIdInfoForm = ({ onSubmit, initialValues }: IProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<UserInfo>({
		defaultValues: { name: initialValues?.name, bio: initialValues?.bio },
	});

	const avatar = watch("avatar");

	const [filesPreview, setFilesPreview] = useImagesPreview(avatar);
	const onCreateSubmit: SubmitHandler<UserInfo> = async (data) => {
		const submitAvatar =
			!isNil(data?.avatar) && data.avatar.length !== 0 ? await image2Attach(data.avatar) : [];

		const submitData = {
			...data,
			avatar: !isEmpty(submitAvatar)
				? Buffer.from(submitAvatar[0].data, "hex").toString("base64")
				: undefined,
			bio: isEmpty(data?.bio ?? "") ? undefined : data?.bio,
		};
		console.log("submit profile data", submitData);
		onSubmit(submitData);
	};
	// console.log("avatar", avatar, !isEmpty(avatar));
	return (
		<form
			autoComplete="off"
			onSubmit={handleSubmit(onCreateSubmit)}
			className="mt-8 flex flex-col gap-6"
		>
			<div className="flex flex-col gap-8">
				<div className="flex flex-col gap-2">
					<div className="text-white">Your Name</div>
					<label
						className={cls(
							"input input-bordered border-white text-white bg-[black] flex items-center gap-2 relative",
							{
								"input-error": errors.name,
							}
						)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							className="w-4 h-4 opacity-70"
						>
							<path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
						</svg>
						<input
							type="text"
							className="grow bg-[black]"
							{...register("name", { required: true })}
						/>
						{errors.name && (
							<span className="text-error absolute top-[50px] text-sm">
								Username can't be empty.
							</span>
						)}
					</label>
				</div>
				<div className="flex flex-col gap-2">
					<div className="flex justify-between">
						<div className="text-white">Your PFP</div>
						{!isNil(avatar) && avatar.length !== 0 && (
							<div
								className="btn btn-xs btn-outline font-normal text-white"
								onClick={() => {
									setFilesPreview([]);
									setValue("avatar", [] as any);
								}}
							>
								clear current uploads
							</div>
						)}
					</div>

					<input type="file" id="addPFP" className="hidden" {...register("avatar")} />

					{!isNil(avatar) && avatar.length !== 0 ? (
						<img
							className="image self-center rounded-full"
							height={"100px"}
							width={"100px"}
							src={filesPreview[0]}
							alt=""
						/>
					) : (
						<div
							onClick={() => {
								document.getElementById("addPFP")!.click();
							}}
							className="btn btn-outline font-normal text-white bg-[black]"
						>
							<Image size={16} />
							Click To Upload
						</div>
					)}
				</div>
				<div className="flex flex-col gap-2">
					<div className="text-white">Your Bio</div>

					<textarea
						className={cls(
							"textarea textarea-bordered border-white text-white bg-[black] h-[200px] flex items-center gap-2 relative"
						)}
						{...register("bio")}
					/>
				</div>
			</div>

			<button
				className="btn btn-primary  rounded-full font-medium w-[120px] flex self-center mt-6"
				type="submit"
			>
				Submit
			</button>
		</form>
	);
};

export default CreateMetaIdInfoForm;
