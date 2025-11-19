const VERSION = '1.1.0';
const NAME = 'solaris-etl';

/**
 * Показать справку по использованию
 */
export default function showHelp(): void {
  console.log(`
Solaris ETC tool v${VERSION}

Usage: ${NAME} [command] [options]

Commands:
  import [filename.csv]  Import a CSV file
  --help, -h             Show this help message

Examples:
  ${NAME} import ./files/data.csv
  ${NAME} --help
`);
}
