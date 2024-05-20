import { Schema, model } from 'mongoose';
import validator from 'validator';
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  StudentModel,
  TUserName,
} from './student/student.interface';
import bcrypt from 'bcrypt';
import config from '../config';


// 2. Create a Schema corresponding to the document interface.

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [20, 'Name can not be more than 20 characters'],
    validate: {
      validator: function (value: string) {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);

        return firstNameStr === value;

      },
      message: '{VALUE} First name must start with a capital letter',
    }
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'Last name is required'],
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: "{VALUE} is not valid",
    },
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    trim: true,
    required: [true, 'Father\'s name is required'],
  },
  fatherOccupation: {
    type: String,
    trim: true,
    required: [true, 'Father\'s occupation is required'],
  },
  fatherContactNo: {
    type: String,
    trim: true,
    required: [true, 'Father\'s contact number is required'],
  },
  motherName: {
    type: String,
    trim: true,
    required: [true, 'Mother\'s name is required'],
  },
  motherOccupation: {
    type: String,
    trim: true,
    required: [true, 'Mother\'s occupation is required'],
  },
  motherContactNo: {
    type: String,
    trim: true,
    required: [true, 'Mother\'s contact number is required'],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    trim: true,
    required: [true, 'Local guardian\'s name is required'],
  },
  occupation: {
    type: String,
    trim: true,
    required: [true, 'Local guardian\'s occupation is required'],
  },
  contactNo: {
    type: String,
    trim: true,
    required: [true, 'Local guardian\'s contact number is required'],
  },
  address: {
    type: String,
    trim: true,
    required: [true, 'Local guardian\'s address is required'],
  },
});

const studentSchema = new Schema<TStudent, StudentModel>({
  id: { type: String, required: [true, 'ID is required'], unique: true },
  password: { type: String, required: [true, 'password is required'] },
  name: {
    type: userNameSchema,
    trim: true,
    required: [true, 'Name is required'],
  },
  gender: {
    type: String,
    trim: true,
    enum: {
      values: ['male', 'female', 'other'],
      message: '{VALUE} is not a valid gender',
    },
    required: [true, 'Gender is required'],
  },
  dateOfBirth: {
    type: String,
    trim: true,
    required: [true, 'Date of birth is required']
  },
  email: {
    type: String, trim: true, required: [true, 'Email is required'], unique: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: '{VALUE} is not a valid email',
    }
  },
  contactNo: { type: String, trim: true, required: [true, 'Contact number is required'] },
  emergencyContactNo: { type: String, trim: true, required: [true, 'Emergency contact number is required'] },
  bloodGroup: {
    type: String,
    trim: true,
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
      message: '{VALUE} is not a valid blood group',
    },
  },
  presentAddress: { type: String, trim: true, required: [true, 'Present address is required'] },
  permanentAddress: { type: String, trim: true, required: [true, 'Permanent address is required'] },
  guardian: {
    type: guardianSchema,
    trim: true,
    required: [true, 'Guardian information is required'],
  },
  localGuardian: {
    type: localGuardianSchema,
    trim: true,
    required: [true, 'Local guardian information is required'],
  },
  ProfileImg: { type: String },
  isActive: {
    type: String,
    trim: true,
    enum: {
      values: ['active', 'blocked'],
      message: '{VALUE} is not a valid status',
    },
    default: 'active',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
},
  {
    toJSON: {
      virtuals: true,
    }
  }
);


//Document middleware

// pre save middleware/ hook : will work on create() save()

studentSchema.pre('save', async function (next) {
  // console.log(this, 'pre hook : we will save the data');

  // Hashing password and save in mongoDB
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_rounds))

  next();
})

//post save middleware / hook


studentSchema.post('save', function (doc, next) {
  doc.password = ''
  next();
})


//Query middleware

studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next();
});

studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next();
})

studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
})








//creating a custom method

studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
}


// virtual
studentSchema.virtual("fullName").get(function () {
  const middleName = this.name.middleName ? ` ${this.name.middleName}` : '';
  return `${this.name.firstName}${middleName} ${this.name.lastName}`
});

//creating a custom instance method
// studentSchema.methods.isUserExists = async function (id: string) {
//   const existingUser = await Student.findOne({ id })
//   return existingUser;
// }

export const Student = model<TStudent, StudentModel>('Student', studentSchema);
