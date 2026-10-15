/* ==========================================================================
   Lógica de la invitación
   ========================================================================== */
(() => {
  const C = window.BODA || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Rellenar datos desde config.js ---------- */
  const binds = {
    novia: C.novia, novio: C.novio, iniciales: C.iniciales, hashtag: C.hashtag,
    fechaTexto: C.fechaTexto, fechaLimiteRSVP: C.fechaLimiteRSVP,
    lugarNombre: C.lugar?.nombre, lugarDireccion: C.lugar?.direccion,
    cancionTitulo: C.cancionTitulo || 'Risk It All',
    cancionArtista: C.cancionArtista || 'Bruno Mars',
  };
  $$('[data-bind]').forEach(el => {
    const v = binds[el.dataset.bind];
    if (v) el.textContent = v;
  });
  if (C.novia && C.novio) document.title = `${C.novia} & ${C.novio} · Nuestra Boda`;

  /* ---------- 2. Nombres letra por letra ---------- */
  $$('.anim-letters').forEach(el => {
    const base = parseFloat(el.dataset.delay || '0.5');
    const text = el.textContent;
    el.textContent = '';
    el.setAttribute('aria-label', text);
    [...text].forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = ch === ' ' ? '\u00A0' : ch;
      s.style.setProperty('--i', i);
      s.style.setProperty('--base', base + 's');
      s.setAttribute('aria-hidden', 'true');
      el.appendChild(s);
    });
  });

  /* ---------- 3. Intro (abrir sobre) + música nativa (YouTube / Audio) ---------- */
  const audio = $('#bg-music');
  const musicBtn = $('#music-toggle');
  const musicCard = $('#music-card');
  const playSectionBtn = $('#btn-play-music');
  const musicStatusText = $('#music-status-text');
  const musicBtnText = $('#music-btn-text');
  const musicBtnIcon = $('#music-btn-icon');

  const ICON_PLAY = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  const ICON_PAUSE = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

  let isMusicPlaying = false;
  let ytPlayer = null;
  let ytReady = false;
  let pendingPlay = false;

  function updateMusicUI(playing) {
    isMusicPlaying = playing;
    if (playing) {
      musicBtn.classList.add('playing');
      musicCard?.classList.add('playing');
      if (musicStatusText) musicStatusText.textContent = 'Reproduciendo ahora 🎵';
      if (musicBtnText) musicBtnText.textContent = 'Pausar canción';
      if (musicBtnIcon) musicBtnIcon.innerHTML = ICON_PAUSE;
      musicBtn.setAttribute('aria-label', 'Pausar música');
    } else {
      musicBtn.classList.remove('playing');
      musicCard?.classList.remove('playing');
      if (musicStatusText) musicStatusText.textContent = 'Música pausada';
      if (musicBtnText) musicBtnText.textContent = 'Escuchar nuestra canción';
      if (musicBtnIcon) musicBtnIcon.innerHTML = ICON_PLAY;
      musicBtn.setAttribute('aria-label', 'Reproducir música');
    }
  }

  function playMusic() {
    if (C.youtubeVideoId) {
      if (ytReady && ytPlayer && typeof ytPlayer.playVideo === 'function') {
        ytPlayer.playVideo();
        updateMusicUI(true);
      } else {
        pendingPlay = true;
        if (musicStatusText) musicStatusText.textContent = 'Cargando melodía…';
      }
    } else if (C.musica && audio) {
      audio.play().then(() => updateMusicUI(true)).catch(() => {});
    }
  }

  function pauseMusic() {
    pendingPlay = false;
    if (C.youtubeVideoId && ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
      ytPlayer.pauseVideo();
    } else if (audio) {
      audio.pause();
    }
    updateMusicUI(false);
  }

  function toggleMusic() {
    if (isMusicPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }

  // Inicialización de YouTube Iframe API
  if (C.youtubeVideoId) {
    musicBtn.hidden = false;
    window.onYouTubeIframeAPIReady = function() {
      ytPlayer = new YT.Player('yt-player', {
        height: '180',
        width: '180',
        videoId: C.youtubeVideoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          loop: 1,
          playlist: C.youtubeVideoId,
          playsinline: 1,
        },
        events: {
          onReady: () => {
            ytReady = true;
            if (pendingPlay) {
              pendingPlay = false;
              playMusic();
            }
          },
          onStateChange: (event) => {
            // YT.PlayerState: 1 = PLAYING, 2 = PAUSED, 0 = ENDED
            if (event.data === 1) {
              updateMusicUI(true);
            } else if (event.data === 2 || event.data === 0) {
              updateMusicUI(false);
            }
          }
        }
      });
    };

    if (window.YT && window.YT.Player) {
      window.onYouTubeIframeAPIReady();
    }
  } else if (C.musica) {
    audio.src = C.musica;
    musicBtn.hidden = false;
    audio.addEventListener('play', () => updateMusicUI(true));
    audio.addEventListener('pause', () => updateMusicUI(false));
  }

  // Event listeners para los controles nativos
  if (playSectionBtn) playSectionBtn.addEventListener('click', toggleMusic);
  musicBtn.addEventListener('click', toggleMusic);

  $('#open-invitation').addEventListener('click', () => {
    document.body.classList.add('opened');
    if (C.reproducirAlAbrirSobre !== false) {
      playMusic();
    }
    burstLeaves();
    setTimeout(() => {
      document.body.classList.remove('locked');
      document.body.classList.add('intro-gone');
    }, 1700);
  });

  /* ---------- 4. Hojas de olivo cayendo (canvas) ---------- */
  const canvas = $('#leaves-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, DPR, leaves = [], sparks = [];
  const palette = ['#9aa77f', '#b5bf98', '#c2a46b', '#e3d2a8', '#7d8c5a'];

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  function makeLeaf(fromTop = false) {
    return {
      x: Math.random() * W,
      y: fromTop ? -20 - Math.random() * H * 0.5 : Math.random() * H,
      s: 6 + Math.random() * 10,
      vy: 0.35 + Math.random() * 0.8,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.008 + Math.random() * 0.015,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.02,
      flip: Math.random() * Math.PI * 2,
      color: palette[(Math.random() * palette.length) | 0],
      alpha: 0.45 + Math.random() * 0.45,
    };
  }
  function makeSpark() {
    return { x: Math.random() * W, y: Math.random() * H, r: 0.6 + Math.random() * 1.8, t: Math.random() * 6.28, sp: 0.01 + Math.random() * 0.02 };
  }
  function drawLeaf(l) {
    ctx.save();
    ctx.translate(l.x, l.y);
    ctx.rotate(l.rot);
    ctx.scale(1, Math.abs(Math.cos(l.flip)) * 0.8 + 0.2);
    ctx.globalAlpha = l.alpha;
    ctx.fillStyle = l.color;
    ctx.beginPath();
    ctx.moveTo(-l.s, 0);
    ctx.quadraticCurveTo(0, -l.s * 0.55, l.s, 0);
    ctx.quadraticCurveTo(0, l.s * 0.55, -l.s, 0);
    ctx.fill();
    ctx.strokeStyle = 'rgba(35,43,28,.35)';
    ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.moveTo(-l.s * 0.9, 0); ctx.lineTo(l.s * 0.9, 0); ctx.stroke();
    ctx.restore();
  }
  function loop() {
    ctx.clearRect(0, 0, W, H);
    sparks.forEach(p => {
      p.t += p.sp;
      ctx.globalAlpha = (Math.sin(p.t) + 1) * 0.3;
      ctx.fillStyle = '#f3e6c4';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.fill();
    });
    leaves.forEach((l, i) => {
      l.sway += l.swaySpeed;
      l.flip += 0.02;
      l.x += Math.sin(l.sway) * 0.7 + (l.vx || 0);
      if (l.vx) l.vx *= 0.97;
      l.y += l.vy;
      l.rot += l.vr;
      if (l.y > H + 30 || l.x < -40 || l.x > W + 40) leaves[i] = makeLeaf(true);
      drawLeaf(l);
    });
    ctx.globalAlpha = 1;
    if (heroVisible) requestAnimationFrame(loop); else looping = false;
  }
  function burstLeaves() {
    for (let i = 0; i < 26; i++) {
      const l = makeLeaf();
      l.x = W / 2; l.y = H / 2;
      l.vx = (Math.random() - 0.5) * 14;
      l.vy = -1 + Math.random() * 2.5;
      leaves.push(l);
    }
    setTimeout(() => { leaves = leaves.slice(0, 34); }, 6000);
  }
  let heroVisible = true, looping = false;
  if (!reduceMotion) {
    resize();
    const count = W < 600 ? 22 : 38;
    leaves = Array.from({ length: count }, () => makeLeaf());
    sparks = Array.from({ length: W < 600 ? 25 : 50 }, makeSpark);
    window.addEventListener('resize', resize);
    new IntersectionObserver(([e]) => {
      heroVisible = e.isIntersecting;
      if (heroVisible && !looping) { looping = true; loop(); }
    }).observe($('.hero'));
  }

  /* ---------- 5. Parallax suave del contenido del hero ---------- */
  const heroContent = $('.hero__content');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < innerHeight) {
      heroContent.style.transform = `translateY(${y * 0.35}px)`;
      heroContent.style.opacity = 1 - y / (innerHeight * 0.8);
    }
    updateTimeline();
  }, { passive: true });

  /* ---------- 6. Cuenta regresiva ---------- */
  const iso = C.fechaISO || '2027-04-03T15:30:00';
  const eventDate = new Date(/[zZ]|[+-]\d\d:\d\d$/.test(iso) ? iso : iso + '-05:00');
  const cdEls = { d: $('#cd-d'), h: $('#cd-h'), m: $('#cd-m'), s: $('#cd-s') };
  function setNum(el, val) {
    if (el.textContent !== val) {
      el.textContent = val;
      el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick');
    }
  }
  function tickCountdown() {
    let diff = Math.max(0, eventDate - Date.now());
    const d = Math.floor(diff / 864e5); diff %= 864e5;
    const h = Math.floor(diff / 36e5); diff %= 36e5;
    const m = Math.floor(diff / 6e4); diff %= 6e4;
    const s = Math.floor(diff / 1e3);
    setNum(cdEls.d, String(d).padStart(2, '0'));
    setNum(cdEls.h, String(h).padStart(2, '0'));
    setNum(cdEls.m, String(m).padStart(2, '0'));
    setNum(cdEls.s, String(s).padStart(2, '0'));
  }
  tickCountdown(); setInterval(tickCountdown, 1000);

  /* ---------- 7. Calendario, mapa y rutas ---------- */
  const lugar = C.lugar || {};
  const q = encodeURIComponent(lugar.consultaMapa || 'Hacienda Kala El Rosal');
  $('#map-frame').src = `https://www.google.com/maps?q=${q}&z=14&output=embed`;
  $('#btn-maps').href = `https://www.google.com/maps/search/?api=1&query=${q}`;
  $('#btn-waze').href = `https://waze.com/ul?q=${q}&navigate=yes`;

  const endDate = new Date(eventDate.getTime() + 9 * 36e5);
  const fmt = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const evTitle = `Boda de ${C.novia || ''} & ${C.novio || ''}`;
  const evPlace = `${lugar.nombre || ''}, ${lugar.direccion || ''}`;
  const evDesc = `¡Te esperamos! Más info: ${location.href.split('#')[0]}`;
  $('#btn-gcal').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    `&text=${encodeURIComponent(evTitle)}&dates=${fmt(eventDate)}/${fmt(endDate)}` +
    `&location=${encodeURIComponent(evPlace)}&details=${encodeURIComponent(evDesc)}`;
  $('#btn-ics').addEventListener('click', () => {
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Boda//ES', 'BEGIN:VEVENT',
      `UID:${Date.now()}@boda`, `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(eventDate)}`, `DTEND:${fmt(endDate)}`,
      `SUMMARY:${evTitle}`, `LOCATION:${evPlace}`, `DESCRIPTION:${evDesc}`,
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:Mañana es la boda 💍', 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = 'boda.ics';
    a.click();
  });

  /* ---------- 8. Animaciones al hacer scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    io.observe(el);
  });

  const timeline = $('#timeline'), tlProgress = $('#timeline-progress');
  function updateTimeline() {
    const r = timeline.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.7 - r.top) / r.height));
    tlProgress.style.height = (p * 100) + '%';
  }

  /* ---------- 9. Buscador de mesa ---------- */
  const norm = t => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const escHTML = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  $('#guest-search').addEventListener('input', e => {
    const term = norm(e.target.value);
    const box = $('#search-result');
    if (term.length < 3) return box.classList.remove('show');
    const words = term.split(/\s+/);
    const matches = (C.invitados || [])
      .filter(g => words.every(w => norm(g.nombre).includes(w)))
      .slice(0, 5);
    box.innerHTML = matches.length
      ? matches.map(m => `
          <div class="finder__item">
            <p class="finder__name">${escHTML(m.nombre)}</p>
            <div class="finder__table">${escHTML(m.mesa)}</div>
            <p class="small">${escHTML(m.pases)}</p>
          </div>`).join('')
      : `<div class="finder__item">
           <p class="finder__name">Aún no encontramos tu nombre</p>
           <div class="finder__table">Mesa por confirmar</div>
           <p class="small">Verifica la ortografía o escríbenos directamente.</p>
         </div>`;
    box.classList.add('show');
  });

  /* ---------- 11. RSVP ---------- */
  const form = $('#rsvp-form');
  const countEl = $('#rsvp-count');
  const max = C.maxAcompanantes || 4;
  countEl.max = max;

  $$('.stepper__btn').forEach(b => b.addEventListener('click', () => {
    const v = Math.min(max, Math.max(1, +countEl.value + +b.dataset.step));
    countEl.value = v;
    $('#companions-field').hidden = v < 2;
  }));
  $$('input[name="asistencia"]').forEach(r => r.addEventListener('change', () => {
    $('#yes-only').classList.toggle('hide', form.asistencia.value !== 'Sí');
  }));

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const err = $('#rsvp-error');
    err.textContent = '';
    const nombre = form.nombre.value.trim();
    if (nombre.length < 3) { err.textContent = 'Por favor escribe tu nombre completo.'; form.nombre.focus(); return; }

    const asiste = form.asistencia.value === 'Sí';
    const data = {
      nombre,
      asistencia: form.asistencia.value,
      personas: asiste ? +countEl.value : 0,
      acompanantes: asiste ? form.acompanantes.value.trim() : '',
      restricciones: asiste ? form.restricciones.value.trim() : '',
      cancion: asiste ? form.cancion.value.trim() : '',
      telefono: form.telefono.value.trim(),
      mensaje: form.mensaje.value.trim(),
    };

    const btn = $('#rsvp-submit');
    btn.classList.add('loading'); btn.disabled = true;

    const enviarWhatsApp = () => {
      const msg = `🌿 *Confirmación de boda* 🌿\n\n*Nombre:* ${data.nombre}\n*Asistencia:* ${data.asistencia}` +
        (asiste ? `\n*Personas:* ${data.personas}\n*Acompañantes:* ${data.acompanantes || '-'}\n*Restricciones:* ${data.restricciones || '-'}\n*Canción:* ${data.cancion || '-'}` : '') +
        `\n*Mensaje:* ${data.mensaje || '-'}`;
      const url = `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}`;
      if (!window.open(url, '_blank')) location.href = url;
    };

    try {
      if (C.modoRSVP === 'whatsapp') {
        enviarWhatsApp();
      } else {
        // Netlify Forms: guarda la respuesta en tu panel de Netlify (exportable a CSV)
        const body = new URLSearchParams({ 'form-name': 'rsvp', 'bot-field': form['bot-field'].value, ...data });
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString(),
        }).catch(() => null);
        if (!res || !res.ok) enviarWhatsApp(); // respaldo si no está publicado en Netlify
      }
      form.hidden = true;
      const thanks = $('#rsvp-thanks');
      if (!asiste) {
        $('#thanks-title').textContent = '¡Gracias por avisarnos!';
        $('#thanks-text').textContent = 'Te vamos a extrañar. Gracias por tu cariño.';
      }
      thanks.hidden = false;
      thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (asiste) confetti();
    } catch (ex) {
      err.textContent = 'Ups, no pudimos enviar tu respuesta. Inténtalo de nuevo.';
    } finally {
      btn.classList.remove('loading'); btn.disabled = false;
    }
  });

  /* ---------- 12. Confeti ---------- */
  function confetti() {
    if (reduceMotion) return;
    const cv = $('#confetti'), c = cv.getContext('2d');
    cv.width = innerWidth; cv.height = innerHeight;
    const colors = ['#c2a46b', '#e3d2a8', '#9aa77f', '#5b6b3a', '#f7f3ea'];
    const parts = Array.from({ length: 160 }, () => ({
      x: innerWidth / 2, y: innerHeight * 0.6,
      vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 18 - 6,
      w: 6 + Math.random() * 6, h: 4 + Math.random() * 8,
      r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.3,
      col: colors[(Math.random() * colors.length) | 0],
    }));
    let frames = 0;
    (function draw() {
      c.clearRect(0, 0, cv.width, cv.height);
      parts.forEach(p => {
        p.vy += 0.45; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        c.save(); c.translate(p.x, p.y); c.rotate(p.r);
        c.fillStyle = p.col; c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.cos(p.r * 2));
        c.restore();
      });
      if (++frames < 220) requestAnimationFrame(draw); else c.clearRect(0, 0, cv.width, cv.height);
    })();
  }
})();
