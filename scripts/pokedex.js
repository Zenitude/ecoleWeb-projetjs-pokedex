/* Variables */

    const form = document.querySelector('.pokedex-form');
    const inputRecherche = document.querySelector('#recherche');
    const labelRecherche = document.querySelector('.label-recherche');
    const casesPokemon = document.querySelector('.cases-container');
    const chargement = document.querySelector('.loader');
    let listeMaxPokedex = 151;
    let tousLesPkmn = [];
    let pkmnListeFinale = [];

/* Animation label */

    inputRecherche.addEventListener('input', () =>
    {
        if(inputRecherche.value !== "")
        {
            form.classList.add('active-input');
        }
        else if(inputRecherche.value === "")
        {
            form.classList.remove('active-input');
        }

    });

/* Affichage des pokémons */

    function afficherPokemon()
    {
        fetch(`https://pokeapi.co/api/v2/pokemon?limit=${listeMaxPokedex}`)
            .then(reponse => reponse.json())
            .then(donnees =>
            {
                recupererInfosPkmn(donnees);
            });
    }

    afficherPokemon();
    
/* Récupérer données des pokémons */

    function recupererInfosPkmn(infos)
    {
        infos.results.forEach(pokemon => 
            {
                let pkmnComplet = {};
                let url = pokemon.url;
                let nom = pokemon.name;

                /* Récupérer id, image et type */
                
                    fetch(url)
                        .then(reponse => reponse.json())
                        .then(donnees =>
                        {
                            /* Récupérer l'id*/

                                    pkmnComplet.id = donnees.id;
                                
                            /*Récupérer image */

                                pkmnComplet.image = donnees.sprites.front_default;

                            /* Récupérer type(s)*/

                                if(donnees.types.length < 2)
                                {
                                    pkmnComplet.type = [donnees.types[0].type.name];
                                }
                                else
                                {
                                    pkmnComplet.type = [donnees.types[0].type.name,donnees.types[1].type.name];
                                }

                            /* Récupérer nom français */

                                fetch(`https://pokeapi.co/api/v2/pokemon-species/${nom}/`)
                                    .then(reponse => reponse.json())
                                    .then(donnees =>
                                    {
                                        pkmnComplet.nom = donnees.names[4].name;
                                        tousLesPkmn.push(pkmnComplet);
                                        
                                        if(tousLesPkmn.length === listeMaxPokedex)
                                        {
                                            pkmnListeFinale = tousLesPkmn.sort((a, b) => 
                                            {
                                                return a.id - b.id;
                                            }).slice(0,21);

                                            casePkmn(pkmnListeFinale);

                                            chargement.style.display = "none";
                                        }
                                    });
                        });  
            });    
    }

/* Couleurs types */

    const couleurType =
    {
        grass: '#78c850',
        ground: '#E2BF65',
        dragon: '#6F35FC',
        fire: '#F58271',
        electric: '#F7D02C',
        fairy: '#D685AD',
        poison: '#966DA3',
        bug: '#B3F594',
        water: '#6390F0',
        normal: '#D9D5D8',
        psychic: '#F95587',
        flying: '#A98FF3',
        fighting: '#C25956',
        rock: '#B6A136',
        ghost: '#735797',
        ice: '#96D9D6',
        steel: 'silver'
    };

/* Case Pokémon  */

    function casePkmn(infosPkmn)
    {
        for(let i = 0; i < infosPkmn.length; i++)
        {
            const pkmn = document.createElement('div');
            pkmn.classList.add('pokemon');

            let premierType;
            let secondType;
                    
            if(infosPkmn[i].type.length < 2)
            {
                premierType = couleurType[infosPkmn[i].type[0]];
                pkmn.style.background = `${premierType}`;
            }
            else
            {
                premierType = couleurType[infosPkmn[i].type[0]];
                secondType = couleurType[infosPkmn[i].type[1]];
                pkmn.style.background = `linear-gradient(37deg, ${premierType} 50%, ${secondType} 50%)`;
            }

            pkmn.innerHTML = `
            <img src="${infosPkmn[i].image}">
            <h5>${infosPkmn[i].nom}</h5>
            <p>N° ${infosPkmn[i].id}</p>`;

            casesPokemon.appendChild(pkmn); 
        }
    }

/* Scroll infini */

window.addEventListener('scroll', () =>
{
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;

    if(clientHeight + scrollTop >= scrollHeight - 30)
    {
        ajoutePkmn(6);
    }
})

let index = 21;

function ajoutePkmn(nb)
{
    if (index > 151)
    {
        return;
    }

    const ajouterPkmn = tousLesPkmn.slice(index + 1, index + nb)

    casePkmn(ajouterPkmn);
    index += nb;
}

/* Recherche */

inputRecherche.addEventListener('keyup', recherche);

function recherche()
{
    if(index < 151)
    {
        ajoutePkmn(130);
    }

    let filtre, allPkmn, valeurNom, tousLesNoms;
    filtre = inputRecherche.value.toUpperCase();
    allPkmn = document.querySelectorAll('.pokemon');
    tousLesNoms = document.querySelectorAll('.pokemon > h5');

    for(let i = 0; i < allPkmn.length; i++)
    {
        valeurNom = tousLesNoms[i].innerText;

        if(valeurNom.toUpperCase().indexOf(filtre) > -1)
        {
            allPkmn[i].style.display = "flex";
        }
        else
        {
            allPkmn[i].style.display = 'none';
        }
    }
}
