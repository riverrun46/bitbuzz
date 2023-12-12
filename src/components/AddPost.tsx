import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../api/posts";
import PostForm from "./PostForm";
import { v4 as uuidv4 } from "uuid";
import { FormInputPost } from "../types";

const AddPost = () => {
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      console.log("success bro!");
    },
  });

  const handleAddPost = (post: Omit<FormInputPost, "id">) => {
    createPostMutation.mutate({
      id: uuidv4(),
      ...post,
    });
  };

  return (
    <div>
      <h2>Add new post</h2>
      <PostForm
        onSubmit={handleAddPost}
        initialValue={{ title: "", body: "" }}
      />
    </div>
  );
};

export default AddPost;
