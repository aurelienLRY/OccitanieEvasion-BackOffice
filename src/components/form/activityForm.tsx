"use client";

/* LIBRAIRIES */
import React from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { Spin } from "antd";

/* ACTIONS */
import { CREATE_ACTIVITY } from "@/libs/actions";

/* STORE */
import { useActivities } from "@/context/store";

/* TYPES */
import { IActivity } from "@/types";

/* COMPONENTS */
import { Input, CheckboxInput, Textarea } from "@/components/Inputs";
import Modal from "@/components/Modal";
import ToasterAction from "@/components/ToasterAction";

/* Validation schema */
const baseSchema = yup.object().shape({
  name: yup.string().required("Le champ name est requis"),
  description: yup.string(),
  half_day: yup.boolean(),
  full_day: yup.boolean(),
  price_half_day: yup
    .number()
    .positive()
    .integer()
    .required("Le champ price_half_day est requis"),
  price_full_day: yup
    .number()
    .positive()
    .integer()
    .required("Le champ price_full_day est requis"),
  min_age: yup
    .number()
    .positive()
    .integer()
    .required("Le champ min_age est requis"),
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
});

export type TActivityForm = {
  name: string;
  description: string;
  half_day: boolean;
  full_day: boolean;
  price_half_day: number;
  price_full_day: number;
  min_age: number;
  max_OfPeople: number;
  min_OfPeople: number;
};

export default function CreateActivityForm({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const methods = useForm<TActivityForm>({
    resolver: yupResolver(baseSchema),
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  const { updateActivities } = useActivities();

  const onSubmit = async (data: TActivityForm) => {
    const result = await CREATE_ACTIVITY(data as IActivity);
    if (result.success) {
      if (result.data) {
        updateActivities(result.data);
      }
      reset();
      onClose();
    }
    ToasterAction({ result, defaultMessage: "Activité créée avec succès" });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-center">Créer une activité</h2>
          <Input name="name" type="text" label="Nom de l'activité" />
          <Textarea name="description" label="Description" />
          <CheckboxInput name="half_day" label="Demi-journée" />
          <CheckboxInput name="full_day" label="Journée complète" />
          <Input
            name="price_half_day"
            type="number"
            label="Prix demi-journée"
          />
          <Input
            name="price_full_day"
            type="number"
            label="Prix journée complète"
          />

          <div className="flex flex-col gap-2 items-center">
            <h3 className="text-lg font-bold"> Gestion des groupes</h3>
            <div className="flex flex-col md:flex-row gap-6">
              <Input
                name="max_OfPeople"
                type="number"
                label="Nombre maximum de personnes"
              />
              <Input
                name="min_OfPeople"
                type="number"
                label="Nombre minimum de personnes"
                placeholder="Nombre minimum de personnes "
              />
            </div>
            <Input name="min_age" type="number" label="Age minimum" />
          </div>

          <div className="flex justify-end items-center gap-1">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white w-fit mx-auto p-3 rounded-md flex items-center justify-center min-w-[70px] min-h-[40px] disabled:opacity-80 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spin size="default" /> : "Créer"}
            </button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
}
