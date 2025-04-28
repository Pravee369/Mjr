import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { makeAutoObservable } from "mobx";
import "bootstrap/dist/css/bootstrap.min.css";

// Store
class CartStore {
  cart = [];
  currentPage = "";
  pharmacies = [];
  cartItems = [];
  isPharmacy = false;
  filteredPharmacies = [];
  searchQuery = "";
  selectedPharmacyId = 0;
  searchFilterPlaceholder = "Search by pharmacy name or location...";
  isPharmacyStore = false;
  medicines=[]
  filteredMedicines=[]

  constructor() {
    makeAutoObservable(this);
  }

  addToCart(medicine) {
    const item = this.cart.find((item) => item.name === medicine.name);
    if (item) {
      item.quantity += 1;
    } else {
      this.cart.push({
        ...medicine,
        quantity: 1,
        pharmacyId: this.selectedPharmacyId,
      });
    }
  }

  increaseQuantity(name) {
    const item = this.cart.find((item) => item.name === name);
    if (item) {
      item.quantity += 1;
    }
  }

  decreaseQuantity(name) {
    const item = this.cart.find((item) => item.name === name);
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        this.removeFromCart(name);
      }
    }
  }

  removeFromCart(name) {
    this.cart = this.cart.filter((item) => item.name !== name);
  }
  clearCart() {
    this.cart = [];
  }
}
const pharmaStore = new CartStore();
export { pharmaStore };
