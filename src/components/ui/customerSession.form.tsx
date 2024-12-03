"use client";

/* LIBRAIRIES */
import React, { useEffect, useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { Spin } from "antd";
import { Tooltip } from "antd";

/* Component */
import {
  Modal,
  Input,
  SelectInput,
  CheckboxInput,
  ToasterAction,
  DeleteButton,
} from "@/components";

/*services*/
import { fetcherUpdateEvent } from "@/services/GoogleCalendar/fetcherUpdateEvent";
import { generateEvent } from "@/services/GoogleCalendar/generateEvent";

/* types */
import { ISessionWithDetails, ICustomerSession } from "@/types";

/* Actions */
import {
  CREATE_CUSTOMER_SESSION,
  UPDATE_CUSTOMER_SESSION,
} from "@/libs/actions";

/*store*/
import { useSessionWithDetails, useProfile } from "@/store";

/* Template Email  */
import { customerConfirmation } from "@/libs/nodeMailer/template/RegistrationConfirmation";
import { MailContent, HtmlBase } from "@/libs/nodeMailer/template/base";

/* NodeMailer */
import { nodeMailerSender } from "@/libs";

/*icons */
import { IoMdPersonAdd } from "react-icons/io";
import { FaUser } from "react-icons/fa";

/* Validation */
const baseSchema = yup.object().shape({
  last_name: yup.string().required("Le nom de famille est obligatoire"),
  first_names: yup.string().required("Le prénom est obligatoire"),
  email: yup
    .string()
    .email("L'email est invalide")
    .required("L'email est obligatoire"),
  phone: yup.string().required("Le numéro de téléphone est obligatoire"),
  tarification: yup.string().required("La tarification est obligatoire"),
});

const peopleListSchema = yup.array().of(
  yup.object().shape({
    size: yup.string().required("La taille est obligatoire"),
    weight: yup.string().required("Le poids est obligatoire"),
    isReduced: yup.boolean(),
    price_applicable: yup.number(),
  })
);

const createDynamicSchema = (fields: Array<any>) => {
  return baseSchema.concat(
    yup.object().shape({
      people_list: peopleListSchema,
    })
  );
};

type Props = {
  session: ISessionWithDetails;
  data?: ICustomerSession;
  isOpen: boolean;
  onClose: () => void;
};

export function CustomerSessionForm({ session, data, isOpen, onClose }: Props) {
  const { updateSessionWithDetails } = useSessionWithDetails();
  const { profile } = useProfile();
  /* Form */
  const methods = useForm({
    resolver: yupResolver(createDynamicSchema([])),
    defaultValues: {
      ...data,
      people_list: data?.people_list || [
        { size: ``, weight: ``, isReduced: false, price_applicable: 0 },
      ],
    },
  });

  /* Field Array */
  const { fields, append, remove } = useFieldArray({
    name: "people_list",
    control: methods.control,
  });

  /* Reset Form */
  const {
    reset,
    formState: { isSubmitting },
  } = methods;

  /* Reset Form */
  useEffect(() => {
    reset({
      ...data,
      people_list: data?.people_list || [
        { size: ``, weight: ``, isReduced: false, price_applicable: 0 },
      ],
    });
  }, [data, reset, session]);

  /* Submit Form */
  const onSubmit = async (formData: any) => {
    const newCustomer: ICustomerSession = {
      ...formData,
      sessionId: session._id,
      date: session.date,
      status: "Validated",
      typeOfReservation: "ByCompany",
      number_of_people: fields.length,
      price_applicable: getPriceApplicable(
        watch.tarification === "reduced" ? true : false,
        session.type_formule,
        session.activity
      ),
      price_total: formData.people_list.reduce(
        (acc: number, person: { price_applicable: number }) =>
          acc + person.price_applicable,
        0
      ),
    };

    let result;
    if (data?._id && newCustomer) {
      result = await UPDATE_CUSTOMER_SESSION(data._id, newCustomer);
    } else if (newCustomer) {
      result = await CREATE_CUSTOMER_SESSION(newCustomer);
    } else {
      result = {
        success: false,
        data: null,
        error: "Les informations du client sont invalides",
        feedback: null,
      };
    }

    if (result.success) {
      if (result.data) {
        updateSessionWithDetails(result.data);
        const refreshToken = profile?.tokenRefreshCalendar;
        if (refreshToken) {
          const event = generateEvent(result.data);
          await fetcherUpdateEvent(refreshToken, event, result.data._id);
        } else {
          toast.error(
            "Votre calendrier n'est pas connecté, l'évènement n'a pas été mis à jour dans votre calendrier"
          );
        }

        if (
          window.confirm(
            "Client ajouté avec succès ! \n Voulez-vous envoyer un email au client ?"
          )
        ) {
          alert("je dois coder l'envoi d'email ");
          /*
          if (sessionWithDetails && customer) {
            const myContent = customerConfirmation(
              customer,
              sessionWithDetails
            );
            const mailHtml = HtmlBase(myContent.subject, myContent.content);
            const envoi = await nodeMailerSender(
              newCustomer.email,
              myContent.subject,
              mailHtml
            );
            if (envoi) {
              toast.success("Email envoyé avec succès");
            } else {
              toast.error("Erreur lors de l'envoi de l'email");
            }
          }*/
        }
        onClose();
        methods.reset();
      }
    }
    ToasterAction({
      result,
      defaultMessage: data?._id
        ? "Client modifié avec succès"
        : "Client ajouté avec succès",
    });
  };

  /*
   * Option Tarif
   *
   */
  const optionTarif = () => {
    if (session.type_formule === "half_day") {
      return Object.entries(session.activity.price_half_day)
        .filter(([key, value]) => value > 0)
        .map(([key, value]) => ({
          id: key,
          name:
            key == "standard"
              ? "Tarif normal"
              : key == "acm"
              ? "Tarif acm"
              : key == "reduced"
              ? "Tarif réduit"
              : key,
        }));
    } else {
      return Object.entries(session.activity.price_full_day)
        .filter(([key, value]) => value > 0)
        .map(([key, value]) => ({
          id: key,
          name:
            key == "standard"
              ? "Tarif normal"
              : key == "acm"
              ? "Tarif acm"
              : key == "reduced"
              ? "Tarif réduit"
              : key,
        }));
    }
  };

  /*
   * Watching form
   */
  const watch = methods.watch();

  /*
   * Fonction utilitaire pour obtenir le prix applicable
   */
  const getPriceApplicable = (
    isReduced: boolean,
    typeFormule: string,
    activity: any
  ) => {
    if (typeFormule === "half_day") {
      return isReduced
        ? activity.price_half_day.reduced
        : activity.price_half_day.standard;
    } else if (typeFormule === "full_day") {
      return isReduced
        ? activity.price_full_day.reduced
        : activity.price_full_day.standard;
    }
    return 0;
  };

  /*
   *
   */
  useEffect(() => {
    if (watch.tarification === "reduced") {
      watch.people_list?.forEach((person, index) => {
        const price = getPriceApplicable(
          true,
          session.type_formule,
          session.activity
        );
        methods.setValue(`people_list.${index}.price_applicable`, price);
      });
    } else {
      watch.people_list?.forEach((person, index) => {
        if (person.isReduced === undefined) {
          return;
        }
        const price = getPriceApplicable(
          person.isReduced,
          session.type_formule,
          session.activity
        );
        methods.setValue(`people_list.${index}.price_applicable`, price);
      });
    }
  }, [
    watch.tarification,
    watch.people_list,
    methods,
    session.activity,
    session.type_formule,
  ]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col items-center  gap-4 text-white"
          >
            <h2 className="text-2xl font-bold text-center">
              {data?._id ? "Modifier le client" : "Ajouter un client"}
            </h2>

            <SelectInput
              name="tarification"
              label="Type de tarification"
              options={optionTarif()}
              className="w-fit"
            />
            <div className="flex flex-col gap-4 items-center border-2 border-sky-500 p-4 rounded-md">
              <h3 className="text-xl font-bold text-sky-500">
                Informations du client
              </h3>
              <div className="flex gap-2 flex-col  md:flex-row">
                <Input name="last_name" label="Nom" type="text" />
                <Input name="first_names" label="Prénoms" type="text" />
              </div>

              <div className="flex gap-2 flex-col md:flex-row">
                <Input name="email" label="Email" type="email" />
                <Input name="phone" label="Téléphone" type="tel" />
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Tooltip title="Ajouter une personne">
                <IoMdPersonAdd
                  className="text-4xl hover:text-orange-500 cursor-pointer transition-all"
                  onClick={() => {
                    if (
                      fields?.length &&
                      fields.length < session.placesMax - session.placesReserved
                    ) {
                      append({
                        size: ``,
                        weight: ``,
                        isReduced: false,
                        price_applicable: getPriceApplicable(
                          false,
                          session.type_formule,
                          session.activity
                        ),
                      });
                    } else {
                      if (
                        window.confirm(
                          "Nombre de personnes maximum atteint ! \n Voulez-vous tout de même ajouter une personne ?"
                        )
                      ) {
                        append({
                          size: ``,
                          weight: ``,
                          isReduced: false,
                          price_applicable: getPriceApplicable(
                            false,
                            session.type_formule,
                            session.activity
                          ),
                        });
                      } else {
                        toast.error("Nombre de personnes maximum atteint");
                      }
                    }
                  }}
                />
              </Tooltip>
              <div className="flex flex-col gap-2 ">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex flex-col md:flex-row gap-2 items-center border-2 border-sky-500 p-4 rounded-md"
                  >
                    <span className="flex items-center gap-1 text-sm">
                      <FaUser className="text-xl" />
                      {index + 1}
                    </span>
                    <div className="flex items-center  gap-4 h-full">
                      <div className="flex flex-col md:flex-row gap-2">
                        <Input
                          name={`people_list[${index}].size`}
                          label="Taille en cm"
                          type="number"
                          errorsName={`people_list.${index}.size`}
                        />
                        <Input
                          name={`people_list[${index}].weight`}
                          label="Poids"
                          type="number"
                          errorsName={`people_list.${index}.weight`}
                        />
                      </div>
                      <div className="flex flex-col md:flex-row gap-1">
                        {index > 0 && (
                          <CheckboxInput
                            name={`people_list.${index}.isReduced`}
                            label="prix réduit"
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              const price = getPriceApplicable(
                                isChecked,
                                session.type_formule,
                                session.activity
                              );
                              methods.setValue(
                                `people_list.${index}.price_applicable`,
                                price
                              );
                            }}
                          />
                        )}

                        {index > 0 && (
                          <DeleteButton
                            title="Retirer"
                            onClick={() => {
                              remove(index);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex w-full items-center justify-end flex-col gap-2">
              <h3>
                Prix total:{" "}
                {methods
                  .getValues("people_list")
                  ?.reduce(
                    (acc: number, person: { price_applicable?: number }) =>
                      acc + (person.price_applicable || 0),
                    0
                  )}{" "}
                €
              </h3>
            </div>

            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white w-fit mx-auto p-3 rounded-md flex items-center justify-center min-w-[70px] min-h-[40px] disabled:opacity-80 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Spin size="default" />
              ) : data?._id ? (
                "Modifier"
              ) : (
                "Ajouter"
              )}
            </button>
          </form>
        </FormProvider>
      </Modal>
    </>
  );
}
