"use client";
/* LIBRAIRIES */
import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Spin } from "antd";

/* ACTIONS */
import { CREATE_SESSION, UPDATE_SESSION } from "@/libs/actions/session.actions";
import { sessionSchema } from "@/libs/yup/session.schema";

/* STORES */
import {
  useSessionWithDetails,
  useSpots,
  useActivities,
} from "@/context/store";

/* TYPES */
import { ISession, ISessionWithDetails, IActivity } from "@/types";

/* COMPONENTS */
import Modal from "@/components/Modal";
import { Input, SelectInput } from "@/components/Inputs";
import ToasterAction from "@/components/ToasterAction";

/* UTILS */
import { formatDate } from "@/utils/date";

export type TSessionForm = {
  date: Date | string;
  startTime: string;
  status: string;
  endTime: string;
  activity: string;
  spot: string;
  placesMax: number;
  placesReserved: number;
  type_formule: string;
};

export function SessionForm({
  sessionData,
  isOpen,
  onClose,
}: {
  sessionData?: ISessionWithDetails;
  isOpen: boolean;
  onClose: () => void;
}) {
  const isUpdate = !!sessionData;

  const addSessionWithDetails = useSessionWithDetails(
    (state) => state.addSessionWithDetails
  );
  const updateSessionWithDetails = useSessionWithDetails(
    (state) => state.updateSessionWithDetails
  );
  const sessionsWithDetails = useSessionWithDetails(
    (state) => state.SessionWithDetails
  );
  const activities = useActivities((state) => state.Activities);
  const spots = useSpots((state) => state.Spots);

  const [filteredActivities, setFilteredActivities] =
    useState<IActivity[]>(activities);
  const [filteredTypeFormule, setFilteredTypeFormule] = useState<
    { id: string; name: string }[]
  >([
    { id: "half_day", name: "Demi-journée" },
    { id: "full_day", name: "Journée" },
  ]);

  const methods = useForm<TSessionForm>({
    resolver: yupResolver(sessionSchema as any), // Ajout de 'as any' pour contourner l'erreur de typage
    defaultValues: {
      ...sessionData,
      date: sessionData?.date && formatDate(sessionData.date),
      activity: sessionData ? sessionData.activity._id : "",
      spot: sessionData ? sessionData.spot._id : "",
      status: sessionData ? sessionData.status : "Actif",
      placesReserved: sessionData ? sessionData.placesReserved : 0,
    },
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting  },
  } = methods;

  useEffect(() => {
    if (sessionData) {
      reset({
        ...sessionData,
        date: sessionData?.date && formatDate(sessionData.date),
        activity: sessionData.activity._id,
        spot: sessionData.spot._id,
      });
    }
  }, [sessionData, reset]);

  const watchSpot = methods.watch("spot");
  const watchActivity = methods.watch("activity");
  const watchDate = methods.watch("date");

  useEffect(() => {
    const interActivities =
      spots.find((spot) => spot._id === watchSpot)?.practicedActivities || [];
    const filteredActivities = activities.filter((activity) =>
      interActivities
        .map((interActivity) => interActivity.activityId)
        .filter((activityId): activityId is string => !!activityId) // Ajout de cette ligne pour filtrer les 'undefined'
        .includes(activity._id)
    );
    setFilteredActivities(filteredActivities);
  }, [watchSpot, activities, spots]);

  useEffect(() => {
    const thisActivity = activities.find(
      (activity) => activity._id === watchActivity
    );
    if (thisActivity) {
      const typeFormuleOptions = [];
      if (thisActivity.half_day)
        typeFormuleOptions.push({ id: "half_day", name: "Demi-journée" });
      if (thisActivity.full_day)
        typeFormuleOptions.push({ id: "full_day", name: "Journée" });
      setFilteredTypeFormule(typeFormuleOptions);
    } else {
      setFilteredTypeFormule([
        { id: "half_day", name: "Demi-journée" },
        { id: "full_day", name: "Journée" },
      ]);
    }
  }, [watchActivity, activities]);

  useEffect(() => {
    if (!isUpdate) {
      const sessionExists = sessionsWithDetails.some(
        (session) => new Date(session.date).toDateString() === new Date(watchDate).toDateString()
      );
      if (sessionExists) {
        setError("date", {
          type: "manual",
          message: "Cette date est déjà prise",
        });
      }
    }
  }, [watchDate , sessionsWithDetails ,setError , isUpdate , isSubmitting]);

  const onSubmit = async (data: TSessionForm) => {
    const result = isUpdate
      ? await UPDATE_SESSION(sessionData!._id, data as ISession)
      : await CREATE_SESSION(data as ISession);

    if (result.success) {
      if (result.data) {
        isUpdate
          ? updateSessionWithDetails(result.data)
          : addSessionWithDetails(result.data);
      }
      reset();
      onClose();
    }
    ToasterAction({
      result,
      defaultMessage: isUpdate
        ? "Session modifiée avec succès"
        : "Session créée avec succès",
    });
  };
  
  const handleOnClose = () => {
    reset();
    onClose();
  }


  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-full justify-center items-center gap-6 text-white "
        >
          {/* HEADER */}
          <div className="flex flex-col justify-center items-center gap-1">
            <h2 className="text-2xl font-bold">
              {isUpdate ? "Modifier la session" : "Créer une session"}
            </h2>
          </div>

          {/* FORM */}
          <div className="flex flex-col gap-3 items-center md:justify-evenly border-2 rounded-md border-sky-500 w-full p-2">
            <p className="text-sky-500 text-xl font-bold">Activité & Lieu</p>
            <div className="flex flex-col md:flex-row gap-2 justify-around w-full">
              <SelectInput
                name="spot"
                options={spots.map((spot) => ({
                  id: spot._id,
                  name: spot.name,
                }))}
                label="Lieu"
              />
              <SelectInput
                name="activity"
                options={filteredActivities.map((activity) => ({
                  id: activity._id || "", // Ajout de '|| ""' pour s'assurer que 'id' est une chaîne de caractères
                  name: activity.name,
                }))}
                label="Activité"
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 w-full p-2">
            <p className="text-sky-500 text-xl font-bold">Créneau horaire</p>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col md:flex-row gap-2">
                {filteredTypeFormule && (
                  <SelectInput
                    name="type_formule"
                    options={filteredTypeFormule}
                    label="Type de formule"
                  />
                )}
                <Input name="date" type="date" label="Date" />
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <Input name="startTime" type="time" label="Heure de début" />
                <Input name="endTime" type="time" label="Heure de fin" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 border-2 rounded-md border-sky-500 w-full p-2">
            <p className="text-sky-500 text-xl font-bold">Gestion des places</p>
            <div className="flex flex-col md:flex-row gap-2">
              <Input name="placesMax" type="number" label="Places max" />
              <Input
                name="placesReserved"
                type="number"
                label="Places réservées"
              />
            </div>
          </div>
          {isUpdate && (
            <div className="flex flex-col items-center gap-1">
            <p className="text-sky-500 text-xl font-bold">Statut</p>
            <SelectInput
              name="status"
              options={[
                { id: "Actif", name: "Validé" },
                { id: "Pending", name: "En attente" },
              ]}
              label="Statut"
            />
          </div>
          )}

          {/* FOOTER */}
          <div className="flex justify-end items-center gap-1">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white w-fit mx-auto p-3 rounded-md flex items-center justify-center min-w-[70px] min-h-[40px] disabled:opacity-80 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Spin size="default" />
              ) : isUpdate ? (
                "Modifier"
              ) : (
                "Créer"
              )}
            </button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
}
