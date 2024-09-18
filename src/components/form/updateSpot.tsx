"use client";

/* LIBRAIRIES */
import React, { useEffect } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { Spin } from "antd";

/* ACTIONS */
import { UPDATE_SPOT } from "@/libs/actions";

/* STORES */
import { useSpots, useActivities } from "@/context/store";

/* TYPES */
import { ISpot } from "@/types";

/* COMPONENTS */
import { Input, CheckboxInput , Textarea } from "@/components/Inputs";
import Modal from "@/components/Modal";
import ToasterAction from "@/components/ToasterAction";

/* Validation schema */
const baseSchema = yup.object().shape({
  name: yup.string().required("Le champ name est requis"),
  description: yup.string(),
  gpsCoordinates: yup.string().required("Le champ gpsCoordinates est requis"),
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

const practicedActivitiesSchema = yup.array().of(
  yup.object().shape({
    activityId: yup.string().required("Le champ activityId est requis"),
    activityName: yup.string().required("Le champ activityName est requis"),
  })
);

const createDynamicSchema = (fields: Array<any>) => {
  return baseSchema.concat(
    yup.object().shape({
      practicedActivities: practicedActivitiesSchema.min(
        1,
        "Au moins une activité doit être sélectionnée"
      ),
    })
  );
};

export type TSpotForm = {
  name: string;
  description: string | undefined;
  gpsCoordinates: string;
  practicedActivities: {
    activityId: string;
    activityName: string;
  }[];
  photo: string | undefined;
  half_day: boolean;
  full_day: boolean;
  max_OfPeople: number;
  min_OfPeople: number;
  meetingPoint: string | undefined;
  estimatedDuration: string | undefined;
};

export default function UpdateSpotForm({
  spotData,
  isOpen,
  onClose,
}: {
  spotData: ISpot;
  isOpen: boolean;
  onClose: () => void;
}) {
  const updateSpot = useSpots((state) => state.updateSpots);
  const activities = useActivities((state) => state.Activities);
  const methods = useForm<TSpotForm>({
    resolver: yupResolver(createDynamicSchema([])),
    defaultValues: {
      ...spotData,
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "practicedActivities",
    control: methods.control,
  });

  const onSubmit = async (data: TSpotForm) => {
    const result = await UPDATE_SPOT(spotData._id, data as ISpot);
    if (result.success) {
      if (result.data) {
        updateSpot(result.data);
      }
      reset();
      onClose();
    }
    ToasterAction({result , defaultMessage: "Lieu modifié avec succès"})
  };

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (spotData) {
      reset({
        ...spotData,
      });
    }
  }, [spotData, reset]);

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
              {spotData ? "Modifier le lieu" : "Créer un lieu"}
            </h2>
          </div>

          {/* FORM */}
          <div className="flex flex-col items-center gap-2 border-2 rounded-md border-sky-500 w-full p-2">
            <p className="text-sky-500 text-xl font-bold">
              Informations du lieu
            </p>

            <Input name="name" type="text" label="Nom" />
            <Textarea name="description"  label="Description" placeholder="Description" />
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                name="gpsCoordinates"
                type="text"
                label="Coordonnées GPS"
                className=""
                placeholder="Exemple: 48.8584, 2.2945"
              />
              <Input
                name="meetingPoint"
                type="text"
                label="Point de rencontre"
                className=""
                placeholder="Exemple: 48.8584, 2.2945"
              />
            </div>
          

            <Input
              name="estimatedDuration"
              type="text"
              label="Durée estimée"
              className=""
            />
          </div>

          <div className="flex flex-col items-center gap-1 border-2 rounded-md border-sky-500 w-full p-2">
            <p className="text-sky-500 text-xl font-bold">
              Activités pratiquées
            </p>

            {/* message d'erreur si aucune activité n'est sélectionnée */}
            {errors.practicedActivities && (
              <p className="text-red-500">
                Au moins une activité doit être sélectionnée
              </p>
            )}
            <div className="grid grid-cols-2 gap-4 justify-around  ">
              {activities.map((activity) => (
                <CheckboxInput
                  key={activity._id}
                  name={`practicedActivities.${activity._id}`}
                  label={activity.name}
                  checked={fields.some(
                    (field) => field.activityId === activity._id
                  )}
                  onChange={(e) => {
                    if (e.target.checked) {
                      append({
                        activityId: activity._id,
                        activityName: activity.name,
                      });
                    } else {
                      const index = fields.findIndex(
                        (field) => field.activityId === activity._id
                      );
                      if (index !== -1) remove(index);
                    }
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 border-2 rounded-md border-sky-500 w-full p-2">
            <p className="text-sky-500 text-xl font-bold">Disponibilité</p>
            <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
              <CheckboxInput
                name="half_day"
                label="Demi-journée"
                className=""
              />
              <CheckboxInput
                name="full_day"
                label="Journée complète"
                className=""
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 border-2 rounded-md border-sky-500 w-full p-2">
            <p className="text-sky-500 text-xl font-bold">Capacité</p>
            <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
              <Input
                name="max_OfPeople"
              type="number"
              label="Nombre maximum de personnes"
              className=""
            />
            <Input
              name="min_OfPeople"
              type="number"
              label="Nombre minimum de personnes"
              className=""
            />
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end items-center gap-1">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white w-fit mx-auto p-3 rounded-md flex items-center justify-center min-w-[70px] min-h-[40px] disabled:opacity-80 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Spin size="default" />
              ) : spotData ? (
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
