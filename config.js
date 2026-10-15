/* ==========================================================================
   CONFIGURACIÓN DE LA INVITACIÓN
   👉 Edita SOLO este archivo para personalizar toda la invitación.
   ========================================================================== */
window.BODA = {
  // --- Novios ---------------------------------------------------------------
  novia: "Ella",
  novio: "Él",
  iniciales: "E & E",            // aparecen en el sello de cera
  hashtag: "#NuestraBodaEnKala",

  // --- Fecha y hora (formato AAAA-MM-DDTHH:MM:SS, hora de Colombia) ---------
  fechaISO: "2027-04-03T15:30:00",
  fechaTexto: "Sábado · 03 · Abril · 2027",
  fechaLimiteRSVP: "1 de marzo de 2027",

  // --- Lugar ----------------------------------------------------------------
  lugar: {
    nombre: "Hacienda Kalá",
    direccion: "El Rosal, Cundinamarca · Sabana de Occidente",
    // Búsqueda usada por Google Maps / Waze (puedes poner coordenadas "4.8531,-74.2630")
    consultaMapa: "Hacienda Kala, El Rosal, Cundinamarca",
  },

  // --- Confirmaciones -------------------------------------------------------
  // "netlify"  → se guardan en tu panel de Netlify (descargas un CSV cuando quieras)
  // "whatsapp" → cada invitado te envía su respuesta por WhatsApp
  modoRSVP: "netlify",
  whatsapp: "573105393307",      // número con indicativo, sin "+" (también es el respaldo)
  maxAcompanantes: 4,            // número máximo de personas por confirmación

  // --- Música de la invitación ---------------------------------------------
  // Canción personalizada de YouTube reproducida de forma 100% nativa (sin botones ni logos de YouTube)
  // Enlace: https://www.youtube.com/watch?v=lY5V4hSLWY8
  youtubeVideoId: "lY5V4hSLWY8",  // ID del video de YouTube
  cancionTitulo: "Risk It All",
  cancionArtista: "Bruno Mars",
  reproducirAlAbrirSobre: true,   // Iniciar automáticamente cuando el invitado toca el sello de cera
  musica: "",                    // (Opcional) Si prefieres un archivo local en /assets (ej: "assets/cancion.mp3")

  // --- Invitados y mesas (buscador de mesa) ---------------------------------
  // ⚠️ Lista de EJEMPLO. Reemplázala por tus invitados reales.
  invitados: [
    // Mesa 1 · Olivo (familia novia)
    { nombre: "Valentina Restrepo",      mesa: "Mesa 1 · Olivo",     pases: "Pase individual" },
    { nombre: "Jorge Restrepo",          mesa: "Mesa 1 · Olivo",     pases: "Pase para 2 personas" },
    { nombre: "Martha Lucía Restrepo",   mesa: "Mesa 1 · Olivo",     pases: "Pase para 2 personas" },
    { nombre: "Daniel Ospina",           mesa: "Mesa 1 · Olivo",     pases: "Pase individual" },
    { nombre: "Camila Ospina",           mesa: "Mesa 1 · Olivo",     pases: "Pase individual" },
    // Mesa 2 · Eucalipto (familia novio)
    { nombre: "Andrés Gómez",            mesa: "Mesa 2 · Eucalipto", pases: "Pase para 2 personas" },
    { nombre: "Gloria Gómez",            mesa: "Mesa 2 · Eucalipto", pases: "Pase para 2 personas" },
    { nombre: "Felipe Gómez Arango",     mesa: "Mesa 2 · Eucalipto", pases: "Pase individual" },
    { nombre: "Isabela Arango",          mesa: "Mesa 2 · Eucalipto", pases: "Pase individual" },
    { nombre: "Familia Gómez Duarte",    mesa: "Mesa 2 · Eucalipto", pases: "Pase familiar (3 personas)" },
    // Mesa 3 · Salvia
    { nombre: "Laura Martínez",          mesa: "Mesa 3 · Salvia",    pases: "Pase individual" },
    { nombre: "Sebastián Cárdenas",      mesa: "Mesa 3 · Salvia",    pases: "Pase para 2 personas" },
    { nombre: "Natalia Herrera",         mesa: "Mesa 3 · Salvia",    pases: "Pase para 2 personas" },
    { nombre: "Juan Pablo Rincón",       mesa: "Mesa 3 · Salvia",    pases: "Pase individual" },
    { nombre: "Mariana Vélez",           mesa: "Mesa 3 · Salvia",    pases: "Pase individual" },
    // Mesa 4 · Romero
    { nombre: "Carlos Mejía",            mesa: "Mesa 4 · Romero",    pases: "Pase para 2 personas" },
    { nombre: "Paula Andrea Castro",     mesa: "Mesa 4 · Romero",    pases: "Pase para 2 personas" },
    { nombre: "Santiago Londoño",        mesa: "Mesa 4 · Romero",    pases: "Pase individual" },
    { nombre: "Daniela Londoño",         mesa: "Mesa 4 · Romero",    pases: "Pase individual" },
    { nombre: "Tomás Salazar",           mesa: "Mesa 4 · Romero",    pases: "Pase individual" },
    // Mesa 5 · Lavanda
    { nombre: "Sofía Rodríguez",         mesa: "Mesa 5 · Lavanda",   pases: "Pase para 2 personas" },
    { nombre: "Alejandro Torres",        mesa: "Mesa 5 · Lavanda",   pases: "Pase para 2 personas" },
    { nombre: "Manuela Quintero",        mesa: "Mesa 5 · Lavanda",   pases: "Pase individual" },
    { nombre: "Nicolás Pardo",           mesa: "Mesa 5 · Lavanda",   pases: "Pase individual" },
    { nombre: "Catalina Rojas",          mesa: "Mesa 5 · Lavanda",   pases: "Pase individual" },
    // Mesa 6 · Laurel
    { nombre: "Ricardo Moreno",          mesa: "Mesa 6 · Laurel",    pases: "Pase para 2 personas" },
    { nombre: "Ana María Jaramillo",     mesa: "Mesa 6 · Laurel",    pases: "Pase para 2 personas" },
    { nombre: "Esteban Villegas",        mesa: "Mesa 6 · Laurel",    pases: "Pase individual" },
    { nombre: "Juliana Suárez",          mesa: "Mesa 6 · Laurel",    pases: "Pase individual" },
    { nombre: "Familia Pérez Lozano",    mesa: "Mesa 6 · Laurel",    pases: "Pase familiar (4 personas)" },
    // Mesa 7 · Tomillo
    { nombre: "Mateo Zuluaga",           mesa: "Mesa 7 · Tomillo",   pases: "Pase individual" },
    { nombre: "Gabriela Montoya",        mesa: "Mesa 7 · Tomillo",   pases: "Pase individual" },
    { nombre: "David Echeverri",         mesa: "Mesa 7 · Tomillo",   pases: "Pase para 2 personas" },
    { nombre: "Luisa Fernanda Ruiz",     mesa: "Mesa 7 · Tomillo",   pases: "Pase para 2 personas" },
    { nombre: "Samuel Bernal",           mesa: "Mesa 7 · Tomillo",   pases: "Pase individual" },
    // Mesa 8 · Jazmín
    { nombre: "Hernán Castaño",          mesa: "Mesa 8 · Jazmín",    pases: "Pase para 2 personas" },
    { nombre: "Beatriz Navarro",         mesa: "Mesa 8 · Jazmín",    pases: "Pase para 2 personas" },
    { nombre: "Miguel Ángel Sierra",     mesa: "Mesa 8 · Jazmín",    pases: "Pase individual" },
    { nombre: "Carolina Patiño",         mesa: "Mesa 8 · Jazmín",    pases: "Pase individual" },
    { nombre: "Óscar Valencia",          mesa: "Mesa 8 · Jazmín",    pases: "Pase individual" },
  ],
};
