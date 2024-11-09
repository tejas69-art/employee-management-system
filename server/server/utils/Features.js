class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    search() {
        const search = this.queryString.search || '';
        this.searchQuery = search ? {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { designation: { $regex: search, $options: 'i' } }
            ]
        } : {};
        this.query = this.query.find(this.searchQuery);
        return this;
    }

    paginate() {
        this.page = parseInt(this.queryString.page, 10) || 1;
        this.limit = parseInt(this.queryString.limit, 10) || 10;
        const skip = (this.page - 1) * this.limit;

        this.query = this.query.skip(skip).limit(this.limit);
        return this;
    }
}

module.exports = APIFeatures;