// ============================================================
// firebase-config.js
// Inicializa o Firebase e exporta o que os outros arquivos usam.
// A apiKey NÃO é segredo: quem protege os dados são as Security
// Rules + Auth. Mesmo assim, restrinja os domínios autorizados
// no console (Authentication > Settings > Authorized domains).
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB_ZDYMjk0w1kpg8xr7V8Pgrz2mZUxaSns",
  authDomain: "ra-assesoria.firebaseapp.com",
  projectId: "ra-assesoria",
  storageBucket: "ra-assesoria.firebasestorage.app",
  messagingSenderId: "158032274565",
  appId: "1:158032274565:web:9cd5b0fedfa846af9cf5ec"
};

const app = initializeApp(firebaseConfig);

// Exporta as instâncias que o resto do site vai importar
export const auth = getAuth(app);
export const db = getFirestore(app);
