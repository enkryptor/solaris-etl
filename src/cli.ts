import showHelp from './commands/help';
import importCSV from './commands/import';
import { SimpleWriter } from "./lib/writers";


/**
 * Запуск команды, указанной в аргументах
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
      // TODO добавить разные стратегии записи в зависимости от ключей
      await importCSV(params, new SimpleWriter());
      break;
    
    default:
      showHelp();
      throw new Error(`Unknown command "${command}"`);
  }
}
