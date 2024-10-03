// Faculty interface
interface IFaculty {
    _id?: string;
    faculty_name: string;
    faculty_email: string;
    faculty_contact_no: string;
    faculty_address: string;
    faculty_designation: string;
    faculty_department_id: string; // Assuming IDepartment["_id"] is a string
    faculty_yr_of_exp: number;
    faculty_qualification: string;
    faculty_experience: number;
    faculty_salary: number;
    faculty_joining_date: Date;
  }
  
  // List of the fields we want to dynamically render for the faculty
  const facultyFields: Array<keyof IFaculty> = [
    "faculty_name",
    "faculty_email",
    "faculty_contact_no",
    "faculty_address",
    "faculty_designation",
    "faculty_department_id",
    "faculty_yr_of_exp",
    "faculty_qualification",
    "faculty_experience",
    "faculty_salary",
    "faculty_joining_date",
  ];
  
  // Function to render the faculty details dynamically
  const renderFacultyDetails = (faculty: IFaculty) => {
    return facultyFields.map((field, index) => {
      let label = field.replace(/_/g, " ").replace(/faculty /g, ""); // Formats the field names
      let value: string | number | Date | undefined = faculty[field];
  
      // Handle special cases, e.g., Date field formatting
      if (field === "faculty_joining_date" && value instanceof Date) {
        value = new Date(value).toLocaleDateString(); // Format date
      }
  
      return (
        <p key={index}>
          <strong>{label.charAt(0).toUpperCase() + label.slice(1)}:</strong>{" "} {value || "Not available"}
        </p>
      );
    });
  };
  
  // Usage example in a component
  const FacultyDetailsComponent = ({ faculty }: { faculty: IFaculty }) => {
    return (
      <div className="faculty-details">
        <h2>Faculty Details</h2>
        <div className="grid grid-cols-2 gap-4">
          {renderFacultyDetails(faculty)}
        </div>
      </div>
    );
  };
  
  // Example usage
  const facultyExample: IFaculty = {
    faculty_name: "John Doe",
    faculty_email: "john.doe@example.com",
    faculty_contact_no: "1234567890",
    faculty_address: "123 Faculty Street",
    faculty_designation: "Professor",
    faculty_department_id: "123abc",
    faculty_yr_of_exp: 10,
    faculty_qualification: "PhD in Computer Science",
    faculty_experience: 10,
    faculty_salary: 90000,
    faculty_joining_date: new Date("2015-08-15"),
  };
  
  // Render the component (for demonstration)
  const App = () => {
    return <FacultyDetailsComponent faculty={facultyExample} />;
  };
  