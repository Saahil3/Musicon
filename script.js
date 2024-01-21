let currentsong = new Audio();

let songs;

let currfolder;

function sectomin(seconds){
    if(isNaN(seconds)||seconds<0){
        return "00:00"
    }
    const minutes = Math.floor(seconds/60)
    const remainsec = Math.floor(seconds%60)

    const formattedMinutes = String(minutes).padStart(2,'0')
    const formattedRemainSec = String(remainsec).padStart(2, '0')
    return `${formattedMinutes}:${formattedRemainSec}`

}

async function getsongs(folder){
    
    currfolder = folder
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text()
    // console.log(response)

    let div = document.createElement("div")
    div.innerHTML=response;

    let as = div.getElementsByTagName("a")

    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = "";
    for(const song of songs){
        songul.innerHTML = songul.innerHTML + `<li><img src="music.svg" alt="" srcset="">
                            <div class="songinfo">
                                <div>${song.replaceAll("%20"," ")}</div>
                            </div>
                            </li>`;
    }
    

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{

        e.addEventListener("click",element=>{
            playmusic(e.querySelector(".songinfo").firstElementChild.innerHTML.trim())
            

        })
    })

    return songs

}

const playmusic = (track,pause=false)=>{
    // var audio = new Audio()
   
    currentsong.src=`/${currfolder}/`+track
    
    if(!pause){
        currentsong.play();
        play.src = "pause.svg"
        document.querySelector(".songinfobar").innerHTML = decodeURI(track)
        document.querySelector(".songtime").innerHTML = "00:00/00:00"

    }
    
    

}



// async function displayalbum(){
//     let a = await fetch(`http://127.0.0.1:5500/songs/`)
//     let response = await a.text()
//     // console.log(response)

//     let div = document.createElement("div")
//     div.innerHTML=response;

//     let atag = div.getElementsByTagName("a")

//     let cardcontainer = document.querySelector(".cardcontainer")
//     Array.from(atag).forEach(async e=>{
//         if(e.href.includes("/songs")){
//             let folder = (e.href.split("/").slice(-2)[0])
//             let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
//             let response = await a.json()

//             cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}" class="card">
//             <div class="play">
//                 <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16"
//                     viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
//                     <path fill="#FFD43B"
//                         d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7v72V368c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V147L192 223.8V432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V200 128c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z" />
//                 </svg>
//             </div>

//             <img src="/songs/${folder}/cover.jpg" alt="">
//             <h4>${response.title}</h4>
//             <p>${response.description}</p>
//         </div>`
//         }
//     })

// }

async function displayalbum() {
    console.log("displaying albums")
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardcontainer")
    let array = Array.from(anchors)
    for (let index = 2; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[1]
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json(); 
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                         <div class="play">
                             <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16"
                                 viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                                 <path fill="#FFD43B"
                                     d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7v72V368c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V147L192 223.8V432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V200 128c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z" />
                             </svg>
                         </div>
            
                         <img src="/songs/${folder}/cover.jpg" alt="">
                         <h4>${response.title}</h4>
                         <p>${response.description}</p>
                     </div>`
        }
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)  
            // playmusic(songs[0])

        })
    })
    
}


async function main() {


    await getsongs("songs")
    playmusic(songs[0],true)

    // console.log(songs)
    displayalbum()




    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src = "pause.svg"
        }
        else{
            currentsong.pause()
            play.src = "play.svg"
        }
    })

    

    currentsong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML = `${sectomin(currentsong.currentTime)}/${sectomin(currentsong.duration)}`

        document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100 + "%"

        
    })

  

    document.querySelector(".seekbar").addEventListener("click",e=>{
        percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left= percent+"%"
        currentsong.currentTime = (currentsong.duration * percent )/100
        
    })

    document.querySelector("#bars").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
        // document.querySelector(".left").style.width="40%"
    })
    document.querySelector("#cross").addEventListener("click",()=>{
        
        document.querySelector(".left").style.left = "-100%";

    })

    back.addEventListener("click",()=>{
        const songIndex = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if(songIndex>0) {
            playmusic(songs[songIndex-1])
        }

    })

    forward.addEventListener("click",()=>{
        const songIndex = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if(songIndex+1<songs.length) {
            playmusic(songs[songIndex+1])
        }

    })

    const volumeButton = document.getElementById("volume-button");
const volumeRange = document.getElementById("volume-range").querySelector("input");

volumeRange.addEventListener("input", () => {
  // Get the audio element or player object you want to control
  // Replace with your audio element ID
  currentsong.volume = volumeRange.value;
});

// volumeButton.addEventListener("click", () => {
//     // Set volume to 0
//     if(currentsong.volume>0){
//         currentsong.muted = true;// Optionally, update the range input to reflect the new volume
//         volumeRange.value = 0;
//     }
//     else{
//         currentsong.muted=false;
//         volumeRange.value=currentsong.volume;
//     }
    
//   });

let isMuted = false;

volumeRange.addEventListener("input", () => {
    currentsong.volume = volumeRange.value;

    if(isMuted==true){
        isMuted = false;
        
    }
    else{
        isMuted=true;
    }
  
});
let volbtn= document.querySelector("#volbtn");
volumeButton.addEventListener("click", () => {
  isMuted = !isMuted;
  currentsong.muted = isMuted;
  if(volumeRange.value=isMuted){
    volbtn.src="mute.svg"
    volumeRange.value = 0;
  }
  else{
    volbtn.src="vol.svg"
    volumeRange.value=currentsong.volume;
  }
});
  

Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item=>{
        songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
    })
})


}

main()