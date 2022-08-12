import './ProductCard.sass'
import selectedIcon from '../../assets/checked.svg'
import { MouseEvent, useState } from 'react'
import styled, { keyframes } from 'styled-components'

interface Props {
    product: IProduct
    index: number
    clickHandler: ( event: MouseEvent<HTMLLIElement>, id: number ) => void
}

export default function ProductCard({ product: { id, image, name, count, selected, disabled }, index, clickHandler }: Props ) {
    const [ isPressing, setIsPressing ] = useState( false )
    const [ isBlank, setIsBlank ] = useState( false )
    const desc: string = ( count > 1 )
        ? `${ count } inquiries were received by suppliers`
        : 'A Inquiry was received by a supplier';
    
    const classes = [
        'product-card-content',
        selected && 'is-selected',
        isPressing && 'is-pressing',
        disabled && 'is-disabled',
        isBlank && 'blank-card'
    ].join( ' ' )

    function cardClickHandler( event: MouseEvent<HTMLLIElement> ): void {
        if ( !disabled ) clickHandler( event, id )
    }

    function cardPressing(): void {
        if ( !disabled ) setIsPressing( true )
    }

    function cardRelease(): void {
        setIsPressing( false )
    }

    return (
        <Container index={ index } className="product-card"
            onClick={ cardClickHandler }
            onMouseDown={ cardPressing }
            onMouseUp={ cardRelease }
            >
            <div className={ classes }>
                <div className="container">
                    <div className="thumbnail-area">
                        <img src={ image } alt={ name } />
                    </div>
                    <div className="content-area">
                        <h1 className="product-name">{ name }</h1>
                        <p className="desc">{ desc }</p>
                    </div>
                    <div className="action-area">
                        <img src={ selectedIcon } alt="" />
                    </div>
                </div>
            </div>
        </Container>
    )
}

const appearing = keyframes`
    from {
        transform: translateY( 100% );
        opacity: 0;
    }
    to {
        transfrom: translateY( 0 );
        opacity: 1;
    }
`

const Container = styled.li<{ index: number }>`
    animation: ${ appearing } .66s cubic-bezier(0.250, 0.460, 0.450, 0.940) ${ props => props.index * .04 }s;
`