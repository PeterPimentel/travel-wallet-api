import { Location } from "@prisma/client"
import { Place, PlaceApiResponse } from "../../types/LocationType";
import { checkProperties, ValidatorResponse } from "./common"

type ReducedLocation = Omit<Location, "id" | "createdAt" | "ownerId" | "travelId">

export const isValidLocation = (operation: 'CREATE' | 'UPDATE', data: Partial<Location>): ValidatorResponse => {
  const PROPS = ['countryCode', 'countryName', 'cityName', 'label', 'cityLat', 'region', 'cityLong']

  if (operation === 'CREATE') {
    return checkProperties(data, PROPS)
  } else {
    return checkProperties(data, [...PROPS, 'id'])
  }
}

export const isSameLocation = (data: Location, storedLocation: Location | null): boolean => {
  const isSameCity = data.label === storedLocation?.label
  const isSameCountry = data.countryCode === storedLocation?.countryCode
  const isSameRegion = data.region === storedLocation?.region

  return isSameCity && isSameCountry && isSameRegion;
}

export const isValidPlaceResponse = (response: PlaceApiResponse) => {
  if (!response || !response.data) {
    return false;
  }

  return true;
}

export const placesReduceFromApi = (places: Place[]): ReducedLocation[] => {
  return places.map<ReducedLocation>(place => ({
    countryName: place.country,
    countryCode: place.country_code,
    cityLat: place.latitude,
    cityLong: place.longitude,
    cityName: place.name,
    label: place.label,
    region: place.region,
    type: place.type,
  }))
}
