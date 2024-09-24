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
 half_day: yup.boolean(),
 full_day: yup.boolean(),
 max_OfPeople: yup
   .number()
   .positive()
   .integer()
   .required("Le champ max_OfPeople est requis"),
 min_OfPeople: yup
   .number()
   .positive()
   .integer()
   .required("Le champ min_OfPeople est requis"),
 meetingPoint: yup.string(),
 estimatedDuration: yup.string(),
});
