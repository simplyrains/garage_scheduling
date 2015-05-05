'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Job Schema
 */
var JobSchema = new Schema({
	bpj_no: {
		type: String,
		default: '',
		required: 'Please fill Job name',
		trim: true
	},
	bpe_no: {
		type: String,
		default: '',
		trim: true
	},
	start_dt: {
		type: Date,
		default: '',
		required: 'Please fill start_dt',
	},
	retrieve_dt: {
		type: Date,
		default: '',
		required: 'Please fill retrieve_dt',

	},
	sa_id: {
		type: String,
		required: 'Please fill SA ID'
	},
	name_plate: {
		type: String,
		default: '',
		required: 'Please fill Plate Number'
	},
	car_type: {
        type: String,
        enum: ['ทั่วไป', 'มีรายการซ่อมเพิ่มเติม', 'งานตีกลับภายนอก', 'เอาออกจากแผนชั่วคราว', 'รถไม่จอด', 'ถอดชิ้นส่วนทิ้งไว้']
	},
	work_type: {
        type: String,
        enum: ['L','M','H']
	},
	topserv_hr: {
        type: Number,
	},
	backorder_parts: [
			{
				name: String,
				station: Number,
				arrival: Date
			}
	],
	tel_details: [
			{
				tel_time: Date,
				tel_desc: String
			}
	],
	tel_info: {
		type: String
	},
	approx_hrs: [
			{
				station: Number,
				time: Number
			}
	],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Job', JobSchema);