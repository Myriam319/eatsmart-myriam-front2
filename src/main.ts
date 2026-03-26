import './style.css'

interface Article {
    id: number;
    nom: string;
    description: string;
    prix: number;
}

let panier: Article[] = [];

async function fetchArticle(): Promise<Article[]> {
     const res = await fetch('http://localhost/myriam-api-eatsmart/articles');
     return await res.json();
}

function renduPanier() {
    const cartItemsDiv = document.querySelector<HTMLDivElement>('#cart-items');

    if (cartItemsDiv) {
        // Si le panier est vide, on laisse le message par défaut
        if (panier.length === 0) {
            cartItemsDiv.innerHTML = `<p>Votre panier est vide</p>`;
            return;
        }

        // On génère uniquement la liste des noms et prix
        cartItemsDiv.innerHTML = panier.map(item => `
            <div class="cart-item">
                <span>${item.nom}</span>
                <strong>${item.prix} €</strong>
            </div>
        `).join('');
    }
}

async function init() {
    const articles = await fetchArticle();
    const appDiv = document.querySelector<HTMLDivElement>('#app');

    if (appDiv) {
        appDiv.innerHTML = articles.map(c => {
            // SOLUTION : On cherche l'ID même si l'API l'appelle id_article ou ID
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

    const tousLesBoutons = document.querySelectorAll<HTMLButtonElement>('.btn-order');

    tousLesBoutons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            // On utilise parseInt pour transformer le texte du bouton en vrai nombre
            const idPlat = parseInt(btn.dataset.id || "0", 10);
            const nomPlat = btn.dataset.nom || "";
            const descPlat = btn.dataset.description || "";
            const prixPlat = Number(btn.dataset.prix) || 0;

            panier.push({
                id: idPlat,
                nom: nomPlat,
                description: descPlat,
                prix: prixPlat
            });
            renduPanier();
            console.log(`Bouton n°${index} cliqué ! Plat = ${nomPlat}`);
            console.log("Panier =", [...panier]); 
            
        });
    });
}

init();