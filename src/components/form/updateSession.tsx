"use client";
/* LIBRAIRIES */
import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { Spin } from "antd";

/*ACTIONS*/
import { UPDATE_SESSION } from "@/libs/actions";

/* STORES */
import { useSessionWithDetails, useSpots, useActivities } from "@/context/store";

/* TYPES */
import { ISession, ISessionWithDetails } from "@/types";


/*COMPONENTS*/
import Modal from "@/components/Modal";
import { Input, SelectInput } from "@/components/Inputs";
import ToasterAction from "@/components/ToasterAction";


/*UTILS*/
import { formatDate } from "@/utils/date";


/* Validation schema */
const schema = yup.object().shape({
    
  date: yup.date().required("Renseignez la date"),
  startTime: yup.string().required("Renseignez l'heure de début"),
  status: yup.string().required("Choisissez un statut"),
  endTime: yup.string().required("Renseignez l'heure de fin"),
  activity: yup.string().required("Choisissez une activité"),
  spot: yup.string().required("Choisissez un lieu"),
  placesMax: yup
    .number()
    .required("Renseignez le nombre maximum de personnes")
    .positive()
    .integer(),
  placesReserved: yup
    .number()
    .required("Renseignez le nombre de places réservées")
    .integer(),
});



export type TSessionForm = {
  date: string;
  startTime: string;
  status: string;
  endTime: string;
  activity: string;
  spot: string;
  placesMax: number;
  placesReserved: number;
};

export default function UpdateSessionForm({
  sessionData,
  isOpen,
  onClose,
}: {
  sessionData: ISessionWithDetails | undefined;
  isOpen: boolean;
  onClose: () => void;
}) {


  const updateSessionWithDetails = useSessionWithDetails((state) => state.updateSessionWithDetails);
  const activities = useActivities((state) => state.Activities);
  const spots = useSpots((state) => state.Spots);


  const methods = useForm<TSessionForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      ...sessionData,
      date: sessionData ? formatDate(sessionData.date) : "",
      activity: sessionData ? sessionData.activity._id : "",
      spot: sessionData ? sessionData.spot._id : "",
    },
  });

  const onSubmit = async (data: TSessionForm) => {
    const result = await UPDATE_SESSION(sessionData?._id as string, data );
    if (result.success) {
      if (result.data) {
        updateSessionWithDetails(result.data);
      }
      reset();
      onClose();
    } 
    ToasterAction({result , defaultMessage: "Session modifiée avec succès"})
  };

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (sessionData) {
      reset({
        ...sessionData,
        date: formatDate(sessionData.date),
        activity: sessionData.activity._id,
        spot: sessionData.spot._id,
      });
    }
  }, [sessionData, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center gap-6"
        >
          {/* HEADER */}
          <div className="flex flex-col justify-center items-center gap-1">
            <h2 className="text-2xl font-bold">
              {sessionData ? "Modifier la session" : "Créer une session"}
            </h2>
          </div>

          {/* FORM */}
          <div className="flex flex-col items-center gap-1 border-2 rounded-md border-sky-500 w-full p-2">
            <p className="text-sky-500 text-xl font-bold">Créneau horaire</p>
            {/**Groupe temporel */}
            <div className="flex flex-col md:flex-row items-center gap-2">
              {/* DATE */}
              <Input name="date" type="date" label="Date" className="" />
              <div className="flex flex-col md:flex-row gap-2">
                {/* HEURE DE DÉBUT */}
                <Input
                  name="startTime"
                  type="time"
                  label="Heure de début"
                  className=" "
                />
                {/* HEURE DE FIN */}
                <Input
                  name="endTime"
                  type="time"
                  label="Heure de fin"
                  className=""
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col  gap-3 items-center md:justify-evenly w-full">
            <p className="text-sky-500 text-xl font-bold">Activité & Lieu</p>
            <div className="flex flex-col md:flex-row gap-2">
              {/* ACTIVITÉ */}
              <SelectInput
                name="activity"
                options={activities.map((activity) => ({
                  id: activity._id,
                  name: activity.name,
                }))}
                label="Activité"
                className=""
              />
              {/* LIEU */}
              <SelectInput
                name="spot"
                options={spots.map((spot) => ({
                  id: spot._id,
                  name: spot.name,
                }))}
                label="Lieu"
                className=""
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 border-2 rounded-md border-sky-500 w-full p-2">
            <p className="text-sky-500 text-xl font-bold">Gestion des places</p>
            <div className="flex flex-col md:flex-row gap-2">
              <Input
                name="placesMax"
                type="number"
                label="Places max"
                className=""
              />
              <Input
                name="placesReserved"
                type="number"
                label="Places réservées"
                className=""
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 border-2 rounded-md border-sky-500 w-full p-2">
            <p className="text-sky-500 text-xl font-bold">Statut</p>
            <SelectInput
              name="status"
              options={[
                { id: "Actif", name: "Validé" },
                { id: "Pending", name: "En attente" },
              ]}
              label="Statut"
              className=""
            />
          </div>

          {/* FOOTER */}
          <div className="flex justify-end items-center gap-1">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white w-fit mx-auto p-3 rounded-md flex items-center justify-center min-w-[70px] min-h-[40px] disabled:opacity-80 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spin size="default" />   : sessionData ? "Modifier" : "Créer"}
            </button>

          </div>
        </form>
      </FormProvider>
    </Modal>
  );
}

