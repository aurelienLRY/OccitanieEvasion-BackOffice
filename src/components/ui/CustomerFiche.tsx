/* LIBRAIRIES */
import React from "react";
import { Tooltip } from "antd";
import { toast } from "sonner";

/* ACTIONS */
import { UPDATE_CUSTOMER_SESSION } from "@/libs/actions";

/* COMPONENTS */
import { DeleteButton , Modal , ToasterAction } from "@/components";

/* utils */
import { getCustomerStatusDisplay } from "@/utils";

/*stores*/
import { useSessionWithDetails } from "@/store";

/* types */
import { ICustomerSession } from "@/types";


/**
 * CustomerFiche Component
 * @param customer: ICustomerSession
 * @returns JSX.Element
 */
export const CustomerFiche = ({ customer , isOpen , onClose }: { customer: ICustomerSession , isOpen: boolean , onClose : () => void }) =>   {
  const { updateSessionWithDetails } = useSessionWithDetails();
   if (!customer) return null;

   
  const removePerson = async (index: number) => {
    if (customer.number_of_people === 1) {
      toast.error(
        "Vous ne pouvez pas retirer la dernière personne de la réservation, veuillez annuler la réservation."
      );
      return;
    }
    if (window.confirm("Voulez-vous vraiment retirer cette personne ?")) {
      const people_list = [...customer.people_list];
      if (people_list.length > 1) {
        people_list.splice(index, 1);
      }
      const data = {
        ...customer,
        people_list,
        number_of_people: people_list.length,
        price_total: people_list.reduce(
          (acc, person) => acc + person.price_applicable,
          0
        ),
      };
      const result = await UPDATE_CUSTOMER_SESSION(
        customer._id,
        data as ICustomerSession
      );
      console.log(result);
      if (result.success) {
        if (result.data) {
          updateSessionWithDetails(result.data);
        }
      }
      ToasterAction({
        result,
        defaultMessage: "Participant retiré avec succès",
      });
    }
  };

  const IsCanceled = customer.status === "Canceled";

  return (
    <Modal isOpen = {isOpen} onClose={onClose}>
    <div className="flex flex-col gap-6 min-w-[300px] w-[80vw] max-w-[600px]">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-bold">
          {customer.first_names} {customer.last_name.toUpperCase()}
        </p>
        <Tooltip title={getCustomerStatusDisplay(customer.status).name}>
          <span className="text-4xl cursor-pointer">
            {getCustomerStatusDisplay(customer.status).icon}
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
        <p>
          <span className="font-bold">Date de réservation :</span>{" "}
          {new Date(customer.createdAt).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
        <p>
          <span className="font-bold">Total à payer:</span>{" "}
          {customer.price_total} €
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

            <p className={person.isReduced ? "text-orange-300 " : ""}>
              {person.isReduced ? (
                <Tooltip title={`prix réduit`}>
                  {person.price_applicable} €
                </Tooltip>
              ) : (
                <>{person.price_applicable} €</>
              )}
            </p>

            <span className="font-bold text-xl"> -&gt; </span>
            <p>
              {person.size} cm | {person.weight}kg
            </p>
            {!IsCanceled && (
              <DeleteButton
                title="Retirer"
                onClick={() => removePerson(index)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
    </Modal>
  );
}


