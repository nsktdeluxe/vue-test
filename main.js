var app = new Vue ({
    el: '#app',
    data: {
        brand: "Vue Mastery",
        product: "Socks",
        selectedVariant: 0,
        altText : "A pair of socks",
        inventory: 100,
        onSale: true,
        details: ["80% Cotton", "20% polyester", "Gender-neutral"],
        variants: [{
            variantId: 2234,
            variantColor: "green",
            variantImage: "./assets/vmSocks-green.jpeg",
            variantQuantity: 100
        },
        {
            variantId: 2235,
            variantColor: "blue",
            variantImage: "./assets/vmSocks-blue.jpeg",
            variantQuantity: 0
        }],
        sizes: ["38", "39", "40", "41"],
        cart: 0
    },
    methods: {
        addToCart(){
            this.cart +=1
        },
        removeFromCart() {
            this.cart -= 1
        },
        UpdateProduct(index){
            this.selectedVariant=index
            console.log(index)
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            // 内部では、バリアントの配列である this.variants を返し、
            // 0または1のいずれかである selectedVariant を使用してその配列の最初または2番目の要素をターゲットにし、
            // 次にドット表記を使用してその画像をターゲットにしている。
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale() {
            if(this.onSale){
                return this.brand + ' ' + this.product + " " + "are on sale!"
            }
                return this.brand + ' ' + this.product  + " " + "are not on sale"
        }
    }
})