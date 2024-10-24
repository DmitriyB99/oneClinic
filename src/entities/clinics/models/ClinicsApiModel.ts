export interface GetClinicsQueryParams {
  latitude?: number;
  longitude?: number;
  name?: string;
  page?: number;
  ratingAbove?: number;
  sort?: string;
  status?: string;
  tags?: string[];
}
