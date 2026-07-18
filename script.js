console.log("lets write java script")

let songs = [
    "Winning Speech.mp3",
    "Kkriegerz - Waiting For You [NCS Release].mp3",
    "2frers - FLIRT LIGHTS [NCS Release].mp3"
];
let currentSong = new Audio();
let currentSongIndex = 0;

function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";

    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    if (secs < 10) {
        secs = "0" + secs;
    }

    return `${minutes}:${secs}`;
}

function getSongUrl(songName) {
    return "/songs/" + encodeURIComponent(songName);
}

async function getSongs() {
    try {
        let a = await fetch("/songs/");
        if (a.ok) {
            let response = await a.text();
            let div = document.createElement("div");
            div.innerHTML = response;
            let links = Array.from(div.getElementsByTagName("a"));
            let discoveredSongs = links
                .map(link => link.href)
                .filter(href => href.endsWith(".mp3"))
                .map(href => decodeURIComponent(href.split("/songs/")[1] || href.split("/").pop()));

            if (discoveredSongs.length > 0) {
                return discoveredSongs;
            }
        }
    } catch (error) {
        console.warn("Could not read songs directory listing:", error);
    }

    return [
        "Winning Speech.mp3",
        "Kkriegerz - Waiting For You [NCS Release].mp3",
        "2frers - FLIRT LIGHTS [NCS Release].mp3"
    ];
}

async function main() {
    //get the llist ofall sonsgs
    songs = await getSongs()
    console.log(songs)

    let songOL = document.querySelector(".songlist ol");



    for (const song of songs) {
        console.log(song);

        songOL.innerHTML = songs
            .map(song => `<li>${decodeURIComponent(song).replace(".mp3", " ")} </li>`).join("");
    }

    Array.from(songOL.getElementsByTagName("li")).forEach((e, index) => {
        e.addEventListener("click", () => {
            currentSongIndex = index;
            currentSong.src = getSongUrl(songs[currentSongIndex]);
            currentSong.load();
            currentSong.play();

            play.src = "pause.svg";
            updateSongInfo();
        });
    });

    currentSong.addEventListener("loadedmetadata", () => {
        console.log(
            "Duration:",
            currentSong.duration
        );
    });
}
main()

let play = document.getElementById("play");

play.addEventListener("click", () => {
    if (currentSong.paused) {
        currentSong.play();
        play.src = "pause.svg";

    } else {
        currentSong.pause();

        updateSongInfo();

        play.src = "play.svg"
    }
});

let previous = document.getElementById("previous");
let next = document.getElementById("next");


next.addEventListener("click", () => {
    if (currentSongIndex < songs.length - 1) {
        currentSongIndex++;

        currentSong.src = "/songs/" + encodeURIComponent(songs[currentSongIndex]);
        currentSong.play();

        updateSongInfo();

        play.src = "pause.svg"
    }
})

previous.addEventListener("click", () => {
    if (currentSongIndex > 0) {
        currentSongIndex--
        currentSong.src = "/songs/" + encodeURIComponent(songs[currentSongIndex]);
        currentSong.play();

        updateSongInfo();

        play.src = "pause.svg";
    }
})

function updateSongInfo() {
    document.querySelector(".songinfo").innerHTML =
        decodeURIComponent(songs[currentSongIndex]).replace(".mp3", "");
}

currentSong.addEventListener("timeupdate", () => {
    console.log(
        "Current:",
        currentSong.currentTime,
        "Duration:",
        currentSong.duration
    );

    document.querySelector(".songtime").innerHTML =
        `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;

});

currentSong.addEventListener("timeupdate", () => {

    let progress = (currentSong.currentTime / currentSong.duration) * 100;

    document.querySelector(".circle").style.left = progress + "%";

});

document.querySelector(".seekbar").addEventListener("click", (e) => {

    let seekbar = e.currentTarget;
    let percent = (e.offsetX / seekbar.clientWidth) * 100;

    document.querySelector(".circle").style.left = percent + "%";

    currentSong.currentTime =
        (currentSong.duration * percent) / 100;

});

document.querySelectorAll(".card").forEach(card => {

    card.addEventListener("click", () => {

        let index = card.dataset.index;

        currentSongIndex = Number(index);
        currentSong.src = "/songs/" + encodeURIComponent(songs[currentSongIndex]);

        currentSong.load();
        currentSong.play();

        play.src = "pause.svg";

        updateSongInfo();

    });

});

