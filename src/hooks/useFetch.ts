import { useState, useEffect } from "react";

export default function useFetch<T = unknown>( uri: string ): { data: T | undefined, isLoading: boolean } {
    const [ isLoading, setIsLoading ] = useState<boolean>( false )
    const [ data, setData ] = useState<T>()

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading( true )
    
            try {
                const res = await fetch( uri )
                if ( !res.ok ) throw new Error( res.statusText )
                setData( ( await res.json() ) as T )
            } catch ( err ) {
                console.error( err )
            } finally {
                setIsLoading( false )
            }
        }

        void fetchData()
        
    }, [ uri ])

    return { data, isLoading }
}