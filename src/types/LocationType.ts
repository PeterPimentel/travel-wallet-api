export type Place = {
  country_code: string;
  country: string;
  label: string;
  latitude: number;
  longitude: number;
  name: string;
  region: string;
  type: 'locality' | 'region' | 'address' | 'country';
}

export type PlaceApiRequest = {
  query: string;
};

export type PlaceApiResponse = {
  data: Place[];
};