import personalConfig from '../../foodbook.config';
import { foodbookDefaults, type FoodbookConfig } from './foodbook-defaults';

export const foodbook: FoodbookConfig = {
  ...foodbookDefaults,
  ...personalConfig,
};
