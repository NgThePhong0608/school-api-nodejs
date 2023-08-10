const advancedResults = (model, populate) => {
    return async (req, res, next) => {
        // query string ?
        const query = req?.query;
        let modelQuery = model.find();
        // Paginations
        const limit = Number(query?.limit);
        const page = Number(query?.page);
        const skip = (page - 1) * limit;
        // get totals record
        const totals = await model.countDocuments();
        const startIdx = (page - 1) * limit,
            endIdx = page * limit;

        // pagination results
        // add next page
        const pagination = {};
        if (endIdx < totals) {
            pagination.next = {
                page: page + 1,
                limit,
            };
        }
        // add previous page
        if (startIdx > 0) {
            pagination.prev = {
                page: page - 1,
                limit,
            };
        }

        // filtering/searching by name
        if (query?.name) {
            modelQuery = modelQuery.find({
                name: {
                    $regex: query?.name,
                    $options: "i", // ignore lowercase or uppercase
                },
            });
        }

        // populate
        if (populate) {
            modelQuery = modelQuery.populate(populate);
        }

        // Excute query
        const modelResults = await modelQuery.find().skip(skip).limit(limit);

        res.results = {
            totals,
            result: modelResults.length,
            pagination,
            status: "success",
            message: "results fetched successfully",
            data: modelResults,
        };

        next();
    };
};

module.exports = advancedResults;
