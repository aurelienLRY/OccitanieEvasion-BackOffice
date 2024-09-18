/* LIBRAIRIES */
import React from "react";
import { Tooltip } from "antd";
import { capitalizeFirstLetter } from "@/utils/typo";
import { toast } from "sonner";

/* ACTIONS */
import { UPDATE_CUSTOMER_SESSION } from "@/libs/actions";

/*stores*/
import { useSessionWithDetails } from "@/context/store";

/* types */
import { ICustomerSession } from "@/types";

/*
 * CustomerFiche Component
 * @param customer: ICustomerSession
 * @returns JSX.Element
 */
function CustomerFiche({ customer }: { customer: ICustomerSession }) {
  const { updateSessionWithDetails } = useSessionWithDetails();

  const removePerson = async (index: number) => {
    if (window.confirm("Voulez-vous vraiment retirer cette personne ?")) {
      const people_list = [...customer.people_list];
      if (people_list.length > 1) {
        people_list.splice(index, 1);
      }
      const data = {
        ...customer,
        people_list,
        number_of_people: people_list.length,
      };

      if (people_list.length === 0) {
        if (
          window.confirm(
            "Aucun participant sera enregistré , voulez vous annuler la réservation ?"
          )
        ) {
          data.status = "Canceled";
          data.number_of_people = 0;
        }
      } 

      const result = await UPDATE_CUSTOMER_SESSION(
        customer._id,
        data as ICustomerSession
      );
      console.log(result);
      if (result.success) {
        if (result.data) {
          if (result.data.status === "Canceled") {
            toast.success("Réservation annulée avec succès");
            updateSessionWithDetails(result.data);
          } else {
            updateSessionWithDetails(result.data);
            toast.success("Participation retirée avec succès");
          }
        } else {
          toast.error(
            "Une erreur est survenue lors de l'annulation de la réservation"
          );
        }
      }
    }
  };

  const IsCanceled = customer.status === "Canceled";

  return (
    <div className="flex flex-col gap-6 min-w-[300px] w-[80vw] max-w-[600px]">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-bold">
          {customer.first_names} {customer.last_name.toUpperCase()}
        </p>
        <Tooltip
          title={
            capitalizeFirstLetter(customer.status) === "Validated"
              ? "Validé"
              : "Annulé"
          }
        >
          <span className="text-4xl cursor-pointer">
            {capitalizeFirstLetter(customer.status) === "Validated"
              ? "👍"
              : "🖕"}
          </span>
        </Tooltip>
      </div>

      <div>
        <p>
          <span className="font-bold">Email:</span>{" "}
          <a href={`mailto:${customer.email}`}>{customer.email}</a>
        </p>
        <p>
          <span className="font-bold">Téléphone:</span>{" "}
          <a href={`tel:${customer.phone}`}>{customer.phone}</a>
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-center text-xl font-bold">
          Nombre de participants: {customer.number_of_people}
        </p>
        {customer.people_list.map((person, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 justify-center rounded-md border border-gray-200 p-2  transition-all duration-300 ${
              IsCanceled ? "opacity-60" : "hover:bg-sky-900 opacity-100"
            }`}
          >
            <span className="font-bold text-4xl">🧍‍♂️</span>
            <span className="font-bold text-xl"> -&gt; </span>
            <p>
              {" "}
              {person.size} cm | {person.weight}kg
            </p>
            {!IsCanceled && (
              <button
                className="hover:bg-red-500 text-white px-2 py-1 rounded-md border border-red-500 transition-all duration-300 text-sm"
                onClick={() => removePerson(index)}
              >
                Retirer
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomerFiche;
