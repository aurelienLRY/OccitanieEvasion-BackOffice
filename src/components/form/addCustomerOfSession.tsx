/* LIBRAIRIES */
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

/* Component*/
import Modal from "@/components/Modal";
import { Input } from "@/components/Inputs";

/* types */
import { ISession } from "@/libs/database/models/Session";
import { ICustomerSession } from "@/libs/database/models/CustomerSession";

/* Validation */
const createDynamicSchema = (placesReserved: number) => {

  for (let i = 0; i < placesReserved; i++) {
   `size_${i}` = yup.number().required("La taille est obligatoire");
  `weight_${i}` = yup.number().required("Le poids est obligatoire");
  }


  return yup.object().shape({
    last_name: yup.string().required("Le nom de famille est obligatoire"),
    first_names: yup.string().required("Le prénom est obligatoire"),
    email: yup
      .string()
      .email("L'email est invalide")
      .required("L'email est obligatoire"),
    phone: yup.string().required("Le numéro de téléphone est obligatoire"),
    size_0: yup.number().required("La taille est obligatoire"),
    weight_: yup.number().required("Le poids est obligatoire"),

  });
};



type Props = {
  session: ISession;
  isOpen: boolean;
  onClose: () => void;
};
export default function AddCustomerOfSession({
  session,
  isOpen,
  onClose,
}: Props) {
  const [err, setErr] = useState<string | null>(null);
  const [placesReserved, setPlacesReserved] = useState<number>(1);

  const schema = createDynamicSchema(placesReserved);
  type TSchema = yup.InferType<typeof schema>;
 

  const methods = useForm<TSchema>({
    resolver: yupResolver(schema), // Utilisation du schéma dynamique
  });
  const { handleSubmit, reset } = methods;

  const onSubmit = (data: TSchema) => {
    console.log("data", data);

    const customer = Object.entries(data).reduce(
      (acc, [key, value]) => {
        if (key.startsWith("size") || key.startsWith("weight")) {
          const index = key.split("_")[1];
          if (!acc.people_list) acc.people_list = [];
          if (!acc.people_list[index]) {
            acc.people_list[index] = {};
          }
          acc.people_list[index][key.split("_")[0]] = value;
        } else {
          acc[key] = value;
        }
        return acc;
      },
      {
        sessionId: session._id,
        date: new Date(),
        status: "validated",
        typeOfReservation: "ByCompany",
        number_of_people: placesReserved,
      }
    );

    console.log("customer", customer);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-center">
            Ajouter un client à la session
          </h2>
          {err && <div className="text-red-500 text-sm">{err}</div>}
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
              <h3 onClick={() => setPlacesReserved(placesReserved + 1)}>
                Ajouter une personne
              </h3>
              {placesReserved > 0 &&
                Array.from({ length: placesReserved }).map((_, index) => (
                  <div key={index} className="flex gap-2">
                    <Input name={`size_${index}`} label="Taille en cm" type="number" />
                    <Input
                      name={`weight_${index}`}
                      label="Poids"
                      type="number"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => setPlacesReserved(placesReserved - 1)}
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white w-fit mx-auto p-3 rounded-md"
          >
            Ajouter
          </button>
        </form>
      </FormProvider>
    </Modal>
  );
}