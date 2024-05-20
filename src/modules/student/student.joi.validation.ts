import { z } from 'zod';

// Define Zod schema for UserName
const userNameValidationSchema = z.object({
	firstName: z.string()
		.trim()
		.max(20, { message: 'Name cannot be more than 20 characters' })
		.regex(/^[A-Z]/, { message: 'First name must start with a capital letter' }),
	middleName: z.string().trim().optional(),
	lastName: z.string()
		.trim()
		.regex(/^[a-zA-Z]+$/, { message: 'Last name must contain only letters' }),
});

// Define Zod schema for Guardian
const guardianValidationSchema = z.object({
	fatherName: z.string().trim().min(1, { message: 'Father\'s name is required' }),
	fatherOccupation: z.string().trim().min(1, { message: 'Father\'s occupation is required' }),
	fatherContactNo: z.string().trim().min(1, { message: 'Father\'s contact number is required' }),
	motherName: z.string().trim().min(1, { message: 'Mother\'s name is required' }),
	motherOccupation: z.string().trim().min(1, { message: 'Mother\'s occupation is required' }),
	motherContactNo: z.string().trim().min(1, { message: 'Mother\'s contact number is required' }),
});

// Define Zod schema for LocalGuardian
const localGuardianValidationSchema = z.object({
	name: z.string().trim().min(1, { message: 'Local guardian\'s name is required' }),
	occupation: z.string().trim().min(1, { message: 'Local guardian\'s occupation is required' }),
	contactNo: z.string().trim().min(1, { message: 'Local guardian\'s contact number is required' }),
	address: z.string().trim().min(1, { message: 'Local guardian\'s address is required' }),
});

// Define Zod schema for Student
const studentValidationSchema = z.object({
	id: z.string().min(1, { message: 'ID is required' }),
	password: z.string().max(20),
	name: userNameValidationSchema,
	gender: z.enum(['male', 'female', 'other'], { errorMap: () => ({ message: 'Gender is required' }) }),
	dateOfBirth: z.string().min(1, { message: 'Date of birth is required' }),
	email: z.string()
		.trim()
		.min(1, { message: 'Email is required' })
		.email({ message: 'Email is not valid' }),
	contactNo: z.string().trim().min(1, { message: 'Contact number is required' }),
	emergencyContactNo: z.string().trim().min(1, { message: 'Emergency contact number is required' }),
	bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']).optional(),
	presentAddress: z.string().trim().min(1, { message: 'Present address is required' }),
	permanentAddress: z.string().trim().min(1, { message: 'Permanent address is required' }),
	guardian: guardianValidationSchema,
	localGuardian: localGuardianValidationSchema,
	ProfileImg: z.string().optional(),
	isActive: z.enum(['active', 'blocked']).default('active'),
});

export default studentValidationSchema;
