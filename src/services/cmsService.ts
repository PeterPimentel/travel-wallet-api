import { Feature, FeatureApiResponse, HeroMarketing, HeroMarketingApiResponse } from '../types/CMSType';
import { fetcher } from '../util/fetcher';

const CMS_API_URL = process.env.CMS_API_URL;

async function cmsfetcher<T>(resource: string): Promise<T> {
  return await fetcher({ method: 'get' }, `${CMS_API_URL}/items/${resource}`);
}

const featureToStandard = (features: Feature[]) => {
  return features.map((feature) => ({
    id: feature.id,
    icon: feature.icon,
    title: feature.title,
    description: feature.description,
  }));
};

const heroToStandard = (hero: HeroMarketing) => {
  return {
    id: hero.id,
    title: hero.title,
    summary: hero.summary,
  };
};

export const landingPage = async () => {
  const featuresPromise = cmsfetcher<FeatureApiResponse>('app_features');
  const heroMarketingPromise = cmsfetcher<HeroMarketingApiResponse>('app_hero_marketing');

  const [heroMarketing, features] = await Promise.all([heroMarketingPromise, featuresPromise]);

  return {
    features: featureToStandard(features.data),
    hero: heroToStandard(heroMarketing.data),
  };
};
