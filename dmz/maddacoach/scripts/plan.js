/***
 * @file plan.js
 * @author Niccolò Segato
 * @description This script handles all the logic of the plan page
 */

/**
 * Function to toggle the visibility of the plan card content when a plan card is clicked.
 * @param {HTMLElement} this A reference to the clicked plan card element.
 */
function togglePlanCard(header) {
    let card = header.closest(".plan-card");
    let openedCard = document.getElementById("plan-card-opened");
    if (openedCard && openedCard !== card) {
        // Rimuovo l'ID "plan-card-opened" dalla card attualmente aperta
        openedCard.removeAttribute("id");
        // Nascondo tutti i .plan-card-content
        let allContents = document.querySelectorAll(".plan-card-content");
        allContents.forEach(content => {
            content.style.display = "none";
        });
        // Applico l'ID "plan-card-opened" alla nuova card cliccata
        card.setAttribute("id", "plan-card-opened");
        // Mostro il contenuto della nuova card cliccata
        let content = card.querySelector(".plan-card-content");
        if (content) {
            content.style.display = "block";
        }
    }
    else {
        // Se la card cliccata è già aperta, chiudo la card
        if (openedCard === card) {
            card.removeAttribute("id");
            let content = card.querySelector(".plan-card-content");
            if (content) {
                content.style.display = "none";
            }
        }
        else {
            // Se nessuna card è aperta, apro la card cliccata
            card.setAttribute("id", "plan-card-opened");
            let content = card.querySelector(".plan-card-content");
            if (content) {
                content.style.display = "block";
            }
        }
    }
}