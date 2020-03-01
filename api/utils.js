class Utils {

    static generateTicker() {
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear().toString().substr(-2);
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var selectedChars = '';
        for (var i = 0; i < 4; i++) {
            selectedChars += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        if (day < 10) {
            day = '0' + day
        }
        if (month < 10) {
            month = '0' + month
        }
        return year + month + day + '-' + selectedChars;
    }

    static computeTripsQuery(req) {
        var query = {}
        var keyword = req.query.k;
        var minPrice = req.query.minPrice;
        var maxPrice = req.query.maxPrice;
        var startDate = req.query.startDate;
        var endDate = req.query.endDate;
        if (keyword) {
            query['$text'] = { $search: keyword };
        }
        if (minPrice) {
            query['price'] = { $gt: minPrice };
        }
        if (maxPrice) {
            if ('price' in query) {
                query['price']['$lt'] = maxPrice;
            } else {
                query['price'] = { $lt: maxPrice };
            }
        }
        if (startDate) {
            query['startDate'] = { $gt: startDate };
        }
        if (endDate) {
            query['endDate'] = { $lt: endDate };
        }

        return query;
    }
}

module.exports = Utils;