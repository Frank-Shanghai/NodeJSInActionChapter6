module.exports = (callback, perpage) => {
    perpage = perpage || 10; // 10 is the default page size
    return (req, res, next) => {
        let page = Math.max(
            parseInt(req.params.page || '1', 10), 1
        ) - 1;

        callback((err, total) => {
            if(err) return next(err);
            req.page = res.locals.page = {
                number: page,
                perpage: perpage,
                from: page * perpage,
                to: page * perpage + perpage - 1,
                total: total,
                count: Math.ceil(total/perpage)
            };

            next();
        });
    };
};