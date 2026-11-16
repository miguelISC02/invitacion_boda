(function(){
  'use strict';

  const body      = document.body;
  const portada   = document.getElementById('portada');
  const envelope  = document.getElementById('envelope');
  const content   = document.getElementById('contenido');
  const scrollCue = document.getElementById('scrollCue');

  /* ---------- Invitado vía URL: ?invitado=Juan%20Ortiz&cupos=2 ---------- */
  const params = new URLSearchParams(location.search);
  const invitado = params.get('invitado');
  const cupos = params.get('cupos');
  if (invitado) document.getElementById('guestName').textContent = invitado;
  if (cupos && /^\d{1,2}$/.test(cupos)) document.getElementById('guestSeats').textContent = cupos;

  /* ---------- Abrir sobre ---------- */
  let opened = false;
  function openEnvelope(){
    if (opened) return;
    opened = true;

    envelope.classList.add('is-open');
    envelope.setAttribute('aria-expanded', 'true');
    envelope.setAttribute('aria-label', 'Invitación abierta');
    portada.classList.add('is-opened');

    // Libera el resto del contenido cuando termina la animación
    setTimeout(() => {
      body.classList.remove('is-locked');
      content.classList.add('is-visible');
      content.removeAttribute('aria-hidden');
      scrollCue.removeAttribute('tabindex');
    }, 1700);

    // La interacción del usuario permite iniciar el audio
    playSong();
  }
  envelope.addEventListener('click', openEnvelope);

  /* ---------- Reproductor ---------- */
  const song      = document.getElementById('song');
  const btnPlay   = document.getElementById('btnPlay');
  const iconPlay  = document.getElementById('iconPlay');
  const iconPause = document.getElementById('iconPause');
  const progress  = document.getElementById('progress');

  function setPlayingUI(isPlaying){
    iconPlay.classList.toggle('d-none', isPlaying);
    iconPause.classList.toggle('d-none', !isPlaying);
    btnPlay.setAttribute('aria-label', isPlaying ? 'Pausar canción' : 'Reproducir canción');
  }
  function playSong(){
    song.play().then(() => setPlayingUI(true)).catch(() => setPlayingUI(false));
  }

  btnPlay.addEventListener('click', () => song.paused ? playSong() : (song.pause(), setPlayingUI(false)));
  document.getElementById('btnBack').addEventListener('click', () => { song.currentTime = Math.max(0, song.currentTime - 10); });
  document.getElementById('btnFwd').addEventListener('click',  () => { if (song.duration) song.currentTime = Math.min(song.duration, song.currentTime + 10); });

  song.addEventListener('timeupdate', () => {
    if (song.duration) progress.style.width = (song.currentTime / song.duration * 100) + '%';
  });
  song.addEventListener('ended', () => { setPlayingUI(false); progress.style.width = '0'; });
})();
