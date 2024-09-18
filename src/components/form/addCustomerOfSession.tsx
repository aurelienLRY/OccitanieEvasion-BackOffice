/* LIBRAIRIES */
import React, { useEffect, useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";

import { Spin } from "antd";

/* Component */
import Modal from "@/components/Modal";
import { Input } from "@/components/Inputs";
import ToasterAction from "@/components/ToasterAction";
import EditEmail from "@/components/EditEmail";

/* types */
import { ISessionWithDetails } from "@/types";
import { ICustomerSession } from "@/types";

/* Actions */
import { CREATE_CUSTOMER_SESSION } from "@/libs/actions";

/*store*/
import { useSessionWithDetails } from "@/context/store";

/* Template */
import { customerConfirmation } from "@/libs/sendBox/template/RegistrationConfirmation";
import { MailContent, HtmlBase } from "@/libs/sendBox/template/base";

/* Validation */
const baseSchema = yup.object().shape({
  last_name: yup.string().required("Le nom de famille est obligatoire"),
  first_names: yup.string().required("Le prénom est obligatoire"),
  email: yup
    .string()
    .email("L'email est invalide")
    .required("L'email est obligatoire"),
  phone: yup.string().required("Le numéro de téléphone est obligatoire"),
});

const peopleListSchema = yup.array().of(
  yup.object().shape({
    size: yup.string().required("La taille est obligatoire"),
    weight: yup.string().required("Le poids est obligatoire"),
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
  isOpen: boolean;
  onClose: () => void;
};

export default function AddCustomerOfSession({
  session,
  isOpen,
  onClose,
}: Props) {
  const methods = useForm({
    resolver: yupResolver(createDynamicSchema([])),
    defaultValues: {
      people_list: [{ size: ``, weight: `` }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "people_list",
    control: methods.control,
  });

  const {
    formState: { isSubmitting },
  } = methods;

  const { updateSessionWithDetails } = useSessionWithDetails();
  const [isOpenEmail, setIsOpenEmail] = useState(false);
  const [customer, setCustomer] = useState<ICustomerSession | null>(null);
  const [sessionWithDetails, setSessionWithDetails] = useState<ISessionWithDetails | null>(null);
  const [myMailContent, setMyMailContent] = useState<string>("");

  const onSubmit = async (data: any) => {
    const customer: ICustomerSession = {
      ...data,
      sessionId: session._id,
      date: session.date,
      status: "Validated",
      typeOfReservation: "ByCompany",
      number_of_people: fields.length,
    };
setCustomer(customer);
    const result = await CREATE_CUSTOMER_SESSION(customer);
    if (result.success) {
      if (result.data) {
        updateSessionWithDetails(result.data);
        setSessionWithDetails(result.data);
        //TODO: envoyer un email au client
        if (window.confirm("Client ajouté avec succès ! \n Voulez-vous envoyer un email au client ?")) {
          if (sessionWithDetails && customer) {
         const myContent = customerConfirmation(customer, sessionWithDetails);
         setMyMailContent(MailContent(myContent.subject, myContent.content)) ;
         console.log("myMailContent",myMailContent);
         setIsOpenEmail(true);
          }
        }
        onClose();
        methods.reset();
      }
    }
    ToasterAction({ result, defaultMessage: "Client ajouté avec succès" });
  };

  return (
    <>
    <Modal isOpen={isOpen} onClose={onClose}>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <h2 className="text-2xl font-bold text-center">
            Ajouter un client à la session
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Input name="last_name" label="Nom" type="text" />
              <Input name="first_names" label="Prénoms" type="text" />
            </div>

            <div className="flex gap-2">
              <Input name="email" label="Email" type="email" />
              <Input name="phone" label="Téléphone" type="tel" />
            </div>

            <div className="flex flex-col gap-2">
              <h3
                onClick={() => {
                  if ( fields?.length &&
                    fields.length <
                    session.placesMax - session.placesReserved
                  ) {
                    append({ size: ``, weight: `` });
                  } else {
                    if (
                      window.confirm(
                        "Nombre de personnes maximum atteint ! \n Voulez-vous tout de même ajouter une personne ?"
                      )
                    ) {
                      append({ size: ``, weight: `` });
                    } else {
                      toast.error("Nombre de personnes maximum atteint");
                    }
                  }
                }}
              >
                Ajouter une personne
              </h3>

              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
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
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        remove(index);
                      }}
                    >
                      Retirer
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white w-fit mx-auto p-3 rounded-md flex items-center justify-center min-w-[70px] min-h-[40px] disabled:opacity-80 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Spin
              size="default" />

            ) : (
              "Ajouter"
            )}
          </button>
        </form>
      </FormProvider>
    </Modal>
    { myMailContent && (
      <EditEmail isOpen={isOpenEmail} onClose={() => setIsOpenEmail(false)}  myContent={myMailContent} />
    )}
    </>
  );
}
