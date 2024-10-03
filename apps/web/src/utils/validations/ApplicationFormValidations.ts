// validation.ts
export const ApplicationFormValidations = (formData: any) => {
  const errors: { [key: string]: string } = {};

  // Personal Details Validation
  if (!formData.firstName.trim()) errors.firstName = "First Name is required";
  if (!formData.lastName.trim()) errors.lastName = "Last Name is required";
  if (!formData.gender.trim()) errors.gender = "Gender is required";
  if (!formData.dateOfBirth.trim())
    errors.dateOfBirth = "Date of Birth is required";

  // Contact Details Validation
  if (!formData.email.trim()) errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(formData.email))
    errors.email = "Email is invalid";

  if (!formData.phoneNumber.trim())
    errors.phoneNumber = "Phone number is required";
  else if (!/^\d{10}$/.test(formData.phoneNumber))
    errors.phoneNumber = "Phone number is invalid";

  if (!formData.aadharNumber.trim())
    errors.aadharNumber = "Aadhar number is required";
  if (!formData.panNumber.trim()) errors.panNumber = "PAN number is required";

  // Academic Details Validation
  if (!formData.college) errors.college = "College is required";
  if (!formData.courseType.trim())
    errors.courseType = "Course Type is required";
  if (!formData.departmentName.trim())
    errors.departmentName = "Department is required";
  if (!formData.admissionYear.trim())
    errors.admissionYear = "Admission Year is required";

  return errors;
};
