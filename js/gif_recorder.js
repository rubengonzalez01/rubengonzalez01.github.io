// Constantes
const CONSTRAINT_OBJ = { 
    audio: false, 
    video: { 
        facingMode: "user", 
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 } 
    } 
};

// defino la url de acceso directo al neuvo gif subido
const GIPHY_DIRECT_URL = 'https://media.giphy.com/media/';

const TIMEOUT = 5000;

//////////////// VARIABLES Y LLAMADOS A FUNCIONES \\\\\\\\\\\\\\\\\\\\\
let comenzar = document.getElementById("comenzar");
comenzar.addEventListener("click", recordStep1);

let grabar = document.getElementById("grabar");
grabar.addEventListener('click', recordNewGif );

let finalizar = document.getElementById("finalizar");    
finalizar.addEventListener('click', finishNewGif );

let subir = document.getElementById("subir");
subir.addEventListener("click", subirNewGif );

let repeat = document.getElementById("repeat");
repeat.addEventListener("click", repeatRecording );

let btnDown2 = document.getElementById("down2");
btnDown2.addEventListener("mouseover", function(){ btnDown2.src = "images/icon-download-hover.svg" });
btnDown2.addEventListener("mouseout", function(){ btnDown2.src = "images/icon-download.svg" });
btnDown2.addEventListener("click", startDownload );

let btnLink = document.getElementById("link");
btnLink.addEventListener("mouseover", function(){ btnLink.src = "images/icon-link-hover.svg" });
btnLink.addEventListener("mouseout", function(){ btnLink.src = "images/icon-link-normal.svg" });
btnLink.addEventListener("click", getLink );

let mediaRecorder = null;
let recordURL = null;
let recorder = null;
let stream = null;

let activeStep1 = false;
let activeStep2 = false;
let activeStep3 = false;

// array que contendra los gifos creados y almacenados en el local storage
let creations = [];

// posteriormente se le dara funcionalidad al step1
let stepper1 = document.getElementById("step1");

//------ Funcion para ejecutar las acciones del step 1 del proceso de grabacion de gif
function recordStep1(){
    let indication = document.getElementById("indication");
    indication.innerHTML = "¿Nos das acceso<br> a tu cámara?";

    let description = document.getElementById("description");
    description.innerHTML = "El acceso a tu camara será válido sólo<br>por el tiempo en el que estés creando el GIFO.";

    changeStepStatus(1, true);
    activeStep1 = true;
    comenzar.style.display = "none";

    // manejador para navegadores antiguos de manera que pueda implementar getUserMedia de alguna forma
    
    if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
        navigator.mediaDevices.getUserMedia = function(constraintObj) {
            let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            // si el navegador no es mozila o chrome indica que no se puede utilizar en el navegador
            if (!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
            }
            // retorna la respuesta si el usuario acepta o no la solicitud de uso de dispositivos.
            return new Promise(function(resolve, reject) {
                getUserMedia.call(navigator, constraintObj, resolve, reject);
            });
        }
    }else{
        // cuando los dispositivos son claramente identificados, lo logueo para identificar
        navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            devices.forEach(device=>{
                console.log(device.kind.toUpperCase(), device.label);
            })
        })
        .catch(err=>{
            console.log(err.name, err.message);
        })
    }
    
    navigator.mediaDevices.getUserMedia(CONSTRAINT_OBJ)
    .then( 
        recordStep2 
    )
    .catch(function(err) { 
        console.log(err.name, err.message); 
    });
    
    /*
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    console.log(navigator.getUserMedia)
    navigator.getUserMedia(CONSTRAINT_OBJ, recordStep2, function(err) { 
        console.log(err.name, err.message); 
    });*/


   //navigator.mediaDevices.getUserMedia(CONSTRAINT_OBJ)
    // ({
    //     audio: false,
    //     video: {
    //        height: { max: 480 }
    //     }
    //  })
     /*.then(//function(stream) {
        //video.srcObject = stream;
        //video.play()
        recordStep2
     )
     .catch(function(err) { 
        console.log(err.name, err.message); 
    });*/
}


//------ Funcion para ejecutar las acciones del step 2 del proceso de grabacion de gif
function recordStep2(mediaStreamObj){

    stream = mediaStreamObj;
    recorder = RecordRTC(mediaStreamObj, {
            type: 'gif',
            frameRate: 1,
            quality: 10,
            width: 360,
            hidden: 240,
            onGifRecordingStarted: function() {
                console.log('started')
            },
        });

    console.log("Preparando grabacion de gifo...")
    let indication = document.getElementById("indication");
    indication.style.display = "none";
    let description = document.getElementById("description");
    description.style.display = "none";

    // cambio el estilo de los botones step
    changeStepStatus(1, false);
    changeStepStatus(2, true);
    activeStep1 = false;   
    activeStep2 = true;

    // al step1 le doy funcionalidad de modo que se pueda volver atras    
    stepper1.style.cursor = "pointer";
    stepper1.style.pointerEvents = "auto";
    stepper1.addEventListener("mouseover", function(){ changeStepStatus(1, true) });
    stepper1.addEventListener("mouseout", function(){ changeStepStatus(1, false) });            
    stepper1.addEventListener("click", function(){
        // finalizo la utilizacion de la camara
        stream.getTracks().forEach(track => track.stop());        
        // cambio el estilo de los botones step
        changeStepStatus(1, false);
        changeStepStatus(2, false);
        activeStep1 = false;
        activeStep2 = false;
        stepper1.style.pointerEvents = "none";
        loadRecorderInitialState();
    })

    //connect the media stream to the first video element
    let video = document.getElementById('gifo-record');
    video.style.display = "block"
    
    // segun la version del componente video, voy agregando el streaming en su src
    if ("srcObject" in video) {
        video.srcObject = mediaStreamObj;
    } else {
        //old version
        video.src = window.URL.createObjectURL(mediaStreamObj);
    }

    video.onloadedmetadata = function(ev) {
        //show in the video element what is being captured by the webcam
        video.play();
    };
   
    grabar.style.display = "block";

}

//------- Funcion para Inicializar la grabacion de un nuevo Gif
function recordNewGif(ev){        
    console.log("Grabando gifo...")
    grabar.style.display = "none";
    finalizar.style.display = "block";
    timer.style.display = "inline"

    // Invoco la inicializacion del temporizador
    startTimer();

    // inicio la grabacion
    recorder.startRecording();
    console.log("Media Recorder start success...")
}



//------ Funcion para disparar la finalizacion de grabacion del gifo
function finishNewGif(){
    // stoppeo el recorder y timer. Estilo tambien la pantalla
    recorder.stopRecording( function(){
        console.log("Finalizando gifo...")
        finalizar.style.display = "none";  

        stopTimer();

        timer.style.display = "none";
        subir.style.display = "block";
        repeat.style.display = "inline";
    });
}



//------ Funcion para depositar en el local storage el gif grabado en la variable recordURL
async function subirNewGif(){
    repeat.style.display = "none";
    // hago que el boton de step1 ya no tenga funcionalidad
    stepper1.style.pointerEvents = "none";
    // defino un formData para crear el fichero que poteriormente subire a giphy
    let form = new FormData();

    subir.style.display = "none";

    // hago el estilado de la pantalla de subida
    let videoContainer = document.getElementById("video-container");
    videoContainer.style.background = "#572EE5";
    let loading = document.getElementById("loading-gifo");
    loading.style.display = "block";
    let video = document.getElementById("gifo-record");
    video.style.opacity = "0.6";
    // cambio estilo de los botones step
    changeStepStatus(2, false);
    changeStepStatus(3, true);
    activeStep2 = false;   
    activeStep3 = true; 

    // preparo el fichero para subir a Giphy
    form.append('file', recorder.getBlob(), 'my-gifo.gif');

    // llamo al metodo de subida y obtengo el ID del gif
    let idGifo = await giphy.uploadGif(form);

    recordStep3(idGifo);
}

//------ Funcion para ejecutar las acciones del step 3 del proceso de subida de gif
function recordStep3( gifoId ){ 

    if(gifoId){
        // armo la url del gifo nuevo
        let gifoURL = `${GIPHY_DIRECT_URL}${gifoId}/giphy.gif`;
        // se hara el almacenamiento en local storage del nuevo gifo
        let myGif;
        myLocalStorage = window.localStorage;
        creations = JSON.parse(myLocalStorage.getItem("myOwnGifos"));
        if(creations === null){
            creations = [];
            myGif = new Gif( gifoId, gifoURL, "my-gifo-1", "own gifo");
        }
        else{
            let id = creations.length + 1;
            myGif = new Gif( gifoId, gifoURL, `my-gifo-${id}`, "own gifo" );        
        }
        creations.push(myGif)
        myLocalStorage.setItem("myOwnGifos", JSON.stringify(creations));

        let finalOptions = document.getElementById("final-options");
        finalOptions.style.display = "block";        
    }
    // finalizo la utilizacion de la camara
    stream.getTracks().forEach(track => track.stop());
}

//------- Funcion para repetir la grabacion del gifo
function repeatRecording(){
    console.log("Repeat recording...")
    repeat.style.display = "none";
    subir.style.display = "none";
    grabar.style.display = "block";
    recorder.reset();
}

//------- Funcion para cambiar los estados visuales de los steppers
function changeStepStatus(stepper, active){    
    let step = document.getElementById(`step${stepper}`);
    if(modoNoc){
        if(active){
            step.style.background = "#FFFFFF";
            step.style.color = "#37383C";
        }
        else{
            step.style.background = "none";
            step.style.color = "#FFFFFF";
        }
    } 
    else{
        if(active){
            step.style.background = "#572EE5";
            step.style.color = "#FFFFFF";
        }
        else{
            step.style.background = "none";
            step.style.color = "#572EE5";
        }
        
    }
}

//------- Funcion para obtener el ultimo gif grabado e iniciar la descarga del mismo.
function startDownload(){
    localStorage = window.localStorage;
    creations = JSON.parse(myLocalStorage.getItem("myOwnGifos"));
    selectedGif = creations[creations.length - 1];
    downloadImage();
}

//------- Funcion para entregar al usuario el link al Gifo creado
function getLink(){
    localStorage = window.localStorage;
    creations = JSON.parse(myLocalStorage.getItem("myOwnGifos"));
    selectedGif = creations[creations.length - 1];
    alert("Link al Gifo:\n" + selectedGif.src);
}

function loadRecorderInitialState(){
    console.log("Loading recorder initial state...")
    //vuelvo el estilado a su valor original
    comenzar.style.display = "block";
    let indication = document.getElementById("indication");
    indication.style.display = "inline";
    indication.innerHTML = "Aquí podrás<br>crear tus propios <span>GIFOS</span>"
    let description = document.getElementById("description");
    description.style.display = "inline";
    description.innerHTML = "¡Crea tu GIFO en sólo 3 pasos!<br>(sólo necesitas una cámara para grabar un video)"
    let video = document.getElementById('gifo-record');
    video.style.display = "none"
    video.style.opacity = "initial";
    let videoContainer = document.getElementById("video-container");
    videoContainer.style.background = "none";
    let loading = document.getElementById("loading-gifo");
    loading.style.display = "none";
    let status = document.getElementById("status");
    status.src = "images/Spinner-1s-351px.svg";
    status.style.width = "80px";
    let message = document.getElementById("message");
    message.innerHTML = "Estamos subiendo tu GIFO";
    message.style.top = "-15px";
    let finalOptions = document.getElementById("final-options");
    finalOptions.style.display = "none";
    grabar.style.display = "none";
    subir.style.display = "none";
    finalizar.style.display = "none";
    timer.style.display = "none";
    repeat.style.display = "none";
    
    changeStepStatus(3, false);
    activeStep3 = false; 
}


/************************************************************** */
//************************ TEMPORIZADOR *********************** */

let isMarch = false; 
let acumularTime = 0;
let timer = document.getElementById("timer");

//------- Funcion para defnir el estado inicial del temporizador por cada llamado
function cronometro () { 
    timeActual = new Date();
    acumularTime = timeActual - timeInicial;
    acumularTime2 = new Date();
    acumularTime2.setTime(acumularTime);
    ss = acumularTime2.getSeconds();
    mm = acumularTime2.getMinutes();
    hh = acumularTime2.getHours()-21;
    if (ss < 10) {ss = "0"+ss;} 
    if (mm < 10) {mm = "0"+mm;}
    if (hh < 10) {hh = "0"+hh;}
    timer.innerHTML = hh+" : "+mm+" : "+ss;
}

//------- Funcion para inicializar el temporizador
function startTimer () {
    console.log("Start timer...")
    if (isMarch == false) { 
       timeInicial = new Date();
       control = setInterval(cronometro, 10);
       isMarch = true;
    }
}

//----- Funcion para inicializar el temporizador
function stopTimer () { 
    console.log("Stop timer...")
    if (isMarch == true) {
       clearInterval(control);
       isMarch = false;
    }     
}

//----- Funcion para reiniciar el temporizador
function resetTimer () {
    if (isMarch == true) {
       clearInterval(control);
       isMarch = false;
       }
    acumularTime = 0;
    timer.innerHTML = "00 : 00 : 00";
}