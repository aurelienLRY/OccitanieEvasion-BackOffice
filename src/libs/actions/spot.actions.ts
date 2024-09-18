"use server";

/* libs */
import * as yup from "yup";
import xss from "xss";

/* Database */
import { connectDB, disconnectDB } from "@/libs/database/mongodb";
/* Models */
import Spot from "@/libs/database/models/Spot";

/* Types */
import { ISpot, ICallbackForSpot, ICallbackForSpots } from "@/types";

/*
 * Spot schema
 */
const spotSchema = yup.object().shape({
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

/*
 * Validate the spot
 * @param spot - The spot to validate
 * @returns The validation result
 */
export const validateSpot = async (spot: ISpot) => {
  return await spotSchema.validate(spot, {
    abortEarly: false,
  });
};

/*
 * XSS the spot
 * @param spot - The spot to xss
 * @returns The xss result
 */
export const xssSpot = async (spot: ISpot): Promise<ISpot | object> => {
  try {
    const xssData: ISpot = {
      ...spot,
      name: xss(spot.name),
      description: xss(spot.description),
      gpsCoordinates: xss(spot.gpsCoordinates),
      practicedActivities: spot.practicedActivities.map((activity) => ({
        ...activity,
        activityId: xss(activity.activityId),
        activityName: xss(activity.activityName),
      })),
      photo: xss(spot.photo),
      meetingPoint: xss(spot.meetingPoint),
      estimatedDuration: xss(spot.estimatedDuration),
    };
    return JSON.parse(JSON.stringify(xssData));
  } catch (error) {
    console.error("Erreur lors de la validation du lieu:", error);
    throw error;
  }
};

/*
 * Create a spot
 * @param spot - The spot to create
 * @returns The callback for the spot
 */
export async function CREATE_SPOT(spot: ISpot): Promise<ICallbackForSpot> {
  try {
    /* validation & cleaning */
    const YupValidation = await validateSpot(spot);
    const cleanSpot = await xssSpot(YupValidation as ISpot);

    await connectDB();
    const newSpot = new Spot(cleanSpot);
    await newSpot.save();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newSpot)),
      error: null,
      feedback: "Spot créé avec succès",
    };
  } catch (error) {
    console.error("Erreur lors de la création du spot:", error);
    if (error instanceof yup.ValidationError) {
      return {
        success: false,
        error: null,
        feedback: error.errors,
        data: null,
      };
    } else {
      const message = (error as Error).message;
      return {
        success: false,
        error: message,
        feedback: null,
        data: null,
      };
    }
  } finally {
    await disconnectDB();
  }
}

/*
 * Get all spots
 * @returns The callback for the spots
 */
export async function GET_SPOTS(): Promise<ICallbackForSpots> {
  try {
    await connectDB();
    const spots = await Spot.find();
    return {
      success: true,
      data: JSON.parse(JSON.stringify(spots)),
      error: null,
      feedback: null,
    };
  } catch (error) {
    const message = (error as Error).message;
    console.error("Erreur lors de la récupération des spots:", error);
    return {
      success: false,
      data: null,
      error: message,
      feedback: null,
    };
  } finally {
    await disconnectDB();
  }
}

/*
 * Get a spot by id
 * @param id - The id of the spot to get
 * @returns The callback for the spot
 */
export async function GET_SPOT_BY_ID(id: string): Promise<ICallbackForSpot> {
  try {
    await connectDB();
    const spot = await Spot.findById(id);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(spot)),
      error: null,
      feedback: null,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération du spot:", error);
    const message = (error as Error).message;
    return {
      success: false,
      data: null,
      error: message,
      feedback: null,
    };
  }
}


/*
 * Update a spot
 * @param id - The id of the spot to update
 * @param spot - The spot to update
 * @returns The callback for the spot
 */
export async function UPDATE_SPOT(
  id: string,
  spot: ISpot
): Promise<ICallbackForSpot> {
  try {
    /* validation & cleaning */
    const YupValidation = await validateSpot(spot);
    const cleanSpot = await xssSpot(YupValidation as ISpot);
   
   
    await connectDB();

    const updatedSpot = await Spot.findByIdAndUpdate(id, cleanSpot, {
      new: true,
    });
    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedSpot)),
      error: null,
      feedback: ["lieu modifié avec succès"],
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du spot:", error);
    if (error instanceof yup.ValidationError) {
      return {
        success: false,
        error: null,
        feedback: error.errors,
        data: null,
      };
    } else {
      const message = (error as Error).message;
      return {
        success: false,
        data: null,
        error: message,
        feedback: null,
      };
    }
  } finally {
    await disconnectDB();
  }
}

/*
 * Delete a spot
 * @param id - The id of the spot to delete
 * @returns The callback for the spot
 */
export const DELETE_SPOT = async (spotId: string): Promise<ICallbackForSpot> => {
    try {
        await connectDB()
        const result = await Spot.findByIdAndDelete(spotId)
        if (!result) {
            throw new Error("lieu non trouvé")
        }
        return {success: true, data: JSON.parse(JSON.stringify(result)) , error: null, feedback: ["Spot supprimé avec succès"]}
    }
    catch (error) {
        const message = (error as Error).message
        console.log(message)
        return {success: false, error: message, data: null, feedback: null}
    }
    finally {
        await disconnectDB()
    }
}

