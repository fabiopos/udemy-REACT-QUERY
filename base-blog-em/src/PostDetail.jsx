import React from "react";
import { useQuery, useMutation } from "react-query";
async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "PATCH", data: { title: "REACT QUERY FOREVER!!!!" } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  const deleteMutation = useMutation((postId) => deletePost(postId));
  const updateMutation = useMutation((postId) => updatePost(postId));
  const { data, isLoading, isError, error } = useQuery(
    ["comments", post.id],
    () => fetchComments(post.id)
  );

  const handleDeleteClick = () => {
    deleteMutation.mutate(post.id);
  };

  const handleUpdateClick = () => {
    updateMutation.mutate(post.id);
  };

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={handleDeleteClick}>Delete</button>

      {deleteMutation.isError && (
        <div style={{ color: "red" }}>
          Error: {deleteMutation.error.toString()}
        </div>
      )}

      {deleteMutation.isSuccess && (
        <div style={{ color: "green" }}>Success !!!</div>
      )}
      {deleteMutation.isLoading && (
        <div style={{ color: "purple" }}>Deleting...</div>
      )}
      <button onClick={handleUpdateClick}>Update title</button>
      {updateMutation.isError && (
        <div style={{ color: "red" }}>
          Error: {updateMutation.error.toString()}
        </div>
      )}

      {updateMutation.isSuccess && (
        <div style={{ color: "green" }}>Success !!!</div>
      )}
      {updateMutation.isLoading && (
        <div style={{ color: "purple" }}>Updating...</div>
      )}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {isError && (
        <div>
          <p>Error loading comments</p>
          <p>{error.toString()}</p>
        </div>
      )}
      {isLoading
        ? "Loading comments"
        : (data ?? []).map((comment) => (
            <li key={comment.id}>
              {comment.email}: {comment.body}
            </li>
          ))}
    </>
  );
}
