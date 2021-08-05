Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
  },
  template: `
    <div class="product">
        <div class="product-image">
            <img :src="image" :alt="altText" />
        </div>
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p v-if="inStock">In Stock</p>
            <p v-else :class="{ lineThrough : !inStock}">Out of Stock</p>
            <p>Shipping: {{ shipping }}</p>
            <p v-if="onSale">{{ sale }}</p>
            <product-details :details="details"></product-details>
            <p>sizes:</p>
            <ul>
                <li v-for="size in sizes">{{ size }}</li>
            </ul>
            <div v-for="(variant, index) in variants" :key="variant.variantId" class="color-box"
              :style="{backgroundColor: variant.variantColor}" @mouseover="UpdateProduct(index)">
            </div>
            <div class=" flex">
                <button @click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to Cart</button>
                <!--<button @click="removeFromCart">Remove from Cart</button>-->
            </div>
        </div>
    </div>
  `,
  data() {
    return {
      brand: "Vue Mastery",
      product: "Socks",
      selectedVariant: 0,
      altText: "A pair of socks",
      onSale: true,
      details: ["80% Cotton", "20% polyester", "Gender-neutral"],
      variants: [
        {
          variantId: 2234,
          variantColor: "green",
          variantImage: "./assets/vmSocks-green.jpeg",
          variantQuantity: 100,
        },
        {
          variantId: 2235,
          variantColor: "blue",
          variantImage: "./assets/vmSocks-blue.jpeg",
          variantQuantity: 0,
        },
      ],
      sizes: ["38", "39", "40", "41"],
    };
  },
  methods: {
    addToCart() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
    },
    UpdateProduct(index) {
      this.selectedVariant = index;
      console.log(index);
    },
  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    image() {
      // 内部では、バリアントの配列である this.variants を返し、
      // 0または1のいずれかである selectedVariant を使用してその配列の最初または2番目の要素をターゲットにし、
      // 次にドット表記を使用してその画像をターゲットにしている。
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    sale() {
      if (this.onSale) {
        return this.brand + " " + this.product + " " + "are on sale!";
      }
      return this.brand + " " + this.product + " " + "are not on sale";
    },
    shipping() {
      if (this.premium) {
        return "free";
      }
      return 2.99;
    },
  },
});
Vue.component("product-details", {
  props: {
    details: {
      type: Array,
      required: true,
    },
  },
  // solution
  template: `
    <ul>
      <li v-for="detail in details">{{ detail }}</li>
    </ul>
  `,
  //私の解答(エラー)
  //   data() {
  //     return {
  //       details: ["80% Cotton", "20% polyester", "Gender-neutral"],
  //     };
  //   },
});
var app = new Vue({
  el: "#app",
  data: {
    premium: true,
    cart: [],
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    // removeFromCart() {
    //   this.cart -= 1;
    // },
  },
});
