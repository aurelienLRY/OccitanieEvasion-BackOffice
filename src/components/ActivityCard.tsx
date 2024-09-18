/* Librairies */
import React, { useState } from "react";
import { Tooltip } from "antd";
import { IActivity } from "@/types";
import { Spin } from "antd";

/* Components */

import ToasterAction from "@/components/ToasterAction";

/* Actions */
import { DELETE_ACTIVITY } from "@/libs/actions";

/* store */
import { useActivities } from "@/context/store";

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

  const {deleteActivities} = useActivities()

  const deleteActivity = async (activityId: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette activité ?")) {
        setIsDelete(true);
      const result = await DELETE_ACTIVITY(activityId);
      if (result.success) {
        deleteActivities(result.data)
      } else {
        setIsDelete(false);
      }
      ToasterAction({result, defaultMessage: 'Activité supprimée avec succès'})
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 justify-evenly min-w-fit w-full h-full bg-slate-700 dark:bg-sky-800 rounded-md px-3 pt-3 pb-1 text-white relative shadow-md shadow-slate-400 dark:shadow-sky-400 border-opacity-65 ">
        {isDelete && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-80 z-10 backdrop-blur-md flex flex-col gap-4 items-center justify-center">
            <Spin size="large" />
            <p className="text-white text-xl font-bold">
              Suppression du lieu en cours.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-center">{activity.name}</h2>

          <div className="flex flex-col gap-2 w-full justify-center items-center">
            <h3 className="text-xl font-bold">Description</h3>
            <p className="text-sm dark:text-gray-500 text-center  px-2">
              {activity.description}
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full justify-center items-center">
            <h3 className="text-xl font-bold">Tarification</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <p>
                Prix demi-journée:{" "}
                <span className="font-bold">{activity.price_half_day}€</span>
              </p>
              <p>
                Prix journée complète:{" "}
                <span className="font-bold">{activity.price_full_day}€</span>
              </p>
            </div>
          </div>


          <div className="flex flex-col gap-2 w-full justify-center items-center">
            <h3 className="text-xl font-bold"> Caractéristiques          </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col justify-around items-center gap-1 bg-orange-500 rounded-md p-2 text-center">
                Âge minimum
                <span className="font-bold">{activity.min_age} ans</span>
              </div>


              <div className="flex flex-col justify-around items-center gap-1 bg-orange-500 rounded-md p-2 text-center">
                <p>Nombre minimum</p>
                <p className="flex items-center gap-1"><span className="font-bold">{activity.min_OfPeople}</span> <IoPeople />
                </p>
                
              </div>


              <div className="flex flex-col justify-around items-center gap-1 bg-orange-500 rounded-md p-2 text-center">
                <p>Nombre maximum</p>
                <p className="flex items-center gap-1"><span className="font-bold">{activity.max_OfPeople}</span> <IoPeople />
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
            <button onClick={() => deleteActivity(activity._id)}>
              <RiCalendarCloseFill className="text-4xl hover:text-red-500 cursor-pointer transition-all" />
            </button>
          </Tooltip>
        </div>
      </div>
    </>
  );
}

export default ActivityCard;
