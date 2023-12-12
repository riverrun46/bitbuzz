import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPost } from "../api/posts";

const Post = () => {
  const navigate = useNavigate();
  const { id: tempId } = useParams();
  const id = tempId ?? "";
  const {
    isLoading,
    isError,
    data: post,
    error,
  } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => fetchPost(id),
  });

  if (isLoading) return <div>"loading..."</div>;
  if (isError) return <div>`Error: ${error.message}`</div>;

  return (
    <div>
      <button onClick={() => navigate("/")}>back to list posts</button>
      <h1>{post?.title}</h1>
      <p>{post?.body}</p>
    </div>
  );
};

export default Post;
