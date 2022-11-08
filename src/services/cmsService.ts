import {
  Carousel,
  CarouselQueryResponse,
  CoverQueryResponse,
  Feature,
  FeaturesQueryResponse,
  HeaderQueryResponse,
  HeroMarketing,
  LandingPageQueryResponse
} from '../types/CMSType';
import { fetcher } from '../util/fetcher';
import { getLocaleCode } from '../util/localeUtil';

const CMS_API_URL = process.env.CMS_API_URL;

type GraphqlQuery = {
  query: string
}

async function cmsGraphqlFetcher<T>(data: GraphqlQuery): Promise<T> {
  return await fetcher({ method: 'post' }, `${CMS_API_URL}/graphql`, data);
}

const featureToStandard = (feature: FeaturesQueryResponse): Feature => ({
  id: feature.id,
  title: feature.translations.length ? feature.translations[0].feature_title : '',
  description: feature.translations.length ? feature.translations[0].feature_description : '',
  icon: feature.feature_icon
});

const heroToStandard = (hero: HeaderQueryResponse): HeroMarketing => ({
  title: hero.translations.length ? hero.translations[0].title : '',
  summary: hero.translations.length ? hero.translations[0].summary : '',
});

const carouselToStandard = (carousel: CarouselQueryResponse): Carousel => carousel.image;
const coverToStandard = (cover: CoverQueryResponse): Carousel => cover.cover;

export const landingPage = async (locale: string) => {
  const localeCode = getLocaleCode(locale);

  const graphqlQuery = {
    query: `
      query {
        header: landing_page {
          translations(filter: { languages_id: { _eq: "${localeCode}" } }) {
            title
            summary
          }
        }
        carousel : landing_page_carousel {
          image
        }
        cover: landing_page_carousel_cover {
          cover
        }
        features: app_features {
          id
          feature_icon
          translations(filter: { languages_code: { _eq: "${localeCode}" } }) {
            feature_title
            feature_description
          }
        }
        social_media {
          link
          type
        }
      }
    `
  }
  const response = await cmsGraphqlFetcher<LandingPageQueryResponse>(graphqlQuery)

  return {
    hero: heroToStandard(response.data.header),
    carousel: response.data.carousel.map(carouselToStandard),
    cover: coverToStandard(response.data.cover),
    features: response.data.features.map(featureToStandard),
    social: response.data.social_media
  };
};
