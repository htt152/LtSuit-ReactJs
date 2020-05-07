const mongoose = require('mongoose')

const nghiPhepSchema = new mongoose.Schema({
    userEmail:{
        type: String,
        required: true
    },
    userName:{
        type: String,
        required: true
    },
    nghiPhep:[{
        nghiTu:{
            type:String,
            required: true
        },
        nghiDen:{
            type:String,
            required: true
        },
        lyDoNghi:{
            type:String,
            required: true
        },
        benLienQuan:{
            nguoiLienQuan:[{
                userEmail:{
                    type: String,
                },
                userName:{
                    type: String
                }
            }],
            teamLienQuan:[{
                teamID:{
                    type: mongoose.Schema.Types.ObjectId,
                },
                teamName:{
                    type: String
                }
            }]
        },
        mucDoAnhHuong:{
            type: String,
            required: true
        },
        phuongAnKhacPhuc:{
            type: String
        },
        tongThoiGianNghi:{
            type: Number
        },
        phepTon:{
            type: Number
        }, 
    }],
    deleteAt:{
        type: Date
    }
},{
    timestamps: true
})

nghiPhepSchema.methods.toJSON = function () {
    const nghiPhepObject = this.toObject()
    return nghiPhepObject
}

nghiPhepSchema.statics.findByCredentials = async (userName) => {
    const nghiPhep = await NghiPhep.find({userName})
    const error = []

    if(!nghiPhep){
        error.push('Chua nghi buoi nao')
        return error
    }
    return nghiPhep
}

const NghiPhep = mongoose.model('NghiPhep',nghiPhepSchema)

module.exports = NghiPhep