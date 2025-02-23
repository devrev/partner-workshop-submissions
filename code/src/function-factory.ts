// src/function-factory.ts

import extraction from './functions/extraction';
import install_initial_domain_mapping from './functions/install_initial_domain_mapping';
import loading from './functions/loading';

// Feature 1: Federated Search
import { federatedSearch } from './functions/federatedSearch';

// Feature 2: Indexed Search
import {
  initialIndexDrive,
  incrementalUpdateDriveIndex,
  searchDriveIndex,
} from './functions/driveIndexer';

// Feature 3: Permissions Enforcement
import { enforcePermissionsSearch } from './functions/enforcePermissionsSearch';

// Feature 4: Authentication & Security
import { secureDriveSearch } from './functions/secureDriveSearch';

/**
 * Exports a factory object mapping function names to their implementations.
 * This allows calling them dynamically by name in your main.ts or server code.
 */
export const functionFactory = {
  extraction,
  install_initial_domain_mapping,
  loading,

  // From Feature 1
  federatedSearch,

  // From Feature 2
  initialIndexDrive,
  incrementalUpdateDriveIndex,
  searchDriveIndex,

  // From Feature 3
  enforcePermissionsSearch,

  // From Feature 4
  secureDriveSearch,
} as const;

export type FunctionFactoryType = keyof typeof functionFactory;
