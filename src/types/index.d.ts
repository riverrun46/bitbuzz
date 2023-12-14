export type BuzzItem = {
	user: string;
	isFollowed: boolean;
	content: string;
	txid: string;
	id: string;
	createTime: string;
};

export type BuzzNewForm = {
	content: string;
	createTime: string;
	// price:string
};
