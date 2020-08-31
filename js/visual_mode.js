// para cambio de modo
let modoNoc = false;

//----- Funcion para mostrar el menu hamburgueza
function showMenu(){   

    resizingHamburguerMenu();
    let menu = document.getElementById("menu-options");    
    if(menu.classList.contains("disabled") && btn_close.classList.contains("disabled")){
        menu.classList.remove("disabled");
        btn_close.classList.remove("disabled");
        btn_hamburger.classList.add("disabled");
    }
    else{
        menu.classList.add("disabled");
        btn_close.classList.add("disabled");
        btn_hamburger.classList.remove("disabled");
    }
}

//----- Funcion para cambiar de modo (Nocturno y Diurno)
function changeMode(){
    let body = document.getElementById("general-container");
    let createButton = document.getElementById("create-button");
    let fav = document.getElementById("favoritos");
    let misgifs = document.getElementById("mis-gifos");

    // para cambiar las imagenes de la seccion grabacion
    let cameraImage = document.getElementById("camera-image");
    let peliculaImage = document.getElementById("pelicula-image");

    // para cambiar los steps de grabacion
    let step1 = document.getElementById("step1");
    let step2 = document.getElementById("step2");
    let step3 = document.getElementById("step3");

    // cambio de logo
    let logo = document.getElementById("logo");
    
    // agrego la clase pertinente segun el modo, 
    // y estilizo las secciones ya que reaccionan diferente a los textos normales
    if(body.classList.contains("dayModeColor")){
        body.classList.remove("dayModeColor");
        body.classList.add("nightModeColor");
        cameraImage.src = "images/camara-modo-noc.svg";
        peliculaImage.src = "images/pelicula-modo-noc.svg";
        logo.src = "images/logo-desktop-nocturno.png";
        if(!createButton.src.includes("images/CTA-crear-gifo-active.svg"))
            createButton.src = "images/CTA-crear-gifo-modo-noc.svg";
        if(fav.style.color !== "rgb(156, 175, 195)")
            fav.style.color = "#FFFFFF";        
        if(misgifs.style.color !== "rgb(156, 175, 195)")
            misgifs.style.color = "#FFFFFF";
        // cambia el estilo de los steps
        if(activeStep1){
            step1.style.background = "#FFFFFF";
            step1.style.color = "#37383C";
        }
        else{
            step1.style.background = "none";
            step1.style.color = "#FFFFFF";
        }
        if(activeStep2){
            step2.style.background = "#FFFFFF";
            step2.style.color = "#37383C";
        }
        else{
            step2.style.background = "none";
            step2.style.color = "#FFFFFF";
        }
        if(activeStep3){
            step3.style.background = "#FFFFFF";
            step3.style.color = "#37383C";
        }
        else{
            step3.style.background = "none";
            step3.style.color = "#FFFFFF";
        }
                
        modoNoc = true;        
    }
    else{
        body.classList.add("dayModeColor");
        body.classList.remove("nightModeColor");
        cameraImage.src = "images/camara.svg";
        peliculaImage.src = "images/pelicula.svg";
        logo.src = "images/logo-desktop.png";
        if(screen.width >= 860){
            if(!createButton.src.includes("images/CTA-crear-gifo-active.svg"))
                createButton.src = "images/button-crear-gifo.svg";
            if(fav.style.color !== "rgb(156, 175, 195)")
                fav.style.color = "#572EE5";        
            if(misgifs.style.color !== "rgb(156, 175, 195)")
                misgifs.style.color = "#572EE5";
        }
        // cambia el estilo de los steps
        if(activeStep1){
            step1.style.background = "#572EE5";
            step1.style.color = "#FFFFFF";
        }
        else{
            step1.style.background = "none";
            step1.style.color = "#572EE5";
        }
        if(activeStep2){
            step2.style.background = "#572EE5";
            step2.style.color = "#FFFFFF";
        }
        else{
            step2.style.background = "none";
            step2.style.color = "#572EE5";
        }
        if(activeStep3){
            step3.style.background = "#572EE5";
            step3.style.color = "#FFFFFF";
        }
        else{
            step3.style.background = "none";
            step3.style.color = "#572EE5";
        }

        modoNoc = false;
    }
    showMenu();
}

//----- Funcion para el home, de modo que siempre vuelve al modo inicial
function homeMode(visibleSeccion){
    let body = document.getElementById("general-container");
    // cambio de logo
    let logo = document.getElementById("logo");
    logo.src = "images/logo-desktop.png";
    if(modoNoc){
        body.classList.add("dayModeColor");
        body.classList.remove("nightModeColor");        
        modoNoc = false;
    }
    showSelectedSection(visibleSeccion);
}



//----- Funcion para cambiar entre secciones
function showSelectedSection(elementSection){
    
    let sectionSelected = document.getElementById(elementSection);

    // defino los objetos de las diretentes secciones
    let myGifos = document.getElementById("mis-gifos-section");
    let myFavs = document.getElementById("favorites-section");
    let principal = document.getElementById("principal");
    let searchSection= document.getElementById("search-results-section");
    let creationSection= document.getElementById("gifos-creation-section");

    //defino los elementos de los titulos para cambiar el color segun seleccion;
    let fav = document.getElementById("favoritos");
    let misgifs = document.getElementById("mis-gifos");
    let plusButton = document.getElementById("create-button");

    // cambio el color y visualizacion del boton segun la resolucion
    if(screen.width >= 860){
        if(modoNoc){
            fav.style.color = "#FFFFFF";
            misgifs.style.color = "#FFFFFF";
            plusButton.src = "images/CTA-crear-gifo-modo-noc.svg";
        }
        else{
            fav.style.color = "#572EE5";
            misgifs.style.color = "#572EE5";
            plusButton.src = "images/button-crear-gifo.svg";
        }
    }    

    // deshabilito todas las secciones
    if(!myGifos.classList.contains("disabled")){
        myGifos.classList.add("disabled");
    }
    if(!myFavs.classList.contains("disabled")){
        myFavs.classList.add("disabled");
    }   
    if(!searchSection.classList.contains("disabled")){
        searchSection.classList.add("disabled");        
    }
    if(!creationSection.classList.contains("disabled")){
        creationSection.classList.add("disabled");        
    }
    principal.style.display = "none";
    
    // comienzo a habilitar las secciones segun seleccion
    // si la seccion seleccionada es la principal, le agrego un display visible, si es otra le quito la clase "disabled"
    sectionSelected.id === "principal" ? principal.style.display = "flex" : sectionSelected.classList.remove("disabled");
    
    if(sectionSelected.id !== "principal" && sectionSelected.id !== "search-results-section")
        showMenu();
    if(sectionSelected.id === 'favorites-section'){
        offsetFav = 0;
        loadFavoritesSection(offsetFav);
        if(screen.width >= 860){
            fav.style.color = "#9CAFC3";
        }
    }
    if(sectionSelected.id === 'mis-gifos-section'){
        offsetMisGifos = 0;
        loadMisGifosSection(offsetMisGifos);
        if(screen.width >= 860){
            misgifs.style.color = "#9CAFC3";
        }
    }
    if(sectionSelected.id === 'gifos-creation-section'){
        if(screen.width >= 860){
            console.log("Loading creacion de gifos...")
            plusButton.src = "images/CTA-crear-gifo-active.svg";
        }
        loadRecorderInitialState();
    } 
}

//----- funcion para cambiar el boton de creacion de gif tras el mouseover
function changeButton(action){    
    let plusButton = document.getElementById("create-button");
    if(!plusButton.src.includes("images/CTA-crear-gifo-active.svg")){
        if(action === "over"){
            if(modoNoc)
                plusButton.src = "images/CTA-crear-gifo-hover-modo-noc.svg";
            else
                plusButton.src = "images/CTA-crear-gifo-hover.svg";
        }
        else{
            if(modoNoc)
                plusButton.src = "images/CTA-crear-gifo-modo-noc.svg";
            else
                plusButton.src = "images/button-crear-gifo.svg";
        }
    }
}



/************************************************************** */
//*********************** MEDIA QUERIES *********************** */
// defino una media query
var mediaqueryList = window.matchMedia("(min-width: 860px)");
// asociamos el manejador de evento
mediaqueryList.addListener(manejador);

screen.width >= 860 ? changeSectionText("desktop") : changeSectionText("mobile");


//----- funcion que me adapta las funcionalidades segun resolucion de pantalla
function manejador(EventoMediaQueryList) {
    EventoMediaQueryList.matches ? changeSectionText("desktop") : changeSectionText("mobile");
    resizingHamburguerMenu();
 }

 //----- funcion para utilizar uppercase o initial para los nombres de seccion segun resolucion de pantalla
function changeSectionText(mode){
    let chm1 = document.getElementById("change-mode1");
    let chm2 = document.getElementById("change-mode2");
    let fav = document.getElementById("favoritos");
    let misg = document.getElementById("mis-gifos");
    let create = document.getElementById("create-button");
    console.log(mode)
    //let gifosResults = document.getElementsByClassName("gifos-results");
    if(mode === "desktop"){
        console.log("sections to uppercase")
        chm1.style.textTransform = 'uppercase';
        chm2.style.textTransform = 'uppercase';
        fav.style.textTransform = 'uppercase';
        misg.style.textTransform = 'uppercase';       
        if(!modoNoc){
            fav.style.color = '#572EE5';
            misg.style.color = '#572EE5';
            create.src = "images/button-crear-gifo.svg";
        }
    } else{
        console.log("sections to initial")
        chm1.style.textTransform = 'initial';
        chm2.style.textTransform = 'initial';
        fav.style.textTransform = 'initial';
        misg.style.textTransform = 'initial';
        // verifico el estado del menu tras volver de un resizing de modo
        let menu = document.getElementById("menu-options"); 
        if (!menu.classList.contains("disabled")){
            menu.classList.add("disabled");
            btn_close.classList.add("disabled");
            btn_hamburger.classList.remove("disabled");
        }
        fav.style.color = '#FFFFFF';
        misg.style.color = '#FFFFFF';    
    }
    switchingAmpliarGif();
}


 //----- funcion para habilitar o deshabilitar ampliacion de gif al hacer click en la imagen, segun resolucion de pantalla
function switchingAmpliarGif(){
    let gifosResults = document.getElementsByClassName("gifos-results");
    if(screen.width >= 860){
        for(let i = 0; i < gifosResults.length; i++)
                gifosResults[i].style.pointerEvents = "none";
    } 
    else{
        for(let i = 0; i < gifosResults.length; i++)
                gifosResults[i].style.pointerEvents = "auto";
    }
}