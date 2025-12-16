class ProductWishlist extends HTMLElement {
  constructor() {
    super();
    this.id = this.getAttribute('data-productID');
    this.checkActiveWishlist();
    this.addEventListener('click', this.onEventWishlist.bind(this));
  }

  onEventWishlist() {
    if (wishList.indexOf(this.id) > -1) {
      this.classList.remove('wishlist_added');
      const index = wishList.indexOf(this.id);
      wishList.splice(index, 1);
      wishList
      this.updateWishlistCount();
    } else {
      this.classList.add('wishlist_added');
      wishList.push(this.id);
      this.updateWishlistCount();
    }
    localStorage.setItem('wishList', JSON.stringify(wishList.slice(0, 20)));
  }

  checkActiveWishlist() {
    if (wishList.indexOf(this.id) > -1) {
      this.classList.add('wishlist_added');
      this.updateWishlistCount();
    } else {
      this.classList.remove('wishlist_added');
      this.updateWishlistCount();
    }
  }
  updateWishlistCount() {
    var count_el = document.getElementById("wishlist-count");
    var count = wishList.length;
    count_el.innerHTML = count;
  }
}

customElements.define('wish-list-icon', ProductWishlist);

class ProductWishlistTemplate extends HTMLElement {
  constructor() {
    super();
  }

  get searchQueryString() {
    return wishList.map((item) => "id:" + item).join(" OR ");
  }

  get sectionId() {
    return this.getAttribute("section-id");
  }

  async connectedCallback() {
    if (this.searchQueryString === "") {
      return;
    }
    const response = await fetch(`${window.routes.urlSearch}?type=product&q=${this.searchQueryString}&section_id=${this.sectionId}`);
    const div = document.createElement("div");
    div.innerHTML = await response.text();
    const wishlistProductsElement = div.querySelector("product-wishlist-template");
    if (wishlistProductsElement.hasChildNodes()) {
      this.innerHTML = wishlistProductsElement.innerHTML;
    }
  }
}
customElements.define('product-wishlist-template', ProductWishlistTemplate);