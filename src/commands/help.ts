const VERSION = '1.0.0';
const NAME = 'cli-tool';

/**
 * Show help information for the CLI
 */
export default function showHelp(): void {
  console.log(`
Untitled CLI tool v${VERSION}

Usage: ${NAME} [command] [options]

Commands:
  import [filename.csv]  Import a CSV file
  --help, -h             Show this help message

Examples:
  ${NAME} import ./files/data.csv
  ${NAME} --help
`);
}
