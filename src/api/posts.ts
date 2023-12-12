import { FormInputPost } from "../types";

export async function fetchPosts(): Promise<FormInputPost[]> {
  const response = await fetch("http://localhost:3000/posts");
  return response.json();
}

export async function fetchPost(id: string): Promise<FormInputPost> {
  const response = await fetch(`http://localhost:3000/posts/${id}`);
  return response.json();
}

export async function createPost(
  newPost: FormInputPost
): Promise<FormInputPost> {
  const response = await fetch(`http://localhost:3000/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPost),
  });
  return response.json();
}

export async function updatePost(
  updatedPost: FormInputPost
): Promise<FormInputPost> {
  const response = await fetch(
    `http://localhost:3000/posts/${updatedPost.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPost),
    }
  );
  return response.json();
}

export async function deletePost(id: string) {
  const response = await fetch(`http://localhost:3000/posts/${id}`, {
    method: "DELETE",
  });
  return response.json();
}
