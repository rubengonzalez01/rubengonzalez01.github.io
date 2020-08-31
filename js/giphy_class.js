/***************************************************************** */
//************************** CLASE GIPHY ************************* */

class Giphy{
    constructor(){
        this.api_key = GIPHY_API_KEY;
        this.endpoint = GIPHY_ENDPOINT;
        this.limit = GIFS_TO_SHOW;
        this.upload = GIPHY_UPLOAD_ENDPOINT;
        this.offset = 0;
        this.keyword = '';
    }

    // metodo para obtener la nueva palabra a buscar y lanzar la busqueda
    newKeywordToSearch(){
        // si el boton de ver mas estaba oculto, lo vuelvo a dejar visible
        if(btn_more.classList.contains("disabled")){
            btn_more.classList.remove("disabled");
        }        
        
        // hago visible la seccion de resulltados
        let searchSection= document.getElementById("search-results-section");
        if(searchSection.classList.contains("disabled"))
            searchSection.classList.remove("disabled");

        // si ya tenia hijos, los elimino para la nueva busqueda
        let grid = document.getElementById("images-grid");
        while(grid.firstChild){
            grid.removeChild(grid.firstChild);
        }        

        // obtengo el string a buscar para usarlo como titulo
        let keyword = document.getElementById("search");
        let title = document.getElementById("search-title");
        title.textContent = keyword.value.trim();
        this.keyword = keyword.value.trim();
        // es el offset para indicar desde donde comenzar a buscar gifs
        this.offset = 0;
        this.keyword ? this.searchGifs() : console.log("No se ingreso valor de busqueda");
        keyword.value = '';
    }

    // metodo para la busqueda de nuevos gifs
    async searchGifs(){
        console.log("Searching new gifs...")
        // armo la url de busqueda
        let url = this.endpoint + '/search?api_key=' + this.api_key + '&limit=' + this.limit + '&offset=' + this.offset + '&q=';
        url = url.concat(this.keyword);
        let yesResults = document.getElementById("search-results-with-content");
        let grid = document.getElementById("images-grid");

         // hago el request a la api de giphy
         await fetch(url)
         .then( response => response.json() )
         .then( content => {
             if(content.data.length < GIFS_TO_SHOW){
                 btn_more.classList.add("disabled");
             }
             let noResults = document.getElementById("search-results-no-content");
             if(content.data.length === 0 && this.offset === 0){
                // cuando no hay resultados, se muestra la pantalla correspondiente
                if(noResults.classList.contains("disabled")){
                    noResults.classList.remove("disabled");                   
                }
                if(!yesResults.classList.contains("disabled"))
                    yesResults.classList.add("disabled");
             }
             // por cada gif encontrado, genero un nuevo elemento img, lo coloco en un div y lo agrego al contenedor padre
             else{
                if(!noResults.classList.contains("disabled")){
                    noResults.classList.add("disabled");
                }
                if(yesResults.classList.contains("disabled"))
                    yesResults.classList.remove("disabled");

                // por cada gif encontrado genero un nuevo elemento img y lo coloco en el contenedor
                content.data.forEach(element => {
                    let img = document.createElement("img");
                    img.src = element.images.downsized.url;
                    img.id = element.id;
                    img.alt = element.title + ',' + element.username;
                    img.classList.add("search-result");
                    img.classList.add("gifos-results");
                    // elementos con titulo y user del gif visualizables desde modo desktop
                    let user = document.createElement("p");            
                    let title = document.createElement("p");
                    let detailDiv = document.createElement("div");
                    element.username === '' ? user.textContent = "User" : user.textContent = element.username;            
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
                    btnFav.src = "images/icon-fav.svg";
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
                    // eventos vinculados con la botonera superior de cada gif
                    btnFav.addEventListener("mouseover", function(event){ doAction(event, 4) });
                    btnFav.addEventListener("mouseout", function(event){ doAction(event, 5) });
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
                    grid.appendChild(div);
                });
            }
         })
         .catch( err => {
             console.log("Error al buscar gif: "+err)
             console.log("url con el error" ,url)
         });         

        let availablesSearchGifs = document.getElementsByClassName("search-result");
        for(let i = 0; i < availablesSearchGifs.length ; i++){
            availablesSearchGifs[i].addEventListener("click", function(){ ampliarGif(i, availablesSearchGifs) });
        }
        switchingAmpliarGif();        
    }


    // metodo para obtener los gifs trending y cargarlos
    async trendingGifs(){
        console.log("Loading Trending gifs...")
        // armo la url de trending
        let url = this.endpoint + '/trending?api_key=' + this.api_key;
        let galery = document.getElementById("galery");

        await fetch(url)
        .then( response => response.json() )
        .then( content => {            
            content.data.forEach(element => {
                let img = document.createElement("img");
                img.src = element.images.downsized.url;
                img.id = element.id;
                img.alt = element.title + ',' + element.username;
                img.classList.add("trending-result");
                img.classList.add("gifos-results");
                // elementos con titulo y user del gif visualizables desde modo desktop
                let user = document.createElement("p");            
                let title = document.createElement("p");
                let detailDiv = document.createElement("div");
                element.username === '' ? user.textContent = "User" : user.textContent = element.username;            
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
                btnFav.src = "images/icon-fav.svg";
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
                // eventos vinculados con la botonera superior de cada gif
                btnFav.addEventListener("mouseover", function(event){ doAction(event, 4) });
                btnFav.addEventListener("mouseout", function(event){ doAction(event, 5) });
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
                galery.appendChild(div);
            });
        })
        .catch( err => {
            console.log("Error: "+err)
        });

        let availablesTrendingGifs = document.getElementsByClassName("trending-result");
        for(let i = 0; i < availablesTrendingGifs.length ; i++){            
            availablesTrendingGifs[i].addEventListener("click", function(){ ampliarGif( i, availablesTrendingGifs) });
        }
        switchingAmpliarGif();
    }


    // metodo que me trae las sugerencias de busquedas
    async autocomplete(){
        console.log("Searching tags to autocomplete...")
        // armo la url de trending
        let keyword = document.getElementById("search");
        this.keyword = keyword.value.trim();
        let url = this.endpoint + '/search/tags?api_key=' + this.api_key + '&q=';
        url = url.concat(this.keyword);

        let optList = document.getElementsByClassName("opcion");
        let hiddenSO = document.getElementsByClassName("hidden-search-option");
        
        let searchHr = document.getElementById("search-hr");
        let searchButton1 = document.getElementById("search-button");
        let searchButton2 = document.getElementById("search-button2");
        let closeSearch = document.getElementById("close-search");
        
        if(this.keyword !== ''){
            // hago visible los elementos de la busqueda            
            closeSearch.style.visibility = "visible";
            searchButton1.style.visibility = "visible";            
            searchButton2.style.visibility = "hidden";
        } else{
            // oculto los elementos de la busqueda;
            closeSearch.style.visibility = "hidden";
            searchButton1.style.visibility = "hidden";
            searchButton2.style.visibility = "visible";            
        }

        // por cada keypress elimino el contenido de los label y lo oculto
        for(let j=0; j<optList.length; j++){
            optList[j].innerHTML = "";
            hiddenSO[j].style.display = "none";
        }
        
        // obtendre las sugerencias de busqueda
        await fetch(url)
        .then( response => response.json() )
        .then( content => {
            let i = 0;
            // agregara opciones visibles segun la cantidad de resultados positivos
            while(content.data && i < content.data.length && i < optList.length){                
                searchHr.style.display = "block";
                optList[i].innerHTML = content.data[i].name;
                hiddenSO[i].style.display = "flex";
                i++;
            }
            if(content.data.length === 0){
                searchHr.style.display = "none";
            }
        })
        .catch(err => {
            console.error("Error: "+ err)
        });
    }



    // metodo que subira un nuevo gif a la web de Giphy
    async uploadGif(formData){
        console.log("Uploading gif...")
        // armo la url de upload
        let url = `${this.upload}?api_key=${this.api_key}`;

        // procedo a hacer el upload del gif mediente un POST y pasando el formData en el body
        // posteriormente obtengo el ID
        let idGifo = await fetch(url, {
                        method: "POST",
                        body: formData
                    })
                    .then( response => response.json())
                    .then( content => {
                        console.log("Upload success.")
                        // aplico el estilado de subida exitosa
                        let message = document.getElementById("message");
                        message.innerHTML = "GIFO subido con éxito";
                        message.style.top = "10px";
                        let status = document.getElementById("status");
                        status.src = "images/check.svg";
                        status.style.width = "20px"

                        // obtengo el ID del gif subido y lo devuelvo
                        return content.data.id;
                    })
                    .catch(err => {
                        console.log("Error: "+ err)
                        // aplico el estilado de subida fallida
                        let message = document.getElementById("message");
                        message.innerHTML = "Hubo un inconveniente al subir tu GIFO";
                        message.style.top = "10px";
                        let status = document.getElementById("status");
                        status.src = "images/1200px-Error.png";
                        status.style.width = "35px"
                    });

        return idGifo;
    }

}
