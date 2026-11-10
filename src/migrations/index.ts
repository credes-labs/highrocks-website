import * as migration_20261110_175854_initial from './20261110_175854_initial';

export const migrations = [
  {
    up: migration_20261110_175854_initial.up,
    down: migration_20261110_175854_initial.down,
    name: '20261110_175854_initial'
  },
];
