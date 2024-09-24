


/* LIBRAIRIES */
import React, { useEffect, useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { Spin } from "antd";

/* Component */
import Modal from "@/components/Modal";
import { Input, SelectInput } from "@/components/Inputs";
import ToasterAction from "@/components/ToasterAction";
import EditEmail from "@/components/EditEmail";

/* types */
import { ISessionWithDetails, ICustomerSession } from "@/types";

/* Actions */
import { CREATE_CUSTOMER_SESSION, UPDATE_CUSTOMER_SESSION } from "@/libs/actions";

/*store*/
import { useSessionWithDetails } from "@/context/store";

/* Template */
import { customerConfirmation } from "@/libs/sendBox/template/RegistrationConfirmation";
import { MailContent } from "@/libs/sendBox/template/base";

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

export  function CustomerSessionForm({
  session,
  data,
  isOpen,
  onClose,
}: Props) {
  const methods = useForm({
    resolver: yupResolver(createDynamicSchema([])),
    defaultValues: {
      ...data,
      people_list: data?.people_list || [{ size: ``, weight: `` }],
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

  useEffect(() => {
    methods.reset({
      ...data,
      people_list: data?.people_list || [{ size: ``, weight: `` }],
    });
  }, [data, methods.reset]);

  const onSubmit = async (formData: any) => {
    const customer: ICustomerSession = {
      ...formData,
      sessionId: session._id,
      date: session.date,
      status: "Validated",
      typeOfReservation: "ByCompany",
      number_of_people: fields.length,
    };
    setCustomer(customer);

    let result;
    if (data?._id) {
      result = await UPDATE_CUSTOMER_SESSION(data._id, customer);
    } else {
      result = await CREATE_CUSTOMER_SESSION(customer);
    }

    if (result.success) {
      if (result.data) {
        updateSessionWithDetails(result.data);
        setSessionWithDetails(result.data);
        //TODO: envoyer un email au client
        if (window.confirm("Client ajouté avec succès ! \n Voulez-vous envoyer un email au client ?")) {
          if (sessionWithDetails && customer) {
            const myContent = customerConfirmation(customer, sessionWithDetails);
            setMyMailContent(MailContent(myContent.subject, myContent.content));
            console.log("myMailContent", myMailContent);
            setIsOpenEmail(true);
          }
        }
        onClose();
        methods.reset();
      }
    }
    ToasterAction({ result, defaultMessage: data?._id ? "Client modifié avec succès" : "Client ajouté avec succès" });
  };

  const optionTarif = () => {
    if (session.type_formule === "half_day") {
      return Object.entries(session.activity.price_half_day)
        .filter(([key, value]) => value > 0)
        .map(([key, value]) => ({ id: key, name: key }));
    } else {
      return Object.entries(session.activity.price_full_day)
        .filter(([key, value]) => value > 0)
        .map(([key, value]) => ({ id: key, name: key }));
    }
  };

  const watchTarification = methods.watch("tarification") as string;
  const [price, setPrice] = useState<number>();
  useEffect(() => {
    if (watchTarification && session.type_formule === "half_day") {
      setPrice(session.activity.price_half_day[watchTarification as keyof typeof session.activity.price_half_day]);
    } else if (watchTarification && session.type_formule === "full_day") {
      setPrice(session.activity.price_full_day[watchTarification as keyof typeof session.activity.price_full_day]);
    }
  }, [watchTarification]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <h2 className="text-2xl font-bold text-center">
              {data?._id ? "Modifier le client de la session" : "Ajouter un client à la session"}
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                choisir la tarification
                <SelectInput name="tarification" label="Tarification" options={optionTarif()} />
              </div>
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
                    if (fields?.length && fields.length < session.placesMax - session.placesReserved) {
                      append({ size: ``, weight: `` });
                    } else {
                      if (window.confirm("Nombre de personnes maximum atteint ! \n Voulez-vous tout de même ajouter une personne ?")) {
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
                  <div key={field.id} className="flex gap-2 items-center">
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
                    <span className="text-sm text-gray-500 ">Prix: {price} €</span>
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
              <div className="flex w-full items-center justify-end flex-col gap-2">
                <h3>Prix total: {price ? price * fields.length : 0} €</h3>
              </div>
            </div>
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white w-fit mx-auto p-3 rounded-md flex items-center justify-center min-w-[70px] min-h-[40px] disabled:opacity-80 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Spin size="default" />
              ) : (
                data?._id ? "Modifier" : "Ajouter"
              )}
            </button>
          </form>
        </FormProvider>
      </Modal>
      {myMailContent && (
        <EditEmail isOpen={isOpenEmail} onClose={() => setIsOpenEmail(false)} myContent={myMailContent} />
      )}
    </>
  );
}