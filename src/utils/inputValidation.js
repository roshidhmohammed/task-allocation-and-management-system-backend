import { z } from "zod";
export const skillsSchema = (data) => {
  const stringArraySchema = z.array(z.string());
  const result = stringArraySchema.safeParse(data);
  return result;
};

export const availableWorkingHoursSchema = (data) =>{
    const checkSchema = z.number().min(0).max(24)
    return checkSchema.safeParse(data)
}

export const workingDaysSchema = (data) =>{
    const checkSchema = z
    .array(
      z.enum([
        "mon",
        "tue",
        "wed",
        "thu",
        "fri"
      ])
    )
    .min(1, "Please select at least one working day")
    return checkSchema.safeParse(data)
}
