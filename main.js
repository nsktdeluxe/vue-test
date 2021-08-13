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
                <button @click="removeFromCart">Remove from Cart</button>
            </div>
        </div>
        <div>
          <h2>Reviews</h2>
          <p v-if="!reviews.length">There are no reviews yet.</p>
          <ul>
            <li v-for="(review,index) in reviews" :key="index">
              <p>{{ review.name }}</p>
              <p>Rating: {{ review.rating }}</p>
              <p>{{ review.review }}</p>
              <p>Recommend: {{ review.recommend }}</p>
            </li>
          </ul>
        </div>
        <product-review @review-submitted="addReview"></product-review>
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
      sizes: ["38", "39", "40", "41"],
      variants: [
        {
          variantId: 2234,
          variantQuantity: 150,
          variantColor: "green",
          variantImage: "./assets/vmSocks-green.jpeg",
        },
        {
          variantId: 2235,
          variantQuantity: 0,
          variantColor: "blue",
          variantImage: "./assets/vmSocks-blue.jpeg",
        },
      ],
      reviews: [],
    };
  },
  methods: {
    addToCart() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
    },
    removeFromCart() {
      this.$emit(
        "remove-from-cart",
        this.variants[this.selectedVariant].variantId
      );
    },
    addReview(productReview) {
      this.reviews.push(productReview);
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
      //return this.variants[this.selectedVariant].variantQuantity;
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
/**
 * product-details コンポーネント
 * nested within our `product` component.
 */
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
/**
 * product-review コンポーネント
 * nested within our `product` component.
 */
Vue.component("product-review", {
  template: `
    <!--<input v-model="name">-->
    <form class="review-form" @submit.prevent="onSubmit">
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
      </p>
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
      <p>
      <p>Would you recommend this product?</p>
        <label for="recommend">Yes<input type="radio" v-model="recommend" value="Yes" checked></label>
        <label for="recommend">No<input type="radio" v-model="recommend" value="No"></label>
      </p>
      <p>
        <input type="submit" value="Submit">
      </p>
    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: [],
    };
  },
  methods: {
    onSubmit() {
      this.errors = [];
      if (this.name && this.review && this.rating && this.recommend) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend,
        };
        this.$emit("review-submitted", productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommend = null;
      } else {
        if (!this.name) this.errors.push("Name required.");
        if (!this.review) this.errors.push("Review required.");
        if (!this.rating) this.errors.push("Rating required.");
        if (!this.recommend) this.errors.push("Recommend required.");
      }
    },
  },
});
/** ルートインスタンス */
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
    removeFromCart(id) {
      // this.cart.shift(id);
      // ↓solution
      // 思ってたんと違う
      for (var i = this.cart.length - 1; i >= 0; i--) {
        if (this.cart[i] === id) {
          this.cart.splice(i, 1);
        }
      }
    },
  },
});
