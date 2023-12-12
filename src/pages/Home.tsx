import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deletePost, fetchPosts } from "../api/posts";
import AddPost from "../components/AddPost";
import BuzzList from "../components/BuzzList";
import RecommendUsers from "../components/RecommendUsers";

const Home = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const connected = false;

  const {
    isLoading,
    isError,
    data: posts,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleDelete = (id: string) => {
    deletePostMutation.mutate(id);
  };
  if (connected) {
    return (
      <main className="">
        <RecommendUsers />
        <BuzzList />
      </main>
    );
  }
  return (
    <main className="h-full place-content-center overflow-hidden">
      <img
        src="src/image/orbuzz_home_img.png"
        width={650}
        height={600}
        alt="Picture of the home"
        className="absolute top-[10rem]"
      />
      <div className="flex flex-col items-center mt-[12rem]">
        <div className="text-main font-['impact'] text-[120px]">ORDID</div>
        <div className="text-[white]">Claim your DID on bitcoin</div>
        <div className="btn btn-primary rounded-full mt-[8rem] text-[20px] font-medium	w-[220px]">
          Connect Wallet
        </div>
      </div>
    </main>
  );

  // if (isLoading) return <div>"loading..."</div>;
  // if (isError) return <div>`Error: ${error.message}`</div>;

  // return (
  //   <div>
  //     <AddPost />
  //     {(posts ?? []).map((post) => (
  //       <div key={post.id} style={{ background: "#777" }}>
  //         <h2
  //           style={{ cursor: "pointer" }}
  //           onClick={() => navigate(`/post/${post.id}`)}
  //         >
  //           {post.title}
  //         </h2>
  //         <h3>{post.body}</h3>
  //         <button onClick={() => navigate(`/post/${post.id}/edit`)}>
  //           Edit
  //         </button>
  //         <button onClick={() => handleDelete(post.id)}>Delete</button>
  //       </div>
  //     ))}
  //   </div>
  // );
};

export default Home;
