import './style.css'

// Définition de la structure d'un article (TypeScript)
interface Article {
    id: number;
    nom: string;
    description: string;
    prix: number;
}

// Initialisation du panier vide (stocké en mémoire pendant la session)
let panier: Article[] = [];

/**
 * Récupère la liste des articles depuis l'API PHP
 */
async function fetchArticle(): Promise<Article[]> {
     const res = await fetch('http://localhost/myriam-api-eatsmart/articles');
     return await res.json();
}

/**
 * Met à jour l'affichage visuel du panier (Zone de droite)
 */
function renduPanier() {
    // On cible les zones d'affichage dans le HTML
    const cartItemsDiv = document.querySelector<HTMLDivElement>('#cart-items');
    const totalPrixSpan = document.querySelector<HTMLSpanElement>('#total-prix');

    if (cartItemsDiv) {
        // 1. Si le panier est vide, on affiche un message et on remet le total à 0
        if (panier.length === 0) {
            cartItemsDiv.innerHTML = `<p>Votre panier est vide</p>`;
            if (totalPrixSpan) totalPrixSpan.innerText = "0.00";
            return;
        }

        // 2. Si on a des articles, on génère une ligne HTML pour chaque plat
        cartItemsDiv.innerHTML = panier.map(item => `
            <div class="cart-item">
                <span>${item.nom}</span>
                <strong>${item.prix.toFixed(2)} €</strong>
            </div>
        `).join('');

        // 3. Calcul et affichage du prix TOTAL
        if (totalPrixSpan) {
            // .reduce additionne tous les prix du tableau panier
            const total = panier.reduce((acc, item) => acc + item.prix, 0);
            // On force l'affichage à 2 décimales (ex: 15.50 €)
            totalPrixSpan.innerText = total.toFixed(2);
        }
    }
}

/**
 * Initialisation de l'application
 */
async function init() {
    // On attend de recevoir les articles de l'API
    const articles = await fetchArticle();
    const appDiv = document.querySelector<HTMLDivElement>('#app');

    if (appDiv) {
        // On génère les cartes de plats dynamiquement dans la grille principale
        appDiv.innerHTML = articles.map(c => {
            // Sécurité : récupère l'ID même si le nom de la clé varie (id ou id_article)
            const trueId = c.id || (c as any).id_article || (c as any).ID || 0;

            return `
                <div class="card">
                    <h3>${c.nom}</h3>
                    <p>${c.description}</p>
                    <p><strong>Prix : ${c.prix} €</strong></p>
                    <button class="btn-order" 
                        data-id="${trueId}" 
                        data-nom="${c.nom}" 
                        data-prix="${c.prix}"
                        data-description="${c.description}">
                        Ajouter
                    </button>
                </div>
            `;
        }).join('');
    }

    // On sélectionne tous les boutons "Ajouter" créés juste au-dessus
    const tousLesBoutons = document.querySelectorAll<HTMLButtonElement>('.btn-order');

    // On ajoute un écouteur d'événement (clic) sur chaque bouton
    tousLesBoutons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            // On récupère les données stockées dans les attributs "data-" du bouton
            const idPlat = parseInt(btn.dataset.id || "0", 10);
            const nomPlat = btn.dataset.nom || "";
            const descPlat = btn.dataset.description || "";
            const prixPlat = Number(btn.dataset.prix) || 0;

            // On ajoute le nouveau plat dans le tableau panier
            panier.push({
                id: idPlat,
                nom: nomPlat,
                description: descPlat,
                prix: prixPlat
            });

            // On rafraîchit l'affichage du panier à droite
            renduPanier();
            
            // Debugging console
            console.log(`Bouton n°${index} cliqué ! Plat = ${nomPlat}`);
            console.log("Panier =", [...panier]); 
        });
    });
}

// Lancement de l'app
init();