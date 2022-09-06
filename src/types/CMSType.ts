export type Feature = {
  id: number;
  status: string;
  icon: string;
  title: string;
  description: string;
};

export type FeatureApiResponse = {
  data: Feature[];
};

export type HeroMarketing = {
  id: number;
  status: string;
  title: string;
  summary: string;
  main_image: string;
};

export type HeroMarketingApiResponse = {
  data: HeroMarketing;
};
