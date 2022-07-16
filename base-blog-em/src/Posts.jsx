import React, { useEffect } from "react";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";

import { PostDetail } from "./PostDetail";

const maxPostPage = 10;

async function fetchPosts({ page }) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${page}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery(["posts", nextPage], () =>
        fetchPosts({ page: currentPage })
      );
    }
  }, [currentPage, queryClient]);

  const { data, isLoading, isError, error } = useQuery(
    ["posts", currentPage],
    () => fetchPosts({ page: currentPage }),
    {
      staleTime: 2 * 1000,
    }
  );

  const handleNextPageClick = () => setCurrentPage((prev) => prev + 1);
  const handlePrevPageClick = () => setCurrentPage((prev) => prev - 1);

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return (
      <div>
        <p>Error fetching Posts</p>
        <p>{error.toString()}</p>
      </div>
    );
  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled={currentPage <= 1} onClick={handlePrevPageClick}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={handleNextPageClick}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
