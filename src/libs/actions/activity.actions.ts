"use server";
/* libs */
import * as yup from "yup";
import xss from "xss";

/* Database */
import { connectDB, disconnectDB } from "@/libs/database/mongodb";
/* Models */
import Activity from "@/libs/database/models/Activity";
/* Types */
import {
  IActivity,
  ICallbackForActivity,
  ICallbackForActivities,
} from "@/types";

/*
 * Activity schema
 */
const activitySchema = yup.object().shape({
  name: yup.string().required("Le champ name est requis"),
  description: yup.string(),
  half_day: yup.boolean(),
  full_day: yup.boolean(),


  price_half_day: yup.object().when('half_day', {
    is: true,
    then: (schema) => schema.shape({
      standard: yup.number().positive().integer().required("Le prix pour la demi-journée est requis"),
      reduced: yup.number().integer().nullable(),
      ACM: yup.number().integer().nullable(),
    }),
    otherwise: (schema) => schema
  }),


  price_full_day: yup.object().when('full_day', {
    is: true,
    then: (schema) => schema.shape({
      standard: yup.number().positive().integer().required("Le prix pour la journée complète est requis"),
      reduced: yup.number().integer().nullable(),
      ACM: yup.number().integer().nullable(),
    }),
    otherwise: (schema) => schema
  }),



  min_age: yup.number().positive().integer().required("Le champ min_age est requis"),
  max_OfPeople: yup.number().positive().integer().required("Le champ max_OfPeople est requis"),
  min_OfPeople: yup.number().positive().integer().required("Le champ min_OfPeople est requis"),
});


/*
 * Validate the activity
 * @param activity - The activity to validate
 * @returns The validation result
 */
export const validateActivity = async (activity: IActivity) => {
  return await activitySchema.validate(activity, {
    abortEarly: false,
  });
};

/*
 * XSS the activity
 * @param activity - The activity to xss
 * @returns The xss result
 */
export const xssActivity = async (
  activity: IActivity
): Promise<IActivity | object> => {
  try {
    const xssData: IActivity = {
      ...activity,
      name: xss(activity.name),
      description: xss(activity.description),
    };
    return JSON.parse(JSON.stringify(xssData));
  } catch (error) {
    console.error("Erreur lors de la validation de l'activité:", error);
    throw error;
  }
};

/*
 * Create an activity
 * @param activity - The activity to create
 * @returns The callback for the activity
 */
export const CREATE_ACTIVITY = async (
  activity: IActivity
): Promise<ICallbackForActivity> => {
  try {
    console.log("activity", activity)
    /* validation & cleaning */
    const yupActivity = (await validateActivity(activity)) as IActivity;
    const cleanActivity = (await xssActivity(yupActivity)) as IActivity;
    /* database */
    await connectDB();
    const newActivity = new Activity(cleanActivity);
    await newActivity.save();
    /* feedback */
    return {
      success: true,
      data: JSON.parse(JSON.stringify(newActivity)),
      feedback: ["Activité créée avec succès"],
      error: null,
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      console.error("Erreur lors de la création de la session:", error);
      return {
        success: false,
        error: null,
        feedback: error.errors,
        data: null,
      };
    } else {
      const message = (error as Error).message;
      console.error("Erreur lors de la création de la session:", error);
      return {
        success: false,
        error: message,
        feedback: null,
        data: null,
      };
    }
  } finally {
    disconnectDB();
  }
};

/**
 * Récupérer toutes les activités
 * @returns {success: boolean, data: IActivity[] | null, error: Error | null, feedback: string | null}
 */
export async function GET_ACTIVITIES(): Promise<ICallbackForActivities> {
  try {
    await connectDB();
    const activities = (await Activity.find()) as IActivity[];
    return {
      success: true,
      data: JSON.parse(JSON.stringify(activities)),
      error: null,
      feedback: null,
    };
  } catch (error) {
    const message = (error as Error).message;
    console.error("Erreur lors de la récupération des activités:", error);
    return { success: false, data: null, error: message, feedback: null };
  } finally {
    await disconnectDB();
  }
}

/*
 * Récupérer une activité par son id
 * @param id - The id of the activity to get
 * @returns The callback for the activity
 */
export async function GET_ACTIVITY_BY_ID(
  id: string
): Promise<ICallbackForActivity> {
  try {
    await connectDB();
    const activity = (await Activity.findById(id)) as IActivity | null;
    return {
      success: true,
      data: JSON.parse(JSON.stringify(activity)),
      error: null,
      feedback: null,
    };
  } catch (error) {
    const message = (error as Error).message;
    console.error("Erreur lors de la récupération de l'activité:", error);
    return { success: false, data: null, error: message, feedback: null };
  } finally {
    await disconnectDB();
  }
}

/*
 * Update an activity
 * @param id - The id of the activity to update
 * @param activity - The activity to update
 * @returns The callback for the activity
 */
export const UPDATE_ACTIVITY = async (
  id: string,
  activity: IActivity
): Promise<ICallbackForActivity> => {
  try {
    /* validation & cleaning */
    const yupActivity = (await validateActivity(activity)) as IActivity;
    const cleanActivity = (await xssActivity(yupActivity)) as IActivity;

    await connectDB();
    const updatedActivity = await Activity.findByIdAndUpdate(id, cleanActivity, {
      new: true,
    });
    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedActivity)),
      error: null,
      feedback: ["Activité modifiée avec succès"],
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'activité:", error);
    if (error instanceof yup.ValidationError) {
      return {
        success: false,
        error: null,
        feedback: error.errors,
        data: null,
      };
    } else {
      const message = (error as Error).message;
      return { success: false, data: null, error: message, feedback: null };
    }
  } finally {
    await disconnectDB();
  }
};


/*
 * Delete an activity
 * @param activityId - The id of the activity to delete
 * @returns The callback for the activity
 */
export const DELETE_ACTIVITY = async (activityId: string): Promise<ICallbackForActivity> => {
    try {
        await connectDB()
        const result = await Activity.findByIdAndDelete(activityId)
        if (!result) {
            throw new Error("Activité non trouvée")
        }
        return {success: true, data: JSON.parse(JSON.stringify(result)) , error: null, feedback: ["Activité supprimée avec succès"]}
    }
    catch (error) {
     
        const message = (error as Error).message;
        console.error("Erreur lors de la suppression de l'activité:", error);
        return {success: false, error: message, data: null, feedback: null}
    }
    finally {
        await disconnectDB()
    }
}