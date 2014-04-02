var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
var clusterTermSchema = new Schema({
	termName: { type: String, trim: true },
	termValue: { type: Number }
});

var clusterSchema = new Schema({
	clusterId: { type: String, trim: true },
	terms: [clusterTermSchema]
});

var clusterTermModel = mongoose.model("clusterterm", clusterTermSchema);

var clusterModel = mongoose.model('cluster', clusterSchema);


clusterTermSchema.virtual('id').get(function() { return this._id; });
clusterSchema.virtual('id').get(function() { return this._id; });

module.exports = {
	Cluster: clusterModel,
    ClusterTerm: clusterTermModel
};
