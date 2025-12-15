const spotifyTracks = [
  '7gqdZpe7MlTLA59viClLoY',
  '6b9yQhy8XyaeadWPlFYSDE',
  '1GZnoLPpR9p2CwclsZnOXD'
];

function randomSpotifyTrack() {
  const randomIndex = Math.floor(Math.random() * spotifyTracks.length);
  return spotifyTracks[randomIndex];
}

function loadRandomTrack() {
  const iframe = document.getElementById('spotify-player');
  const trackId = randomSpotifyTrack();

  iframe.src = `https://open.spotify.com/embed/track/${trackId}`;
}

document.addEventListener('DOMContentLoaded', loadRandomTrack);
