// CURSOR
const C=document.getElementById('cur'),C2=document.getElementById('cur2');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;C.style.left=mx+'px';C.style.top=my+'px';});
(function loop(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;C2.style.left=rx+'px';C2.style.top=ry+'px';requestAnimationFrame(loop);})();

// NEURAL BACKGROUND
const cv=document.getElementById('cv');
if(cv) {
  const cx=cv.getContext('2d');
  let W,H,nodes=[],pulses=[];
  const NC=68,MD=170,PS=3.2;
  function resize(){W=cv.width=innerWidth;H=cv.height=innerHeight;}
  function initNodes(){
    nodes=[];
    for(let i=0;i<NC;i++)nodes.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.9,vy:(Math.random()-.5)*.9,r:Math.random()*1.8+1,ph:Math.random()*Math.PI*2});
    pulses=[];
  }
  function spawnPulse(){
    for(let t=0;t<25;t++){
      const a=nodes[Math.floor(Math.random()*nodes.length)],b=nodes[Math.floor(Math.random()*nodes.length)];
      const dx=b.x-a.x,dy=b.y-a.y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<MD&&d>25){pulses.push({ax:a.x,ay:a.y,bx:b.x,by:b.y,p:0,d});break;}
    }
  }
  function draw(){
    cx.clearRect(0,0,W,H);
    nodes.forEach(n=>{n.x+=n.vx;n.y+=n.vy;n.ph+=.022;if(n.x<0||n.x>W)n.vx*=-1;if(n.y<0||n.y>H)n.vy*=-1;});
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const dx=nodes[j].x-nodes[i].x,dy=nodes[j].y-nodes[i].y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<MD){
          cx.beginPath();cx.moveTo(nodes[i].x,nodes[i].y);cx.lineTo(nodes[j].x,nodes[j].y);
          cx.strokeStyle=`rgba(123,47,255,${(1-d/MD)*.15})`;cx.lineWidth=.7;cx.stroke();
        }
      }
    }
    pulses=pulses.filter(p=>{
      p.p+=PS/p.d;if(p.p>=1)return false;
      const TR=10;
      for(let i=TR;i>=0;i--){
        const tp=Math.max(0,p.p-i*(PS/p.d)*.6);
        const tx=p.ax+(p.bx-p.ax)*tp,ty=p.ay+(p.by-p.ay)*tp;
        cx.beginPath();cx.arc(tx,ty,i===0?3.5:1.2,0,Math.PI*2);
        cx.fillStyle=`rgba(0,229,255,${(1-i/TR)*(i===0?.92:.45)})`;
        if(i===0){cx.shadowBlur=14;cx.shadowColor='rgba(0,229,255,.75)';}
        cx.fill();cx.shadowBlur=0;
      }
      return true;
    });
    nodes.forEach(n=>{
      const g=.5+.5*Math.sin(n.ph);
      cx.beginPath();cx.arc(n.x,n.y,n.r*3,0,Math.PI*2);cx.fillStyle=`rgba(168,85,247,${g*.07})`;cx.fill();
      cx.beginPath();cx.arc(n.x,n.y,n.r,0,Math.PI*2);cx.fillStyle=`rgba(168,85,247,${.35+g*.5})`;cx.fill();
    });
    if(Math.random()<.09)spawnPulse();
    requestAnimationFrame(draw);
  }
  resize();initNodes();draw();
  window.addEventListener('resize',()=>{resize();initNodes();});
}

// REVEAL
document.querySelectorAll('.rev').forEach(el=>{
  new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('on');});
  },{threshold:.1}).observe(el);
});

// CONTACT
function handleSend(e){
  e.preventDefault();const b=e.target;
  b.textContent='✓ Sent!';b.style.background='linear-gradient(135deg,#1a6e3c,#22c55e)';
  setTimeout(()=>{b.style.background='';b.setAttribute('data-i','co_send');applyLang();},3000);
}

// PAGE SWITCH (Privacy Policy Overlay)
function renderPP(){
  const pb = document.getElementById('ppBody');
  if(pb) pb.innerHTML=PP[lang]||PP.en;
}
function showPP(){
  document.getElementById('main').style.display='none';
  document.getElementById('ppPage').classList.add('on');
  if(cv) cv.style.display='none';
  window.scrollTo(0,0);renderPP();
}
function showSite(){
  document.getElementById('main').style.display='';
  document.getElementById('ppPage').classList.remove('on');
  if(cv) cv.style.display='block';
  window.scrollTo(0,0);
}

// PP CONTENT
const PP={
en:`<div class="pphili"><p>AstraBudget is designed with a <strong>privacy-first approach</strong> — the majority of data processing happens locally on your device. We do not operate servers that store your personal financial history.</p></div>
<h2>1. Introduction</h2><p>AstraBudget is a personal finance app that automatically processes banking SMS, push notifications, and receipt photos to help you track expenses.</p>
<h2>2. Data We Collect</h2><h3>2.1 Banking Notifications</h3><p>We automatically extract: transaction amounts/currencies, merchant names, dates/times, and last 4 card digits. All processing is local.</p>
<h3>2.2 Financial Data</h3><p>All data stored in an <strong>encrypted local database</strong> (Android Room). No external servers.</p>
<h3>2.3 Receipt Photos (Optional)</h3><p>Camera used only for OCR text extraction. Raw photos not stored after processing.</p>
<h2>3. AI Features</h2><h3>3.1 KlaunekAI — On-Device AI</h3><p>AstraBudget uses <strong>KlaunekAI</strong>, a proprietary AI engine built by AstraCoreNova on top of Gemma 3n. Custom prompts, fine-tuned categorization logic, fully <strong>offline</strong>. No external transmission.</p>
<h3>3.2 Cloud AI — Google Gemini (Optional)</h3><p>Premium features send only anonymized aggregated summaries or OCR text — never raw SMS, full card numbers, or personal IDs. Subject to <a href="https://policies.google.com/privacy" style="color:var(--glow)">Google's Privacy Policy</a>.</p>
<h2>4. Third-Party Services</h2><ul><li><strong>Google Play Billing:</strong> Handles subscriptions — we never access your payment details.</li><li><strong>Firebase:</strong> App integrity (App Check), anonymized crash reports, AI model downloads.</li></ul>
<h2>5. Permissions</h2><ul><li><strong>READ_SMS:</strong> Banking messages from recognized senders only.</li><li><strong>Notification Access:</strong> Push from recognized banking apps only.</li><li><strong>Camera:</strong> Optional — receipt scanning.</li><li><strong>Internet:</strong> Only for optional cloud features and subscription validation.</li></ul>
<h2>6. Security &amp; Sharing</h2><p>Encrypted local storage only. No selling or sharing of your data except as required by law.</p>
<h2>7. Deletion</h2><p>Delete any data in-app, or uninstall to permanently remove everything.</p>
<h2>8. Children</h2><p>Not directed at children under 13.</p>
<h2>9. Changes</h2><p>Significant changes notified through the app.</p>
<h2>10. Contact</h2><div class="ppbox"><p><strong>Developer:</strong> AstraCoreNova<br><strong>Email:</strong> <a href="mailto:astra.core.nova.dev@gmail.com">astra.core.nova.dev@gmail.com</a></p></div>`,

uk:`<div class="pphili"><p>AstraBudget розроблений з підходом <strong>privacy-first</strong> — більшість обробки локально на пристрої. Ми не маємо серверів для ваших фінансових даних.</p></div>
<h2>1. Вступ</h2><p>AstraBudget — фінансовий додаток, що автоматично обробляє банківські SMS, push та фото чеків.</p>
<h2>2. Дані</h2><h3>2.1 Банківські сповіщення</h3><p>Автоматично: суми, валюти, назви магазинів, дати, останні 4 цифри картки. Все локально.</p>
<h3>2.2 Фінансові дані</h3><p><strong>Зашифрована локальна база</strong> (Android Room). Без зовнішніх серверів.</p>
<h3>2.3 Фото чеків (Необов'язково)</h3><p>Камера лише для OCR. Фото не зберігаються після обробки.</p>
<h2>3. AI-функції</h2><h3>3.1 KlaunekAI — AI на пристрої</h3><p>AstraBudget використовує <strong>KlaunekAI</strong> — власний AI-двигун AstraCoreNova на базі Gemma 3n. Кастомні промпти, власна логіка категоризації, повністю <strong>офлайн</strong>. Без зовнішніх серверів.</p>
<h3>3.2 Хмарний AI — Google Gemini (Необов'язково)</h3><p>Premium надсилає лише анонімізовані агреговані дані або OCR-текст — ніколи сирий SMS чи номери карток. Регулюється <a href="https://policies.google.com/privacy" style="color:var(--glow)">Політикою Google</a>.</p>
<h2>4. Сторонні сервіси</h2><ul><li><strong>Google Play Billing:</strong> Підписки — без доступу до платіжних даних.</li><li><strong>Firebase:</strong> App Check, анонімізовані збої, завантаження AI-моделей.</li></ul>
<h2>5. Дозволи</h2><ul><li><strong>READ_SMS:</strong> Лише відомі банківські відправники.</li><li><strong>Сповіщення:</strong> Лише відомі банківські додатки.</li><li><strong>Камера:</strong> Необов'язково — чеки.</li><li><strong>Інтернет:</strong> Лише для хмарних функцій.</li></ul>
<h2>6. Безпека та передача</h2><p>Локальне зашифроване зберігання. Без продажу чи передачі даних.</p>
<h2>7. Видалення</h2><p>Видаліть у додатку або видаліть сам додаток.</p>
<h2>8. Діти</h2><p>Не для дітей до 13 років.</p>
<h2>9. Зміни</h2><p>Значні зміни — через сповіщення в додатку.</p>
<h2>10. Контакт</h2><div class="ppbox"><p><strong>Розробник:</strong> AstraCoreNova<br><strong>Email:</strong> <a href="mailto:astra.core.nova.dev@gmail.com">astra.core.nova.dev@gmail.com</a></p></div>`,

de:`<div class="pphili"><p>AstraBudget mit <strong>Privacy-First-Ansatz</strong> — Verarbeitung erfolgt lokal. Keine externen Server für Ihre Finanzdaten.</p></div>
<h2>1. Einleitung</h2><p>AstraBudget verarbeitet automatisch Banking-SMS, Push-Benachrichtigungen und Kassenbon-Fotos.</p>
<h2>2. Daten</h2><h3>2.1 Banking-Benachrichtigungen</h3><p>Automatisch: Beträge, Händlernamen, Datum, letzte 4 Ziffern. Alles lokal.</p>
<h3>2.2 Finanzdaten</h3><p><strong>Verschlüsselte lokale Datenbank</strong> (Android Room). Keine externen Server.</p>
<h3>2.3 Kassenbon-Fotos (Optional)</h3><p>Kamera nur für OCR. Fotos werden nicht gespeichert.</p>
<h2>3. KI-Funktionen</h2><h3>3.1 KlaunekAI — On-Device KI</h3><p>AstraBudget verwendet <strong>KlaunekAI</strong>, eine proprietäre KI-Engine von AstraCoreNova, aufgebaut auf Gemma 3n. Eigene Prompts, maßgeschneiderte Kategorisierung, vollständig <strong>offline</strong>.</p>
<h3>3.2 Cloud-KI — Google Gemini (Optional)</h3><p>Premium sendet nur anonymisierte Zusammenfassungen oder OCR-Text. Unterliegt der <a href="https://policies.google.com/privacy" style="color:var(--glow)">Google-Richtlinie</a>.</p>
<h2>4. Drittanbieter</h2><ul><li><strong>Google Play Billing:</strong> Abonnements — kein Zugriff auf Zahlungsdaten.</li><li><strong>Firebase:</strong> App-Integrität, anonymisierte Absturzberichte, KI-Downloads.</li></ul>
<h2>5. Berechtigungen</h2><ul><li><strong>READ_SMS:</strong> Nur erkannte Bankabsender.</li><li><strong>Benachrichtigungen:</strong> Nur erkannte Banking-Apps.</li><li><strong>Kamera:</strong> Optional.</li><li><strong>Internet:</strong> Nur für Cloud-Funktionen.</li></ul>
<h2>6. Sicherheit</h2><p>Lokale verschlüsselte Speicherung. Keine Weitergabe außer gesetzlicher Pflicht.</p>
<h2>7. Löschung</h2><p>In der App oder durch Deinstallation.</p>
<h2>8. Kinder</h2><p>Nicht für unter 13-Jährige.</p>
<h2>9. Änderungen</h2><p>Wesentliche Änderungen in der App mitgeteilt.</p>
<h2>10. Kontakt</h2><div class="ppbox"><p><strong>Entwickler:</strong> AstraCoreNova<br><strong>E-Mail:</strong> <a href="mailto:astra.core.nova.dev@gmail.com">astra.core.nova.dev@gmail.com</a></p></div>`,

fr:`<div class="pphili"><p>AstraBudget avec approche <strong>privacy-first</strong> — traitement local. Aucun serveur pour vos données.</p></div>
<h2>1. Introduction</h2><p>AstraBudget traite automatiquement SMS bancaires, push et photos de reçus.</p>
<h2>2. Données</h2><h3>2.1 Notifications bancaires</h3><p>Automatiquement : montants, commerçants, dates, 4 derniers chiffres. Tout localement.</p>
<h3>2.2 Données financières</h3><p><strong>Base locale chiffrée</strong> (Android Room). Aucun serveur externe.</p>
<h3>2.3 Photos de reçus (Optionnel)</h3><p>Caméra uniquement pour OCR. Photos non conservées.</p>
<h2>3. IA</h2><h3>3.1 KlaunekAI — IA locale</h3><p>AstraBudget utilise <strong>KlaunekAI</strong>, un moteur IA propriétaire d'AstraCoreNova basé sur Gemma 3n. Prompts personnalisés, logique de catégorisation sur mesure, entièrement <strong>hors ligne</strong>.</p>
<h3>3.2 IA Cloud — Google Gemini (Optionnel)</h3><p>Premium envoie uniquement résumés anonymisés ou texte OCR. Soumis à la <a href="https://policies.google.com/privacy" style="color:var(--glow)">politique Google</a>.</p>
<h2>4. Services tiers</h2><ul><li><strong>Google Play Billing :</strong> Abonnements — pas d'accès aux paiements.</li><li><strong>Firebase :</strong> Intégrité, rapports anonymisés, téléchargements IA.</li></ul>
<h2>5. Autorisations</h2><ul><li><strong>READ_SMS :</strong> Expéditeurs bancaires reconnus seulement.</li><li><strong>Notifications :</strong> Apps bancaires reconnues seulement.</li><li><strong>Caméra :</strong> Optionnel.</li><li><strong>Internet :</strong> Fonctions cloud optionnelles uniquement.</li></ul>
<h2>6. Sécurité</h2><p>Stockage local chiffré. Aucun partage sauf obligation légale.</p>
<h2>7. Suppression</h2><p>Dans l'app ou par désinstallation.</p>
<h2>8. Enfants</h2><p>Non destiné aux moins de 13 ans.</p>
<h2>9. Modifications</h2><p>Changements importants notifiés via l'app.</p>
<h2>10. Contact</h2><div class="ppbox"><p><strong>Développeur :</strong> AstraCoreNova<br><strong>Email :</strong> <a href="mailto:astra.core.nova.dev@gmail.com">astra.core.nova.dev@gmail.com</a></p></div>`,

it:`<div class="pphili"><p>AstraBudget con approccio <strong>privacy-first</strong> — elaborazione locale. Nessun server per i tuoi dati.</p></div>
<h2>1. Introduzione</h2><p>AstraBudget elabora automaticamente SMS bancari, push e foto di ricevute.</p>
<h2>2. Dati</h2><h3>2.1 Notifiche bancarie</h3><p>Automaticamente: importi, commercianti, date, ultime 4 cifre. Tutto localmente.</p>
<h3>2.2 Dati finanziari</h3><p><strong>Database locale crittografato</strong> (Android Room). Nessun server esterno.</p>
<h3>2.3 Foto ricevute (Opzionale)</h3><p>Fotocamera solo per OCR. Foto non conservate.</p>
<h2>3. IA</h2><h3>3.1 KlaunekAI — IA locale</h3><p>AstraBudget usa <strong>KlaunekAI</strong>, un motore IA proprietario di AstraCoreNova basato su Gemma 3n. Prompt personalizzati, logica di categorizzazione su misura, completamente <strong>offline</strong>.</p>
<h3>3.2 IA Cloud — Google Gemini (Opzionale)</h3><p>Premium invia solo riepiloghi anonimi o testo OCR. Soggetto alla <a href="https://policies.google.com/privacy" style="color:var(--glow)">politica Google</a>.</p>
<h2>4. Servizi terzi</h2><ul><li><strong>Google Play Billing:</strong> Abbonamenti — nessun accesso ai pagamenti.</li><li><strong>Firebase:</strong> Integrità, report anonimi, download modelli IA.</li></ul>
<h2>5. Autorizzazioni</h2><ul><li><strong>READ_SMS:</strong> Solo mittenti bancari riconosciuti.</li><li><strong>Notifiche:</strong> Solo app bancarie riconosciute.</li><li><strong>Fotocamera:</strong> Opzionale.</li><li><strong>Internet:</strong> Solo funzioni cloud opzionali.</li></ul>
<h2>6. Sicurezza</h2><p>Archiviazione locale crittografata. Nessuna condivisione salvo obbligo legale.</p>
<h2>7. Eliminazione</h2><p>Nell'app o disinstallando.</p>
<h2>8. Minori</h2><p>Non per minori di 13 anni.</p>
<h2>9. Modifiche</h2><p>Cambiamenti significativi notificati via app.</p>
<h2>10. Contatti</h2><div class="ppbox"><p><strong>Sviluppatore:</strong> AstraCoreNova<br><strong>Email:</strong> <a href="mailto:astra.core.nova.dev@gmail.com">astra.core.nova.dev@gmail.com</a></p></div>`,

pl:`<div class="pphili"><p>AstraBudget z podejściem <strong>privacy-first</strong> — przetwarzanie lokalne. Brak serwerów dla Twoich danych.</p></div>
<h2>1. Wprowadzenie</h2><p>AstraBudget automatycznie przetwarza bankowe SMS-y, push i zdjęcia paragonów.</p>
<h2>2. Dane</h2><h3>2.1 Powiadomienia bankowe</h3><p>Automatycznie: kwoty, sprzedawcy, daty, ostatnie 4 cyfry karty. Wszystko lokalnie.</p>
<h3>2.2 Dane finansowe</h3><p><strong>Zaszyfrowana lokalna baza</strong> (Android Room). Bez zewnętrznych serwerów.</p>
<h3>2.3 Zdjęcia paragonów (Opcjonalne)</h3><p>Aparat tylko do OCR. Zdjęcia nie przechowywane po przetworzeniu.</p>
<h2>3. AI</h2><h3>3.1 KlaunekAI — AI na urządzeniu</h3><p>AstraBudget używa <strong>KlaunekAI</strong> — własnego silnika AI AstraCoreNova zbudowanego na Gemma 3n. Własne prompty, dopasowana logika kategoryzacji, całkowicie <strong>offline</strong>.</p>
<h3>3.2 AI w chmurze — Google Gemini (Opcjonalne)</h3><p>Premium wysyła tylko zanonimizowane podsumowania lub tekst OCR. Podlega <a href="https://policies.google.com/privacy" style="color:var(--glow)">polityce Google</a>.</p>
<h2>4. Usługi zewnętrzne</h2><ul><li><strong>Google Play Billing:</strong> Subskrypcje — brak dostępu do płatności.</li><li><strong>Firebase:</strong> Integralność, anonimowe raporty, pobieranie modeli AI.</li></ul>
<h2>5. Uprawnienia</h2><ul><li><strong>READ_SMS:</strong> Tylko rozpoznani nadawcy bankowi.</li><li><strong>Powiadomienia:</strong> Tylko rozpoznane aplikacje bankowe.</li><li><strong>Aparat:</strong> Opcjonalnie.</li><li><strong>Internet:</strong> Tylko opcjonalne funkcje AI.</li></ul>
<h2>6. Bezpieczeństwo</h2><p>Zaszyfrowane lokalne przechowywanie. Bez udostępniania poza wymogami prawnymi.</p>
<h2>7. Usuwanie</h2><p>W aplikacji lub przez odinstalowanie.</p>
<h2>8. Dzieci</h2><p>Nie dla dzieci poniżej 13 lat.</p>
<h2>9. Zmiany</h2><p>Istotne zmiany notyfikowane przez aplikację.</p>
<h2>10. Kontakt</h2><div class="ppbox"><p><strong>Deweloper:</strong> AstraCoreNova<br><strong>Email:</strong> <a href="mailto:astra.core.nova.dev@gmail.com">astra.core.nova.dev@gmail.com</a></p></div>`
};

// TRANSLATIONS
const T={
en:{nav_apps:'Apps',nav_val:'Values',nav_priv:'Privacy',nav_con:'Contact',h1:'The future of AI —',h2:'without compromise',hsub:'We build AI-powered apps where your data belongs only to you. No tracking. No leaks. Pure, powerful technology.',hcta1:'↓ Explore Apps',hcta2:'Our Approach',v_tag:'Why AstraCoreNova',v_title:'Technology you can trust',v1t:'Privacy by Design',v1d:"Privacy is not a feature — it's the foundation. Your data never leaves your device without your explicit permission.",v2t:'AI on your side',v2d:'AI as a tool — powerful, useful, transparent. No black boxes.',v3t:'Minimalism & Speed',v3d:'Apps that do one thing — flawlessly. No excess permissions.',v4t:'Transparency',v4d:'Clear Privacy Policies. No hidden clauses.',a_tag:'Our Apps',a_title:'AstraBudget',a_tag2:'Smart finance. Private by default.',a_badge:'Coming Soon — Android',a_dtitle:'Automatic expense tracking',a_desc:'AstraBudget reads your banking SMS and push to track expenses — all processing happens locally. No cloud.',af1:'Auto transaction detection from SMS & push',af2:'KlaunekAI — proprietary on-device AI (based on Gemma 3n, fully offline)',af3:'Receipt photo scanning via OCR',af4:'Supports 8 countries & 30+ banks',af5:'Optional AI financial advice (anonymized, opt-in)',af6:'Encrypted local database — data never leaves your phone',a_play:'Google Play — Coming Soon',a_pp:'Privacy Policy',c_tag:'Supported Countries',c_title:'30+ banks across 8 countries',p_tag:'Our Philosophy',p_title:'Privacy is a right, not a privilege',p1:'In a world where data has become currency, we choose a different path.',p2:"Every app undergoes a privacy audit. We don't collect what we don't need.",pi1:'data sales',pi2:'transparency',pi3:'AI processing',co_tag:'Get in touch',co_title:'Questions?',co_sub:'Reach out about apps, collaboration, or privacy.',co_name:'Your name',co_email:'Email',co_msg:'Message...',co_send:'Send Message',f_pp:'Privacy Policy',f_copy:'© 2026 AstraCoreNova. All rights reserved.',pp_back:'← Back',pp_date:'Last updated: March 1, 2026', btn_learn_more:'Learn More'},
uk:{nav_apps:'Додатки',nav_val:'Цінності',nav_priv:'Приватність',nav_con:'Контакт',h1:'Майбутнє AI —',h2:'без компромісів',hsub:'Ми створюємо AI-додатки де ваші дані належать лише вам. Ніякого стеження.',hcta1:'↓ Переглянути додатки',hcta2:'Наш підхід',v_tag:'Чому AstraCoreNova',v_title:'Технологія якій можна довіряти',v1t:'Privacy by Design',v1d:'Приватність — основа. Дані не залишають пристрій без вашого дозволу.',v2t:'AI на вашій стороні',v2d:'AI як інструмент — потужний, прозорий. Без чорних скриньок.',v3t:'Мінімалізм і швидкість',v3d:'Додатки що роблять одну річ бездоганно.',v4t:'Прозорість',v4d:'Чіткі Privacy Policy. Ніяких прихованих умов.',a_tag:'Наші додатки',a_title:'AstraBudget',a_tag2:'Розумні фінанси. Приватність за замовчуванням.',a_badge:'Незабаром — Android',a_dtitle:'Автоматичне відстеження витрат',a_desc:'AstraBudget читає SMS та push для 