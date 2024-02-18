import { useForm, SubmitHandler } from "react-hook-form";
import cls from "classnames";

export type UserInfo = {
	name: string;
};

type IProps = {
	onSubmit: (userInfo: UserInfo) => void;
};

const CreateForm = ({ onSubmit }: IProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UserInfo>();

	const onCreateSubmit: SubmitHandler<UserInfo> = (data) => {
		onSubmit(data);
	};

	return (
		<form
			autoComplete="off"
			onSubmit={handleSubmit(onCreateSubmit)}
			className="mt-8 flex flex-col gap-6"
		>
			<div className="flex flex-col gap-2">
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
						placeholder="Enter Username here"
						{...register("name", { required: true })}
					/>
					{errors.name && (
						<span className="text-error absolute top-[50px] text-sm">
							Username can't be empty.
						</span>
					)}
				</label>
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

export default CreateForm;
