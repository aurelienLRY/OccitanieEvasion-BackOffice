/*Librairies*/
import { Tooltip , Spin } from "antd";
import { useState } from "react";

/* Types */
import { ISpot } from "@/types";
/* Actions */
import { DELETE_SPOT } from "@/libs/actions";
/* Components */
import MapCustomer from "@/components/MapCustomer";
import UpdateSpotForm from "@/components/form/updateSpot";
import ToasterAction from "@/components/ToasterAction";


/* store */
import { useSpots} from "@/context/store";

/*icons*/
import { RiCalendarCloseFill } from "react-icons/ri";
import { MdOutlineUpdate } from "react-icons/md";

export default function SpotCard({ spot }: { spot: ISpot }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const { deleteSpots } = useSpots();

   const handleDelete = async () => {
    const confirm = window.confirm("Voulez vous vraiment supprimer ce spot ?")
    if (confirm) {
      setIsDelete(true)
      const result = await DELETE_SPOT(spot._id)
      if (result.success) {
        deleteSpots(spot)
      }
      else {
        setIsDelete(false)
      }
      ToasterAction({result, defaultMessage: 'Lieu supprimé avec succès'})
    }
  }
  return (
    <div className=" h-full bg-slate-700 dark:bg-sky-800 rounded-md text-white flex flex-col md:flex-row gap-6 justify-between w-full max-w-[1200px] shadow-md shadow-slate-400 dark:shadow-sky-400 border-opacity-65 relative">
    
      {isDelete && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-80 z-10 backdrop-blur-md flex flex-col gap-4 items-center justify-center">
          <Spin size="large" />
          <p className="text-white text-xl font-bold">Suppression du lieu en cours.</p>
        </div>
      )}
      
      <div className="flex flex-col gap-3 justify-between w-full p-4">
        {/* header */}
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-bold text-center">{spot.name}</h2>
          <p className="text-sm  dark:text-gray-500 ">
            {spot.description || "Aucune description"}
          </p>
        </div>
        {/* content */} 
        <div className="flex flex-col gap-2">
          <div className="flex flex-col ">
            <p>
              Nombre de personnes minimum:{" "}
              <span className="font-bold">{spot.min_OfPeople}</span>{" "}
            </p>
            <p>
              Nombre de personnes maximum:{" "}
              <span className="font-bold">{spot.max_OfPeople}</span>
            </p>
            <p>
              Durée estimée:{" "}
              <span className="font-bold">{spot.estimatedDuration}</span>
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <h3 className="text-2xl font-bold text-center">
              Activités pratiquées sur place
            </h3>
            <div className="flex  gap-2 justify-center items-center">
            {spot.practicedActivities.map((activity) => (
              <p key={activity.activityId}>{activity.activityName}</p>
            ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full items-center ">
            <h3 className="text-2xl font-bold text-center">
              Type de sessions proposées
            </h3>
            <div className="flex  gap-4 w-full  items-center justify-center">
              <label htmlFor="half_day " className="flex items-center gap-2">
                Demi-journée:
                <input
                  type="checkbox"
                  name="half_day"
                  checked={spot.half_day}
                  disabled
                  className="w-4 h-4"
                />
              </label>

              <label htmlFor="full_day " className="flex items-center gap-2">
                Journée:
                <input
                  type="checkbox"
                  name="full_day"
                  checked={spot.full_day}
                  disabled
                  className="w-4 h-4"
                />
              </label>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="flex gap-3 w-full justify-end">
          <Tooltip title="Modifier le spot">
            <button onClick={() => setIsOpen(true)}>
              <MdOutlineUpdate className="text-4xl hover:text-slate-200 cursor-pointer transition-all" />
            </button>
          </Tooltip>

          <Tooltip title="Supprimer le spot">
            <button onClick={handleDelete}>
              <RiCalendarCloseFill className="text-4xl hover:text-red-500 cursor-pointer transition-all" />
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="min-w-[40%] flex items-center justify-center  ">
        <MapCustomer spot={spot} />
      </div>

      <UpdateSpotForm spotData={spot} isOpen={isOpen} onClose={() => {setIsOpen(false)}} />
    </div>
  );
}
