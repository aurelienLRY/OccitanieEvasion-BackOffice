import * as yup from "yup";

/*
 * Spot schema
 */
export const spotSchema = yup.object().shape({
  name: yup.string().required("Le champ name est requis"),
  description: yup.string(),
  gpsCoordinates: yup.string().required("Le champ gpsCoordinates est requis"),
  practicedActivities: yup.array().of(
    yup.object().shape({
      activityId: yup.string().required("Le champ activityId est requis"),
      activityName: yup.string().required("Le champ activityName est requis"),
    })
  ),
  photo: yup.string(),
  meetingPoint: yup.object().shape({
    half_day: yup.string(),
    full_day: yup.string(),
  }),
});
