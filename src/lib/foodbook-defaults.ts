export interface FoodbookConfig {
  name: string;
  description: string;
  tagline: string;
}

export const foodbookDefaults: FoodbookConfig = {
  name: 'Foodbook',
  description:
    'A personal recipe collection you own and maintain with an AI agent.',
  tagline: 'Your recipes, in a collection you own.',
};
