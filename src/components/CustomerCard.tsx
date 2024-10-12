/* LIBRAIRIES */
import React, { useState } from "react";
import { useSessionWithDetails } from "@/context/store";

/* ACTIONS */
import { CANCEL_CUSTOMER_SESSION } from "@/libs/actions";

/* Types */
import { ICustomerSession } from "@/types";

/* Components */
import Modal from "@/components/Modal";
import CustomerFiche from "@/components/CustomerFiche";
import { Tooltip } from "antd";
import ToasterAction from "@/components/ToasterAction";
import { ItemCard, ItemCardInner } from "@/components/ItemCard";
import { DeleteButton, DetailButton } from "@/components/Button";
import { GlobalPriceBadge, CustomerPriceBadge } from "@/components/badge";

/* Utils */
import { capitalizeFirstLetter , getCustomerStatusDisplay , customerIsCancelled, customerIsWaiting } from "@/utils";

/* Icons */
import { MdOutlineEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { MdPeopleAlt } from "react-icons/md";


/**
 * Composant CustomerCard
 * @param {ICustomerSession} customer - La session du client
 * @param {string} [className] - Classe CSS optionnelle pour le style personnalisé
 * @returns {JSX.Element} - Élément JSX représentant la carte du client
 */
const CustomerCard = ({
  customer,
  className,
  detailsCustomer
}: {
  customer: ICustomerSession;
  className?: string;
  detailsCustomer: (data : ICustomerSession) => void
}) => {


  const IsCanceled = customerIsCancelled([customer])
  const IsWaiting = customerIsWaiting([customer])
  const { updateSessionWithDetails } = useSessionWithDetails();

  const CancelCustomer = async () => {
    window.confirm("Voulez-vous annuler le client ?");
    {
      const result = await CANCEL_CUSTOMER_SESSION(customer._id);
      if (result.success) {
        if (result.data) {
          updateSessionWithDetails(result.data);
        }
      }
      ToasterAction({ result, defaultMessage: "Client annulé avec succès" });
    }
  };



  return (
  
      <ItemCard
        className={`min-w-[200px] relative ${
          IsCanceled
            ? "opacity-50"
            : IsWaiting ? "border-2 border-orange-500 shadow-orange-500 dark:shadow-orange-500": ""
        } ${className}`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-between gap-2 items-center px-1">
            <p className="text-xl font-bold">
              {customer.first_names} {customer.last_name.toUpperCase()}
            </p>
            <Tooltip title={getCustomerStatusDisplay(customer.status).name}>
              <span className="text-xl cursor-pointer">
                {getCustomerStatusDisplay(customer.status).icon}
              </span>
            </Tooltip>
          </div>

          <div className="flex flex-col gap-2 md:text-sm  ">
            <ItemCardInner className="flex flex-col  p-2 ">
              <h3 className="text-lg font-semibold text-center pb-2">
                Contact
              </h3>
              <p className="  inline-flex items-center gap-1">
                <MdOutlineEmail className="text-gray-400 mr-1 " />{" "}
                {customer.email}
              </p>
              <p className=" inline-flex items-center gap-1">
                <FaPhoneAlt className="text-gray-400 mr-1" /> {customer.phone}
              </p>
              <p className="  inline-flex items-center gap-1">
                <MdPeopleAlt className="text-gray-400 mr-1 " />{" "}
                {customer.people_list.length} personnes
              </p>
            </ItemCardInner>
            <ItemCardInner className="flex flex-col  p-2 ">
              <h3 className="text-lg font-semibold text-center pb-2">Prix</h3>
              <div className="flex  gap-2">
                <CustomerPriceBadge price={customer.price_applicable} />
                <GlobalPriceBadge price={customer.price_total} />
              </div>
            </ItemCardInner>
          </div>
          <div
            id="customer-card-footer"
            className="flex justify-end gap-4 p-1 text-slate-400"
          >
            <DetailButton onClick={()=> detailsCustomer(customer)} />
           
            {!IsCanceled && <DeleteButton onClick={CancelCustomer} />}
          </div>
        </div>
      </ItemCard>

  
  );
};

export default CustomerCard;
