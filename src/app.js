let app = Vue.createApp({
  data() {
    return {
      showSideBar: false,
      inventory: [],
      cart: {},
    };
  },
  computed: {
    totalQuantity() {
      const isEmpty =
        Object.keys(this.cart).length === 0 && this.cart.constructor === Object;
      return isEmpty
        ? 0
        : Object.values(this.cart).reduce((acc, curr) => acc + curr, 0);
    },
  },
  methods: {
    addToCart(name, index) {
      if (!this.cart[name]) this.cart[name] = 0;
      this.cart[name] += this.inventory[index].quantity;
      this.inventory[index].quantity = 0;
    },
    toggleSideBar() {
      this.showSideBar = !this.showSideBar;
    },
    removeItem(name) {
      delete this.cart[name];
    },
  },
  async mounted() {
    const res = await fetch("./food.json");
    const data = await res.json();
    this.inventory = data;
  },
});
app.component("sidebar", {
  props: ["toggle", "cart", "inventory", "remove"],
  computed: {},
  methods: {
    calculateTotal() {
      //[key,value]
      const total = Object.entries(this.cart).reduce((acc, curr, index) => {
        return acc + curr[1] * this.getPrice(curr[0]);
      }, 0);
      return total.toFixed(2);
    },
    getPrice(name) {
      return this.inventory.find((item) => item.name === name).price.USD;
    },
  },
  template: `
  <aside class="cart-container">
  <div class="cart">
    <h1 class="cart-title spread">
      <span>
        Cart
        <i class="icofont-cart-alt icofont-1x"></i>
      </span>
      <button class="cart-close" @click="toggle">&times;</button>
    </h1>

    <div class="cart-body">
      <table class="cart-table">
        <thead>
          <tr>
            <th><span class="sr-only">Product Image</span></th>
            <th>Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
            <th><span class="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(quantity, key, index) in cart" :key="index">
            <td><i class="icofont-carrot icofont-3x"></i></td>
            <td>{{ key }}</td>
            <td>\${{ getPrice(key) }}</td>
            <td class="center">{{quantity}}</td>
            <td>\${{(quantity * getPrice(key)).toFixed(2)}}</td>
            <td class="center">
              <button class="btn btn-light cart-remove"  @click="remove(key)">&times;</button>
            </td>
          </tr>
        </tbody>
      </table>

      <p class="center" v-if="!Object.keys(cart).length"><em>No items in cart</em></p>
      <div class="spread">
        <span><strong>Total:</strong> \${{calculateTotal()}}</span>
        <button class="btn btn-light">Checkout</button>
      </div>
    </div>
  </div>
</aside>
  `,
});
app.mount("#app");
