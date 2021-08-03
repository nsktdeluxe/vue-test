var app = new Vue ({
    el: '#app',
    data: {
        product: "Socks",
        image: "./assets/vmSocks-green.jpeg",
        altText : "A pair of socks",
        inventory: 100,
        inStock: false,
        onSale: true,
        details: ["80% Cotton", "20% polyester", "Gender-neutral"],
        variants: [{
            variantId: 2234,
            variantColor: "green",
            variantImage: "./assets/vmSocks-green.jpeg",
        },
        {
            variantId: 2235,
            variantColor: "blue",
            variantImage: "./assets/vmSocks-blue.jpeg",
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
        UpdateProduct(variantImage){
            this.image=variantImage
        }
    }
})