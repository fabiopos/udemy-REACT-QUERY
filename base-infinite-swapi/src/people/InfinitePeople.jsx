import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import { Person } from "./Person";

const initialUrl = "https://swapi.dev/api/people/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  const { data, isLoading, isFetching, fetchNextPage, hasNextPage } =
    useInfiniteQuery(
      `sw-people`,
      ({ pageParam = initialUrl }) => fetchUrl(pageParam),
      {
        getNextPageParam: (lastPage) => lastPage.next || undefined,
      }
    );
  // TODO: get data for InfiniteScroll via React Query
  if (isLoading) return <div className="loading">Loading...</div>;
  return (
    <>
    {isFetching && <div className="loading">Loading...</div>}
      <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
        {data.pages.map((pageData) =>
          pageData.results.map((person) => (
            <Person
              key={person.name}
              name={person.name}
              eyeColor={person.eye_color}
              hairColor={person.hair_color}
            />
          ))
        )}
      </InfiniteScroll>
    </>
  );
}
