export interface PageableResponse<T> {
  content: T[];
  first: boolean | null;
  last: boolean | null;
  number: number;
  numberOfElements: number;
  size: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  totalElements: number;
  totalPages: number;
}
