import { Schema, Types, model } from "mongoose";
import { primarydb } from "../..";
export interface IRound extends Document {
    _id:string,
    job_id:Types.ObjectId,
    round_number:number,
    round_type:string,
    isNextRound:boolean
}

const RoundSchema=new Schema<IRound>({
    job_id:{
        type:Schema.Types.ObjectId,
        ref:"Job"
    },
    round_number:{
        type: Number,
        required:true
    },
    round_type:{
        type: String,
        required:true
    },
    isNextRound:{
        type: Boolean,
        required:true

    }
})

const Round =primarydb.model("Round",RoundSchema);
export default Round;