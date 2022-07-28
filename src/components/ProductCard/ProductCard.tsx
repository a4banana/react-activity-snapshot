import './ProductCard.sass'
import selectedIcon from '../../assets/checked.svg'
import { useState } from 'react'

interface Props {
    product: IProduct
    clickHandler: ( event: any, id: number ) => void
}

export default function ProductCard({ product: { id, image, name, index, count, selected, disabled }, clickHandler }: Props ) {
    // unused prop: index
    const [ isPressing, setIsPressing ] = useState( false )
    const [ isBlank, setIsBlank ] = useState( false )
    const desc: string = ( count > 1 )
        ? `${ count } inquiries were received by suppliers`
        : 'A Inquiry was received by a supplier';
    
    const classes = [
        'product-card-content',
        selected ? 'is-selected' : '',
        isPressing ? 'is-pressing' : '',
        disabled ? 'is-disabled' : '',
        isBlank ? 'blank-card' : ''
    ].join( ' ' )
    
    function cardClickHandler( event: any ) {
        clickHandler( event, id )
    }

    function cardPressing() {
        setIsPressing( true )
    }

    function cardRelease() {
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