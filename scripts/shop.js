/**
 * shop.js
 * 
 * This script handles the functionality of the shop buttons on the shop item pages.
 * 
 * Created by Niccolò Segato
 * Copyright © 2025 Niccolò Segato. All rights reserved.
 */

/**
 * Handles the click event for shop buttons.
 */
function onShopButtonClick() {
    alert("Shop functionality is not implemented yet.");
}

document.addEventListener("DOMContentLoaded", function() {
    const shopButtons = document.querySelectorAll(".shop-button");
    shopButtons.forEach(function(button) {
        button.addEventListener("click", onShopButtonClick);
    });
});