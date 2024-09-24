import * as yup from "yup";




 export const sessionSchema = yup.object().shape({
    status: yup.string().required("Le champ status est requis"),
    date: yup.date().required("Le champ date est requis"),
    startTime: yup.string().required("Le champ startTime est requis"),
    endTime: yup.string().required("Le champ endTime est requis"),
    activity: yup.string().required("Le champ activity est requis"),
    spot: yup.string().required("Le champ spot est requis"),
    placesMax: yup
      .number()
      .required("Le champ placesMax est requis")
      .positive()
      .integer(),
    placesReserved: yup
      .number()
      .required("Le champ placesReserved est requis")
      .integer(),
    type_formule: yup.string().required("Le champ formule est requis"),
  });

