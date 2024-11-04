import React from 'react'

/* components */
import {ItemCard , ItemCardHeader , ItemCardInner} from '@/components'

/* types */
import { IEmailTemplate } from '@/types'

type Props = {
    data: IEmailTemplate
}

export default function EmailCard({data}: Props) {
  return (
    <ItemCard className='w-full'>
        <ItemCardHeader>

            <h3>{data.scenario}</h3>
        </ItemCardHeader>
        <ItemCardInner>
            <p>{data.subject}</p>
            <p>{data.body}</p>
        </ItemCardInner>
    </ItemCard>
  )
}