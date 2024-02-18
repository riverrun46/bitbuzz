import { dropRepeats } from "ramda";
import { useEffect, useState } from "react";

const useImagesPreview = (files: FileList) => {
	const [imgSrcs, setImgSrcs] = useState<string[]>([]);

	useEffect(() => {
		if (files) {
			const imageArray: string[] = Array.from(files).map((file) => URL.createObjectURL(file));
			setImgSrcs((prevImages) => dropRepeats(prevImages.concat(imageArray)));
		}
	}, [files]);

	return [imgSrcs];
};

export default useImagesPreview;
