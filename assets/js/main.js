(function(){
  'use strict';

  const $ = (id) => document.getElementById(id);

  const body     = document.body;
  const portada  = $('portada');
  const envelope = $('envelope');
  const content  = $('contenido');

  /* ---------- Invitado vía URL: ?invitado=Juan%20Ortiz&cupos=2 ---------- */
  const params   = new URLSearchParams(location.search);
  const invitado = params.get('invitado');
  const cupos    = params.get('cupos');
  if (invitado && $('guestName')) $('guestName').textContent = invitado;
  if (cupos && /^\d{1,2}$/.test(cupos) && $('guestSeats')) $('guestSeats').textContent = cupos;

  /* ---------- Reproductor (opcional: solo si existe en el HTML) ---------- */
  const song      = $('song');
  const btnPlay   = $('btnPlay');
  const iconPlay  = $('iconPlay');
  const iconPause = $('iconPause');
  const progress  = $('progress');

  function setPlayingUI(isPlaying){
    if (iconPlay)  iconPlay.classList.toggle('d-none', isPlaying);
    if (iconPause) iconPause.classList.toggle('d-none', !isPlaying);
    if (btnPlay)   btnPlay.setAttribute('aria-label', isPlaying ? 'Pausar canción' : 'Reproducir canción');
  }
  function playSong(){
    if (!song) return;
    song.play().then(() => setPlayingUI(true)).catch(() => setPlayingUI(false));
  }

  if (song && btnPlay){
    btnPlay.addEventListener('click', () => song.paused ? playSong() : (song.pause(), setPlayingUI(false)));
    $('btnBack')?.addEventListener('click', () => { song.currentTime = Math.max(0, song.currentTime - 10); });
    $('btnFwd')?.addEventListener('click',  () => { if (song.duration) song.currentTime = Math.min(song.duration, song.currentTime + 10); });
    song.addEventListener('timeupdate', () => {
      if (song.duration && progress) progress.style.width = (song.currentTime / song.duration * 100) + '%';
    });
    song.addEventListener('ended', () => { setPlayingUI(false); if (progress) progress.style.width = '0'; });
  }

  /* ---------- Aparición de secciones al hacer scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting){ e.target.classList.add('is-in'); observer.unobserve(e.target); }
        });
      }, { threshold: .2 })
    : null;

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
      $('scrollCue')?.removeAttribute('tabindex');

      revealEls.forEach((el) => observer ? observer.observe(el) : el.classList.add('is-in'));
    }, 1700);

    // La interacción del usuario permite iniciar el audio
    playSong();
  }
  envelope.addEventListener('click', openEnvelope);
})();
