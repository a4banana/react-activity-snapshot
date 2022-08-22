import './TextInformation.sass'
import useInquiry from '../../hooks/useInquiry'
import DateCounter from './DateCounter'
import DataCounter from "./DataCounter"
import { useEffect, useContext, useRef, MutableRefObject } from 'react'
import { QueuesContext } from '../../contexts/queuesContext'
import usePrevious from '../../hooks/usePrevious'

export default function TextInformation() {
    const { counts } = useInquiry()
    const { isAllDone } = useContext( QueuesContext )
    const prev = usePrevious<boolean>( isAllDone )
    const countsRef: MutableRefObject<InquiryCount> = useRef({
        inquiries: 0,
        sellers: 0,
        buyers: 0,
        products: 0
    })
    
    useEffect(() => {
        if ( prev === false && isAllDone ) {
            countsRef.current = counts
        }
    }, [ isAllDone ])

    const dataCounters = Object.entries( countsRef.current ).map(([ key, val ], index ) => {
        return <DataCounter key={ index } label={ key } value={ val } duration={ key === 'inquiries' ? 3000 : 2000 } />
    })

    return (
        <aside className="text-information">
            <DateCounter />
            { dataCounters }
        </aside>
    )
}