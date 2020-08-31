///////////////// CONSTANTES GLOBALES \\\\\\\\\\\\\\\\\\\
const GIFS_TO_SHOW = 12;
const GIPHY_ENDPOINT = 'https://api.giphy.com/v1/gifs';
const GIPHY_UPLOAD_ENDPOINT = 'https://upload.giphy.com/v1/gifs';
const GIPHY_API_KEY = 'g2kFnLPUDBP3t3dCB8XrcQl9bOIFySbN';


//////////////// VARIABLES Y LLAMADOS A FUNCIONES \\\\\\\\\\\\\\\\\\\\\

// variables para mostrar menu hamburgueza
let btn_hamburger = document.getElementById("hamburger");
let btn_close = document.getElementById("close");

btn_hamburger.addEventListener("click", showMenu);
btn_close.addEventListener("click", showMenu);


// variables para cambiar entre modo nocturno y diurno
let btn_change1 = document.getElementById("change-mode1");
let btn_change2 = document.getElementById("change-mode2");

btn_change1.addEventListener("click", changeMode);
btn_change2.addEventListener("click", changeMode);


// variables para cambiar entre secciones
let btn_favorite = document.getElementById("favoritos");
let btn_misGifos = document.getElementById("mis-gifos")
let btn_newGifo = document.getElementById("new-gifo")


btn_favorite.addEventListener("click", function(){ showSelectedSection("favorites-section") });
btn_misGifos.addEventListener("click", function(){ showSelectedSection("mis-gifos-section") });
btn_newGifo.addEventListener("click", function(){ showSelectedSection("gifos-creation-section") });
btn_newGifo.addEventListener("mouseover", function(){ changeButton("over") });
btn_newGifo.addEventListener("mouseout", function(){ changeButton("out") });


// volver al home
let home = document.getElementById("logo-container");
home.addEventListener("click", function(){ homeMode("principal") });



///////////////////// FUNCIONES \\\\\\\\\\\\\\\\\\\\\\\\\\
//----- funcion para eliminar los nodos hijos de la seccion de resultados de busqueda
function removeSearchChild(){
    // si ya tenia hijos, los elimino
    let searching = document.getElementById("search-results-with-content");
    while(searching.firstChild){
        searching.removeChild(searching.firstChild);
    }
}






/************************************************************** */
//************************** BUSQUEDA ************************* */
const giphy = new Giphy();
let btn_search = document.getElementById("search-button");
let input = document.getElementById("search");

btn_search.addEventListener("click", function(event){ 
    event.preventDefault(); 
    giphy.newKeywordToSearch();
    cleanSearch();
});

input.addEventListener("keyup", function(event){
    if(event.key === 'Enter'){
        event.preventDefault();
        giphy.newKeywordToSearch();
        cleanSearch();
    }
    else{
        giphy.autocomplete();
    }
});


// Boton para poder ver mas gifs en la busqueda
let btn_more = document.getElementById("vermas");
let offset = 0;
btn_more.addEventListener("click", function(){ giphy.searchGifs(giphy.offset+=GIFS_TO_SHOW) });


// Limpieza de buscador
let closeSearch = document.getElementById("close-search");
closeSearch.addEventListener("click", cleanSearch );


// agrego el evento click a las opciones de busqueda autocompletadas
let autoOpt = document.getElementsByClassName("opcion");
for(let i = 0; i < autoOpt.length ; i++){
    autoOpt[i].addEventListener("click", function(){ addAutocomplete( i ) });
}  


//----- Funcion para copiar en el input search el valor de la opcion de autocompletar seleccionada
function addAutocomplete(index){
    console.log("autocomplete function")
    let searchInput = document.getElementById("search");    
    searchInput.value = autoOpt[index].innerHTML;
    let searchHr = document.getElementById("search-hr");
    searchHr.style.display = "none";    
    let hiddenSO = document.getElementsByClassName("hidden-search-option");
    for(let j=0; j<autoOpt.length; j++){
        autoOpt[j].innerHTML = "";
        hiddenSO[j].style.display = "none";
    }
    giphy.newKeywordToSearch();
}



//----- Funcion para limpiar todo el contenedor de busqueda de modo de dejarlo en su version inicial
function cleanSearch(){
    closeSearch.style.visibility = "hidden";
    let searchButton2 = document.getElementById("search-button2");
    searchButton2.style.visibility = "visible";
    let searchButton1 = document.getElementById("search-button");
    searchButton1.style.visibility = "hidden";
    let searchInput = document.getElementById("search");
    searchInput.value = '';
    let searchHr = document.getElementById("search-hr");
    searchHr.style.display = "none";  
    let hiddenSO = document.getElementsByClassName("hidden-search-option");
    for(let j=0; j<hiddenSO.length; j++){
        hiddenSO[j].style.display = "none";
    }
}


/************************************************************** */
//*********************** TRENDING GALERY ********************* */

// botones para modo desktop para desplazarse entre gifs del Trending
let btn_left = document.getElementById("left");
let btn_right = document.getElementById("right");
btn_left.addEventListener("click", function(){ scrollDiv('l', 100) });
btn_right.addEventListener("click", function(){ scrollDiv('r', 100) });


//----- funcion para poder las flechas que permiten hacer scroll a la trending galery
function scrollDiv(dir, px) {
    var scroller = document.getElementById('scroll-galery');
    if (dir == 'l') {
        scroller.scrollLeft -= px;
    }
    else if (dir == 'r') {
        scroller.scrollLeft += px;
    }
}


// funcion que se ejecuta al cargar la pagina, obtiene los trending gifs
function getTrending(){
    let gifObject = new Giphy();
    gifObject.trendingGifs();
}


/************************************************************** */
//************************** ON LOADING *********************** */

//----- Funcion de inicializacion y configuracion al cargar la web
function loadConfigs(){
    getTrending();
    resizingImageContainer();
    resizingHamburguerMenu();
}


//----- Funcion funcion para redimensionar el alto que ocupara el menu hamburgueza al abrirlo
function resizingHamburguerMenu(){
    let body = document.getElementById("general-container");
    let optionsList = document.getElementById("options-list");    
    screen.width >= 860 ? optionsList.style.height = '100%' : optionsList.style.height = body.clientHeight + 'px';
}



/*************************************************************** */
//***************** VISOR DE GIFS AMPLIADOS ******************** */

// variable para el gif seleccionado para ampliar
let selectedGif;

let btn_closeContainer = document.getElementById("close-container");
btn_closeContainer.addEventListener("click", closeImageViewer);


//----- funcion para que el contenedor de visualizacion de imagenes ocupe todo el alto de la web
function resizingImageContainer(){
    let body = document.getElementById("general-container");
    let imageContainer = document.getElementById("image-container");    
    imageContainer.style.height = body.clientHeight + 'px';
}


//----- funcion para cerrar el contenedor de visualizacion de imagenes
function closeImageViewer(){
    let imageContainer = document.getElementById("image-container");
    if(!imageContainer.classList.contains("disabled"))
        imageContainer.style.display = "none";
}


//----- funcion para acceder a la seccion del gif ampliado
function ampliarGif( index, availablesGifs ){
    // a travez del indice obtengo el gif seleccionado
    if(index >= 0)
        selectedGif = availablesGifs[index];
    let gifrepository = document.getElementById("gif-repository");    
    gifrepository.src = selectedGif.src;
    gifrepository.alt = selectedGif.alt;

    let gifTitle = document.getElementById("gif-title");
    selectedGif.alt.split(',')[0] === '' ? gifTitle.textContent = "Gifo sin titulo" : gifTitle.textContent = selectedGif.alt.split(',')[0];

    let gifUser = document.getElementById("user");
    selectedGif.alt.split(',')[1]  === '' ? gifUser.textContent = "User" : gifUser.textContent = selectedGif.alt.split(',')[1];

    // verifico si el gif es favorito o no, para cargar la imagen correspondiente.
    let find = findFav();
    !find ? btn_addFav.src = "images/icon-fav.svg" : btn_addFav.src = "images/icon-fav-active.svg";

    //muestro el contenedor de modo que el alto sea del mismo que la ventana
    resizingImageContainer();
    // hago visible el contenedor
    let imageContainer = document.getElementById("image-container");
    imageContainer.style.display = "flex";
    // para dirigir el foco al top de la web
    let topContainer = document.getElementById("general-container");
    topContainer.scrollTop;
    window.scrollTo(0, 0);
}



/************************************************************** */
//********************** SECCION FAVORITOS ******************** */

// Clase con las propiedades de un gif
class Gif{
    constructor( id, src, title, user){
        this.id = id;
        this.src = src;
        title === '' ? this.title = "Gifo sin titulo" : this.title = title;
        this.user = user;
    }
}

let btn_addFav = document.getElementById("fav");
btn_addFav.addEventListener("click", function(){ addGifToFavourite(null) });


// variable que contendra un array de favoritos obtenidos desde el local storage
let favoritos;

// Boton para poder ver mas gifs en los Favoritos
let btn_moreFavs = document.getElementById("vermas-favs");
let offsetFav = 0;
btn_moreFavs.addEventListener("click", function(){ loadFavoritesSection(offsetFav+=12) });


//----- funcion para buscar si un gif se encuentra como favorito
function findFav(){
    myLocalStorage = window.localStorage;
    favoritos = JSON.parse(myLocalStorage.getItem("myFavouritesGifos"));
    let find;
    if(favoritos)
        find = favoritos.find( element => element.id === selectedGif.id);
    return find;
}


//----- funcion para agregar un gif a Favoritos
function addGifToFavourite(button){

    myLocalStorage = window.localStorage;    
    // busca si el gif ya esta como favorito y setea el array favoritos
    let find = findFav();
    if(favoritos === null){
        favoritos = [];
    }
    if(!find){        
        let myGif = new Gif( selectedGif.id, selectedGif.src, selectedGif.alt.split(',')[0], selectedGif.alt.split(',')[1] );
        favoritos.push(myGif)
        myLocalStorage.setItem("myFavouritesGifos", JSON.stringify(favoritos));
        button===null ? btn_addFav.src = "images/icon-fav-active.svg": button.src = "images/icon-fav-active.svg";
    }
    else{
        favoritos.splice( favoritos.indexOf(find), 1);
        myLocalStorage.setItem("myFavouritesGifos", JSON.stringify(favoritos));
        button===null ? btn_addFav.src = "images/icon-fav.svg": button.src = "images/icon-fav.svg";
    }
    // si me encuentro posicionado sobre la seccion favoritos, refresco la pagina con la modificacion
    let myFavs = document.getElementById("favorites-section");
    if(!myFavs.classList.contains("disabled")){
        offsetFav = 0;
        loadFavoritesSection(offsetFav);
    }
}



//----- funcion para cargar y visualizar el contenido de la seccion Favoritos
function loadFavoritesSection(offset){
    console.log("Loading Favorites...")
    myLocalStorage = window.localStorage;    
    
    let favsNoContent = document.getElementById("favorites-no-content");        
    let favsContent = document.getElementById("favorites-with-content");
    favoritos = [];

    let favsGrid = document.getElementById("favorites-grid");
    // limpio el contenedor
    while(favsGrid.firstChild && offset === 0){
        favsGrid.removeChild(favsGrid.firstChild);
    }
    favoritos = JSON.parse(myLocalStorage.getItem("myFavouritesGifos"));
    // si no hay favoritos muestro el contenedor correspondiente
    if(favoritos === null || favoritos.length === 0){
        favsNoContent.style.display = "flex";
        btn_moreFavs.classList.add("disabled");
        if(!favsContent.classList.contains("disabled"))
            favsContent.classList.add("disabled");
    }else{        
        if(favsContent.classList.contains("disabled"))
            favsContent.classList.remove("disabled");
        favsNoContent.style.display = "none";
        // si hay menos de 12 favoritos por tanda para mostrar, oculto el boton vermas
        favoritos.length <= offset + GIFS_TO_SHOW ? 
            btn_moreFavs.classList.add("disabled") : btn_moreFavs.classList.remove("disabled");
        

        // ire agregando elementos al visualizador de a 12 por cada tanda, hasta ya no haber mas
        let element;
        let i = 0;
        while(favoritos[offset + i] && i < GIFS_TO_SHOW){
            element = favoritos[offset + i];
            let img = document.createElement("img");
            img.id = element.id;
            img.src = element.src;
            img.alt = element.title + "," + element.user;
            img.classList.add("favorites-result");
            img.classList.add("gifos-results");
            // elementos con titulo y user del gif visualizables desde modo desktop
            let user = document.createElement("p");            
            let title = document.createElement("p");
            let detailDiv = document.createElement("div");
            element.user === '' ? user.textContent = "User" : user.textContent = element.user;            
            user.classList.add("user");
            element.title === '' ? title.textContent = "Gifo sin titulo" : title.textContent = element.title;  
            title.classList.add("title");         
            detailDiv.classList.add("detail-div");         
            detailDiv.appendChild(user);
            detailDiv.appendChild(title);
            // elementos con botones del gif visualizables desde modo desktop
            let btnFav = document.createElement("img");
            let btnDown = document.createElement("img");
            let btnMax = document.createElement("img");
            btnFav.src = "images/icon-fav-active.svg";
            btnFav.classList.add("favs-btn");
            btnDown.src = "images/icon-download.svg";
            btnDown.classList.add("down-btn");
            btnMax.src = "images/icon-max-normal.svg";
            btnMax.classList.add("max-btn");
            let buttonsDiv = document.createElement("div");
            buttonsDiv.classList.add("buttons-div"); 
            buttonsDiv.appendChild(btnFav);
            buttonsDiv.appendChild(btnDown);
            buttonsDiv.appendChild(btnMax);
            // eventos vinculados con la botonera
            btnFav.addEventListener("click", function(event){ doAction(event, 1) });
            btnDown.addEventListener("mouseover", function(){ btnDown.src = "images/icon-download-hover.svg"; });
            btnDown.addEventListener("mouseout", function(){ btnDown.src = "images/icon-download.svg"; });
            btnDown.addEventListener("click", function(event){ doAction(event, 2) });
            btnMax.addEventListener("mouseover", function(){ btnMax.src = "images/icon-max-hover.svg"; });
            btnMax.addEventListener("mouseout", function(){ btnMax.src = "images/icon-max-normal.svg"; });
            btnMax.addEventListener("click", function(event){ doAction(event, 3) });
            
            let div = document.createElement("div");
            div.classList.add("img-div");
            div.appendChild(img);
            div.appendChild(detailDiv);
            div.appendChild(buttonsDiv);
            favsGrid.appendChild(div);
            i++;
        }

        let availablesFavoriteGifs = document.getElementsByClassName("favorites-result");
        for(let i = 0; i < availablesFavoriteGifs.length ; i++){
            availablesFavoriteGifs[i].addEventListener("click", function(){ ampliarGif(i, availablesFavoriteGifs) });
        }
        switchingAmpliarGif();  
    }
}


//----- funcion que se encarga de efectuar una accion segun el boton presionado del panel de cada gif
function doAction(e, option){    
    let btnParentContainer = e.target.parentElement;
    let gifParentContainer = btnParentContainer.parentElement; 
    // le asigno a selectedGif el gif correspondiente al boton que se haya tocado   
    selectedGif = gifParentContainer.firstChild;    
    switch(option){
        case 1:
            addGifToFavourite(e.target);
            break;
        case 2:
            downloadImage();
            break;
        case 3:
            ampliarGif(-1, null);
            break;
        case 4:
            if(!e.target.src.includes("images/icon-fav-active.svg")){
                e.target.src = "images/icon-fav-hover.svg";
            }
            break;
        case 5:
            if(!e.target.src.includes("images/icon-fav-active.svg")){
                e.target.src = "images/icon-fav.svg";
            }
            break;
        case 6:
            deleteGif();
            break;
        default:
    }
}



/*************************************************************** */
//********************** SECCION MIS GIFOS ********************* */

let misgifos;

// Boton para poder ver mas gifs en los Favoritos
let btn_moreMisGifos = document.getElementById("vermas-misgifos");
let offsetMisGifos = 0;
btn_moreMisGifos.addEventListener("click", function(){ loadMisGifosSection(offsetMisGifos+=12) });


//----- funcion para cargar y visualizar el contenido de la seccion Favoritos
function loadMisGifosSection(offset){
    console.log("Loading mis gifos...")
    myLocalStorage = window.localStorage;    
    
    let misgifosNoContent = document.getElementById("mis-gifos-no-content");        
    let misgifosContent = document.getElementById("mis-gifos-with-content");
    misgifos = [];

    let misgifosGrid = document.getElementById("mis-gifos-grid");
    // limpio el contenedor
    while(misgifosGrid.firstChild && offset === 0){
        misgifosGrid.removeChild(misgifosGrid.firstChild);
    }
    misgifos = JSON.parse(myLocalStorage.getItem("myOwnGifos"));
    // si no hay favoritos muestro el contenedor correspondiente
    if(misgifos === null || misgifos.length === 0){
        misgifosNoContent.style.display = "flex";
        btn_moreMisGifos.classList.add("disabled");
        if(!misgifosContent.classList.contains("disabled"))
            misgifosContent.classList.add("disabled");
    }else{        
        if(misgifosContent.classList.contains("disabled"))
            misgifosContent.classList.remove("disabled");
        misgifosNoContent.style.display = "none";

        // si hay menos de 12 favoritos por tanda para mostrar, oculto el boton vermas
        misgifos.length <= offset + GIFS_TO_SHOW ? 
            btn_moreMisGifos.classList.add("disabled") : btn_moreMisGifos.classList.remove("disabled");
        

        // ire agregando elementos al visualizador de a 12 por cada tanda, hasta ya no haber mas
        let element;
        let i = 0;
        while(misgifos[offset + i] && i < GIFS_TO_SHOW){       
            element = misgifos[offset + i];
            let img = document.createElement("img");
            img.id = element.id;
            img.src = element.src;
            img.alt = element.title + "," + element.user;
            img.classList.add("mis-gifos-result");
            img.classList.add("gifos-results");
            // elementos con titulo y user del gif visualizables desde modo desktop
            let user = document.createElement("p");            
            let title = document.createElement("p");
            let detailDiv = document.createElement("div");
            element.user === '' ? user.textContent = "User" : user.textContent = element.user;            
            user.classList.add("user");
            element.title === '' ? title.textContent = "Gifo sin titulo" : title.textContent = element.title;  
            title.classList.add("title");         
            detailDiv.classList.add("detail-div");         
            detailDiv.appendChild(user);
            detailDiv.appendChild(title);
            // elementos con botones del gif visualizables desde modo desktop
            let btnDel = document.createElement("img");
            let btnDown = document.createElement("img");
            let btnMax = document.createElement("img");
            btnDel.src = "images/icon-trash-normal.svg";
            btnDel.classList.add("favs-btn");
            btnDown.src = "images/icon-download.svg";
            btnDown.classList.add("down-btn");
            btnMax.src = "images/icon-max-normal.svg";
            btnMax.classList.add("max-btn");
            let buttonsDiv = document.createElement("div");
            buttonsDiv.classList.add("buttons-div"); 
            buttonsDiv.appendChild(btnDel);
            buttonsDiv.appendChild(btnDown);
            buttonsDiv.appendChild(btnMax);
            // eventos vinculados con la botonera superior de cada gif
            btnDel.addEventListener("mouseover", function(event){ btnDel.src = "images/icon-trash-hover.svg";  });
            btnDel.addEventListener("mouseout", function(event){ btnDel.src = "images/icon-trash-normal.svg";  });
            btnDel.addEventListener("click", function(event){ doAction(event, 6) });
            btnDown.addEventListener("mouseover", function(){ btnDown.src = "images/icon-download-hover.svg"; });
            btnDown.addEventListener("mouseout", function(){ btnDown.src = "images/icon-download.svg"; });
            btnDown.addEventListener("click", function(event){ doAction(event, 2) });
            btnMax.addEventListener("mouseover", function(){ btnMax.src = "images/icon-max-hover.svg"; });
            btnMax.addEventListener("mouseout", function(){ btnMax.src = "images/icon-max-normal.svg"; });
            btnMax.addEventListener("click", function(event){ doAction(event, 3) });

            let div = document.createElement("div");
            div.classList.add("img-div");
            div.appendChild(img);
            div.appendChild(detailDiv);
            div.appendChild(buttonsDiv);
            misgifosGrid.appendChild(div);
            i++;
        }

        let availablesMisGifos = document.getElementsByClassName("mis-gifos-result");
        for(let i = 0; i < availablesMisGifos.length ; i++){
            availablesMisGifos[i].addEventListener("click", function(){ ampliarGif(i, availablesMisGifos) });
        }
        switchingAmpliarGif();  
    }
}



//----- funcion que se encarga de borrar gif del local storage
function deleteGif(){
    myLocalStorage = window.localStorage;     

    if(misgifos){
        let find = misgifos.find( element => element.id === selectedGif.id);
        if(find){
            misgifos.splice( misgifos.indexOf(find), 1);
            myLocalStorage.setItem("myOwnGifos", JSON.stringify(misgifos));
        }
        offsetMisGifos = 0;
        loadMisGifosSection(offsetMisGifos);
    }
}


/************************************************************** */
//********************** DESCARGA DE GIFS ********************* */

// --- para descarga de gifs
let btn_down = document.getElementById("down");
btn_down.addEventListener("click", downloadImage );


//----- funcion asincronica para comenzar la descargas de imagenes
async function downloadImage(){
    console.log("Downloading gifo...")
    let buttonsContainer = document.getElementById("buttons-container");
    const a = document.createElement("a");

    //obtengo el nombre que va a tener el gif al descargarse 
    a.download = selectedGif.id + ".gif";    
    a.href = await toDataURL(selectedGif.src);
    // agrego el elemento anchor (a) al buttons-container
    buttonsContainer.appendChild(a);
    // fuerzo el evento click sobre el elemento
    a.click();
    buttonsContainer.removeChild(a);
   
    console.log("Fichero listo para descargar")    
}


//----- funcion para convertir la url de la imagen un una url blob
function toDataURL(url) {
    return fetch(url).then((response) => {
        // la respuesta del fetch a la url del gif la convierto en un blob
            return response.blob();
        }).then(blob => {
            // convierto el blob en una url descargable
            return URL.createObjectURL(blob);            
        })
}

