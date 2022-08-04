import './ProductCard.sass'
import selectedIcon from '../../assets/checked.svg'
import { MouseEvent, useState } from 'react'

interface Props {
    product: IProduct
    clickHandler: ( event: MouseEvent<HTMLLIElement>, id: number ) => void
}

export default function ProductCard({ product: { id, image, name, count, selected, disabled }, clickHandler }: Props ) {
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
        <li className="product-card"
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
        </li>
    )
}