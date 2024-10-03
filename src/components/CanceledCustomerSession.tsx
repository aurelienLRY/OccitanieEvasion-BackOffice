import React, { useState } from "react";
/*Components*/
import Modal from "@/components/Modal";
import { Spin } from "antd";
import ToasterAction from "@/components/ToasterAction";

/*Actions*/
import { CANCEL_CUSTOMER_SESSION } from "@/libs/actions";
/*store*/
import { useSessionWithDetails } from "@/context/store";

/*Types*/
import { ISessionWithDetails, ICustomerSession } from "@/types";

/*Icons*/
import { MdOutlineEmail, MdPeopleAlt } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";


type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: ISessionWithDetails;
};

export default function CanceledCustomerSession({
  isOpen,
  onClose,
  data,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-6">
        <div className=" text-center text-white">
          <h3 className="text-2xl font-bold">Panneau d&apos;annulation</h3>
          <p className="text-sm">
            Attention, lors du processus d&apos;annulation, les clients sont
            notifiés par email !
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {data.customerSessions.map((customer) => (
            <CustomerCanceled key={customer._id} customer={customer} />
          ))}
        </div>
      </div>
    </Modal>
  );
}

function CustomerCanceled({ customer }: { customer: ICustomerSession }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateSessionWithDetails } = useSessionWithDetails();

  const handleCancel = async () => {
    window.confirm(`Voulez-vous annuler ${customer.first_names} ${customer.last_name} ?`);
    {
      setIsSubmitting(true);
  
        const result = await CANCEL_CUSTOMER_SESSION(customer._id);
        if (result.success) {
          if (result.data) {
            updateSessionWithDetails(result.data);
          }
        } 
        ToasterAction({result, defaultMessage: 'Client annulé avec succès'})
        setIsSubmitting(false);
      
    }
  };

  const displayStatus = {
    Validated: { icon: "👍", name: "Validé" },
    Canceled: { icon: "🖕", name: "Annulé" },
    Waiting: { icon: "🕒", name: "En attente" },
  };

  return (
    <div
      className={`flex relative flex-col gap-2 p-2 rounded-md bg-sky-500/10 shadow-inner shadow-sky-500/20 transition-all duration-300 text-white ${
        customer.status === "Canceled" && "opacity-60"
      }`}
    >
      {customer.status === "Canceled" && (
        <div className="absolute top-2/3 right-1/2 transform translate-x-1/2 -translate-y-1/2">
          <p className="text-2xl text-center">
            {displayStatus[customer.status].icon}
          </p>
          <p className="text-4xl text-center">
            {displayStatus[customer.status].name}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-center">
          {customer.first_names} {customer.last_name}
        </h3>
      </div>

      <div
        className={`	flex flex-col md:flex-row gap-4 md:gap-2 items-center justify-between ${
          customer.status === "Canceled" ? "opacity-20" : ""
        }`}
      >
        <div className="flex flex-col gap-1 ">
          <p className="  inline-flex items-center gap-1">
            <MdOutlineEmail className="text-gray-400 mr-1 " /> {customer.email}
          </p>
          <p className=" inline-flex items-center gap-1">
            <FaPhoneAlt className="text-gray-400 mr-1" /> {customer.phone}
          </p>
          <p className="  inline-flex items-center gap-1">
            <MdPeopleAlt className="text-gray-400 mr-1 " />{" "}
            {customer.people_list.length} personnes
          </p>
        </div>
        {customer.status !== "Canceled" && (
          <button
            onClick={handleCancel}
            className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition-all duration-300 min-w-[100px] min-h-[40px] flex items-center justify-center "
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spin size="small" /> : "Annuler"}
          </button>
        )}
      </div>
    </div>
  );
}
