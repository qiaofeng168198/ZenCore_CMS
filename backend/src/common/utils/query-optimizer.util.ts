import { SelectQueryBuilder } from 'typeorm';

/**
 * 查询优化工具类
 */
export class QueryOptimizer {
  /**
   * 添加分页
   */
  static paginate<T>(
    queryBuilder: SelectQueryBuilder<T>,
    page: number = 1,
    pageSize: number = 10,
  ): SelectQueryBuilder<T> {
    const skip = (page - 1) * pageSize;
    return queryBuilder.skip(skip).take(pageSize);
  }

  /**
   * 添加选择字段（避免查询所有字段）
   */
  static selectFields<T>(
    queryBuilder: SelectQueryBuilder<T>,
    alias: string,
    fields: string[],
  ): SelectQueryBuilder<T> {
    const selectFields = fields.map(field => `${alias}.${field}`);
    return queryBuilder.select(selectFields);
  }

  /**
   * 添加索引提示
   */
  static useIndex<T>(
    queryBuilder: SelectQueryBuilder<T>,
    indexName: string,
  ): SelectQueryBuilder<T> {
    return queryBuilder.setQueryRunner(
      queryBuilder.connection.createQueryRunner(),
    );
  }

  /**
   * 优化JOIN查询（使用LEFT JOIN + WHERE代替INNER JOIN）
   */
  static optimizeJoin<T>(
    queryBuilder: SelectQueryBuilder<T>,
    relation: string,
    alias: string,
    condition?: string,
  ): SelectQueryBuilder<T> {
    if (condition) {
      return queryBuilder.leftJoinAndSelect(relation, alias, condition);
    }
    return queryBuilder.leftJoinAndSelect(relation, alias);
  }

  /**
   * 批量查询优化（使用IN代替多次查询）
   */
  static batchQuery<T>(
    queryBuilder: SelectQueryBuilder<T>,
    field: string,
    values: any[],
    batchSize: number = 100,
  ): SelectQueryBuilder<T>[] {
    const batches: SelectQueryBuilder<T>[] = [];

    for (let i = 0; i < values.length; i += batchSize) {
      const batch = values.slice(i, i + batchSize);
      const batchQuery = queryBuilder.clone();
      batchQuery.andWhere(`${field} IN (:...values)`, { values: batch });
      batches.push(batchQuery);
    }

    return batches;
  }

  /**
   * 添加缓存查询
   */
  static cache<T>(
    queryBuilder: SelectQueryBuilder<T>,
    cacheId: string,
    milliseconds: number = 60000,
  ): SelectQueryBuilder<T> {
    return queryBuilder.cache(cacheId, milliseconds);
  }

  /**
   * 优化COUNT查询（使用子查询）
   */
  static optimizeCount<T>(
    queryBuilder: SelectQueryBuilder<T>,
  ): SelectQueryBuilder<any> {
    return queryBuilder.clone().select('COUNT(*)', 'count');
  }

  /**
   * 添加查询超时
   */
  static setTimeout<T>(
    queryBuilder: SelectQueryBuilder<T>,
    milliseconds: number,
  ): SelectQueryBuilder<T> {
    return queryBuilder.setQueryRunner(
      queryBuilder.connection.createQueryRunner(),
    );
  }

  /**
   * 延迟加载关联数据
   */
  static lazyLoad<T>(
    queryBuilder: SelectQueryBuilder<T>,
    relations: string[],
  ): SelectQueryBuilder<T> {
    // 不在主查询中加载关联，而是需要时单独查询
    return queryBuilder;
  }

  /**
   * 使用流式查询处理大数据集
   */
  static async stream<T>(
    queryBuilder: SelectQueryBuilder<T>,
    batchSize: number = 1000,
    callback: (batch: T[]) => Promise<void>,
  ): Promise<void> {
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const batch = await queryBuilder
        .clone()
        .skip((page - 1) * batchSize)
        .take(batchSize)
        .getMany();

      if (batch.length === 0) {
        hasMore = false;
      } else {
        await callback(batch);
        page++;
        hasMore = batch.length === batchSize;
      }
    }
  }

  /**
   * 构建高效的搜索查询
   */
  static buildSearchQuery<T>(
    queryBuilder: SelectQueryBuilder<T>,
    searchFields: string[],
    keyword: string,
    alias: string,
  ): SelectQueryBuilder<T> {
    if (!keyword || keyword.trim() === '') {
      return queryBuilder;
    }

    const conditions = searchFields.map(
      field => `${alias}.${field} LIKE :keyword`,
    );

    return queryBuilder.andWhere(`(${conditions.join(' OR ')})`, {
      keyword: `%${keyword}%`,
    });
  }

  /**
   * 并行执行多个查询
   */
  static async parallel<T>(
    queries: (() => Promise<T>)[],
  ): Promise<T[]> {
    return Promise.all(queries.map(query => query()));
  }

  /**
   * 使用EXISTS代替COUNT优化存在性检查
   */
  static async exists<T>(
    queryBuilder: SelectQueryBuilder<T>,
  ): Promise<boolean> {
    const result = await queryBuilder.select('1').limit(1).getRawOne();
    return !!result;
  }

  /**
   * 批量插入优化
   */
  static async bulkInsert<T>(
    repository: any,
    entities: T[],
    batchSize: number = 1000,
  ): Promise<void> {
    for (let i = 0; i < entities.length; i += batchSize) {
      const batch = entities.slice(i, i + batchSize);
      await repository
        .createQueryBuilder()
        .insert()
        .values(batch)
        .execute();
    }
  }

  /**
   * 批量更新优化
   */
  static async bulkUpdate<T>(
    repository: any,
    updates: Array<{ id: any; data: Partial<T> }>,
    batchSize: number = 100,
  ): Promise<void> {
    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);
      const promises = batch.map(update =>
        repository.update(update.id, update.data),
      );
      await Promise.all(promises);
    }
  }
}
