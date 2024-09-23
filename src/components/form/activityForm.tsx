"use client";

/* LIBRAIRIES */
import React, { useEffect } from "react";
import { useForm, FormProvider} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Spin } from "antd";
import { Tooltip } from "antd";

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
import InfoTooltips from "@/components/InfoTooltips";
/* Validation schema */
const baseSchema = yup.object().shape({
  name: yup.string().required("Le champ name est requis"),
  description: yup.string(),
  half_day: yup.boolean(),
  full_day: yup.boolean(),
  price_half_day: yup.object().when('half_day', {
    is: true,
    then: (schema) => schema.shape({
      standard: yup.number().positive().integer().required("Le prix pour la demi-journée est requis"),
      reduced: yup.number().positive().integer(),
      ACM: yup.number().positive().integer(),
    }),
    otherwise: (schema) => schema
  }),

  price_full_day: yup.object().when('full_day', {
    is: true,
    then: (schema) => schema.shape({
      standard: yup.number().positive().integer().required("Le prix pour la journée complète est requis"),
      reduced: yup.number().positive().integer(),
      ACM: yup.number().positive().integer(),
    }),
    otherwise: (schema) => schema
  }),
 
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
  description?: string;
  half_day?: boolean;
  full_day?: boolean;
  price_half_day: {
    standard: number;
    reduced?: number;
    ACM?: number;
  };
  price_full_day: {
    standard?: number;
    reduced?: number;
    ACM?: number;
  };
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
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  const { updateActivities } = useActivities();

  const onSubmit = async (data: TActivityForm) => {
    console.log("onSubmit", data)
    
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

  // Surveiller la valeur de full_day et half_day
  const watchHalfDay = watch("half_day", false);
  const watchFullDay = watch("full_day", false);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold text-center">Créer une activité</h2>
          <Input name="name" type="text" label="Nom de l'activité" />
          <Textarea name="description" label="Description" />

          <table className="w-full border-collapse border-2 rounded-md border-sky-500">
            <thead>
              <tr className="flex justify-center items-center gap-2 w-full">
                <h3 className="text-sky-500 text-xl font-bold text-center ">Formule</h3>
                <InfoTooltips title="Sélectionner si l’activité peut être pratiquée en une demi-journée et/ou en une journée complète" />
              </tr>
            </thead>
            <tbody>
              <tr className="flex justify-around gap-4 w-full">
                <td className="p-2 flex justify-center items-center">
                  <CheckboxInput name="half_day" label="Demi-journée" />
                </td>
                <td className="p-2 flex justify-center items-center">
                  <CheckboxInput name="full_day" label="Journée complète" />
                </td> 
              </tr>
              <tr className="flex justify-center items-center gap-2 w-full">
              <h3 className="text-sky-500 text-xl font-bold text-center ">Tarification </h3>
              <InfoTooltips title="Renseigner les prix pour les formules sélectionnées " />
              </tr>
              <tr className="flex flex-col justify-around items-center md:flex-row gap-4 w-full"> 
                <td className={`p-2 flex flex-col justify-center items-center gap-1 ${!watchHalfDay && 'opacity-60'}`}>
                  <div className="font-semibold text-center py-4">Prix demi-journée</div>
                  <Input
                    name="price_half_day.standard"
                    type="number"
                    label="Prix standard "
                    disabled={!watchHalfDay}
                  />
                  <Input
                    name="price_half_day.reduced"
                    type="number"
                    label="Prix réduit"
                    disabled={!watchHalfDay}
                  />
                  <Input
                    name="price_half_day.ACM"
                    type="number"
                    label="Prix ACM"
                    disabled={!watchHalfDay}
                  />
                </td>
                <td className={`p-2 flex flex-col justify-center items-center gap-1 ${!watchFullDay && 'opacity-60'}`}>
                  <div className="font-semibold text-center py-4">Prix journée complète</div>
                  <Input
                    name="price_full_day.standard"
                    type="number"
                    label="Prix standard "
                    disabled={!watchFullDay}
                  />
                  <Input
                    name="price_full_day.reduced"
                    type="number"
                    label="Prix réduit"
                    disabled={!watchFullDay}
                  />
                  <Input
                    name="price_full_day.ACM"
                    type="number"
                    label="Prix ACM"
                    disabled={!watchFullDay}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex flex-col gap-2 items-center">
            <div className="flex justify-center items-center gap-2">
            <h3 className="text-lg font-bold">Gestion des groupes</h3>
            <InfoTooltips title="Renseigner les nombres maximum et minimum de personnes pour les groupes" />
            </div>
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
