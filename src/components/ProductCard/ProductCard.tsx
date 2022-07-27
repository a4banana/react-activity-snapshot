import './ProductCard.sass'


export default function ProductCard() {
    
    
    return (
        <li className="before-mount">
            <div className="container">
                <div className="thumail-area">
                    <img src="" alt="" />
                </div>
                <div className="content-area">
                    <h1 className="product-name"></h1>
                    <p className="desc"></p>
                </div>
                <div className="action-area">
                    <img src="" alt="" />
                </div>
            </div>
        </li>
    )
}