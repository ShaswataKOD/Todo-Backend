import * as yup from "yup";


//enter only the user input fields : title , priority and tags cuz others are not user defined
export const createTasksSchema =yup.object ({
    title : yup.string().min(3,"Title has to be minimum of 3 characters").required("This field is required"),
    priority : yup.string().default("Low").oneOf(['Low','Medium', 'High'],"Enter among these"),
    tags :  yup.array().of(yup.string().trim()).default([])
    
});

const updatedTasksSchema = yup.object({
    
})