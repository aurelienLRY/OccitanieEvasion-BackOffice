import React from "react";
import { ICustomerSession } from "@/libs/database/models/CustomerSession";
import { Tooltip } from "antd";

/*icons*/
import { MdOutlineEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { MdPeopleAlt } from "react-icons/md";


const CustomerSession = ({ customer }: { customer: ICustomerSession }) => {
  return (
    <div className="border border-gray-200 rounded-md p-2">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <p className="text-sm font-bold">
              {customer.first_names} {customer.last_name}
            </p>
            <Tooltip title={customer.status === "validated" ? "Validé" : "Annulé"}>
              <span className="text-lg cursor-pointer">{customer.status === "validated" ? "👍" : "🖕"}</span>
            </Tooltip>
          </div>

          <p className="text-xs  inline-flex items-center gap-1">
            <MdOutlineEmail className="text-gray-500" /> {customer.email}
          </p>
          <p className="text-xs  inline-flex items-center gap-1">
            <FaPhoneAlt className="text-gray-500" /> {customer.phone}
          </p>
          <p className="text-xs  inline-flex items-center gap-1"><MdPeopleAlt className="text-gray-500" />  {customer.people_list.length} personnes</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerSession;
