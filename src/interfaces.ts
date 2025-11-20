/**
 * Исторические данные об объекте
 */
export type HistoryRecord = {
  code: string;
  lat: number;
  lon: number;
  radius: number;
  data: string;
}

/**
 * Записыватель данных в PostgreSQL
 */
export type Writer<I, T> = {
  /**
   * Начать сессию записи
   */
  start(initialData: I): Promise<void>;

  /**
   * Записать данные
   */
  write(record: T): Promise<void>;

  /**
   * Закончить сессию записи
   */
  end(): Promise<void>;
}
