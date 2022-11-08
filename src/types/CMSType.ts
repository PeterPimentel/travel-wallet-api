export type Feature = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

export type HeroMarketing = {
  title: string;
  summary: string;
};

export type Carousel = string;

type HeaderTranslations = {
  title: string;
  summary: string
}

type FeaturesTranslations = {
  feature_title: string;
  feature_description: string;
}

export type HeaderQueryResponse = {
  translations: HeaderTranslations[]
}

export type CarouselQueryResponse = {
  image: string;
}
export type CoverQueryResponse = {
  cover: string;
}

export type FeaturesQueryResponse = {
  id: string;
  feature_icon: string;
  translations: FeaturesTranslations[]
}

export type SocialMediaQueryResponse = {
  link: string;
  type: string;
}

export type LandingPageQueryResponse = {
  data: {
    header: HeaderQueryResponse;
    carousel: CarouselQueryResponse[];
    features: FeaturesQueryResponse[];
    cover: CoverQueryResponse;
    social_media: SocialMediaQueryResponse[];
  }
}