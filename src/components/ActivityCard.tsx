/* Librairies */
import React, { useState } from "react";
import { Tooltip } from "antd";
import { IActivity } from "@/types";
import { Spin } from "antd";
import { toast } from "sonner";
/* Components */
import ToasterAction from "@/components/ToasterAction";
import { ActivityForm } from "@/components/form";
import { ItemCardHeader, ItemCardInner , ItemCard} from "@/components/ItemCard";

/* Actions */
import { DELETE_ACTIVITY } from "@/libs/actions";

/* store */
import { useActivities, useSessionWithDetails } from "@/context/store";

/* Icons */
import { RiCalendarCloseFill } from "react-icons/ri";
import { MdOutlineUpdate } from "react-icons/md";
import { IoPeople } from "react-icons/io5";

type Props = {
  activity: IActivity;
};

function ActivityCard({ activity }: Props) {
  const [isUpdateActivityModalOpen, setIsUpdateActivityModalOpen] =
    useState(false);

  const [isDelete, setIsDelete] = useState(false);

  const { deleteActivities } = useActivities();
  const { SessionWithDetails } = useSessionWithDetails();

  const deleteActivity = async (activityId: string) => {
    //check if the activity is used in a session for the futur day
    const isUsedInSession = SessionWithDetails.some(session => session.activity._id === activityId );
    if (isUsedInSession) {
      toast.error("Cette activité est utilisée dans une session, vous ne pouvez pas la supprimer. Veuillez d'abord supprimer la session.");
      return;
    }
    if (window.confirm("Voulez-vous vraiment supprimer cette activité ?")) {
      setIsDelete(true);
      const result = await DELETE_ACTIVITY(activityId);
      if (result.success) {
        if (result.data) {
          deleteActivities(result.data);
        }
      } else {
        setIsDelete(false);
      }
      ToasterAction({ result, defaultMessage: "Activité supprimée avec succès" });
    }
  };

  return (
    <>
    <ItemCard className="flex flex-col gap-2 justify-evenly min-w-fit w-full h-full relative">  
        {isDelete && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-80 z-10 backdrop-blur-md flex flex-col gap-4 items-center justify-center">
            <Spin size="large" />
            <p className="text-white text-xl font-bold">
              Suppression du lieu en cours.
            </p>
          </div>
        )}

       
        <div className="flex flex-col gap-4"> 
          <ItemCardHeader className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-center">
            {activity.name}
          </h2>
        </ItemCardHeader>
          <div className="flex gap-2 w-full justify-center items-center border-2 border-sky-600 p-2 rounded-md">
            <h3 className="text-lg font-bold text-gray-400 dark:text-sky-500">Description: </h3>
            <p className="text-sm text-justify px-2">
              {activity.description
                ? activity.description
                : "🧐 Ajouter une description à votre activité 🧐 "}
            </p>
          </div>

          <ItemCardInner className="flex flex-col gap-4 w-full justify-center items-center">
            <div className="flex flex-col gap-2 w-full justify-center items-center">

            <h3 className="text-xl font-bold text-gray-400 dark:text-sky-500">Tarification</h3>
              <table className="w-full border-collapse border-2 border-sky-500 rounded-md">
                <thead>
                  <tr>
                    <th className="border border-sky-500 p-2"></th>
                    { activity.half_day && (
                      <th className="border border-sky-500 p-2">Demi-journée</th>
                    )}
                    {activity.full_day && (
                      <th className="border border-sky-500 p-2">Journée complète</th>
                    )}
                  </tr>
                </thead>
                <tbody className="text-center">
                  <tr className="hover:bg-orange-500 transition-all duration-200">
                    <td className="border border-sky-500 p-2">Standard</td>
                    {activity.half_day && (
                    <td className="border border-sky-500 p-2">
                      {activity.price_half_day?.standard !== undefined
                        ? `${activity.price_half_day.standard}€`
                        : "N/A"}
                    </td>
                    )}
                    {activity.full_day && (
                    <td className="border border-sky-500 p-2">
                      {activity.price_full_day?.standard !== undefined
                        ? `${activity.price_full_day.standard}€`
                        : "N/A"}
                    </td>
                    )}
                  </tr>
                  <tr className="hover:bg-orange-500 transition-all duration-200">
                    <td className="border border-sky-500 p-2">Réduit</td>
                    {activity.half_day && (
                    <td className="border border-sky-500 p-2">
                      {activity.price_half_day?.reduced !== undefined
                        ? `${activity.price_half_day.reduced}€`
                        : "N/A"}
                    </td>
                    )}
                    {activity.full_day && (
                    <td className="border border-sky-500 p-2">
                      {activity.price_full_day?.reduced !== undefined
                        ? `${activity.price_full_day.reduced}€`
                        : "N/A"}
                    </td>
                    )}
                  </tr>
                  <tr className="hover:bg-orange-500 transition-all duration-200">
                    <td className="border border-sky-500 p-2">ACM</td>
                    {activity.half_day && (
                    <td className="border border-sky-500 p-2">
                      {activity.price_half_day?.ACM !== undefined
                        ? `${activity.price_half_day.ACM}€`
                        : "N/A"}
                    </td>
                    )}
                    {activity.full_day && (
                    <td className="border border-sky-500 p-2">
                      {activity.price_full_day?.ACM !== undefined
                        ? `${activity.price_full_day.ACM}€`
                        : "N/A"}
                    </td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-2 w-full justify-center items-center">
              <h3 className="text-xl font-bold text-gray-400 dark:text-sky-500">Durée</h3>
              <table className="w-full border-collapse border-2 border-sky-500 rounded-md">
                <thead>
                  <tr>
                    {activity.half_day && (
                      <th className="border border-sky-500 p-2">Demi-journée</th>
                    )}
                    {activity.full_day && (
                      <th className="border border-sky-500 p-2">Journée complète</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-orange-500 transition-all duration-200 text-center">
                    {activity.half_day && (
                    <td className="border border-sky-500 p-2">
                      {activity.duration?.half ? activity.duration.half : "N/A"}
                    </td>
                    )}
                    {activity.full_day && (
                    <td className="border border-sky-500 p-2">
                      {activity.duration?.full ? activity.duration.full : "N/A"}
                    </td>
                    )}
                  </tr>
                </tbody>
              </table>
           
            </div>
   
          </ItemCardInner>

          <div className="flex flex-col gap-2 w-full justify-center items-center">
            <h3 className="text-xl font-bold">Caractéristiques</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col justify-around items-center gap-1 bg-orange-500 rounded-md p-2 text-center">
                Âge minimum
                <span className="font-bold">{activity.min_age} ans</span>
              </div>

              <div className="flex flex-col justify-around items-center gap-1 bg-orange-500 rounded-md p-2 text-center">
                <p>Nombre minimum</p>
                <p className="flex items-center gap-1">
                  <span className="font-bold">{activity.min_OfPeople}</span> <IoPeople />
                </p>
              </div>

              <div className="flex flex-col justify-around items-center gap-1 bg-orange-500 rounded-md p-2 text-center">
                <p>Nombre maximum</p>
                <p className="flex items-center gap-1">
                  <span className="font-bold">{activity.max_OfPeople}</span> <IoPeople />
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-end gap-3">
          <Tooltip title="Modifier l'activité">
            <button onClick={() => setIsUpdateActivityModalOpen(true)}>
              <MdOutlineUpdate className="text-4xl hover:text-slate-200 cursor-pointer transition-all" />
            </button>
          </Tooltip>
          <Tooltip title="Supprimer l'activité">
            <button onClick={() => deleteActivity(activity._id as string)}>
              <RiCalendarCloseFill className="text-4xl hover:text-red-500 cursor-pointer transition-all" />
            </button>
          </Tooltip>
        </div>

      </ItemCard>
      <ActivityForm
        data={activity}
        isOpen={isUpdateActivityModalOpen}
        onClose={() => setIsUpdateActivityModalOpen(false)}
      />
    </>
  );
}

export default ActivityCard;
