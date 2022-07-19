import { useCallback, useState } from 'react';

function useTest(): [
    value: string, 
    setString: ( val: string ) => void
 ] {
    const [ value, setValue ] = useState<string>( 'hello hook' )

    const setString = useCallback(( val: string ) => {
        setValue( val )
        console.log( value )
    }, [])

    return [
        value, setString
    ]
}

export default useTest;