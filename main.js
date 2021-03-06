var eventBus = new Vue();

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
            <info-tabs :shipping="shipping" :details="details"></info-tabs>
            <p v-if="onSale">{{ sale }}</p>
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
        <product-tabs :reviews="reviews"></product-tabs>
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
      // ???????????????????????????????????????????????? this.variants ????????????
      // 0?????????1???????????????????????? selectedVariant ?????????????????????????????????????????????2??????????????????????????????????????????
      // ????????????????????????????????????????????????????????????????????????????????????
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
    mounted() {
      eventBus.$on("review-submitted", (productReview) => {
        this.reviews.push(productReview);
      });
    },
  },
});
/**
 * product-review ?????????????????????
 * nested within our `product` component.
 */
Vue.component("product-review", {
  template: `
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
        <select class="rating" v-model.number="rating">
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
        eventBus.$emit("review-submitted", productReview);
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
/**
 * product-tabs (???????????????????????????)
 * ??????????????? submit ???????????????????????? data ????????????????????? Reviews ???????????????????????????
 */
Vue.component("product-tabs", {
  props: {
    reviews: {
      type: Array,
      required: true,
    },
  },
  template: `
    <div>
      <div>
        <span class="tab"
            :class="{ activeTab: selectedTab === tab }"
            v-for="(tab,index) in tabs" 
            :key="index"
            @click="selectedTab = tab"
            >{{ tab }}</span>
      </div>
      <div v-show="selectedTab === 'Reviews'">
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul v-else>
          <li v-for="review in reviews">
            <p>{{ review.name }}</p>
            <p>Rating: {{ review.rating }}</p>
            <p>{{ review.review }}</p>
            <p>Recommend: {{ review.recommend }}</p>
          </li>
        </ul>
      </div>
      <div v-show="selectedTab === 'Make a Review'">
        <product-review></product-review>
      </div>
    </div>
    `,
  data() {
    return {
      tabs: ["Reviews", "Make a Review"],
      selectedTab: "Reviews",
    };
  },
});
/**
 * info-tabs (Shipping, Details)
 * ?????? product ????????????????????????????????? info-tabs ?????????????????????
 */
Vue.component("info-tabs", {
  props: {
    shipping: {
      required: true,
    },
    details: {
      type: Array,
      required: true,
    },
    template: `
    <div>
      <ul>
        <span class="tab"
          :class="{ activeTab: selectedTab === tab }"
          v-for="(tab,index) in tabs" 
          :key="tab"
          @click="selectedTab = tab"
        >{{ tab }}</span>
      </ul>
      <div v-show="selectedTab === 'Shipping'">
        <p>Shipping: {{ shipping }}</p>
      </div>
      <div v-show="selectedTab === 'Details'">
        <ul>
          <li v-for="detail in details">{{ detail }}</li>
        </ul>
      </div>
    </div>
    `,
    data() {
      return {
        tabs: ["Shipping", "Details"],
        selectedTab: "Shipping",
      };
    },
  },
});
/** ??????????????????????????? */
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
      // ???solution
      // ????????????????????????
      for (var i = this.cart.length - 1; i >= 0; i--) {
        if (this.cart[i] === id) {
          this.cart.splice(i, 1);
        }
      }
    },
  },
});
