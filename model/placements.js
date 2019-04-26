const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

let placementSchema = new Schema({
    placementTitle: {
        type: String,
        required: true
    },
    placementCompany: {
        type: String,
        required: true
    },
    placementDetails:{
        type: String,
        required: true
    },
    placementEligibility: {
        type: Array,
        required: true
    },
    placementDeadline : {
        type: Date,
        required: true
    },
    placementPosted: {
        type: Date,
        default: Date.now()
    },
    placementPicture : {
        type: String,
        default: 'uploads/offer2.png'
    },
    registeredUsers : {
        type: Array
    }
});

placementSchema.plugin(mongoosePaginate);

const Placement = mongoose.model('Placement', placementSchema);

module.exports = Placement;
module.exports.getAllPlacements = async (err, placement)=>{
    if(err){
        console.log(err);
    }
    const options = {
        page: 1,
        limit: 10,
        sort: 'placementDeadline'
    };

    const placements = await Placement.paginate({},options, function(err, placement){
        if(err){
            console.log(err);
        }
        return placement;
    });

    placement = placements;

    return placement;
} 
