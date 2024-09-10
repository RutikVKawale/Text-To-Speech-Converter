
/**
 * 
 * @param {Event} e
 */
const synth = window.speechSynthesis; 

if(!synth) {
    notSynth();
} 

const text = document.querySelector('#text');

const rate = document.querySelector('#rate');
const rateText = document.querySelector('#rateText');

const pitch = document.querySelector('#pitch');
const pitchText = document.querySelector('#pitchText');

const voiceSelect = document.querySelector('#voiceSelect');
const playButton = document.querySelector("#play");
const pauseButton = document.querySelector("#pause");

let changes = false;
let paused = false;

function getVoices(){
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(synth.getVoices());
          }, 3000);
    });
};

async function populateVoices() {
    const voices = await getVoices();
    voices.forEach(voice => {
        const option = document.createElement("option");
        option.value = voice.name;
        option.setAttribute("voiceLang", voice.lang);
        option.innerHTML= `${voice.name}`;
        if(voice.default){
            option.setAttribute("selected", true);
        }
        voiceSelect.append(option);
    });   
}
populateVoices();

rate.addEventListener(
    "input", (e)=>{
        rateText.innerHTML = e.target.value
        onChanges();
});
pitch.addEventListener(
    "input", (e)=>{
        pitchText.innerHTML = e.target.value
        onChanges();
});
text.addEventListener("input", ()=> {
    onChanges();
})
voiceSelect.addEventListener("input", ()=> {
    onChanges();
})

//on changes 
function onChanges() {
    changes = true;
    playButtontext("convert new");
}

//button event listener
playButton.
    addEventListener("click", (e)=>{
        e.preventDefault();
        read();
    }
);
pauseButton.
    addEventListener("click", (e)=>{
        e.preventDefault();
        pauseAndResume();
    }
);

// play button
async function read() {
    if(synth.speaking && !changes){
       return cancelSpeech();
                
    }   
        synth.cancel();
        resume();
        playButtontext("loading.....");
        let utterance = new SpeechSynthesisUtterance(text.value);
        utterance.rate = rate.value;
        utterance.pitch = pitch.value;

        const voices = await getVoices();
        const voice = await voices.find(voice => voice.name == voiceSelect.value );
        utterance.voice = voice;
        changes = false;
        synth.speak(utterance); 
       setTimeout( playButtontext("cancel"), 3000); 

       utterance.onend = (event) => {
           cancelSpeech();}
}

function notSynth(){
    const div = document.createElement("div");
    div.classList.add("notSynth");
    div.innerHTML = "your browser do not support the functionality";
    document.body.appendChild(div);
};

function cancelSpeech() {
    synth.cancel();
    playButtontext(" play again");
    paused = false;
}
 function playButtontext(val){
    playButton.value= val;
    if(val == 'cancel'){
        playButton.style.color= " rgb(248, 55, 55)";
    }
    else {
        playButton.style.color= "rgb(35, 221, 35)";
    }
}

//pause button
function pauseAndResume(){
    if(paused) return resume();
    
    return pause();
}

function pause() {
    paused = true;
    synth.pause();
   pauseButton.value = "resume";
   pauseButton.style.color = "rgb(35, 221, 35)";
}

function resume() {
    paused = false;
    synth.resume();
    pauseButton.value = "paused";
    pauseButton.style.color = " rgb(248, 55, 55)"
}