import { useMemo } from "react";
import { useInfiniteQuery } from "react-query";

export const useLazySearchOptions = (apiMethod, searchValue, enabled) => {
  const {
    data: optionsList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["lazySearchOptions", apiMethod.name, searchValue],
    ({ pageParam = 1 }) =>
      apiMethod({
        page: pageParam,
        size: 20,
        search: searchValue.trim() ? searchValue : undefined,
      }).then((response) => ({
        result: response.data.result.map(
          (element: { id: string; name: string }) => ({
            id: element.id,
            name: element.name ?? "No name",
          })
        ),
        nextPage: pageParam + 1,
        totalPages: response.data.total_page,
      })),
    {
      getNextPageParam: (lastPage) =>
        lastPage.nextPage <= lastPage.totalPages
          ? lastPage.nextPage
          : undefined,
      enabled: enabled,
    }
  );

  const memoizedOptions = useMemo(
    () => optionsList?.pages.flatMap((page) => page?.result) || [],
    [optionsList]
  );

  return { memoizedOptions, fetchNextPage, hasNextPage, isFetchingNextPage };
};
