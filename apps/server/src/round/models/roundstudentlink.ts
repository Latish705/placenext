import { Schema, Types, model } from "mongoose";
import mongoose from "mongoose";
import { IStudent } from "../../student/models/student";
import { ICollege } from "../../college/models/college";
import { primarydb } from "../..";

export interface IRoundStudentLink extends Document{
    _id:string;
    round_id:Types.ObjectId;
    student_id:Types.ObjectId;
}

const RoundStudentLi =new Schema<IRoundStudentLink>({
    round_id:{
        type: Schema.Types.ObjectId,
        required:true
    },
    student_id:{
        type:Schema.Types.ObjectId,
        required:true
    }
})
const RoundStudentLink=primarydb.model("RoundStudentLink",RoundStudentLi);
export default RoundStudentLink;