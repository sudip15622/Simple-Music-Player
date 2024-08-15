// console.log("Let start JavaScript, Sigma Batch OP!");
let currentsong = new Audio();
let currfolder;
let songs;

function getsongduration(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingseconds = Math.floor(seconds % 60);

    const formattedminutes = String(minutes).padStart(2, '0');
    const formattedseconds = String(remainingseconds).padStart(2, '0');

    return `${formattedminutes}:${formattedseconds}`;
}

async function getSongs(folder) {
    try {
        currfolder = folder;
        const response = await fetch(`/${currfolder}/`);
        const html = await response.text();
        const div = document.createElement("div");
        div.innerHTML = html;
        const as = div.querySelectorAll("a");
        songs = [];
        as.forEach(element => {
            if (element.href.endsWith(".m4a")) {
                songs.push(element.href);
            }
        });

        let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
        songUL.innerHTML = "";
        for (const song of songs) {
            let song_name = song.split(`${currfolder}`)[1].substring(0, 20).replace("/", "");
            songUL.innerHTML = songUL.innerHTML + `<li>
                            <div class="songkodetail">
                                <img class="invert" src="img/music.svg" alt="">
                                <div class="info">
                                    <div>${song_name}</div>
                                    <div>Sudip Don</div>
                                </div>
                            </div>
                            <div class="playnow">
                                <img src="img/play.svg" alt="" class="invert">
                            </div>
                        </li>`;
        }

        // Attach an event listner to each song
        let lis = document.querySelector(".songlist").getElementsByTagName("li");
        for (let i = 0; i < lis.length; i++) {
            const e = lis[i];
            // console.log(e);
            e.addEventListener("click", element => {
                // console.log(e.querySelector(".info").firstElementChild.innerHTML);
                playMusic(songs[i]);

            })

        }

    } catch (error) {
        console.error("Error fetching songs:", error);
        return [];
    }
}

const playMusic = (track, pause = false) => {
    // let audio = new Audio(track);
    // console.log(track);
    currentsong.src = track;
    if (!pause) {
        currentsong.play();
        play.src = ("img/pause.svg");
    }
    document.querySelector(".songinfo").innerHTML = track.split(`${currfolder}`)[1].substring(0, 30).replace(".m4a", "").replace("/", "");
    document.querySelector(".songtime").innerHTML = "0:00 / 0:00";

    let index = songs.indexOf(track);

    let lis = document.querySelector(".songlist").getElementsByTagName("li");
    for (let i = 0; i < lis.length; i++) {
        const e = lis[i];
        if (index == i) {
            const prevClickedLi = document.querySelector('.active');
            if (prevClickedLi) {
                prevClickedLi.querySelector('.playnow img').src = 'img/play.svg';
                prevClickedLi.classList.remove('active');
            }

            // Set the src attribute of the clicked <li>'s .playnow img
            const playImg = e.querySelector('.playnow img');
            playImg.src = 'img/now_playing.svg';
            e.classList.add('active');
        }

    }
    
}

async function displayalbums() {
    const response = await fetch(`/songs/`);
    const html = await response.text();
    const div = document.createElement("div");
    div.innerHTML = html;
    const anchors = div.querySelectorAll("a");
    let cardcontainer = document.querySelector(".cardContainer");
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs")) {
            let folder = (e.href.split("/").slice(-2)[0]);

            // get the metadata of the folder
            const response = await fetch(`/songs/${folder}/info.json`);
            const html = await response.json();
            cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}" class="card">
            <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"
                    fill="none">
                    <circle cx="12" cy="12" r="10" fill="#00FF00" /> <!-- Changed fill color to green -->
                    <path
                        d="M15.4531 12.3948C15.3016 13.0215 14.5857 13.4644 13.1539 14.3502C11.7697 15.2064 11.0777 15.6346 10.5199 15.4625C10.2893 15.3913 10.0793 15.2562 9.90982 15.07C9.5 14.6198 9.5 13.7465 9.5 12C9.5 10.2535 9.5 9.38018 9.90982 8.92995C10.0793 8.74381 10.2893 8.60868 10.5199 8.53753C11.0777 8.36544 11.7697 8.79357 13.1539 9.64983C14.5857 10.5356 15.3016 10.9785 15.4531 11.6052C15.5156 11.8639 15.5156 12.1361 15.4531 12.3948Z"
                        fill="#000000" stroke-width="1.5" stroke-linejoin="round" />
                    <!-- Changed fill color to black -->
                </svg>
            </div>
            <img src="/songs/${folder}/cover.jpg" alt="">
            <h3>${html.title}</h3>
            <p>${html.description}</p>
        </div>`;

        }
    }


}

async function main() {
    try {

        // Get the list of all the songs 
        await getSongs("songs/best/");
        playMusic(songs[0], true);

        // display all the albums on the page
        await displayalbums();

        // Attach an event listner to play next and previous
        play.addEventListener("click", () => {
            if (currentsong.paused) {
                currentsong.play();
                play.src = ("img/pause.svg");
            }
            else {
                currentsong.pause();
                play.src = ("img/play.svg");
            }
        })

        // Listen for time update event
        currentsong.addEventListener("timeupdate", () => {
            // console.log(currentsong.currentTime, currentsong.duration);
            document.querySelector(".songtime").innerHTML = `${getsongduration(currentsong.currentTime)}/${getsongduration(currentsong.duration)}`;
            document.querySelector(".circle").style.left = ((currentsong.currentTime / currentsong.duration) * 100) + "%";

        })


        // add an event listner to seekbar
        document.querySelector(".seekbar").addEventListener("click", e => {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
            document.querySelector(".circle").style.left = percent + "%";

            currentsong.currentTime = ((currentsong.duration) * percent) / 100;
        })


        // add event listner for hamburger 
        document.querySelector(".hamburger").addEventListener("click", () => {
            document.querySelector(".left").style.left = "0";
        })

        // add event listner for close button
        document.querySelector(".close").firstElementChild.addEventListener("click", () => {
            document.querySelector(".left").style.left = "-120%";
        })

        // add event listner to previous and next button
        previous.addEventListener("click", () => {
            let index = songs.indexOf(currentsong.src);
            let previoussong;
            if (index > 0) {
                previoussong = songs[index - 1];
                playMusic(previoussong);
            }
            else {
                previoussong = songs[songs.length - 1];
                playMusic(previoussong);
            }
        })
        next.addEventListener("click", () => {

            let index = songs.indexOf(currentsong.src);
            let nextsong;
            if (index < (songs.length - 1)) {
                nextsong = songs[index + 1];
                playMusic(nextsong);
            }
            else {
                nextsong = songs[0];
                playMusic(nextsong);
            }
        })


        // add event listner to volume range
        document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", e => {
            currentsong.volume = parseInt(e.target.value) / 100;
        })

        // ad event listner to mute the track

        document.querySelector(".volume>img").addEventListener("click", e => {
            if (e.target.src.includes("img/volume.svg")) {
                e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg");
                currentsong.volume = 0;
                document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
            }
            else {
                e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg");
                currentsong.volume = 0.4;
                document.querySelector(".range").getElementsByTagName("input")[0].value = 20;
            }
        })

        // load the playlist whenever the card is clicked
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
                await getSongs(`songs/${item.currentTarget.dataset.folder}/`);
                playMusic(songs[0]);
                const viewportWidth = window.innerWidth;
                if (viewportWidth <= 1500) {
                    if (document.querySelector(".left").style.left != "0") {
                        document.querySelector(".left").style.left = "0";
                    }
                }
            })

        })

        // add event listner to currentsong that change the song to next when present is ended
        currentsong.addEventListener("ended", ()=>{
            let index = songs.indexOf(currentsong.src);
            let nextsong;
            if (index < (songs.length - 1)) {
                nextsong = songs[index + 1];
                playMusic(nextsong);
            }
            else {
                nextsong = songs[0];
                playMusic(nextsong);
            }
        })


    } catch (error) {
        console.error("Error:", error);
    }
}
main();
