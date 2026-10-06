/** The imperial option uses US customary units, not British Imperial volumes. */
export type MeasurementSystem = 'metric' | 'imperial';

export interface FoodbookConfig {
  name: string;
  description: string;
  tagline: string;
  /** Default language for new recipe imports, as a BCP 47 tag (e.g. en or it-IT). */
  language: string;
  /** Default measurement system for new recipe imports. */
  measurementSystem: MeasurementSystem;
  /** Include bundled starter recipes alongside personal recipes. */
  includeDefaultRecipes: boolean;
}

export const foodbookDefaults: FoodbookConfig = {
  name: 'Foodbook',
  description:
    'A personal recipe collection you own and maintain with an AI agent.',
  tagline: 'The dishes you love, gathered in one happy place.',
  language: 'en',
  measurementSystem: 'metric',
  includeDefaultRecipes: true,
};
