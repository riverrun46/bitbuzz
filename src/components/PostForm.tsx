import React from "react";
import { useState } from "react";
import { FormInputPost } from "../types";

type IProps = {
  onSubmit: (post: Omit<FormInputPost, "id">) => void;
  initialValue?: Omit<FormInputPost, "id">;
};

const PostForm = ({ onSubmit, initialValue }: IProps) => {
  const [post, setPost] = useState({
    title: initialValue?.title ?? "",
    body: initialValue?.body ?? "",
  });

  const handleChangeInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value,
    });
  };

  const renderField = (label: string) => (
    <div>
      <label>{label}</label>
      <input
        onChange={handleChangeInput}
        type="text"
        name={label.toLowerCase()}
        value={post[label.toLowerCase()]}
      />
    </div>
  );

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSubmit(post);
    setPost({
      title: "",
      body: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {renderField("Title")}
      {renderField("Body")}
      <button type="submit">Submit</button>
    </form>
  );
};

export default PostForm;
