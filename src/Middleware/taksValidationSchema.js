import * as yup from "yup";

export const createTasksSchema =yup.object ({
    title : yup.string().min(3,"Title has to be minimum of 3 characters").required("This field is required"),
    priority : yup.string().default("Low").oneOf(['Low','Medium', 'High'],"Enter among these"),
    tags :  yup.array().of(yup.string().trim()).default([])
    
});

export const updateTasksSchema = yup.object({
  title: yup.string().min(3).optional(),
  priority: yup.string().oneOf(['Low', 'Medium', 'High']).optional(),
  tags: yup.array().of(yup.string().trim()).optional(),
});
