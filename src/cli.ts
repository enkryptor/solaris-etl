import showHelp from './commands/help';
import importCSV from './commands/import';

/**
 * Process command-line arguments and execute appropriate command
 */
export async function run(args: string[]): Promise<void> {
  if (!args.length) {
    showHelp();
    return;
  }

  const [command, ...params] = args;

  switch (command) {
    case '--help':
    case '-h':
      showHelp();
      break;
    
    case 'import':
      await importCSV(params);
      break;
    
    default:
      showHelp();
      throw new Error(`Unknown command "${command}"`);
  }
}
