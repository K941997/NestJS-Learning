import { EntityManager, getConnection } from 'typeorm';

/**
 * repositories in transaction must use EntityManager to interact with the database
 * instead of default methods with repository
 */
export async function useTransaction(
  fn: (manager: EntityManager) => Promise<any>,
) {
  const queryRunner = getConnection().createQueryRunner();
  await queryRunner.startTransaction();
  try {
    const result = await fn(queryRunner.manager);
    await queryRunner.commitTransaction();
    return result;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    return false;
  } finally {
    await queryRunner.release();
  }
}
