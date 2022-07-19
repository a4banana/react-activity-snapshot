import { useCallback, useEffect, useState } from "react";

function useComponentsReady(): [ boolean, QueueCollection, { initQueue: () => void, addQueue: ( key: string ) => void, endQueue: ( key: string ) => void } ] {
    const [ queues, setQueues ] = useState<QueueCollection>([])
    const [ isQueueEnd, setIsQueueEnd ] = useState<boolean>( false )
    
    const isAllQueueDone = () => queues.every( q => q.isDone === true )
    const hasQueue = ( key: string ): boolean => queues.some( q => q.key === key )

    const initQueue = useCallback(() => {
        setIsQueueEnd( false )
        setQueues([])
    }, [ queues, isQueueEnd ])
    
    const endQueue = useCallback(( key: string ) => {
        if ( !hasQueue( key ) ) console.error( `"${ key }" has never been queued.` )
        setQueues( qs => qs.map( q => ( q.key === key ) ? { ...q, isDone: true } : q ))
        console.log( key + ' has done.' )

        if ( isAllQueueDone() ) setIsQueueEnd( true )
    }, [])

    const addQueue = useCallback(( key: string ) => {
        const queue = { key, isDone: false };
        setQueues( qs => [ ...qs, queue ] )
        console.log( key + ' is added on Queues' )
    }, [])

    // async function waitForDoneQueues(): Promise<boolean> {
    //     return new Promise( resolve => {
    //         useEffect(() => {
    //             console.log( isQueueEnd )
    //             resolve( isQueueEnd )
    //         }, [ isQueueEnd ])
    //     })
    // }

    return [
        isQueueEnd, queues, {
            initQueue, addQueue, endQueue
        }
         // waitForDoneQueues
    ]
}

export default useComponentsReady