import './TextInformation.sass'
import useInquiry from '../../hooks/useInquiry'
import DateCounter from './DateCounter'
import DataCounter from "./DataCounter"
import { useEffect, useContext, useRef, MutableRefObject } from 'react'
import { QueuesContext } from '../../contexts/queuesContext'
import usePrevious from '../../hooks/usePrevious'

interface Prop {
    isMobile: boolean
}

export default function TextInformation({ isMobile }: Prop) {
    const { counts } = useInquiry()
    const { isAllDone } = useContext( QueuesContext )
    const prev = usePrevious<boolean>( isAllDone )
    const classes = [
        'text-information',
        ( isMobile && 'is-mobile' )
    ].join( ' ' )
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
        <aside className={ classes }>
            <DateCounter />
            <div className="data-counters">{ dataCounters }</div>
        </aside>
    )
}