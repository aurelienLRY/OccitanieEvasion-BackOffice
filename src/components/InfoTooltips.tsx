import React from 'react'
import { Tooltip } from 'antd'
import { BsExclamationCircle } from "react-icons/bs";


type Props = {
    title: string
}

const InfoTooltips = ({title}: Props) => {
  return (
<Tooltip title={title}>
    <BsExclamationCircle className='text-sky-500 text-lg' />
</Tooltip>
  )
}

export default InfoTooltips