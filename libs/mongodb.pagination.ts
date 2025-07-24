import ApiError from '@/libs/ApiError';
import { ErrorCodes } from '@/libs/constants/errorCodes';
import responseMessages from '@/libs/constants/responseMessages';
import {
  IPaginationOptions,
  IPaginatedResponse,
} from '@/types/api.response.paginated';
import { Model, PipelineStage, Types } from 'mongoose';

export async function FetchPaginatedDataWithAggregation<T = any>(
  model: Model<any>,
  basePipeline: PipelineStage[] = [],
  rawOptions: IPaginationOptions & Record<string, any>,
  endPipeline: PipelineStage[] = [],
): Promise<IPaginatedResponse<T>> {
  const {
    page: rawPage = '1',
    pageSize: rawPageSize = '10',
    searchValue,
    searchFields = [],
    sortField,
    sortOrder,
    projection,
    excludeIds,
    selectFields,
    ids,
    populateFields,
    ...rawFilter
  } = rawOptions;

  const page = Number(rawPage);
  const pageSize = Number(rawPageSize);
  const skip = (Number(page) - 1) * Number(pageSize);

  // Build $match stage from filters
  const matchStage: Record<string, any> = { ...rawFilter };

  if (page <= 0) {
    throw new ApiError(
      responseMessages.CLIENT.MISSING_INVALID_INPUT,
      400,
      ErrorCodes.CLIENT.MISSING_INVALID_INPUT,
    );
  }

  // IDs filter
  if (ids) {
    const parsedIds = Array.isArray(ids) ? ids : ids.split(',');
    const validIds = parsedIds
      .filter(Types.ObjectId.isValid)
      .map((id) => new Types.ObjectId(id));
    if (validIds.length > 0) matchStage._id = { $in: validIds };
  }

  // Exclude IDs
  if (excludeIds) {
    const parsedIds = Array.isArray(excludeIds)
      ? excludeIds
      : excludeIds.split(',');
    const validIds = parsedIds
      .filter(Types.ObjectId.isValid)
      .map((id) => new Types.ObjectId(id));
    matchStage._id = { ...(matchStage._id || {}), $nin: validIds };
  }

  // Normalize search fields
  const normalizedSearchFields = Array.isArray(searchFields)
    ? searchFields
    : typeof searchFields === 'string'
    ? searchFields.split(',').map((field) => field.trim())
    : [];

  // Search handling
  if (searchValue && normalizedSearchFields.length > 0) {
    const regexOrs = normalizedSearchFields
      .filter((field) => field !== '_id')
      .map((field) => ({
        [field]: { $regex: searchValue.trim(), $options: 'i' },
      }));
    const objectIdOr =
      Types.ObjectId.isValid(searchValue) &&
      normalizedSearchFields.includes('_id')
        ? [{ _id: new Types.ObjectId(searchValue) }]
        : [];
    matchStage.$or = [...regexOrs, ...objectIdOr];
  }

  // Add $match to the pipeline
  const pipeline: PipelineStage[] = [...basePipeline, { $match: matchStage }];

  // Projection handling
  if (projection && typeof projection === 'string') {
    const fields = projection.split(',').map((f) => f.trim());
    if (fields.length > 0) {
      pipeline.push({
        $project: fields.reduce((acc, field) => {
          acc[field] = 1;
          return acc;
        }, {} as Record<string, number>),
      });
    }
  }

  // Sorting
  if (sortField) {
    const sort: { [key: string]: 1 | -1 } = !!sortField
      ? { [sortField]: sortOrder === 'desc' ? -1 : 1 }
      : { createdAt: -1 };
    pipeline.push({ $sort: sort });
  }

  const dataPipeline: PipelineStage[] = [
    { $skip: skip },
    { $limit: pageSize },
    ...endPipeline,
  ];

  // Apply populateFields inside `dataPipeline` before putting it into $facet
  if (populateFields && Array.isArray(populateFields)) {
    for (const { path, select, from: collectionName } of populateFields) {
      const localField = path;
      const foreignField = '_id';

      const from = collectionName ?? path.replace(/Id$/, 's');

      const selectedFields = select
        ? select.split(' ').reduce(
            (acc, field) => {
              acc[field] = 1;
              return acc;
            },
            { _id: 1 } as Record<string, number>,
          )
        : { _id: 1 };

      dataPipeline.push(
        {
          $lookup: {
            from,
            localField,
            foreignField,
            as: path,
          },
        },
        {
          $unwind: {
            path: `$${path}`,
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            [path]: {
              $cond: [
                { $ifNull: [`$${path}`, false] },
                Object.fromEntries(
                  Object.entries(selectedFields).map(([key]) => [
                    key,
                    `$${path}.${key}`,
                  ]),
                ),
                null,
              ],
            },
          },
        },
      );
    }
  }

  // Add $facet to the pipeline, to count the total number of items & apply pagination
  const paginatedPipeline: PipelineStage[] = [
    ...pipeline,
    {
      $facet: {
        data: [...dataPipeline] as PipelineStage.FacetPipelineStage[],
        totalCount: [
          { $count: 'totalItems' },
        ] as PipelineStage.FacetPipelineStage[],
      },
    } as PipelineStage.Facet,
    {
      $addFields: {
        totalItems: {
          $ifNull: [{ $arrayElemAt: ['$totalCount.totalItems', 0] }, 0],
        },
      },
    },
  ];

  // console.log('pipeline', JSON.stringify(paginatedPipeline, null, 2));

  const result = await model.aggregate(paginatedPipeline);

  const { data, totalItems } = result[0] || { data: [], totalItems: 0 };
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    status: 'success',
    message: responseMessages.GENERAL.SUCCESS,
    data,
    totalItems,
    totalPages,
    currentPage: Number(page),
    pageSize: Number(pageSize),
    hasMore: data.length === Number(pageSize),
  };
}

