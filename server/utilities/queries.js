module.exports = {
  getLookupArray: ({
    from,
    as,
    localField,
    foreignField,
    project,
    arrayField = "",
  }) => {
    let prevSteps = [],
      groupSteps = [];
    if (arrayField) {
      prevSteps = [
        {
          $unwind: { path: `$${arrayField}`, preserveNullAndEmptyArrays: true },
        },
      ];
    }
    const lookupObject = {
      $lookup: {
        from: from,
        as: as,
        let: { local_id: `$${localField}` },
        pipeline: [
          {
            $match: { $expr: { $eq: [`$${foreignField}`, "$$local_id"] } },
          },
        ],
      },
    };
    if (project) {
      lookupObject.$lookup.pipeline.push({
        $project: {
          id: "$_id",
          _id: 0,
          _v: -1,
          ...project,
        },
      });
    }

    const addField = [{ $addFields: { [localField]: { $first: `$${as}` } } }];

    if (arrayField) {
      groupSteps = [
        {
          $group: {
            _id: "$_id",
            doc: { $first: "$$ROOT" },
            arrayField: { $push: `$${arrayField}` },
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                "$doc",
                {
                  [arrayField]: {
                    $filter: {
                      input: "$arrayField",
                      cond: { $gt: ["$$this", {}] },
                    },
                  },
                  id: "$_id",
                },
              ],
            },
          },
        },
      ];
    }
    return [
      ...prevSteps,
      lookupObject,
      { $unset: localField },
      ...addField,
      { $unset: as },
      ...groupSteps,
    ];
  },
  projectAndAdd: () => {
    return [{ $addFields: { id: "$_id" } }, { $project: { _v: 0, _id: 0 } }];
  },
};
