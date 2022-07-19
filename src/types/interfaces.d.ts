enum CycleProperties {
    Speed = 8000,  // ms
    Period = 7  // day
}

type Product = {
    id: number // productId // Optional for only dev
    name: string // productName
    image: string // img src // Optional for only dev
}

interface IProduct extends Product {
    index: number // index of product array
    count: number // count of inquiry
    selected: boolean // select bool for interaction
    disabled: boolean
}

// inquiry by count / or specific date
type Inquiry = {
    buyer: string
    seller: string
    product: Product
    createdAt: Date
}

interface InquiryData {
    inquiries: number
    sellers: number
    buyers: number
    products: number
}

type BuyerInquirySellerForWorldMapList = {
	inquiries: Array<BuyerInquirySellerForWorldMapType>
	count: string
	cursorDate: Date
}

type BuyerInquirySellerForWorldMapType = {
	id: string
	sellerCountry: string
	buyerCountry: string
	product: Product
	createdAt: Date
}

// for composables/useComponentsReady
type Queue = {
    key: string
    isDone: boolean
}

type QueueCollection = Array<Queue>
 
// for composables/useCountryData

type InquirySide = 'buyer' | 'seller'

type GeoPosition = {
    lat: number
    lng: number
    alt?: number
}

type CountryData = {
    iso_a2: string
    name: string
    position: GeoPosition
    selected: boolean
    disabled: boolean
}

type CountryDataCollection = Array<CountryData>

type InquiryCount = {
	inquiries: number
	buyers: number
	sellers: number
	products: number
}

interface IInquiryDataStore {
	inquiries: Array<BuyerInquirySellerForWorldMapType>
	counts: InquiryCount
	cursorDate: string | null
	selectedCountry: CountryData | null
	selectedProduct: IProduct | null
    selectBase: 'country' | 'product' | null
}