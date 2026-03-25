// Afin de pouvoir avoir acces a mon api j'ai mis une en-tete sur le fichier index.php du dosier eatsmart-sherine

import './style.css'



interface Article {
    id: number;
    nom: string;
    description: string;
    prix: number;

}

// Fonction qui récupère les articles depuis l'api ou y'a la BDD

async function fetchArticle(): Promise<Article[]> {
    
     const res = await fetch('http://localhost/myriam-api-eatsmart/articles');
     return await res.json();
}

 
// Fonction principale avec le code qui sera afficherr
async function init() {
    console.log("Chargement des données...");

    const articles = await fetchArticle();

    // Affichage dans la console 
    console.log(articles);


    // On précise <HTMLDivElement> pour que TS connaisse les propriétés de la DIV
    const appDiv = document.querySelector<HTMLDivElement>('#app')

    // "if" est une sécutité indispensable ici
    if (appDiv) {
        appDiv.innerHTML= `
    
        ${articles.map(c => {

            // Pour chaque article on crée une carte
            return `
            <div class="card">
                <h3>${c.nom}</h2>
                <p>${c.description}</p>
                <p><strong> Prix : ${c.prix} €</strong></p>
                
            </div>`

            // Utilisation du join pour "coller" tous les éléments du tableau sans aucun séparateur 
        }).join('')
    } 

    `;
}

}
// Affichage 
init();
