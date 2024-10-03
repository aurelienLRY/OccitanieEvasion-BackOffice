/*Librairies*/
import { Tooltip, Spin } from "antd";
import { useState } from "react";
import { toast } from "sonner";
/* Types */
import { ISpot, ICallback } from "@/types";
/* Actions */
import { DELETE_SPOT } from "@/libs/actions";
/* Components */
import MapCustomer from "@/components/MapCustomer";
import { SpotForm } from "@/components/form";
import ToasterAction from "@/components/ToasterAction";
import { ItemCard, ItemCardInner, ItemCardHeader } from "@/components/ItemCard";

/* store */
import { useSpots, useSessionWithDetails } from "@/context/store";

/*icons*/
import { RiCalendarCloseFill } from "react-icons/ri";
import { MdOutlineUpdate } from "react-icons/md";

export default function SpotCard({ spot }: { spot: ISpot }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const { deleteSpots } = useSpots();
  const { SessionWithDetails } = useSessionWithDetails();

  //get all sessions with this spot
  const sessionsWithSpot = SessionWithDetails.filter(
    (session) => session.spot._id === spot._id
  );

  const handleDelete = async () => {
    //check if the spot is used in a session
    if (sessionsWithSpot.length > 0) {
      toast.error(
        "Ce spot est déjà utilisé dans une session , vous ne pouvez pas le supprimer. Vous devez d'abord supprimer les sessions liées à ce spot"
      );
      return;
    }
    //if the spot is not used in a session , delete it
    const confirm = window.confirm("Voulez vous vraiment supprimer ce spot ?");
    if (confirm) {
      setIsDelete(true);
      const result = await DELETE_SPOT(spot._id);
      if (result.success) {
        deleteSpots(spot);
      } else {
        setIsDelete(false);
      }
      ToasterAction({ result, defaultMessage: "Lieu supprimé avec succès" });
    }
  };
  return (
    <ItemCard className="h-full  text-white flex flex-col md:flex-row gap-6 justify-between w-full max-w-[1200px] relative">
      {isDelete && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-80 z-10 backdrop-blur-md flex flex-col gap-4 items-center justify-center">
          <Spin size="large" />
          <p className="text-white text-xl font-bold">
            Suppression du lieu en cours.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 justify-between w-full p-4">
 
          {/* header */}

          <ItemCardHeader>
            <h2 className="text-4xl font-bold text-center">{spot.name}</h2>
          </ItemCardHeader>

          {/* content */}
          <div className="flex flex-col justify-between h-full gap-2">
            <p className="text-sm  dark:text-gray-300 text-center ">
              {spot.description || "Aucune description"}
            </p>
            <ItemCardInner className="flex gap-3 w-full items-center ">
              <h3 className=" font-bold text-center">Activités pratiquées:</h3>
              <div className={`grid grid-cols-1 gap-2  w-full`}>
                {spot.practicedActivities.map((activity) => (
                  <p key={activity.activityId}>{activity.activityName}</p>
                ))}
              </div>
            </ItemCardInner>
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

      <SpotForm
        spotData={spot}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </ItemCard>
  );
}
