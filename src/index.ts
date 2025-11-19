#!/usr/bin/env node

import { run } from "./cli";

/**
 * Main entry point
 */
function main(): void {
  run(process.argv.slice(2))
    .then()
    .catch((error) => {
      console.error(
        "An error occurred:",
        error instanceof Error ? error.message : `${error}`
      );
      process.exit(1);
    });
}

if (require.main === module) {
  main();
}
