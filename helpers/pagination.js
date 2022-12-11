function makePaginationQuery(stages, page, limit, additionalLookup, additionalStages, overrideSkip) {
  const query = [];
  if (page == 0) page = 1;
  let skip = (page - 1) * limit;
  if (overrideSkip != null && overrideSkip != undefined) {
    skip = overrideSkip;
  }

  if (!stages) stages = [];

  const filterStage = [].concat(stages);
  let lastStage = [];
  if (additionalLookup && additionalLookup.length > 0) {
    lastStage = lastStage.concat(additionalLookup);
  }

  const dataStatges = {
    filtered: filterStage,
    data: filterStage.concat({ $skip: skip }, { $limit: limit }).concat(lastStage),
  };

  if (additionalStages && Object.keys(additionalStages).length > 0) {
    for (const key of Object.keys(additionalStages)) {
      dataStatges[key] = additionalStages[key];
    }
  }

  query.push(
    {
      $facet: dataStatges,
    },
    {
      $addFields: {
        pagination: {
          record_per_page: {
            $literal: limit,
          },
          current_page: {
            $literal: page,
          },
          total_record: {
            $size: '$filtered',
          },
          total_record_on_current_page: {
            $size: '$data',
          },
          total_page: {
            $ceil: {
              $divide: [
                {
                  $size: '$filtered',
                },
                limit,
              ],
            },
          },
        },
      },
    },
    {
      $project: {
        'data.__v': 0,
        allRecords: 0,
        filtered: 0,
      },
    },
  );
  return query;
}

exports.makePaginationQuery = makePaginationQuery;
