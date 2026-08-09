(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function a(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(s){if(s.ep)return;s.ep=!0;const i=a(s);fetch(s.href,i)}})();const E="https://backend-nutrient-production.up.railway.app/api";async function j(e){if(!e.ok){const t=await e.json();throw new Error(t.message||`HTTP Error: ${e.status}`)}return e.json()}const Fa=async()=>{const e=sessionStorage.getItem("token"),t={"Content-Type":"application/json",...e&&{Authorization:`Bearer ${e}`}};try{const a=await fetch(`${E}/admin/stats`,{method:"GET",headers:t}),n=await a.json();if(!a.ok)throw new Error(n.message||"Gagal mengambil statistik");return n.stats}catch(a){throw console.error("API Error:",a),a}};async function Na(e,t){try{const a=await fetch(`${E}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:t})});return await j(a)}catch(a){throw console.error("Login error:",a),a}}async function Ua(e){try{const t=await fetch(`${E}/auth/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});return await j(t)}catch(t){throw console.error("Register error:",t),t}}async function qa(e){try{const t=await fetch(`${E}/auth/verify-otp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});return await j(t)}catch(t){throw console.error("Verify OTP error:",t),t}}async function Ga(e){try{const t=await fetch(`${E}/auth/resend-otp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});return await j(t)}catch(t){throw console.error("Resend OTP error:",t),t}}async function Wa(){try{const e=sessionStorage.getItem("token"),t=await fetch(`${E}/admin/users`,{method:"GET",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`}});return await j(t)}catch(e){throw console.error("Get all users error:",e),e}}async function Va(e){try{const t=sessionStorage.getItem("token"),a=await fetch(`${E}/admin/users/${e}`,{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`}});return await j(a)}catch(t){throw console.error("Delete user error:",t),t}}function Ja(e){e?sessionStorage.setItem("token",e):sessionStorage.removeItem("token")}function Ya(e){sessionStorage.setItem("user",JSON.stringify(e))}function P(){const e=sessionStorage.getItem("user");return e?JSON.parse(e):null}async function Mt(){try{const e=await fetch(`${E}/gizi`,{method:"GET",headers:{"Content-Type":"application/json"}});return await j(e)}catch(e){throw console.error("Error fetching nutrition data:",e),e}}async function Pt(e){try{const t=await fetch(`${E}/gizi/search?query=${encodeURIComponent(e)}`,{method:"GET",headers:{"Content-Type":"application/json"}});return await j(t)}catch(t){throw console.error("Error searching nutrition data:",t),t}}async function At(e){const t=sessionStorage.getItem("token"),a={"Content-Type":"application/json",...t&&{Authorization:`Bearer ${t}`}};try{const n=await fetch(`${E}/rekomendasi`,{method:"POST",headers:a,body:JSON.stringify(e)}),s=await n.json();if(!n.ok)throw new Error(s.message||"Gagal mendapatkan rekomendasi");return s.recommendations||[]}catch(n){throw console.error("Error getting recommendations:",n),n}}async function Xa(e,t,a,n="",s=null,i=null){const o=sessionStorage.getItem("token"),r={"Content-Type":"application/json",...o&&{Authorization:`Bearer ${o}`}};try{const d=await fetch(`${E}/rekomendasi/save-report`,{method:"POST",headers:r,body:JSON.stringify({user_profile:e,target_nutrients:t,recommendations:a,keterangan:n,konsultasi_id:s,user_id:i})}),u=await d.json();if(!d.ok)throw new Error(u.message||"Gagal menyimpan rekomendasi");return u}catch(d){throw console.error("Error saving rekomendasi:",d),d}}async function Za(){const e=sessionStorage.getItem("token"),t={"Content-Type":"application/json",...e&&{Authorization:`Bearer ${e}`}};try{const a=await fetch(`${E}/rekomendasi/laporan`,{method:"GET",headers:t}),n=await a.json();if(!a.ok)throw new Error(n.message||"Gagal mengambil laporan");return n.data||[]}catch(a){throw console.error("Error getting laporan list:",a),a}}async function Qa(){const e=sessionStorage.getItem("token"),t={"Content-Type":"application/json",...e&&{Authorization:`Bearer ${e}`}};try{const a=await fetch(`${E}/rekomendasi/user/latest`,{method:"GET",headers:t}),n=await a.json();if(!a.ok)throw new Error(n.message||"Gagal mengambil rekomendasi");return n}catch(a){throw console.error("Error getting user latest rekomendasi:",a),a}}async function en(){const e=sessionStorage.getItem("token"),t={"Content-Type":"application/json",...e&&{Authorization:`Bearer ${e}`}};try{const a=await fetch(`${E}/rekomendasi/user/list`,{method:"GET",headers:t}),n=await a.json();if(!a.ok)throw new Error(n.message||"Gagal mengambil daftar rekomendasi");return n}catch(a){throw console.error("Error getting user rekomendasi list:",a),a}}async function tn(e){const t=sessionStorage.getItem("token"),a={"Content-Type":"application/json",...t&&{Authorization:`Bearer ${t}`}};try{const n=await fetch(`${E}/rekomendasi/user/detail/${e}`,{method:"GET",headers:a}),s=await n.json();if(!n.ok)throw new Error(s.message||"Gagal mengambil detail rekomendasi");return s}catch(n){throw console.error("Error getting user rekomendasi detail:",n),n}}async function an(e){const t=sessionStorage.getItem("token"),a={"Content-Type":"application/json",...t&&{Authorization:`Bearer ${t}`}};try{const n=await fetch(`${E}/rekomendasi/laporan/${e}`,{method:"GET",headers:a}),s=await n.json();if(!n.ok)throw new Error(s.message||"Gagal mengambil detail laporan");return s}catch(n){throw console.error("Error getting laporan detail:",n),n}}async function nn(e){const t=sessionStorage.getItem("token"),a={"Content-Type":"application/json",...t&&{Authorization:`Bearer ${t}`}};try{const n=await fetch(`${E}/rekomendasi/laporan/${e}`,{method:"DELETE",headers:a}),s=await n.json();if(!n.ok)throw new Error(s.message||"Gagal menghapus laporan");return s}catch(n){throw console.error("Error deleting laporan:",n),n}}async function _t(e="all"){const t=sessionStorage.getItem("token"),a={"Content-Type":"application/json",...t&&{Authorization:`Bearer ${t}`}};try{let n=`${E}/konsultasi`;e!=="all"&&(n+=`?status=${e}`);const s=await fetch(n,{method:"GET",headers:a}),i=await s.json();if(!s.ok)throw new Error(i.message||"Gagal mengambil daftar konsultasi");return i.data||[]}catch(n){throw console.error("Error getting konsultasi list:",n),n}}async function Dt(e){const t=sessionStorage.getItem("token"),a={"Content-Type":"application/json",...t&&{Authorization:`Bearer ${t}`}};try{const n=await fetch(`${E}/konsultasi/${e}`,{method:"GET",headers:a}),s=await n.json();if(!n.ok)throw new Error(s.message||"Gagal mengambil detail konsultasi");return s.data}catch(n){throw console.error("Error getting konsultasi detail:",n),n}}async function sn(e,t,a=""){const n=sessionStorage.getItem("token"),s={"Content-Type":"application/json",...n&&{Authorization:`Bearer ${n}`}};try{const i=await fetch(`${E}/konsultasi/${e}`,{method:"PUT",headers:s,body:JSON.stringify({status:t,respons:a})}),o=await i.json();if(!i.ok)throw new Error(o.message||"Gagal mengupdate konsultasi");return o}catch(i){throw console.error("Error updating konsultasi:",i),i}}async function jt(e){const t=sessionStorage.getItem("token"),a={"Content-Type":"application/json",...t&&{Authorization:`Bearer ${t}`}};try{const n=await fetch(`${E}/rekomendasi/available/${e}`,{method:"GET",headers:a}),s=await n.json();if(!n.ok)throw new Error(s.message||"Gagal mengambil daftar laporan");return s.data||[]}catch(n){throw console.error("Error getting available laporan:",n),n}}async function on(e){const t=sessionStorage.getItem("token"),a={"Content-Type":"application/json",...t&&{Authorization:`Bearer ${t}`}};try{const n=await fetch(`${E}/konsultasi/${e}`,{method:"DELETE",headers:a}),s=await n.json();if(!n.ok)throw new Error(s.message||"Gagal menghapus konsultasi");return s}catch(n){throw console.error("Error deleting konsultasi:",n),n}}async function rn(e,t,a=null){const n=sessionStorage.getItem("token"),s={"Content-Type":"application/json",...n&&{Authorization:`Bearer ${n}`}};try{const i=await fetch(`${E}/rekomendasi/${e}/give-to-user/${t}`,{method:"POST",headers:s,body:JSON.stringify({konsultasi_id:a})}),o=await i.json();if(!i.ok)throw new Error(o.message||"Gagal memberikan rekomendasi");return o}catch(i){throw console.error("Error giving rekomendasi to user:",i),i}}function ue(){const e=sessionStorage.getItem("token");return{"Content-Type":"application/json",...e&&{Authorization:`Bearer ${e}`}}}async function ln(e){try{const t=await fetch(`${E}/konsumsi`,{method:"POST",headers:ue(),body:JSON.stringify(e)});return await j(t)}catch(t){throw console.error("addKonsumsi error:",t),t}}async function dn(e,t=null){try{let a=`${E}/konsumsi/user/${e}`;t&&(a+=`?tanggal=${t}`);const n=await fetch(a,{method:"GET",headers:ue()});return await j(n)}catch(a){throw console.error("getKonsumsiByUser error:",a),a}}async function cn(e=null,t=null){try{const a=new URLSearchParams;e&&a.append("user_id",e),t&&a.append("tanggal",t);const n=`${E}/konsumsi${a.toString()?"?"+a.toString():""}`,s=await fetch(n,{method:"GET",headers:ue()});return await j(s)}catch(a){throw console.error("getAllKonsumsi error:",a),a}}async function un(e,t){try{const a=await fetch(`${E}/konsumsi/${e}`,{method:"PUT",headers:ue(),body:JSON.stringify(t)});return await j(a)}catch(a){throw console.error("updateKonsumsi error:",a),a}}async function Ht(e){try{const t=await fetch(`${E}/konsumsi/${e}`,{method:"DELETE",headers:ue()});return await j(t)}catch(t){throw console.error("deleteKonsumsiItem error:",t),t}}function mn(e){e.innerHTML=`
    <div class="auth-container">
      <div class="auth-card">
        <h2>Login GiziCare</h2>
        <form id="loginForm">
          <input type="email" id="email" placeholder="Masukkan email Anda" required />
          <input type="password" id="password" placeholder="Masukkan password" required />
          <button type="submit">Masuk</button>
          <div id="loginError" class="error-message" style="display:none;"></div>
          <div id="loginLoading" class="loading-message" style="display:none;">Sedang login...</div>
        </form>
        <div class="auth-footer">
          <p>Belum punya akun? <a href="/register" id="goRegister">Daftar</a></p>
        </div>
      </div>
    </div>
  `;const t=document.getElementById("loginForm"),a=document.getElementById("loginError"),n=document.getElementById("loginLoading"),s=t.querySelector("button");t.addEventListener("submit",async i=>{i.preventDefault();const o=document.getElementById("email").value,r=document.getElementById("password").value;try{a.style.display="none",n.style.display="block",s.disabled=!0;const d=await Na(o,r);Ja(d.token),Ya(d.user);const u=d.user.role;u==="ahli_gizi"?window.location.href="/petugas/dashboard":u==="pasien"?window.location.href="/user/dashboard":window.location.href="/"}catch(d){a.textContent=d.message||"Login gagal. Cek email dan password.",a.style.display="block",n.style.display="none",s.disabled=!1}}),document.getElementById("goRegister").addEventListener("click",i=>{i.preventDefault(),history.pushState({},"","/register"),window.dispatchEvent(new Event("popstate"))})}function pn(e,t){e.innerHTML=`
    <div class="auth-container">
      <div class="auth-card">
        <h2>Verifikasi Email</h2>
        <p class="verify-subtitle">Kode OTP telah dikirim ke:</p>
        <p class="email-display">${t}</p>
        
        <form id="verifyOTPForm">
          <div class="otp-inputs-container">
            <input type="text" id="otp" placeholder="Masukkan kode OTP (6 digit)" maxlength="6" required />
          </div>
          <button type="submit">Verifikasi</button>
          <div id="verifyError" class="error-message" style="display:none;"></div>
          <div id="verifySuccess" class="success-message" style="display:none;"></div>
          <div id="verifyLoading" class="loading-message" style="display:none;">Sedang memverifikasi...</div>
        </form>

        <div class="auth-footer">
          <p>Belum menerima kode? <a href="#" id="resendOTP" class="resend-link">Kirim ulang</a></p>
          <p><a href="/register" id="goRegister">Kembali ke Registrasi</a></p>
        </div>

        <div class="otp-info">
          <p>ℹ️ Kode OTP berlaku selama 10 menit</p>
          <p>Jika Anda tidak melakukan registrasi, abaikan pesan ini</p>
        </div>
      </div>
    </div>
  `;const a=document.getElementById("verifyOTPForm"),n=document.getElementById("verifyError"),s=document.getElementById("verifySuccess"),i=document.getElementById("verifyLoading"),o=document.getElementById("resendOTP"),r=a.querySelector("button");let d=0;document.getElementById("otp").addEventListener("input",v=>{v.target.value=v.target.value.replace(/[^0-9]/g,"")}),a.addEventListener("submit",async v=>{v.preventDefault();const h=document.getElementById("otp").value.trim();if(!h||h.length!==6){c("Kode OTP harus 6 digit!");return}try{m(),i.style.display="block",r.disabled=!0;const B=await qa({email:t,otp:h});g("✅ Email terverifikasi! Silakan login."),setTimeout(()=>{history.pushState({},"","/login"),window.dispatchEvent(new Event("popstate"))},2e3)}catch(B){const y=B.message||"Verifikasi gagal. Silakan coba lagi.";y.includes("kode OTP tidak valid")?c("❌ Kode OTP tidak valid atau sudah kadaluarsa."):y.includes("User tidak ditemukan")?c("❌ User tidak ditemukan. Silakan registrasi ulang."):c("❌ "+y),i.style.display="none",r.disabled=!1}}),o.addEventListener("click",async v=>{if(v.preventDefault(),d>0){alert(`Tunggu ${d} detik sebelum mengirim ulang`);return}try{o.disabled=!0;const h=await Ga({email:t});g("✅ Kode OTP baru telah dikirim ke email Anda"),d=60;const B=setInterval(()=>{d--,o.textContent=`Kirim ulang (${d}s)`,d<=0&&(clearInterval(B),o.textContent="Kirim ulang",o.disabled=!1)},1e3)}catch(h){c("❌ Gagal mengirim ulang OTP: "+h.message),o.disabled=!1}});function c(v){m(),n.textContent=v,n.style.color="#d32f2f",n.style.display="block"}function g(v){m(),s.textContent=v,s.style.color="#388e3c",s.style.display="block"}function m(){n.style.display="none",s.style.display="none"}}function gn(e){e.innerHTML=`
    <div class="auth-container">
      <div class="auth-card">
        <h2>Registrasi Akun</h2>
        <form id="registerForm">
          <input type="text" id="nama" placeholder="Nama Pengguna (Username)" required />
          <input type="email" id="email" placeholder="Email" required />
          <input type="password" id="password" placeholder="Password" required />
          <input type="password" id="confirmPassword" placeholder="Konfirmasi Password" required />
          <button type="submit">Daftar</button>
          <div id="registerError" class="error-message" style="display:none;"></div>
          <div id="registerSuccess" class="success-message" style="display:none;"></div>
          <div id="registerLoading" class="loading-message" style="display:none;">Sedang mendaftar...</div>
        </form>
        <div class="auth-footer">
          <p>Sudah punya akun? <a href="/login" id="goLogin">Login</a></p>
        </div>
      </div>
    </div>
  `;const t=document.getElementById("registerForm"),a=document.getElementById("registerError"),n=document.getElementById("registerSuccess"),s=document.getElementById("registerLoading"),i=t.querySelector("button");t.addEventListener("submit",async u=>{u.preventDefault();const c=document.getElementById("password").value,g=document.getElementById("confirmPassword").value,m=document.getElementById("nama").value.trim(),v=document.getElementById("email").value.trim();if(c!==g){o("Password tidak sama!");return}if(!m||!v||!c){o("Semua field harus diisi!");return}const h={nama:m,email:v,password:c,role:"pasien"};try{d(),s.style.display="block",i.disabled=!0;const B=await Ua(h);r("✅ Pendaftaran berhasil! Silakan verifikasi email Anda."),sessionStorage.setItem("verifyEmail",v),setTimeout(()=>{history.pushState({},"","/verify-otp"),window.dispatchEvent(new Event("popstate"))},1500)}catch(B){const y=B.message||"Pendaftaran gagal. Silakan coba lagi.";y.includes("Email sudah terdaftar")?o("❌ Email '"+v+"' sudah terdaftar."):y.includes("Gagal mengirim OTP")?o("❌ Gagal mengirim OTP ke email. Pastikan EMAIL_USER dan EMAIL_PASSWORD sudah dikonfigurasi di server. Silakan hubungi admin atau coba lagi nanti."):o("❌ "+y),s.style.display="none",i.disabled=!1}});function o(u){d(),a.textContent=u,a.style.color="#d32f2f",a.style.display="block"}function r(u){d(),n.textContent=u,n.style.color="#388e3c",n.style.display="block"}function d(){a.style.display="none",n.style.display="none",s.style.display="none"}document.getElementById("goLogin").addEventListener("click",u=>{u.preventDefault(),history.pushState({},"","/login"),window.dispatchEvent(new Event("popstate"))})}const hn="/assets/logo-D1nNVnXe.jpeg";function vn(e){e.innerHTML=`
    <div class="home-container">
      <div class="navbar-home">
        <div class="navbar-logo">
          <img src="${hn}" alt="GiziCare Logo" class="logo-img" />
          <span class="logo-text"><span style="color: #07d425;">Gizi</span><span style="color: #1659eb;">Care</span></span>
        </div>
      </div>
      
      <div class="home-content">
        <h1>Selamat Datang di <span style="color: #07d425;">Gizi</span><span style="color: #1659eb;">Care</span></h1>
        <p>Aplikasi Rekomendasi makanan yang membantu anda mendapatkan nutrisi yang optimal dengan bantuan dari ahli gizi.</p>
        <div class="home-links">
          <a href="/login" class="btn-primary">Masuk</a>
          <a href="/register" class="btn-secondary">Daftar</a>
        </div>
      </div>
    </div>
  `}function f(e){if(!e)return"";const t={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"};return String(e).replace(/[&<>"']/g,a=>t[a])}function Rt(e,t,a){if(typeof e=="function"?e===t:e.has(t))return arguments.length<3?t:a;throw new TypeError("Private element is not present on this object")}function fn(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object")}function wt(e,t){return e.get(Rt(e,t))}function wn(e,t,a){fn(e,t),t.set(e,a)}function bn(e,t,a){return e.set(Rt(e,t),a),a}const kn=100,p={},yn=()=>{p.previousActiveElement instanceof HTMLElement?(p.previousActiveElement.focus(),p.previousActiveElement=null):document.body&&document.body.focus()},Bn=e=>new Promise(t=>{if(!e)return t();const a=window.scrollX,n=window.scrollY;p.restoreFocusTimeout=setTimeout(()=>{yn(),t()},kn),window.scrollTo(a,n)}),zt="swal2-",En=["container","shown","height-auto","iosfix","popup","modal","no-backdrop","no-transition","toast","toast-shown","show","hide","close","title","html-container","actions","confirm","deny","cancel","footer","icon","icon-content","image","input","file","range","select","radio","checkbox","label","textarea","inputerror","input-label","validation-message","progress-steps","active-progress-step","progress-step","progress-step-line","loader","loading","styled","top","top-start","top-end","top-left","top-right","center","center-start","center-end","center-left","center-right","bottom","bottom-start","bottom-end","bottom-left","bottom-right","grow-row","grow-column","grow-fullscreen","rtl","timer-progress-bar","timer-progress-bar-container","scrollbar-measure","icon-success","icon-warning","icon-info","icon-question","icon-error","draggable","dragging"],l=En.reduce((e,t)=>(e[t]=zt+t,e),{}),xn=["success","warning","info","question","error"],Be=xn.reduce((e,t)=>(e[t]=zt+t,e),{}),Kt="SweetAlert2:",et=e=>e.charAt(0).toUpperCase()+e.slice(1),M=e=>{console.warn(`${Kt} ${typeof e=="object"?e.join(" "):e}`)},ee=e=>{console.error(`${Kt} ${e}`)},bt=[],Tn=e=>{bt.includes(e)||(bt.push(e),M(e))},Ot=(e,t=null)=>{Tn(`"${e}" is deprecated and will be removed in the next major release.${t?` Use "${t}" instead.`:""}`)},Ae=e=>typeof e=="function"?e():e,tt=e=>e&&typeof e.toPromise=="function",me=e=>tt(e)?e.toPromise():Promise.resolve(e),at=e=>e&&Promise.resolve(e)===e,A=()=>document.body.querySelector(`.${l.container}`),pe=e=>{const t=A();return t?t.querySelector(e):null},H=e=>pe(`.${e}`),k=()=>H(l.popup),oe=()=>H(l.icon),$n=()=>H(l["icon-content"]),Ft=()=>H(l.title),nt=()=>H(l["html-container"]),Nt=()=>H(l.image),st=()=>H(l["progress-steps"]),_e=()=>H(l["validation-message"]),O=()=>pe(`.${l.actions} .${l.confirm}`),re=()=>pe(`.${l.actions} .${l.cancel}`),te=()=>pe(`.${l.actions} .${l.deny}`),Cn=()=>H(l["input-label"]),le=()=>pe(`.${l.loader}`),ge=()=>H(l.actions),Ut=()=>H(l.footer),De=()=>H(l["timer-progress-bar"]),it=()=>H(l.close),Sn=`
  a[href],
  area[href],
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled]),
  button:not([disabled]),
  iframe,
  object,
  embed,
  [tabindex="0"],
  [contenteditable],
  audio[controls],
  video[controls],
  summary
`,ot=()=>{const e=k();if(!e)return[];const t=e.querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])'),a=Array.from(t).sort((i,o)=>{const r=parseInt(i.getAttribute("tabindex")||"0"),d=parseInt(o.getAttribute("tabindex")||"0");return r>d?1:r<d?-1:0}),n=e.querySelectorAll(Sn),s=Array.from(n).filter(i=>i.getAttribute("tabindex")!=="-1");return[...new Set(a.concat(s))].filter(i=>_(i))},rt=()=>U(document.body,l.shown)&&!U(document.body,l["toast-shown"])&&!U(document.body,l["no-backdrop"]),je=()=>{const e=k();return e?U(e,l.toast):!1},Ln=()=>{const e=k();return e?e.hasAttribute("data-loading"):!1},R=(e,t)=>{if(e.textContent="",t){const n=new DOMParser().parseFromString(t,"text/html"),s=n.querySelector("head");s&&Array.from(s.childNodes).forEach(o=>{e.appendChild(o)});const i=n.querySelector("body");i&&Array.from(i.childNodes).forEach(o=>{o instanceof HTMLVideoElement||o instanceof HTMLAudioElement?e.appendChild(o.cloneNode(!0)):e.appendChild(o)})}},U=(e,t)=>{if(!t)return!1;const a=t.split(/\s+/);for(let n=0;n<a.length;n++)if(!e.classList.contains(a[n]))return!1;return!0},In=(e,t)=>{Array.from(e.classList).forEach(a=>{!Object.values(l).includes(a)&&!Object.values(Be).includes(a)&&!Object.values(t.showClass||{}).includes(a)&&e.classList.remove(a)})},D=(e,t,a)=>{if(In(e,t),!t.customClass)return;const n=t.customClass[a];if(n){if(typeof n!="string"&&!n.forEach){M(`Invalid type of customClass.${a}! Expected string or iterable object, got "${typeof n}"`);return}b(e,n)}},He=(e,t)=>{if(!t)return null;switch(t){case"select":case"textarea":case"file":return e.querySelector(`.${l.popup} > .${l[t]}`);case"checkbox":return e.querySelector(`.${l.popup} > .${l.checkbox} input`);case"radio":return e.querySelector(`.${l.popup} > .${l.radio} input:checked`)||e.querySelector(`.${l.popup} > .${l.radio} input:first-child`);case"range":return e.querySelector(`.${l.popup} > .${l.range} input`);default:return e.querySelector(`.${l.popup} > .${l.input}`)}},qt=e=>{if(e.focus(),e.type!=="file"){const t=e.value;e.value="",e.value=t}},Gt=(e,t,a)=>{!e||!t||(typeof t=="string"&&(t=t.split(/\s+/).filter(Boolean)),t.forEach(n=>{Array.isArray(e)?e.forEach(s=>{a?s.classList.add(n):s.classList.remove(n)}):a?e.classList.add(n):e.classList.remove(n)}))},b=(e,t)=>{Gt(e,t,!0)},z=(e,t)=>{Gt(e,t,!1)},W=(e,t)=>{const a=Array.from(e.children);for(let n=0;n<a.length;n++){const s=a[n];if(s instanceof HTMLElement&&U(s,t))return s}},Z=(e,t,a)=>{a===`${parseInt(`${a}`)}`&&(a=parseInt(a)),a||parseInt(`${a}`)===0?e.style.setProperty(t,typeof a=="number"?`${a}px`:a):e.style.removeProperty(t)},L=(e,t="flex")=>{e&&(e.style.display=t)},I=e=>{e&&(e.style.display="none")},lt=(e,t="block")=>{e&&new MutationObserver(()=>{he(e,e.innerHTML,t)}).observe(e,{childList:!0,subtree:!0})},kt=(e,t,a,n)=>{const s=e.querySelector(t);s&&s.style.setProperty(a,n)},he=(e,t,a="flex")=>{t?L(e,a):I(e)},_=e=>!!(e&&(e.offsetWidth||e.offsetHeight||e.getClientRects().length)),Mn=()=>!_(O())&&!_(te())&&!_(re()),We=e=>e.scrollHeight>e.clientHeight,Pn=(e,t)=>{let a=e;for(;a&&a!==t;){if(We(a))return!0;a=a.parentElement}return!1},Wt=e=>{const t=window.getComputedStyle(e),a=parseFloat(t.getPropertyValue("animation-duration")||"0"),n=parseFloat(t.getPropertyValue("transition-duration")||"0");return a>0||n>0},dt=(e,t=!1)=>{const a=De();a&&_(a)&&(t&&(a.style.transition="none",a.style.width="100%"),setTimeout(()=>{a.style.transition=`width ${e/1e3}s linear`,a.style.width="0%"},10))},An=()=>{const e=De();if(!e)return;const t=parseInt(window.getComputedStyle(e).width);e.style.removeProperty("transition"),e.style.width="100%";const a=parseInt(window.getComputedStyle(e).width),n=t/a*100;e.style.width=`${n}%`},_n=()=>typeof window>"u"||typeof document>"u",Dn=`
 <div aria-labelledby="${l.title}" aria-describedby="${l["html-container"]}" class="${l.popup}" tabindex="-1">
   <button type="button" class="${l.close}"></button>
   <ul class="${l["progress-steps"]}"></ul>
   <div class="${l.icon}"></div>
   <img class="${l.image}" />
   <h2 class="${l.title}" id="${l.title}"></h2>
   <div class="${l["html-container"]}" id="${l["html-container"]}"></div>
   <input class="${l.input}" id="${l.input}" />
   <input type="file" class="${l.file}" />
   <div class="${l.range}">
     <input type="range" />
     <output></output>
   </div>
   <select class="${l.select}" id="${l.select}"></select>
   <div class="${l.radio}"></div>
   <label class="${l.checkbox}">
     <input type="checkbox" id="${l.checkbox}" />
     <span class="${l.label}"></span>
   </label>
   <textarea class="${l.textarea}" id="${l.textarea}"></textarea>
   <div class="${l["validation-message"]}" id="${l["validation-message"]}"></div>
   <div class="${l.actions}">
     <div class="${l.loader}"></div>
     <button type="button" class="${l.confirm}"></button>
     <button type="button" class="${l.deny}"></button>
     <button type="button" class="${l.cancel}"></button>
   </div>
   <div class="${l.footer}"></div>
   <div class="${l["timer-progress-bar-container"]}">
     <div class="${l["timer-progress-bar"]}"></div>
   </div>
 </div>
`.replace(/(^|\n)\s*/g,""),jn=()=>{const e=A();return e?(e.remove(),z([document.documentElement,document.body],[l["no-backdrop"],l["toast-shown"],l["has-column"]]),!0):!1},X=()=>{p.currentInstance&&p.currentInstance.resetValidationMessage()},Hn=()=>{const e=k();if(!e)return;const t=W(e,l.input),a=W(e,l.file),n=e.querySelector(`.${l.range} input`),s=e.querySelector(`.${l.range} output`),i=W(e,l.select),o=e.querySelector(`.${l.checkbox} input`),r=W(e,l.textarea);t&&(t.oninput=X),a&&(a.onchange=X),i&&(i.onchange=X),o&&(o.onchange=X),r&&(r.oninput=X),n&&s&&(n.oninput=()=>{X(),s.value=n.value},n.onchange=()=>{X(),s.value=n.value})},Rn=e=>{if(typeof e=="string"){const t=document.querySelector(e);if(!t)throw new Error(`Target element "${e}" not found`);return t}return e},zn=e=>{const t=k();t&&(t.setAttribute("role",e.toast?"alert":"dialog"),t.setAttribute("aria-live",e.toast?"polite":"assertive"),e.toast||t.setAttribute("aria-modal","true"))},Kn=e=>{window.getComputedStyle(e).direction==="rtl"&&(b(A(),l.rtl),p.isRTL=!0)},On=e=>{const t=jn();if(_n()){ee("SweetAlert2 requires document to initialize");return}const a=document.createElement("div");a.className=l.container,t&&b(a,l["no-transition"]),R(a,Dn),a.dataset.swal2Theme=e.theme;const n=Rn(e.target||"body");n.appendChild(a),e.topLayer&&(a.setAttribute("popover",""),a.showPopover()),zn(e),Kn(n),Hn()},ct=(e,t)=>{e instanceof HTMLElement?t.appendChild(e):typeof e=="object"?Fn(e,t):e&&R(t,e)},Fn=(e,t)=>{"jquery"in e?Nn(t,e):R(t,e.toString())},Nn=(e,t)=>{if(e.textContent="",0 in t)for(let a=0;a in t;a++)e.appendChild(t[a].cloneNode(!0));else e.appendChild(t.cloneNode(!0))},Un=(e,t)=>{const a=ge(),n=le();!a||!n||(!t.showConfirmButton&&!t.showDenyButton&&!t.showCancelButton?I(a):L(a),D(a,t,"actions"),qn(a,n,t),R(n,t.loaderHtml||""),D(n,t,"loader"))};function qn(e,t,a){const n=O(),s=te(),i=re();!n||!s||!i||(Ne(n,"confirm",a),Ne(s,"deny",a),Ne(i,"cancel",a),Gn(n,s,i,a),a.reverseButtons&&(a.toast?(e.insertBefore(i,n),e.insertBefore(s,n)):(e.insertBefore(i,t),e.insertBefore(s,t),e.insertBefore(n,t))))}function Gn(e,t,a,n){if(!n.buttonsStyling){z([e,t,a],l.styled);return}b([e,t,a],l.styled),n.confirmButtonColor&&e.style.setProperty("--swal2-confirm-button-background-color",n.confirmButtonColor),n.denyButtonColor&&t.style.setProperty("--swal2-deny-button-background-color",n.denyButtonColor),n.cancelButtonColor&&a.style.setProperty("--swal2-cancel-button-background-color",n.cancelButtonColor),Fe(e),Fe(t),Fe(a)}function Fe(e){const t=window.getComputedStyle(e);if(t.getPropertyValue("--swal2-action-button-focus-box-shadow"))return;const a=t.backgroundColor.replace(/rgba?\((\d+), (\d+), (\d+).*/,"rgba($1, $2, $3, 0.5)");e.style.setProperty("--swal2-action-button-focus-box-shadow",t.getPropertyValue("--swal2-outline").replace(/ rgba\(.*/,` ${a}`))}function Ne(e,t,a){const n=et(t);he(e,a[`show${n}Button`],"inline-block"),R(e,a[`${t}ButtonText`]||""),e.setAttribute("aria-label",a[`${t}ButtonAriaLabel`]||""),e.className=l[t],D(e,a,`${t}Button`)}const Wn=(e,t)=>{const a=it();a&&(R(a,t.closeButtonHtml||""),D(a,t,"closeButton"),he(a,t.showCloseButton),a.setAttribute("aria-label",t.closeButtonAriaLabel||""))},Vn=(e,t)=>{const a=A();a&&(Jn(a,t.backdrop),Yn(a,t.position),Xn(a,t.grow),D(a,t,"container"))};function Jn(e,t){typeof t=="string"?e.style.background=t:t||b([document.documentElement,document.body],l["no-backdrop"])}function Yn(e,t){t&&(t in l?b(e,l[t]):(M('The "position" parameter is not valid, defaulting to "center"'),b(e,l.center)))}function Xn(e,t){t&&b(e,l[`grow-${t}`])}var x={innerParams:new WeakMap,domCache:new WeakMap};const Zn=["input","file","range","select","radio","checkbox","textarea"],Qn=(e,t)=>{const a=k();if(!a)return;const n=x.innerParams.get(e),s=!n||t.input!==n.input;Zn.forEach(i=>{const o=W(a,l[i]);o&&(as(i,t.inputAttributes),o.className=l[i],s&&I(o))}),t.input&&(s&&es(t),ns(t))},es=e=>{if(!e.input)return;if(!$[e.input]){ee(`Unexpected type of input! Expected ${Object.keys($).join(" | ")}, got "${e.input}"`);return}const t=Vt(e.input);if(!t)return;const a=$[e.input](t,e);L(t),e.inputAutoFocus&&setTimeout(()=>{qt(a)})},ts=e=>{for(let t=0;t<e.attributes.length;t++){const a=e.attributes[t].name;["id","type","value","style"].includes(a)||e.removeAttribute(a)}},as=(e,t)=>{const a=k();if(!a)return;const n=He(a,e);if(n){ts(n);for(const s in t)n.setAttribute(s,t[s])}},ns=e=>{if(!e.input)return;const t=Vt(e.input);t&&D(t,e,"input")},ut=(e,t)=>{!e.placeholder&&t.inputPlaceholder&&(e.placeholder=t.inputPlaceholder)},ve=(e,t,a)=>{if(a.inputLabel){const n=document.createElement("label"),s=l["input-label"];n.setAttribute("for",e.id),n.className=s,typeof a.customClass=="object"&&b(n,a.customClass.inputLabel),n.innerText=a.inputLabel,t.insertAdjacentElement("beforebegin",n)}},Vt=e=>{const t=k();if(t)return W(t,l[e]||l.input)},Ee=(e,t)=>{["string","number"].includes(typeof t)?e.value=`${t}`:at(t)||M(`Unexpected type of inputValue! Expected "string", "number" or "Promise", got "${typeof t}"`)},$={};$.text=$.email=$.password=$.number=$.tel=$.url=$.search=$.date=$["datetime-local"]=$.time=$.week=$.month=(e,t)=>{const a=e;return Ee(a,t.inputValue),ve(a,a,t),ut(a,t),a.type=t.input,a};$.file=(e,t)=>{const a=e;return ve(a,a,t),ut(a,t),a};$.range=(e,t)=>{const a=e,n=a.querySelector("input"),s=a.querySelector("output");return n&&(Ee(n,t.inputValue),n.type=t.input,ve(n,e,t)),s&&Ee(s,t.inputValue),e};$.select=(e,t)=>{const a=e;if(a.textContent="",t.inputPlaceholder){const n=document.createElement("option");R(n,t.inputPlaceholder),n.value="",n.disabled=!0,n.selected=!0,a.appendChild(n)}return ve(a,a,t),a};$.radio=e=>{const t=e;return t.textContent="",e};$.checkbox=(e,t)=>{const a=k();if(!a)throw new Error("Popup not found");const n=He(a,"checkbox");if(!n)throw new Error("Checkbox input not found");n.value="1",n.checked=!!t.inputValue;const i=e.querySelector("span");if(i){const o=t.inputPlaceholder||t.inputLabel;o&&R(i,o)}return n};$.textarea=(e,t)=>{const a=e;Ee(a,t.inputValue),ut(a,t),ve(a,a,t);const n=s=>parseInt(window.getComputedStyle(s).marginLeft)+parseInt(window.getComputedStyle(s).marginRight);return setTimeout(()=>{if("MutationObserver"in window){const s=k();if(!s)return;const i=parseInt(window.getComputedStyle(s).width),o=()=>{if(!document.body.contains(a))return;const r=a.offsetWidth+n(a),d=k();d&&(r>i?d.style.width=`${r}px`:Z(d,"width",t.width))};new MutationObserver(o).observe(a,{attributes:!0,attributeFilter:["style"]})}}),a};const ss=(e,t)=>{const a=nt();a&&(lt(a),D(a,t,"htmlContainer"),t.html?(ct(t.html,a),L(a,"block")):t.text?(a.textContent=t.text,L(a,"block")):I(a),Qn(e,t))},is=(e,t)=>{const a=Ut();a&&(lt(a),he(a,!!t.footer,"block"),t.footer&&ct(t.footer,a),D(a,t,"footer"))},os=(e,t)=>{const a=x.innerParams.get(e),n=oe();if(!n)return;if(a&&t.icon===a.icon){Bt(n,t),yt(n,t);return}if(!t.icon&&!t.iconHtml){I(n);return}if(t.icon&&Object.keys(Be).indexOf(t.icon)===-1){ee(`Unknown icon! Expected "success", "error", "warning", "info" or "question", got "${t.icon}"`),I(n);return}L(n),Bt(n,t),yt(n,t),b(n,t.showClass&&t.showClass.icon),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",Jt)},yt=(e,t)=>{for(const[a,n]of Object.entries(Be))t.icon!==a&&z(e,n);b(e,t.icon&&Be[t.icon]),ds(e,t),Jt(),D(e,t,"icon")},Jt=()=>{const e=k();if(!e)return;const t=window.getComputedStyle(e).getPropertyValue("background-color"),a=e.querySelectorAll("[class^=swal2-success-circular-line], .swal2-success-fix");for(let n=0;n<a.length;n++)a[n].style.backgroundColor=t},rs=e=>`
  ${e.animation?'<div class="swal2-success-circular-line-left"></div>':""}
  <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>
  <div class="swal2-success-ring"></div>
  ${e.animation?'<div class="swal2-success-fix"></div>':""}
  ${e.animation?'<div class="swal2-success-circular-line-right"></div>':""}
`,ls=`
  <span class="swal2-x-mark">
    <span class="swal2-x-mark-line-left"></span>
    <span class="swal2-x-mark-line-right"></span>
  </span>
`,Bt=(e,t)=>{if(!t.icon&&!t.iconHtml)return;let a=e.innerHTML,n="";t.iconHtml?n=Et(t.iconHtml):t.icon==="success"?(n=rs(t),a=a.replace(/ style=".*?"/g,"")):t.icon==="error"?n=ls:t.icon&&(n=Et({question:"?",warning:"!",info:"i"}[t.icon])),a.trim()!==n.trim()&&R(e,n)},ds=(e,t)=>{if(t.iconColor){e.style.color=t.iconColor,e.style.borderColor=t.iconColor;for(const a of[".swal2-success-line-tip",".swal2-success-line-long",".swal2-x-mark-line-left",".swal2-x-mark-line-right"])kt(e,a,"background-color",t.iconColor);kt(e,".swal2-success-ring","border-color",t.iconColor)}},Et=e=>`<div class="${l["icon-content"]}">${e}</div>`,cs=(e,t)=>{const a=Nt();if(a){if(!t.imageUrl){I(a);return}L(a,""),a.setAttribute("src",t.imageUrl),a.setAttribute("alt",t.imageAlt||""),Z(a,"width",t.imageWidth),Z(a,"height",t.imageHeight),a.className=l.image,D(a,t,"image")}};let mt=!1,Yt=0,Xt=0,Zt=0,Qt=0;const us=e=>{e.addEventListener("mousedown",xe),document.body.addEventListener("mousemove",Te),e.addEventListener("mouseup",$e),e.addEventListener("touchstart",xe),document.body.addEventListener("touchmove",Te),e.addEventListener("touchend",$e)},ms=e=>{e.removeEventListener("mousedown",xe),document.body.removeEventListener("mousemove",Te),e.removeEventListener("mouseup",$e),e.removeEventListener("touchstart",xe),document.body.removeEventListener("touchmove",Te),e.removeEventListener("touchend",$e)},xe=e=>{const t=k();if(!t)return;const a=oe();if(e.target===t||a&&a.contains(e.target)){mt=!0;const n=ea(e);Yt=n.clientX,Xt=n.clientY,Zt=parseInt(t.style.insetInlineStart)||0,Qt=parseInt(t.style.insetBlockStart)||0,b(t,"swal2-dragging")}},Te=e=>{const t=k();if(t&&mt){let{clientX:a,clientY:n}=ea(e);const s=a-Yt;t.style.insetInlineStart=`${Zt+(p.isRTL?-s:s)}px`,t.style.insetBlockStart=`${Qt+(n-Xt)}px`}},$e=()=>{const e=k();mt=!1,z(e,"swal2-dragging")},ea=e=>{let t=0,a=0;return e.type.startsWith("mouse")?(t=e.clientX,a=e.clientY):e.type.startsWith("touch")&&(t=e.touches[0].clientX,a=e.touches[0].clientY),{clientX:t,clientY:a}},ps=(e,t)=>{const a=A(),n=k();if(!(!a||!n)){if(t.toast){Z(a,"width",t.width),n.style.width="100%";const s=le();s&&n.insertBefore(s,oe())}else Z(n,"width",t.width);Z(n,"padding",t.padding),t.color&&(n.style.color=t.color),t.background&&(n.style.background=t.background),I(_e()),gs(n,t),t.draggable&&!t.toast?(b(n,l.draggable),us(n)):(z(n,l.draggable),ms(n))}},gs=(e,t)=>{const a=t.showClass||{};e.className=`${l.popup} ${_(e)?a.popup:""}`,t.toast?(b([document.documentElement,document.body],l["toast-shown"]),b(e,l.toast)):b(e,l.modal),D(e,t,"popup"),typeof t.customClass=="string"&&b(e,t.customClass),t.icon&&b(e,l[`icon-${t.icon}`])},hs=(e,t)=>{const a=st();if(!a)return;const{progressSteps:n,currentProgressStep:s}=t;if(!n||n.length===0||s===void 0){I(a);return}L(a),a.textContent="",s>=n.length&&M("Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)"),n.forEach((i,o)=>{const r=vs(i);if(a.appendChild(r),o===s&&b(r,l["active-progress-step"]),o!==n.length-1){const d=fs(t);a.appendChild(d)}})},vs=e=>{const t=document.createElement("li");return b(t,l["progress-step"]),R(t,e),t},fs=e=>{const t=document.createElement("li");return b(t,l["progress-step-line"]),e.progressStepsDistance&&Z(t,"width",e.progressStepsDistance),t},ws=(e,t)=>{const a=Ft();a&&(lt(a),he(a,!!(t.title||t.titleText),"block"),t.title&&ct(t.title,a),t.titleText&&(a.innerText=t.titleText),D(a,t,"title"))},ta=(e,t)=>{var a;ps(e,t),Vn(e,t),hs(e,t),os(e,t),cs(e,t),ws(e,t),Wn(e,t),ss(e,t),Un(e,t),is(e,t);const n=k();typeof t.didRender=="function"&&n&&t.didRender(n),(a=p.eventEmitter)===null||a===void 0||a.emit("didRender",n)},bs=()=>_(k()),aa=()=>{var e;return(e=O())===null||e===void 0?void 0:e.click()},ks=()=>{var e;return(e=te())===null||e===void 0?void 0:e.click()},ys=()=>{var e;return(e=re())===null||e===void 0?void 0:e.click()},de=Object.freeze({cancel:"cancel",backdrop:"backdrop",close:"close",esc:"esc",timer:"timer"}),na=e=>{if(e.keydownTarget&&e.keydownHandlerAdded&&e.keydownHandler){const t=e.keydownHandler;e.keydownTarget.removeEventListener("keydown",t,{capture:e.keydownListenerCapture}),e.keydownHandlerAdded=!1}},Bs=(e,t,a)=>{if(na(e),!t.toast){const n=i=>xs(t,i,a);e.keydownHandler=n;const s=t.keydownListenerCapture?window:k();if(s){e.keydownTarget=s,e.keydownListenerCapture=t.keydownListenerCapture;const i=n;e.keydownTarget.addEventListener("keydown",i,{capture:e.keydownListenerCapture}),e.keydownHandlerAdded=!0}}},Ve=(e,t)=>{var a;const n=ot();if(n.length){e=e+t,e===-2&&(e=n.length-1),e===n.length?e=0:e===-1&&(e=n.length-1),n[e].focus();return}(a=k())===null||a===void 0||a.focus()},sa=["ArrowRight","ArrowDown"],Es=["ArrowLeft","ArrowUp"],xs=(e,t,a)=>{e&&(t.isComposing||t.keyCode===229||(e.stopKeydownPropagation&&t.stopPropagation(),t.key==="Enter"?Ts(t,e):t.key==="Tab"?$s(t):[...sa,...Es].includes(t.key)?Cs(t.key):t.key==="Escape"&&Ss(t,e,a)))},Ts=(e,t)=>{if(!Ae(t.allowEnterKey))return;const a=k();if(!a||!t.input)return;const n=He(a,t.input);if(e.target&&n&&e.target instanceof HTMLElement&&e.target.outerHTML===n.outerHTML){if(["textarea","file"].includes(t.input))return;aa(),e.preventDefault()}},$s=e=>{const t=e.target,a=ot();let n=-1;for(let s=0;s<a.length;s++)if(t===a[s]){n=s;break}e.shiftKey?Ve(n,-1):Ve(n,1),e.stopPropagation(),e.preventDefault()},Cs=e=>{const t=ge(),a=O(),n=te(),s=re();if(!t||!a||!n||!s)return;const i=[a,n,s];if(document.activeElement instanceof HTMLElement&&!i.includes(document.activeElement))return;const o=sa.includes(e)?"nextElementSibling":"previousElementSibling";let r=document.activeElement;if(r){for(let d=0;d<t.children.length;d++){if(r=r[o],!r)return;if(r instanceof HTMLButtonElement&&_(r))break}r instanceof HTMLButtonElement&&r.focus()}},Ss=(e,t,a)=>{e.preventDefault(),Ae(t.allowEscapeKey)&&a(de.esc)};var ne={swalPromiseResolve:new WeakMap,swalPromiseReject:new WeakMap};const Ls=()=>{const e=A();Array.from(document.body.children).forEach(a=>{a.contains(e)||(a.hasAttribute("aria-hidden")&&a.setAttribute("data-previous-aria-hidden",a.getAttribute("aria-hidden")||""),a.setAttribute("aria-hidden","true"))})},ia=()=>{Array.from(document.body.children).forEach(t=>{t.hasAttribute("data-previous-aria-hidden")?(t.setAttribute("aria-hidden",t.getAttribute("data-previous-aria-hidden")||""),t.removeAttribute("data-previous-aria-hidden")):t.removeAttribute("aria-hidden")})},oa=typeof window<"u"&&!!window.GestureEvent,Is=()=>{if(oa&&!U(document.body,l.iosfix)){const e=document.body.scrollTop;document.body.style.top=`${e*-1}px`,b(document.body,l.iosfix),Ms()}},Ms=()=>{const e=A();if(!e)return;let t;e.ontouchstart=a=>{t=Ps(a)},e.ontouchmove=a=>{t&&(a.preventDefault(),a.stopPropagation())}},Ps=e=>{const t=e.target,a=A(),n=nt();return!a||!n||As(e)||_s(e)?!1:t===a||!We(a)&&t instanceof HTMLElement&&!Pn(t,n)&&t.tagName!=="INPUT"&&t.tagName!=="TEXTAREA"&&!(We(n)&&n.contains(t))},As=e=>!!(e.touches&&e.touches.length&&e.touches[0].touchType==="stylus"),_s=e=>e.touches&&e.touches.length>1,Ds=()=>{if(U(document.body,l.iosfix)){const e=parseInt(document.body.style.top,10);z(document.body,l.iosfix),document.body.style.top="",document.body.scrollTop=e*-1}},js=()=>{const e=document.createElement("div");e.className=l["scrollbar-measure"],document.body.appendChild(e);const t=e.getBoundingClientRect().width-e.clientWidth;return document.body.removeChild(e),t};let ae=null;const Hs=e=>{ae===null&&(document.body.scrollHeight>window.innerHeight||e==="scroll")&&(ae=parseInt(window.getComputedStyle(document.body).getPropertyValue("padding-right")),document.body.style.paddingRight=`${ae+js()}px`)},Rs=()=>{ae!==null&&(document.body.style.paddingRight=`${ae}px`,ae=null)};function ra(e,t,a,n){je()?xt(e,n):(Bn(a).then(()=>xt(e,n)),na(p)),oa?(t.setAttribute("style","display:none !important"),t.removeAttribute("class"),t.innerHTML=""):t.remove(),rt()&&(Rs(),Ds(),ia()),zs()}function zs(){z([document.documentElement,document.body],[l.shown,l["height-auto"],l["no-backdrop"],l["toast-shown"]])}function V(e){e=Os(e);const t=ne.swalPromiseResolve.get(this),a=Ks(this);this.isAwaitingPromise?e.isDismissed||(fe(this),t(e)):a&&t(e)}const Ks=e=>{const t=k();if(!t)return!1;const a=x.innerParams.get(e);if(!a||U(t,a.hideClass.popup))return!1;z(t,a.showClass.popup),b(t,a.hideClass.popup);const n=A();return z(n,a.showClass.backdrop),b(n,a.hideClass.backdrop),Fs(e,t,a),!0};function la(e){const t=ne.swalPromiseReject.get(this);fe(this),t&&t(e)}const fe=e=>{e.isAwaitingPromise&&(delete e.isAwaitingPromise,x.innerParams.get(e)||e._destroy())},Os=e=>typeof e>"u"?{isConfirmed:!1,isDenied:!1,isDismissed:!0}:Object.assign({isConfirmed:!1,isDenied:!1,isDismissed:!1},e),Fs=(e,t,a)=>{var n;const s=A(),i=Wt(t);typeof a.willClose=="function"&&a.willClose(t),(n=p.eventEmitter)===null||n===void 0||n.emit("willClose",t),i&&s?Ns(e,t,s,!!a.returnFocus,a.didClose):s&&ra(e,s,!!a.returnFocus,a.didClose)},Ns=(e,t,a,n,s)=>{p.swalCloseEventFinishedCallback=ra.bind(null,e,a,n,s);const i=function(o){if(o.target===t){var r;(r=p.swalCloseEventFinishedCallback)===null||r===void 0||r.call(p),delete p.swalCloseEventFinishedCallback,t.removeEventListener("animationend",i),t.removeEventListener("transitionend",i)}};t.addEventListener("animationend",i),t.addEventListener("transitionend",i)},xt=(e,t)=>{setTimeout(()=>{var a;typeof t=="function"&&t.bind(e.params)(),(a=p.eventEmitter)===null||a===void 0||a.emit("didClose"),e._destroy&&e._destroy()})},se=e=>{let t=k();if(t||new w,t=k(),!t)return;const a=le();je()?I(oe()):Us(t,e),L(a),t.setAttribute("data-loading","true"),t.setAttribute("aria-busy","true"),t.focus()},Us=(e,t)=>{const a=ge(),n=le();!a||!n||(!t&&_(O())&&(t=O()),L(a),t&&(I(t),n.setAttribute("data-button-to-replace",t.className),a.insertBefore(n,t)),b([e,a],l.loading))},qs=(e,t)=>{t.input==="select"||t.input==="radio"?Ys(e,t):["text","email","number","tel","textarea"].some(a=>a===t.input)&&(tt(t.inputValue)||at(t.inputValue))&&(se(O()),Xs(e,t))},Gs=(e,t)=>{const a=e.getInput();if(!a)return null;switch(t.input){case"checkbox":return Ws(a);case"radio":return Vs(a);case"file":return Js(a);default:return t.inputAutoTrim?a.value.trim():a.value}},Ws=e=>e.checked?1:0,Vs=e=>e.checked?e.value:null,Js=e=>e.files&&e.files.length?e.getAttribute("multiple")!==null?e.files:e.files[0]:null,Ys=(e,t)=>{const a=k();if(!a)return;const n=s=>{t.input==="select"?Zs(a,Ce(s),t):t.input==="radio"&&Qs(a,Ce(s),t)};tt(t.inputOptions)||at(t.inputOptions)?(se(O()),me(t.inputOptions).then(s=>{e.hideLoading(),n(s)})):typeof t.inputOptions=="object"?n(t.inputOptions):ee(`Unexpected type of inputOptions! Expected object, Map or Promise, got ${typeof t.inputOptions}`)},Xs=(e,t)=>{const a=e.getInput();a&&(I(a),me(t.inputValue).then(n=>{a.value=t.input==="number"?`${parseFloat(n)||0}`:`${n}`,L(a),a.focus(),e.hideLoading()}).catch(n=>{ee(`Error in inputValue promise: ${n}`),a.value="",L(a),a.focus(),e.hideLoading()}))};function Zs(e,t,a){const n=W(e,l.select);if(!n)return;const s=(i,o,r)=>{const d=document.createElement("option");d.value=r,R(d,o),d.selected=da(r,a.inputValue),i.appendChild(d)};t.forEach(i=>{const o=i[0],r=i[1];if(Array.isArray(r)){const d=document.createElement("optgroup");d.label=o,d.disabled=!1,n.appendChild(d),r.forEach(u=>s(d,u[1],u[0]))}else s(n,r,o)}),n.focus()}function Qs(e,t,a){const n=W(e,l.radio);if(!n)return;t.forEach(i=>{const o=i[0],r=i[1],d=document.createElement("input"),u=document.createElement("label");d.type="radio",d.name=l.radio,d.value=o,da(o,a.inputValue)&&(d.checked=!0);const c=document.createElement("span");R(c,r),c.className=l.label,u.appendChild(d),u.appendChild(c),n.appendChild(u)});const s=n.querySelectorAll("input");s.length&&s[0].focus()}const Ce=e=>{const t=[];return e instanceof Map?e.forEach((a,n)=>{let s=a;typeof s=="object"&&(s=Ce(s)),t.push([n,s])}):Object.keys(e).forEach(a=>{let n=e[a];typeof n=="object"&&(n=Ce(n)),t.push([a,n])}),t},da=(e,t)=>!!t&&t!==null&&t!==void 0&&t.toString()===e.toString(),ei=e=>{const t=x.innerParams.get(e);e.disableButtons(),t.input?ca(e,"confirm"):gt(e,!0)},ti=e=>{const t=x.innerParams.get(e);e.disableButtons(),t.returnInputValueOnDeny?ca(e,"deny"):pt(e,!1)},ai=(e,t)=>{e.disableButtons(),t(de.cancel)},ca=(e,t)=>{const a=x.innerParams.get(e);if(!a.input){ee(`The "input" parameter is needed to be set when using returnInputValueOn${et(t)}`);return}const n=e.getInput(),s=Gs(e,a);a.inputValidator?ni(e,s,t):n&&!n.checkValidity()?(e.enableButtons(),e.showValidationMessage(a.validationMessage||n.validationMessage)):t==="deny"?pt(e,s):gt(e,s)},ni=(e,t,a)=>{const n=x.innerParams.get(e);e.disableInput(),Promise.resolve().then(()=>me(n.inputValidator(t,n.validationMessage))).then(i=>{e.enableButtons(),e.enableInput(),i?e.showValidationMessage(i):a==="deny"?pt(e,t):gt(e,t)})},pt=(e,t)=>{const a=x.innerParams.get(e);a.showLoaderOnDeny&&se(te()),a.preDeny?(e.isAwaitingPromise=!0,Promise.resolve().then(()=>me(a.preDeny(t,a.validationMessage))).then(s=>{s===!1?(e.hideLoading(),fe(e)):e.close({isDenied:!0,value:typeof s>"u"?t:s})}).catch(s=>ua(e,s))):e.close({isDenied:!0,value:t})},Tt=(e,t)=>{e.close({isConfirmed:!0,value:t})},ua=(e,t)=>{e.rejectPromise(t)},gt=(e,t)=>{const a=x.innerParams.get(e);a.showLoaderOnConfirm&&se(),a.preConfirm?(e.resetValidationMessage(),e.isAwaitingPromise=!0,Promise.resolve().then(()=>me(a.preConfirm(t,a.validationMessage))).then(s=>{_(_e())||s===!1?(e.hideLoading(),fe(e)):Tt(e,typeof s>"u"?t:s)}).catch(s=>ua(e,s))):Tt(e,t)};function Se(){const e=x.innerParams.get(this);if(!e)return;const t=x.domCache.get(this);I(t.loader),je()?e.icon&&L(oe()):si(t),z([t.popup,t.actions],l.loading),t.popup.removeAttribute("aria-busy"),t.popup.removeAttribute("data-loading"),t.confirmButton.disabled=!1,t.denyButton.disabled=!1,t.cancelButton.disabled=!1}const si=e=>{const t=e.loader.getAttribute("data-button-to-replace"),a=t?e.popup.getElementsByClassName(t):[];a.length?L(a[0],"inline-block"):Mn()&&I(e.actions)};function ma(){const e=x.innerParams.get(this),t=x.domCache.get(this);return t?He(t.popup,e.input):null}function pa(e,t,a){const n=x.domCache.get(e);t.forEach(s=>{n[s].disabled=a})}function ga(e,t){const a=k();if(!(!a||!e))if(e.type==="radio"){const n=a.querySelectorAll(`[name="${l.radio}"]`);for(let s=0;s<n.length;s++)n[s].disabled=t}else e.disabled=t}function ha(){pa(this,["confirmButton","denyButton","cancelButton"],!1)}function va(){pa(this,["confirmButton","denyButton","cancelButton"],!0)}function fa(){ga(this.getInput(),!1)}function wa(){ga(this.getInput(),!0)}function ba(e){const t=x.domCache.get(this),a=x.innerParams.get(this);R(t.validationMessage,e),t.validationMessage.className=l["validation-message"],a.customClass&&a.customClass.validationMessage&&b(t.validationMessage,a.customClass.validationMessage),L(t.validationMessage);const n=this.getInput();n&&(n.setAttribute("aria-invalid","true"),n.setAttribute("aria-describedby",l["validation-message"]),qt(n),b(n,l.inputerror))}function ka(){const e=x.domCache.get(this);e.validationMessage&&I(e.validationMessage);const t=this.getInput();t&&(t.removeAttribute("aria-invalid"),t.removeAttribute("aria-describedby"),z(t,l.inputerror))}const J={title:"",titleText:"",text:"",html:"",footer:"",icon:void 0,iconColor:void 0,iconHtml:void 0,template:void 0,toast:!1,draggable:!1,animation:!0,theme:"light",showClass:{popup:"swal2-show",backdrop:"swal2-backdrop-show",icon:"swal2-icon-show"},hideClass:{popup:"swal2-hide",backdrop:"swal2-backdrop-hide",icon:"swal2-icon-hide"},customClass:{},target:"body",color:void 0,backdrop:!0,heightAuto:!0,allowOutsideClick:!0,allowEscapeKey:!0,allowEnterKey:!0,stopKeydownPropagation:!0,keydownListenerCapture:!1,showConfirmButton:!0,showDenyButton:!1,showCancelButton:!1,preConfirm:void 0,preDeny:void 0,confirmButtonText:"OK",confirmButtonAriaLabel:"",confirmButtonColor:void 0,denyButtonText:"No",denyButtonAriaLabel:"",denyButtonColor:void 0,cancelButtonText:"Cancel",cancelButtonAriaLabel:"",cancelButtonColor:void 0,buttonsStyling:!0,reverseButtons:!1,focusConfirm:!0,focusDeny:!1,focusCancel:!1,returnFocus:!0,showCloseButton:!1,closeButtonHtml:"&times;",closeButtonAriaLabel:"Close this dialog",loaderHtml:"",showLoaderOnConfirm:!1,showLoaderOnDeny:!1,imageUrl:void 0,imageWidth:void 0,imageHeight:void 0,imageAlt:"",timer:void 0,timerProgressBar:!1,width:void 0,padding:void 0,background:void 0,input:void 0,inputPlaceholder:"",inputLabel:"",inputValue:"",inputOptions:{},inputAutoFocus:!0,inputAutoTrim:!0,inputAttributes:{},inputValidator:void 0,returnInputValueOnDeny:!1,validationMessage:void 0,grow:!1,position:"center",progressSteps:[],currentProgressStep:void 0,progressStepsDistance:void 0,willOpen:void 0,didOpen:void 0,didRender:void 0,willClose:void 0,didClose:void 0,didDestroy:void 0,scrollbarPadding:!0,topLayer:!1},ii=["allowEscapeKey","allowOutsideClick","background","buttonsStyling","cancelButtonAriaLabel","cancelButtonColor","cancelButtonText","closeButtonAriaLabel","closeButtonHtml","color","confirmButtonAriaLabel","confirmButtonColor","confirmButtonText","currentProgressStep","customClass","denyButtonAriaLabel","denyButtonColor","denyButtonText","didClose","didDestroy","draggable","footer","hideClass","html","icon","iconColor","iconHtml","imageAlt","imageHeight","imageUrl","imageWidth","preConfirm","preDeny","progressSteps","returnFocus","reverseButtons","showCancelButton","showCloseButton","showConfirmButton","showDenyButton","text","title","titleText","theme","willClose"],oi={allowEnterKey:void 0},ri=["allowOutsideClick","allowEnterKey","backdrop","draggable","focusConfirm","focusDeny","focusCancel","returnFocus","heightAuto","keydownListenerCapture"],ya=e=>Object.prototype.hasOwnProperty.call(J,e),Ba=e=>ii.indexOf(e)!==-1,Ea=e=>oi[e],li=e=>{ya(e)||M(`Unknown parameter "${e}"`)},di=e=>{ri.includes(e)&&M(`The parameter "${e}" is incompatible with toasts`)},ci=e=>{const t=Ea(e);t&&Ot(e,t)},xa=e=>{e.backdrop===!1&&e.allowOutsideClick&&M('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`'),e.theme&&!["light","dark","auto","minimal","borderless","bootstrap-4","bootstrap-4-light","bootstrap-4-dark","bootstrap-5","bootstrap-5-light","bootstrap-5-dark","material-ui","material-ui-light","material-ui-dark","embed-iframe","bulma","bulma-light","bulma-dark"].includes(e.theme)&&M(`Invalid theme "${e.theme}"`);for(const t in e)li(t),e.toast&&di(t),ci(t)};function Ta(e){const t=A(),a=k(),n=x.innerParams.get(this);if(!a||U(a,n.hideClass.popup)){M("You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.");return}const s=ui(e),i=Object.assign({},n,s);xa(i),t&&(t.dataset.swal2Theme=i.theme),ta(this,i),x.innerParams.set(this,i),Object.defineProperties(this,{params:{value:Object.assign({},this.params,e),writable:!1,enumerable:!0}})}const ui=e=>{const t={};return Object.keys(e).forEach(a=>{if(Ba(a)){const n=e;t[a]=n[a]}else M(`Invalid parameter to update: ${a}`)}),t};function $a(){var e;const t=x.domCache.get(this),a=x.innerParams.get(this);if(!a){Ca(this);return}t.popup&&p.swalCloseEventFinishedCallback&&(p.swalCloseEventFinishedCallback(),delete p.swalCloseEventFinishedCallback),typeof a.didDestroy=="function"&&a.didDestroy(),(e=p.eventEmitter)===null||e===void 0||e.emit("didDestroy"),mi(this)}const mi=e=>{Ca(e),delete e.params,delete p.keydownHandler,delete p.keydownTarget,delete p.currentInstance},Ca=e=>{e.isAwaitingPromise?(Ue(x,e),e.isAwaitingPromise=!0):(Ue(ne,e),Ue(x,e),delete e.isAwaitingPromise,delete e.disableButtons,delete e.enableButtons,delete e.getInput,delete e.disableInput,delete e.enableInput,delete e.hideLoading,delete e.disableLoading,delete e.showValidationMessage,delete e.resetValidationMessage,delete e.close,delete e.closePopup,delete e.closeModal,delete e.closeToast,delete e.rejectPromise,delete e.update,delete e._destroy)},Ue=(e,t)=>{for(const a in e)e[a].delete(t)};var pi=Object.freeze({__proto__:null,_destroy:$a,close:V,closeModal:V,closePopup:V,closeToast:V,disableButtons:va,disableInput:wa,disableLoading:Se,enableButtons:ha,enableInput:fa,getInput:ma,handleAwaitingPromise:fe,hideLoading:Se,rejectPromise:la,resetValidationMessage:ka,showValidationMessage:ba,update:Ta});const gi=(e,t,a)=>{e.toast?hi(e,t,a):(fi(t),wi(t),bi(e,t,a))},hi=(e,t,a)=>{t.popup.onclick=()=>{e&&(vi(e)||e.timer||e.input)||a(de.close)}},vi=e=>!!(e.showConfirmButton||e.showDenyButton||e.showCancelButton||e.showCloseButton);let Le=!1;const fi=e=>{e.popup.onmousedown=()=>{e.container.onmouseup=function(t){e.container.onmouseup=()=>{},t.target===e.container&&(Le=!0)}}},wi=e=>{e.container.onmousedown=t=>{t.target===e.container&&t.preventDefault(),e.popup.onmouseup=function(a){e.popup.onmouseup=()=>{},(a.target===e.popup||a.target instanceof HTMLElement&&e.popup.contains(a.target))&&(Le=!0)}}},bi=(e,t,a)=>{t.container.onclick=n=>{if(Le){Le=!1;return}n.target===t.container&&Ae(e.allowOutsideClick)&&a(de.backdrop)}},ki=e=>typeof e=="object"&&e!==null&&"jquery"in e,$t=e=>e instanceof Element||ki(e),yi=e=>{const t={};return typeof e[0]=="object"&&!$t(e[0])?Object.assign(t,e[0]):["title","html","icon"].forEach((a,n)=>{const s=e[n];typeof s=="string"||$t(s)?t[a]=s:s!==void 0&&ee(`Unexpected type of ${a}! Expected "string" or "Element", got ${typeof s}`)}),t};function Bi(...e){return new this(...e)}function Ei(e){class t extends this{_main(n,s){return super._main(n,Object.assign({},e,s))}}return t}const xi=()=>p.timeout&&p.timeout.getTimerLeft(),Sa=()=>{if(p.timeout)return An(),p.timeout.stop()},La=()=>{if(p.timeout){const e=p.timeout.start();return dt(e),e}},Ti=()=>{const e=p.timeout;return e&&(e.running?Sa():La())},$i=e=>{if(p.timeout){const t=p.timeout.increase(e);return dt(t,!0),t}},Ci=()=>!!(p.timeout&&p.timeout.isRunning());let Ct=!1;const Je={};function Si(e="data-swal-template"){Je[e]=this,Ct||(document.body.addEventListener("click",Li),Ct=!0)}const Li=e=>{for(let t=e.target;t&&t!==document;t=t.parentNode)for(const a in Je){const n=t.getAttribute&&t.getAttribute(a);if(n){Je[a].fire({template:n});return}}};class Ii{constructor(){this.events={}}_getHandlersByEventName(t){return typeof this.events[t]>"u"&&(this.events[t]=[]),this.events[t]}on(t,a){const n=this._getHandlersByEventName(t);n.includes(a)||n.push(a)}once(t,a){const n=(...s)=>{this.removeListener(t,n),a.apply(this,s)};this.on(t,n)}emit(t,...a){this._getHandlersByEventName(t).forEach(n=>{try{n.apply(this,a)}catch(s){console.error(s)}})}removeListener(t,a){const n=this._getHandlersByEventName(t),s=n.indexOf(a);s>-1&&n.splice(s,1)}removeAllListeners(t){this.events[t]!==void 0&&(this.events[t].length=0)}reset(){this.events={}}}p.eventEmitter=new Ii;const Mi=(e,t)=>{p.eventEmitter&&p.eventEmitter.on(e,t)},Pi=(e,t)=>{p.eventEmitter&&p.eventEmitter.once(e,t)},Ai=(e,t)=>{if(p.eventEmitter){if(!e){p.eventEmitter.reset();return}t?p.eventEmitter.removeListener(e,t):p.eventEmitter.removeAllListeners(e)}};var _i=Object.freeze({__proto__:null,argsToParams:yi,bindClickHandler:Si,clickCancel:ys,clickConfirm:aa,clickDeny:ks,enableLoading:se,fire:Bi,getActions:ge,getCancelButton:re,getCloseButton:it,getConfirmButton:O,getContainer:A,getDenyButton:te,getFocusableElements:ot,getFooter:Ut,getHtmlContainer:nt,getIcon:oe,getIconContent:$n,getImage:Nt,getInputLabel:Cn,getLoader:le,getPopup:k,getProgressSteps:st,getTimerLeft:xi,getTimerProgressBar:De,getTitle:Ft,getValidationMessage:_e,increaseTimer:$i,isDeprecatedParameter:Ea,isLoading:Ln,isTimerRunning:Ci,isUpdatableParameter:Ba,isValidParameter:ya,isVisible:bs,mixin:Ei,off:Ai,on:Mi,once:Pi,resumeTimer:La,showLoading:se,stopTimer:Sa,toggleTimer:Ti});class Di{constructor(t,a){this.callback=t,this.remaining=a,this.running=!1,this.start()}start(){return this.running||(this.running=!0,this.started=new Date,this.id=setTimeout(this.callback,this.remaining)),this.remaining}stop(){return this.started&&this.running&&(this.running=!1,clearTimeout(this.id),this.remaining-=new Date().getTime()-this.started.getTime()),this.remaining}increase(t){const a=this.running;return a&&this.stop(),this.remaining+=t,a&&this.start(),this.remaining}getTimerLeft(){return this.running&&(this.stop(),this.start()),this.remaining}isRunning(){return this.running}}const Ia=["swal-title","swal-html","swal-footer"],ji=e=>{const t=typeof e.template=="string"?document.querySelector(e.template):e.template;if(!t)return{};const a=t.content;return Ui(a),Object.assign(Hi(a),Ri(a),zi(a),Ki(a),Oi(a),Fi(a),Ni(a,Ia))},Hi=e=>{const t={};return Array.from(e.querySelectorAll("swal-param")).forEach(n=>{Q(n,["name","value"]);const s=n.getAttribute("name"),i=n.getAttribute("value");!s||!i||(s in J&&typeof J[s]=="boolean"?t[s]=i!=="false":s in J&&typeof J[s]=="object"?t[s]=JSON.parse(i):t[s]=i)}),t},Ri=e=>{const t={};return Array.from(e.querySelectorAll("swal-function-param")).forEach(n=>{const s=n.getAttribute("name"),i=n.getAttribute("value");!s||!i||(t[s]=new Function(`return ${i}`)())}),t},zi=e=>{const t={};return Array.from(e.querySelectorAll("swal-button")).forEach(n=>{Q(n,["type","color","aria-label"]);const s=n.getAttribute("type");if(!(!s||!["confirm","cancel","deny"].includes(s))){if(t[`${s}ButtonText`]=n.innerHTML,t[`show${et(s)}Button`]=!0,n.hasAttribute("color")){const i=n.getAttribute("color");i!==null&&(t[`${s}ButtonColor`]=i)}if(n.hasAttribute("aria-label")){const i=n.getAttribute("aria-label");i!==null&&(t[`${s}ButtonAriaLabel`]=i)}}}),t},Ki=e=>{const t={},a=e.querySelector("swal-image");return a&&(Q(a,["src","width","height","alt"]),a.hasAttribute("src")&&(t.imageUrl=a.getAttribute("src")||void 0),a.hasAttribute("width")&&(t.imageWidth=a.getAttribute("width")||void 0),a.hasAttribute("height")&&(t.imageHeight=a.getAttribute("height")||void 0),a.hasAttribute("alt")&&(t.imageAlt=a.getAttribute("alt")||void 0)),t},Oi=e=>{const t={},a=e.querySelector("swal-icon");return a&&(Q(a,["type","color"]),a.hasAttribute("type")&&(t.icon=a.getAttribute("type")),a.hasAttribute("color")&&(t.iconColor=a.getAttribute("color")),t.iconHtml=a.innerHTML),t},Fi=e=>{const t={},a=e.querySelector("swal-input");a&&(Q(a,["type","label","placeholder","value"]),t.input=a.getAttribute("type")||"text",a.hasAttribute("label")&&(t.inputLabel=a.getAttribute("label")),a.hasAttribute("placeholder")&&(t.inputPlaceholder=a.getAttribute("placeholder")),a.hasAttribute("value")&&(t.inputValue=a.getAttribute("value")));const n=Array.from(e.querySelectorAll("swal-input-option"));return n.length&&(t.inputOptions={},n.forEach(s=>{Q(s,["value"]);const i=s.getAttribute("value");if(!i)return;const o=s.innerHTML;t.inputOptions[i]=o})),t},Ni=(e,t)=>{const a={};for(const n in t){const s=t[n],i=e.querySelector(s);i&&(Q(i,[]),a[s.replace(/^swal-/,"")]=i.innerHTML.trim())}return a},Ui=e=>{const t=Ia.concat(["swal-param","swal-function-param","swal-button","swal-image","swal-icon","swal-input","swal-input-option"]);Array.from(e.children).forEach(a=>{const n=a.tagName.toLowerCase();t.includes(n)||M(`Unrecognized element <${n}>`)})},Q=(e,t)=>{Array.from(e.attributes).forEach(a=>{t.indexOf(a.name)===-1&&M([`Unrecognized attribute "${a.name}" on <${e.tagName.toLowerCase()}>.`,`${t.length?`Allowed attributes are: ${t.join(", ")}`:"To set the value, use HTML within the element."}`])})},Ma=10,qi=e=>{var t,a;const n=A(),s=k();if(!n||!s)return;typeof e.willOpen=="function"&&e.willOpen(s),(t=p.eventEmitter)===null||t===void 0||t.emit("willOpen",s);const o=window.getComputedStyle(document.body).overflowY;if(Vi(n,s,e),setTimeout(()=>{Gi(n,s)},Ma),rt()&&(Wi(n,e.scrollbarPadding!==void 0?e.scrollbarPadding:!1,o),Ls()),!je()&&!p.previousActiveElement&&(p.previousActiveElement=document.activeElement),typeof e.didOpen=="function"){const r=e.didOpen;setTimeout(()=>r(s))}(a=p.eventEmitter)===null||a===void 0||a.emit("didOpen",s)},Ie=e=>{const t=k();if(!t||e.target!==t)return;const a=A();a&&(t.removeEventListener("animationend",Ie),t.removeEventListener("transitionend",Ie),a.style.overflowY="auto",z(a,l["no-transition"]))},Gi=(e,t)=>{Wt(t)?(e.style.overflowY="hidden",t.addEventListener("animationend",Ie),t.addEventListener("transitionend",Ie)):e.style.overflowY="auto"},Wi=(e,t,a)=>{Is(),t&&a!=="hidden"&&Hs(a),setTimeout(()=>{e.scrollTop=0})},Vi=(e,t,a)=>{var n;(n=a.showClass)!==null&&n!==void 0&&n.backdrop&&b(e,a.showClass.backdrop),a.animation?(t.style.setProperty("opacity","0","important"),L(t,"grid"),setTimeout(()=>{var s;(s=a.showClass)!==null&&s!==void 0&&s.popup&&b(t,a.showClass.popup),t.style.removeProperty("opacity")},Ma)):L(t,"grid"),b([document.documentElement,document.body],l.shown),a.heightAuto&&a.backdrop&&!a.toast&&b([document.documentElement,document.body],l["height-auto"])};var St={email:(e,t)=>/^[a-zA-Z0-9.+_'-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]+$/.test(e)?Promise.resolve():Promise.resolve(t||"Invalid email address"),url:(e,t)=>/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(e)?Promise.resolve():Promise.resolve(t||"Invalid URL")};function Ji(e){e.inputValidator||(e.input==="email"&&(e.inputValidator=St.email),e.input==="url"&&(e.inputValidator=St.url))}function Yi(e){(!e.target||typeof e.target=="string"&&!document.querySelector(e.target)||typeof e.target!="string"&&!e.target.appendChild)&&(M('Target parameter is not valid, defaulting to "body"'),e.target="body")}function Xi(e){Ji(e),e.showLoaderOnConfirm&&!e.preConfirm&&M(`showLoaderOnConfirm is set to true, but preConfirm is not defined.
showLoaderOnConfirm should be used together with preConfirm, see usage example:
https://sweetalert2.github.io/#ajax-request`),Yi(e),typeof e.title=="string"&&(e.title=e.title.split(`
`).join("<br />")),On(e)}let K;var ye=new WeakMap;class C{constructor(...t){if(wn(this,ye,Promise.resolve({isConfirmed:!1,isDenied:!1,isDismissed:!0})),typeof window>"u")return;K=this;const a=Object.freeze(this.constructor.argsToParams(t));this.params=a,this.isAwaitingPromise=!1,bn(ye,this,this._main(K.params))}_main(t,a={}){if(xa(Object.assign({},a,t)),p.currentInstance){const i=ne.swalPromiseResolve.get(p.currentInstance),{isAwaitingPromise:o}=p.currentInstance;p.currentInstance._destroy(),o||i({isDismissed:!0}),rt()&&ia()}p.currentInstance=K;const n=Qi(t,a);Xi(n),Object.freeze(n),p.timeout&&(p.timeout.stop(),delete p.timeout),clearTimeout(p.restoreFocusTimeout);const s=eo(K);return ta(K,n),x.innerParams.set(K,n),Zi(K,s,n)}then(t){return wt(ye,this).then(t)}finally(t){return wt(ye,this).finally(t)}}const Zi=(e,t,a)=>new Promise((n,s)=>{const i=o=>{e.close({isDismissed:!0,dismiss:o,isConfirmed:!1,isDenied:!1})};ne.swalPromiseResolve.set(e,n),ne.swalPromiseReject.set(e,s),t.confirmButton.onclick=()=>{ei(e)},t.denyButton.onclick=()=>{ti(e)},t.cancelButton.onclick=()=>{ai(e,i)},t.closeButton.onclick=()=>{i(de.close)},gi(a,t,i),Bs(p,a,i),qs(e,a),qi(a),to(p,a,i),ao(t,a),setTimeout(()=>{t.container.scrollTop=0})}),Qi=(e,t)=>{const a=ji(e),n=Object.assign({},J,t,a,e);return n.showClass=Object.assign({},J.showClass,n.showClass),n.hideClass=Object.assign({},J.hideClass,n.hideClass),n.animation===!1&&(n.showClass={backdrop:"swal2-noanimation"},n.hideClass={}),n},eo=e=>{const t={popup:k(),container:A(),actions:ge(),confirmButton:O(),denyButton:te(),cancelButton:re(),loader:le(),closeButton:it(),validationMessage:_e(),progressSteps:st()};return x.domCache.set(e,t),t},to=(e,t,a)=>{const n=De();I(n),t.timer&&(e.timeout=new Di(()=>{a("timer"),delete e.timeout},t.timer),t.timerProgressBar&&n&&(L(n),D(n,t,"timerProgressBar"),setTimeout(()=>{e.timeout&&e.timeout.running&&dt(t.timer)})))},ao=(e,t)=>{if(!t.toast){if(!Ae(t.allowEnterKey)){Ot("allowEnterKey"),io();return}no(e)||so(e,t)||Ve(-1,1)}},no=e=>{const t=Array.from(e.popup.querySelectorAll("[autofocus]"));for(const a of t)if(a instanceof HTMLElement&&_(a))return a.focus(),!0;return!1},so=(e,t)=>t.focusDeny&&_(e.denyButton)?(e.denyButton.focus(),!0):t.focusCancel&&_(e.cancelButton)?(e.cancelButton.focus(),!0):t.focusConfirm&&_(e.confirmButton)?(e.confirmButton.focus(),!0):!1,io=()=>{document.activeElement instanceof HTMLElement&&typeof document.activeElement.blur=="function"&&document.activeElement.blur()};C.prototype.disableButtons=va;C.prototype.enableButtons=ha;C.prototype.getInput=ma;C.prototype.disableInput=wa;C.prototype.enableInput=fa;C.prototype.hideLoading=Se;C.prototype.disableLoading=Se;C.prototype.showValidationMessage=ba;C.prototype.resetValidationMessage=ka;C.prototype.close=V;C.prototype.closePopup=V;C.prototype.closeModal=V;C.prototype.closeToast=V;C.prototype.rejectPromise=la;C.prototype.update=Ta;C.prototype._destroy=$a;Object.assign(C,_i);Object.keys(pi).forEach(e=>{C[e]=function(...t){if(K&&K[e])return K[e](...t)}});C.DismissReason=de;C.version="11.26.18";const w=C;w.default=w;typeof document<"u"&&(function(e,t){var a=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(a),a.styleSheet)a.styleSheet.disabled||(a.styleSheet.cssText=t);else try{a.innerHTML=t}catch{a.innerText=t}})(document,':root{--swal2-outline: 0 0 0 3px rgba(100, 150, 200, 0.5);--swal2-container-padding: 0.625em;--swal2-backdrop: rgba(0, 0, 0, 0.4);--swal2-backdrop-transition: background-color 0.15s;--swal2-width: 32em;--swal2-padding: 0 0 1.25em;--swal2-border: none;--swal2-border-radius: 0.3125rem;--swal2-background: white;--swal2-color: #545454;--swal2-show-animation: swal2-show 0.3s;--swal2-hide-animation: swal2-hide 0.15s forwards;--swal2-icon-zoom: 1;--swal2-icon-animations: true;--swal2-title-padding: 0.8em 1em 0;--swal2-html-container-padding: 1em 1.6em 0.3em;--swal2-input-border: 1px solid #d9d9d9;--swal2-input-border-radius: 0.1875em;--swal2-input-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px transparent;--swal2-input-background: transparent;--swal2-input-transition: border-color 0.2s, box-shadow 0.2s;--swal2-input-hover-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px transparent;--swal2-input-focus-border: 1px solid #b4dbed;--swal2-input-focus-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px rgba(100, 150, 200, 0.5);--swal2-progress-step-background: #add8e6;--swal2-validation-message-background: #f0f0f0;--swal2-validation-message-color: #666;--swal2-footer-border-color: #eee;--swal2-footer-background: transparent;--swal2-footer-color: inherit;--swal2-timer-progress-bar-background: rgba(0, 0, 0, 0.3);--swal2-close-button-position: initial;--swal2-close-button-inset: auto;--swal2-close-button-font-size: 2.5em;--swal2-close-button-color: #ccc;--swal2-close-button-transition: color 0.2s, box-shadow 0.2s;--swal2-close-button-outline: initial;--swal2-close-button-box-shadow: inset 0 0 0 3px transparent;--swal2-close-button-focus-box-shadow: inset var(--swal2-outline);--swal2-close-button-hover-transform: none;--swal2-actions-justify-content: center;--swal2-actions-width: auto;--swal2-actions-margin: 1.25em auto 0;--swal2-actions-padding: 0;--swal2-actions-border-radius: 0;--swal2-actions-background: transparent;--swal2-action-button-transition: background-color 0.2s, box-shadow 0.2s;--swal2-action-button-hover: black 10%;--swal2-action-button-active: black 10%;--swal2-confirm-button-box-shadow: none;--swal2-confirm-button-border-radius: 0.25em;--swal2-confirm-button-background-color: #7066e0;--swal2-confirm-button-color: #fff;--swal2-deny-button-box-shadow: none;--swal2-deny-button-border-radius: 0.25em;--swal2-deny-button-background-color: #dc3741;--swal2-deny-button-color: #fff;--swal2-cancel-button-box-shadow: none;--swal2-cancel-button-border-radius: 0.25em;--swal2-cancel-button-background-color: #6e7881;--swal2-cancel-button-color: #fff;--swal2-toast-show-animation: swal2-toast-show 0.5s;--swal2-toast-hide-animation: swal2-toast-hide 0.1s forwards;--swal2-toast-border: none;--swal2-toast-box-shadow: 0 0 1px hsl(0deg 0% 0% / 0.075), 0 1px 2px hsl(0deg 0% 0% / 0.075), 1px 2px 4px hsl(0deg 0% 0% / 0.075), 1px 3px 8px hsl(0deg 0% 0% / 0.075), 2px 4px 16px hsl(0deg 0% 0% / 0.075)}[data-swal2-theme=dark]{--swal2-dark-theme-black: #19191a;--swal2-dark-theme-white: #e1e1e1;--swal2-background: var(--swal2-dark-theme-black);--swal2-color: var(--swal2-dark-theme-white);--swal2-footer-border-color: #555;--swal2-input-background: color-mix(in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10%);--swal2-validation-message-background: color-mix( in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10% );--swal2-validation-message-color: var(--swal2-dark-theme-white);--swal2-timer-progress-bar-background: rgba(255, 255, 255, 0.7)}@media(prefers-color-scheme: dark){[data-swal2-theme=auto]{--swal2-dark-theme-black: #19191a;--swal2-dark-theme-white: #e1e1e1;--swal2-background: var(--swal2-dark-theme-black);--swal2-color: var(--swal2-dark-theme-white);--swal2-footer-border-color: #555;--swal2-input-background: color-mix(in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10%);--swal2-validation-message-background: color-mix( in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10% );--swal2-validation-message-color: var(--swal2-dark-theme-white);--swal2-timer-progress-bar-background: rgba(255, 255, 255, 0.7)}}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto !important}body.swal2-no-backdrop .swal2-container{background-color:rgba(0,0,0,0) !important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:all}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px var(--swal2-backdrop)}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:rgba(0,0,0,0);pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{inset:0 auto auto 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{inset:0 0 auto auto}body.swal2-toast-shown .swal2-container.swal2-top-start,body.swal2-toast-shown .swal2-container.swal2-top-left{inset:0 auto auto 0}body.swal2-toast-shown .swal2-container.swal2-center-start,body.swal2-toast-shown .swal2-container.swal2-center-left{inset:50% auto auto 0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{inset:50% auto auto 50%;transform:translate(-50%, -50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{inset:50% 0 auto auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-start,body.swal2-toast-shown .swal2-container.swal2-bottom-left{inset:auto auto 0 0}body.swal2-toast-shown .swal2-container.swal2-bottom{inset:auto auto 0 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{inset:auto 0 0 auto}@media print{body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown){overflow-y:scroll !important}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown) .swal2-container{position:static !important}}div:where(.swal2-container){display:grid;position:fixed;z-index:1060;inset:0;box-sizing:border-box;grid-template-areas:"top-start     top            top-end" "center-start  center         center-end" "bottom-start  bottom-center  bottom-end";grid-template-rows:minmax(min-content, auto) minmax(min-content, auto) minmax(min-content, auto);height:100%;padding:var(--swal2-container-padding);overflow-x:hidden;transition:var(--swal2-backdrop-transition);-webkit-overflow-scrolling:touch}div:where(.swal2-container).swal2-backdrop-show,div:where(.swal2-container).swal2-noanimation{background:var(--swal2-backdrop)}div:where(.swal2-container).swal2-backdrop-hide{background:rgba(0,0,0,0) !important}div:where(.swal2-container).swal2-top-start,div:where(.swal2-container).swal2-center-start,div:where(.swal2-container).swal2-bottom-start{grid-template-columns:minmax(0, 1fr) auto auto}div:where(.swal2-container).swal2-top,div:where(.swal2-container).swal2-center,div:where(.swal2-container).swal2-bottom{grid-template-columns:auto minmax(0, 1fr) auto}div:where(.swal2-container).swal2-top-end,div:where(.swal2-container).swal2-center-end,div:where(.swal2-container).swal2-bottom-end{grid-template-columns:auto auto minmax(0, 1fr)}div:where(.swal2-container).swal2-top-start>.swal2-popup{align-self:start}div:where(.swal2-container).swal2-top>.swal2-popup{grid-column:2;place-self:start center}div:where(.swal2-container).swal2-top-end>.swal2-popup,div:where(.swal2-container).swal2-top-right>.swal2-popup{grid-column:3;place-self:start end}div:where(.swal2-container).swal2-center-start>.swal2-popup,div:where(.swal2-container).swal2-center-left>.swal2-popup{grid-row:2;align-self:center}div:where(.swal2-container).swal2-center>.swal2-popup{grid-column:2;grid-row:2;place-self:center center}div:where(.swal2-container).swal2-center-end>.swal2-popup,div:where(.swal2-container).swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;place-self:center end}div:where(.swal2-container).swal2-bottom-start>.swal2-popup,div:where(.swal2-container).swal2-bottom-left>.swal2-popup{grid-column:1;grid-row:3;align-self:end}div:where(.swal2-container).swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;place-self:end center}div:where(.swal2-container).swal2-bottom-end>.swal2-popup,div:where(.swal2-container).swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;place-self:end end}div:where(.swal2-container).swal2-grow-row>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-column:1/4;width:100%}div:where(.swal2-container).swal2-grow-column>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}div:where(.swal2-container).swal2-no-transition{transition:none !important}div:where(.swal2-container)[popover]{width:auto;border:0}div:where(.swal2-container) div:where(.swal2-popup){display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0, 100%);width:var(--swal2-width);max-width:100%;padding:var(--swal2-padding);border:var(--swal2-border);border-radius:var(--swal2-border-radius);background:var(--swal2-background);color:var(--swal2-color);font-family:inherit;font-size:1rem;container-name:swal2-popup}div:where(.swal2-container) div:where(.swal2-popup):focus{outline:none}div:where(.swal2-container) div:where(.swal2-popup).swal2-loading{overflow-y:hidden}div:where(.swal2-container) div:where(.swal2-popup).swal2-draggable{cursor:grab}div:where(.swal2-container) div:where(.swal2-popup).swal2-draggable div:where(.swal2-icon){cursor:grab}div:where(.swal2-container) div:where(.swal2-popup).swal2-dragging{cursor:grabbing}div:where(.swal2-container) div:where(.swal2-popup).swal2-dragging div:where(.swal2-icon){cursor:grabbing}div:where(.swal2-container) h2:where(.swal2-title){position:relative;max-width:100%;margin:0;padding:var(--swal2-title-padding);color:inherit;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;overflow-wrap:break-word;cursor:initial}div:where(.swal2-container) div:where(.swal2-actions){display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:var(--swal2-actions-justify-content);width:var(--swal2-actions-width);margin:var(--swal2-actions-margin);padding:var(--swal2-actions-padding);border-radius:var(--swal2-actions-border-radius);background:var(--swal2-actions-background)}div:where(.swal2-container) div:where(.swal2-loader){display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 rgba(0,0,0,0) #2778c4 rgba(0,0,0,0)}div:where(.swal2-container) button:where(.swal2-styled){margin:.3125em;padding:.625em 1.1em;transition:var(--swal2-action-button-transition);border:none;box-shadow:0 0 0 3px rgba(0,0,0,0);font-weight:500}div:where(.swal2-container) button:where(.swal2-styled):not([disabled]){cursor:pointer}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm){border-radius:var(--swal2-confirm-button-border-radius);background:initial;background-color:var(--swal2-confirm-button-background-color);box-shadow:var(--swal2-confirm-button-box-shadow);color:var(--swal2-confirm-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm):hover{background-color:color-mix(in srgb, var(--swal2-confirm-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm):active{background-color:color-mix(in srgb, var(--swal2-confirm-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny){border-radius:var(--swal2-deny-button-border-radius);background:initial;background-color:var(--swal2-deny-button-background-color);box-shadow:var(--swal2-deny-button-box-shadow);color:var(--swal2-deny-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny):hover{background-color:color-mix(in srgb, var(--swal2-deny-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny):active{background-color:color-mix(in srgb, var(--swal2-deny-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel){border-radius:var(--swal2-cancel-button-border-radius);background:initial;background-color:var(--swal2-cancel-button-background-color);box-shadow:var(--swal2-cancel-button-box-shadow);color:var(--swal2-cancel-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel):hover{background-color:color-mix(in srgb, var(--swal2-cancel-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel):active{background-color:color-mix(in srgb, var(--swal2-cancel-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):focus-visible{outline:none;box-shadow:var(--swal2-action-button-focus-box-shadow)}div:where(.swal2-container) button:where(.swal2-styled)[disabled]:not(.swal2-loading){opacity:.4}div:where(.swal2-container) button:where(.swal2-styled)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-footer){margin:1em 0 0;padding:1em 1em 0;border-top:1px solid var(--swal2-footer-border-color);background:var(--swal2-footer-background);color:var(--swal2-footer-color);font-size:1em;text-align:center;cursor:initial}div:where(.swal2-container) .swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto !important;overflow:hidden;border-bottom-right-radius:var(--swal2-border-radius);border-bottom-left-radius:var(--swal2-border-radius)}div:where(.swal2-container) div:where(.swal2-timer-progress-bar){width:100%;height:.25em;background:var(--swal2-timer-progress-bar-background)}div:where(.swal2-container) img:where(.swal2-image){max-width:100%;margin:2em auto 1em;cursor:initial}div:where(.swal2-container) button:where(.swal2-close){position:var(--swal2-close-button-position);inset:var(--swal2-close-button-inset);z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:var(--swal2-close-button-transition);border:none;border-radius:var(--swal2-border-radius);outline:var(--swal2-close-button-outline);background:rgba(0,0,0,0);color:var(--swal2-close-button-color);font-family:monospace;font-size:var(--swal2-close-button-font-size);cursor:pointer;justify-self:end}div:where(.swal2-container) button:where(.swal2-close):hover{transform:var(--swal2-close-button-hover-transform);background:rgba(0,0,0,0);color:#f27474}div:where(.swal2-container) button:where(.swal2-close):focus-visible{outline:none;box-shadow:var(--swal2-close-button-focus-box-shadow)}div:where(.swal2-container) button:where(.swal2-close)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-html-container){z-index:1;justify-content:center;margin:0;padding:var(--swal2-html-container-padding);overflow:auto;color:inherit;font-size:1.125em;font-weight:normal;line-height:normal;text-align:center;overflow-wrap:break-word;word-break:break-word;cursor:initial}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea),div:where(.swal2-container) select:where(.swal2-select),div:where(.swal2-container) div:where(.swal2-radio),div:where(.swal2-container) label:where(.swal2-checkbox){margin:1em 2em 3px}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea){box-sizing:border-box;width:auto;transition:var(--swal2-input-transition);border:var(--swal2-input-border);border-radius:var(--swal2-input-border-radius);background:var(--swal2-input-background);box-shadow:var(--swal2-input-box-shadow);color:inherit;font-size:1.125em}div:where(.swal2-container) input:where(.swal2-input).swal2-inputerror,div:where(.swal2-container) input:where(.swal2-file).swal2-inputerror,div:where(.swal2-container) textarea:where(.swal2-textarea).swal2-inputerror{border-color:#f27474 !important;box-shadow:0 0 2px #f27474 !important}div:where(.swal2-container) input:where(.swal2-input):hover,div:where(.swal2-container) input:where(.swal2-file):hover,div:where(.swal2-container) textarea:where(.swal2-textarea):hover{box-shadow:var(--swal2-input-hover-box-shadow)}div:where(.swal2-container) input:where(.swal2-input):focus,div:where(.swal2-container) input:where(.swal2-file):focus,div:where(.swal2-container) textarea:where(.swal2-textarea):focus{border:var(--swal2-input-focus-border);outline:none;box-shadow:var(--swal2-input-focus-box-shadow)}div:where(.swal2-container) input:where(.swal2-input)::placeholder,div:where(.swal2-container) input:where(.swal2-file)::placeholder,div:where(.swal2-container) textarea:where(.swal2-textarea)::placeholder{color:#ccc}div:where(.swal2-container) .swal2-range{margin:1em 2em 3px;background:var(--swal2-background)}div:where(.swal2-container) .swal2-range input{width:80%}div:where(.swal2-container) .swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}div:where(.swal2-container) .swal2-range input,div:where(.swal2-container) .swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}div:where(.swal2-container) .swal2-input{height:2.625em;padding:0 .75em}div:where(.swal2-container) .swal2-file{width:75%;margin-right:auto;margin-left:auto;background:var(--swal2-input-background);font-size:1.125em}div:where(.swal2-container) .swal2-textarea{height:6.75em;padding:.75em}div:where(.swal2-container) .swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:var(--swal2-input-background);color:inherit;font-size:1.125em}div:where(.swal2-container) .swal2-radio,div:where(.swal2-container) .swal2-checkbox{align-items:center;justify-content:center;background:var(--swal2-background);color:inherit}div:where(.swal2-container) .swal2-radio label,div:where(.swal2-container) .swal2-checkbox label{margin:0 .6em;font-size:1.125em}div:where(.swal2-container) .swal2-radio input,div:where(.swal2-container) .swal2-checkbox input{flex-shrink:0;margin:0 .4em}div:where(.swal2-container) label:where(.swal2-input-label){display:flex;justify-content:center;margin:1em auto 0}div:where(.swal2-container) div:where(.swal2-validation-message){align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:var(--swal2-validation-message-background);color:var(--swal2-validation-message-color);font-size:1em;font-weight:300}div:where(.swal2-container) div:where(.swal2-validation-message)::before{content:"!";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}div:where(.swal2-container) .swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:rgba(0,0,0,0);font-weight:600}div:where(.swal2-container) .swal2-progress-steps li{display:inline-block;position:relative}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:var(--swal2-progress-step-background);color:#fff}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:var(--swal2-progress-step-background)}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}div:where(.swal2-icon){position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;zoom:var(--swal2-icon-zoom);border:.25em solid rgba(0,0,0,0);border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;user-select:none}div:where(.swal2-icon) .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}div:where(.swal2-icon).swal2-error{border-color:#f27474;color:#f27474}div:where(.swal2-icon).swal2-error .swal2-x-mark{position:relative;flex-grow:1}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-error.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-error.swal2-icon-show .swal2-x-mark{animation:swal2-animate-error-x-mark .5s}}div:where(.swal2-icon).swal2-warning{border-color:#f8bb86;color:#f8bb86}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-warning.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-warning.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .5s}}div:where(.swal2-icon).swal2-info{border-color:#3fc3ee;color:#3fc3ee}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-info.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-info.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .8s}}div:where(.swal2-icon).swal2-question{border-color:#87adbd;color:#87adbd}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-question.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-question.swal2-icon-show .swal2-icon-content{animation:swal2-animate-question-mark .8s}}div:where(.swal2-icon).swal2-success{border-color:#a5dc86;color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;border-radius:50%}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}div:where(.swal2-icon).swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-0.25em;left:-0.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}div:where(.swal2-icon).swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-animate-success-line-tip .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-animate-success-line-long .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-circular-line-right{animation:swal2-rotate-success-circular-line 4.25s ease-in}}[class^=swal2]{-webkit-tap-highlight-color:rgba(0,0,0,0)}.swal2-show{animation:var(--swal2-show-animation)}.swal2-hide{animation:var(--swal2-hide-animation)}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}.swal2-toast{box-sizing:border-box;grid-column:1/4 !important;grid-row:1/4 !important;grid-template-columns:min-content auto min-content;padding:1em;overflow-y:hidden;border:var(--swal2-toast-border);background:var(--swal2-background);box-shadow:var(--swal2-toast-box-shadow);pointer-events:all}.swal2-toast>*{grid-column:2}.swal2-toast h2:where(.swal2-title){margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-toast .swal2-loading{justify-content:center}.swal2-toast input:where(.swal2-input){height:2em;margin:.5em;font-size:1em}.swal2-toast .swal2-validation-message{font-size:1em}.swal2-toast div:where(.swal2-footer){margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-toast button:where(.swal2-close){grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-toast div:where(.swal2-html-container){margin:.5em 1em;padding:0;overflow:initial;font-size:1em;text-align:initial}.swal2-toast div:where(.swal2-html-container):empty{padding:0}.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:bold}.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-toast div:where(.swal2-actions){justify-content:flex-start;height:auto;margin:0;margin-top:.5em;padding:0 .5em}.swal2-toast button:where(.swal2-styled){margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;border-radius:50%}.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.8em;left:-0.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}@container swal2-popup style(--swal2-icon-animations:true){.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-toast-animate-success-line-tip .75s}.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-toast-animate-success-line-long .75s}}.swal2-toast.swal2-show{animation:var(--swal2-toast-show-animation)}.swal2-toast.swal2-hide{animation:var(--swal2-toast-hide-animation)}@keyframes swal2-show{0%{transform:translate3d(0, -50px, 0) scale(0.9);opacity:0}100%{transform:translate3d(0, 0, 0) scale(1);opacity:1}}@keyframes swal2-hide{0%{transform:translate3d(0, 0, 0) scale(1);opacity:1}100%{transform:translate3d(0, -50px, 0) scale(0.9);opacity:0}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-0.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(0.4);opacity:0}50%{margin-top:1.625em;transform:scale(0.4);opacity:0}80%{margin-top:-0.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0deg);opacity:1}}@keyframes swal2-rotate-loading{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-toast-show{0%{transform:translateY(-0.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(0.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0deg)}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-0.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}');function F(e=""){return`
    <!-- Burger Button -->
    <button class="petugas-burger" id="petugasBurger" aria-label="Toggle menu">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Overlay Backdrop -->
    <div class="petugas-sidebar-overlay" id="petugasSidebarOverlay"></div>

    <!-- Sidebar Drawer -->
    <div class="petugas-sidebar" id="petugasSidebar">
      <div class="sidebar-header">
        <h2>Halo Petugas</h2>
        <button class="petugas-sidebar-close" id="petugasSidebarClose" aria-label="Close menu">✕</button>
      </div>
      <nav class="sidebar-nav">
        <a href="/petugas/dashboard" class="nav-link ${e==="dashboard"?"active":""}">
          <span class="nav-icon">🏠</span>
          <span class="nav-text">Beranda</span>
        </a>
        <a href="/petugas/data-gizi" class="nav-link ${e==="data-gizi"?"active":""}">
          <span class="nav-icon">🍎</span>
          <span class="nav-text">Data Gizi</span>
        </a>
        <a href="/petugas/rekomendasi" class="nav-link ${e==="rekomendasi"?"active":""}">
          <span class="nav-icon">📊</span>
          <span class="nav-text">Rekomendasi</span>
        </a>
        <a href="/petugas/laporan" class="nav-link ${e==="laporan"?"active":""}">
          <span class="nav-icon">📋</span>
          <span class="nav-text">Laporan</span>
        </a>
        <a href="/petugas/arsip" class="nav-link ${e==="arsip"?"active":""}">
          <span class="nav-icon">🗂️</span>
          <span class="nav-text">Arsip Konsultasi</span>
        </a>
        <a href="/petugas/kelola-user" class="nav-link ${e==="kelola-user"?"active":""}">
          <span class="nav-icon">👥</span>
          <span class="nav-text">Kelola User</span>
        </a>
        <a href="/petugas/konsumsi-user" class="nav-link ${e==="konsumsi-user"?"active":""}">
          <span class="nav-icon">🍽️</span>
          <span class="nav-text">Pola Makan User</span>
        </a>
      </nav>
      <div class="sidebar-footer">
        <button class="sidebar-logout" id="logoutBtn">
          <span class="nav-icon">🚪</span>
          <span class="nav-text">Logout</span>
        </button>
      </div>
    </div>
  `}function N(){const e=document.getElementById("petugasBurger"),t=document.getElementById("petugasSidebar"),a=document.getElementById("petugasSidebarOverlay"),n=document.getElementById("petugasSidebarClose");function s(){t.classList.add("open"),a.classList.add("active"),e.classList.add("active")}function i(){t.classList.remove("open"),a.classList.remove("active"),e.classList.remove("active")}e?.addEventListener("click",s),a?.addEventListener("click",i),n?.addEventListener("click",i);const o=document.getElementById("logoutBtn");o&&o.addEventListener("click",r=>{r.preventDefault(),w.fire({title:"Logout",text:"Anda yakin ingin keluar?",icon:"question",showCancelButton:!0,confirmButtonText:"Ya",cancelButtonText:"Batal"}).then(d=>{d.isConfirmed&&(localStorage.removeItem("user"),localStorage.removeItem("token"),window.location.href="/login")})})}async function oo(e){const t=P();if(!t||t.role!=="ahli_gizi"){window.location.href="/login";return}e.innerHTML=`
    <div class="petugas-wrapper">
        ${F("dashboard")}
        
        <main class="petugas-main-content">
          <div class="petugas-topbar">
            <div class="topbar-welcome">
              <h1>📊 Dashboard Ahli Gizi</h1>
              <p style="color: #ffff;">Selamat datang kembali, <strong>${f(t.nama)}</strong></p>
            </div>
          </div>

          <div class="petugas-dashboard-content">
            
            <div class="stats-grid">
              <div class="stat-card blue">
                <div class="stat-icon">👥</div>
                <div class="stat-info">
                  <h3>Total User</h3>
                  <p class="stat-value" id="totalUsers">
                    <span class="loading-skeleton"></span>
                  </p>
                  <span class="stat-desc">Pengguna Terdaftar</span>
                </div>
              </div>

              <div class="stat-card purple">
                <div class="stat-icon">📄</div>
                <div class="stat-info">
                  <h3>Request User</h3> 
                  <p class="stat-value" id="totalKonsultasi">
                    <span class="loading-skeleton"></span>
                  </p>
                  <span class="stat-desc">Permintaan Masuk</span>
                </div>
              </div>
            </div>

            <div class="dashboard-section">
              <h2>📋 Aktivitas Terbaru</h2>
              <div class="activity-list" id="activityList">
                <div class="empty-state">
                  <p>⏳ Memuat data aktivitas...</p>
                </div>
              </div>
            </div>

          </div>
        </main>
    </div>
  `;const a=document.createElement("style");a.textContent=`
    .loading-skeleton {
      display: inline-block;
      width: 60px;
      height: 32px;
      background: linear-gradient(90deg, #e2e8f0, #f1f5f9, #e2e8f0);
      background-size: 200% 100%;
      animation: skeleton-load 1.5s infinite;
      border-radius: 4px;
    }

    @keyframes skeleton-load {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `,document.head.appendChild(a),N();try{const n=await Fa(),s=document.getElementById("totalUsers");s&&(s.textContent=n.totalUsers||0),await ro()}catch(n){console.error("Gagal memuat statistik:",n);const s=document.getElementById("totalUsers");s&&(s.textContent="-")}}async function ro(){try{const e=await _t("pending"),t=document.getElementById("activityList"),a=document.getElementById("totalKonsultasi");if(a&&(a.textContent=e.length||0),!t)return;if(e.length===0){t.innerHTML=`
        <div class="empty-state">
          <p>✨ Belum ada request konsultasi. Tunggu user mengirimkan request.</p>
        </div>
      `;return}const s=e.sort((o,r)=>new Date(r.created_at)-new Date(o.created_at)).slice(0,5);let i="";s.forEach(o=>{const r=new Date(o.created_at).toLocaleDateString("id-ID",{weekday:"short",year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),d={pending:'<span class="status-badge status-pending">⏳ Pending</span>',diproses:'<span class="status-badge status-processing">🔄 Diproses</span>',selesai:'<span class="status-badge status-completed">✅ Selesai</span>',ditolak:'<span class="status-badge status-rejected">❌ Ditolak</span>'};i+=`
        <div class="activity-item konsultasi-request">
          <div class="activity-header">
            <div class="activity-title">
              <h3>📨 Konsultasi dari ${f(o.nama)}</h3>
              <p class="activity-date">${f(r)}</p>
            </div>
            <div class="activity-status">
              ${d[o.status]||'<span class="status-badge">Unknown</span>'}
            </div>
          </div>

          <div class="konsultasi-details">
            <div class="detail-row">
              <span style="color:black;" class="detail-label">📧 Email:</span>
              <span class="detail-value">${f(o.email)}</span>
            </div>
            <div class="detail-row">
              <span style="color:black;" class="detail-label">👤 Profil:</span>
              <span class="detail-value">${f(String(o.usia))} tahun | ${f(o.jenis_kelamin)} | ${f(String(o.berat))} kg | ${f(String(o.tinggi))} cm</span>
            </div>
            <div class="detail-row">
              <span style="color:black;" class="detail-label">📊 Data Gizi:</span>
              <span class="detail-value">
                Aktivitas: ${f(o.aktivitas)} | Tujuan: ${f(o.tujuan)}
              </span>
            </div>
            ${o.catatan?`<div class="detail-row">
                <span style="color:black;" class="detail-label">💬 Catatan:</span>
                <span class="detail-value">${f(o.catatan)}</span>
              </div>`:""}
          </div>

          <div class="activity-actions">
            <button class="btn-action btn-respond" onclick="window.location.href='/petugas/konsultasi?id=${o.id}'">
              📝 Respons
            </button>
            <button class="btn-action btn-calculate" onclick="handleKalkulasi(${JSON.stringify(o).replace(/"/g,"&quot;")})">
              🧮 Kalkulasi
            </button>
          </div>
        </div>
      `}),t.innerHTML=i}catch(e){console.error("Error loading konsultasi aktivitas:",e);const t=document.getElementById("activityList");t&&(t.innerHTML=`
        <div class="empty-state">
          <p>❌ Gagal memuat data request. ${e.message}</p>
        </div>
      `)}}window.handleKalkulasi=function(e){try{const t={nama:e.nama,email:e.email,usia:e.usia,jenisKelamin:e.jenis_kelamin,beratBadan:e.berat,tinggiBadan:e.tinggi,aktivitas:e.aktivitas,tujuan:e.tujuan,kategori:e.kategori||"all",konsultasiId:e.id};sessionStorage.setItem("preFilledRekomendasiData",JSON.stringify(t)),window.location.href="/petugas/rekomendasi"}catch(t){console.error("Error:",t),alert("Terjadi kesalahan saat memproses data. Silakan coba lagi.")}};function lo(e){const t=P();if(!t||t.role!=="ahli_gizi"){window.location.href="/login";return}e.innerHTML=`
    <div class="data-gizi-wrapper">
      <div class="data-gizi-container">
        ${F("data-gizi")}

        <main class="data-gizi-main-content">
          <div class="data-gizi-topbar">
            <div class="data-gizi-topbar-left">
              <div class="data-gizi-topbar-title">
                <h1>Data Gizi</h1>
                <p>Kelola data nutrisi makanan</p>
              </div>
            </div>
            <div class="data-gizi-topbar-user">
              <div class="data-gizi-user-avatar">
                ${t.nama?.charAt(0).toUpperCase()}
              </div>
              <div class="data-gizi-user-info">
                <p class="data-gizi-user-name">${t.nama}</p>
                <p class="data-gizi-user-role">Petugas Gizi</p>
              </div>
            </div>
          </div>

          <div class="data-gizi-dashboard-content">
            <div class="data-gizi-table-section">
              <div class="data-gizi-filters">
                <input type="text" placeholder="Cari nama makanan... (cth: beras, daging, sayur)" class="data-gizi-filter-input" id="nutritionSearch">
              </div>

              <div class="data-gizi-table-responsive">
                <table class="data-gizi-table">
                  <thead>
                    <tr>
                      <th style="width: 1%;">Kode</th>
                      <th style="width: 3%;">Nama Pangan</th>
                      <th style="width: 1%;">Energi (kal)</th>
                      <th style="width: 1%;">Protein (g)</th>
                      <th style="width: 1%;">Lemak (g)</th>
                      <th style="width: 1%;">Karbohidrat (g)</th>
                    </tr>
                  </thead>
                  <tbody id="nutritionTable">
                    <tr>
                      <td colspan="6" style="text-align: center; padding: 2rem; color: #a0aec0;">
                        <div class="data-gizi-loading">Memuat data gizi...</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="data-gizi-table-section">
              <h2>Statistik Data Gizi</h2>
              <div class="data-gizi-stats-grid">
                <div class="data-gizi-stat-card">
                  <div class="data-gizi-stat-header">
                    <div>
                      <h3>Total Data Gizi</h3>
                      <div class="data-gizi-stat-value" id="totalNutrition">0</div>
                    </div>
                    <div class="data-gizi-stat-icon">📊</div>
                  </div>
                  <div class="data-gizi-stat-trend">Item nutrisi terdaftar</div>
                </div>

                <div class="data-gizi-stat-card">
                  <div class="data-gizi-stat-header">
                    <div>
                      <h3>Rata-rata Protein</h3>
                      <div class="data-gizi-stat-value" id="vegetableCount">0</div>
                    </div>
                    <div class="data-gizi-stat-icon">🥩</div>
                  </div>
                  <div class="data-gizi-stat-trend">Protein per item (g)</div>
                </div>

                <div class="data-gizi-stat-card">
                  <div class="data-gizi-stat-header">
                    <div>
                      <h3>Rata-rata Energi</h3>
                      <div class="data-gizi-stat-value" id="fruitCount">0</div>
                    </div>
                    <div class="data-gizi-stat-icon">⚡</div>
                  </div>
                  <div class="data-gizi-stat-trend">Energi per item (kal)</div>
                </div>

                <div class="data-gizi-stat-card">
                  <div class="data-gizi-stat-header">
                    <div>
                      <h3>Rata-rata Lemak</h3>
                      <div class="data-gizi-stat-value" id="proteinCount">0</div>
                    </div>
                    <div class="data-gizi-stat-icon">🥑</div>
                  </div>
                  <div class="data-gizi-stat-trend">Lemak per item (g)</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,co()}function co(){const e=document.getElementById("nutritionSearch");N(),e&&e.addEventListener("input",mo),uo()}async function uo(){try{const e=await Mt();e.success&&e.data&&(Ye(e.data),Xe(e.data),window.allNutritionData=e.data)}catch(e){console.error("Error loading nutrition data:",e);const t=document.getElementById("nutritionTable");t&&(t.innerHTML=`
        <tr>
            <td colspan="6" style="text-align: center; padding: 2rem; color: #e53e3e;">
            Error loading nutrition data. Please try again later.
            </td>
        </tr>
        `)}}async function mo(e){const t=e.target.value.trim();if(t===""){window.allNutritionData&&(Ye(window.allNutritionData),Xe(window.allNutritionData));return}try{const a=await Pt(t);if(a.success&&a.data)Ye(a.data),Xe(a.data);else{const n=document.getElementById("nutritionTable");n&&(n.innerHTML=`
          <tr>
            <td colspan="6" style="text-align: center; padding: 2rem; color: #a0aec0;">
              Tidak ada hasil pencarian untuk "${t}"
            </td>
          </tr>
        `)}}catch(a){console.error("Error searching nutrition data:",a)}}function Ye(e){const t=document.getElementById("nutritionTable");if(t){if(t.innerHTML="",!e||e.length===0){t.innerHTML=`
      <tr>
        <td colspan="6" style="text-align: center; padding: 2rem; color: #a0aec0;">
          Tidak ada data nutrisi yang ditemukan
        </td>
      </tr>
    `;return}e.forEach(a=>{const n=document.createElement("tr");n.innerHTML=`
      <td><span class="kode-badge">${a.kode||"N/A"}</span></td>
      <td>${a.nama_bahan||"N/A"}</td>
      <td>${a.energi_kal||0}</td>
      <td>${a.protein_g||0}</td>
      <td>${a.lemak_g||0}</td>
      <td>${a.karbohidrat_g||0}</td>
    `,t.appendChild(n)})}}function Xe(e){const t=e.length;let a=0,n=0,s=0;t>0&&(a=e.reduce((u,c)=>u+(c.protein_g||0),0)/t,n=e.reduce((u,c)=>u+(c.energi_kal||0),0)/t,s=e.reduce((u,c)=>u+(c.lemak_g||0),0)/t,e.reduce((u,c)=>u+(c.karbohidrat_g||0),0)/t);const i=document.getElementById("totalNutrition"),o=document.getElementById("vegetableCount"),r=document.getElementById("fruitCount"),d=document.getElementById("proteinCount");i&&(i.textContent=t),o&&(o.textContent=a.toFixed(2)),r&&(r.textContent=n.toFixed(0)),d&&(d.textContent=s.toFixed(2))}function po(e){const t=P();if(!t||t.role!=="ahli_gizi"){window.location.href="/login";return}e.innerHTML=`
    <div class="petugas-wrapper">
        ${F("kelola-user")}
        
        <main class="petugas-main-content">
          <div class="petugas-topbar">
            <div class="topbar-welcome">
              <h1>👥 Kelola User</h1>
              <p style="color:#ffff;">Manajemen data masyarakat (pengguna aplikasi)</p>
            </div>
            <div class="topbar-profile">
              <div class="avatar">${t.nama?.charAt(0).toUpperCase()}</div>
            </div>
          </div>

          <div class="petugas-dashboard-content">
            <div class="kelola-user-section">
              <div class="section-header">
                <h2>📋 Daftar User</h2>
                <div class="section-stats">
                  <span id="totalUserCount">0 User Terdaftar</span>
                </div>
              </div>

              <div class="kelola-user-filters">
                <input 
                  type="text" 
                  placeholder="🔍 Cari nama atau email user..." 
                  id="userSearch" 
                  class="kelola-user-search"
                >
              </div>

              <div class="kelola-user-table-responsive">
                <table class="kelola-user-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama</th>
                      <th>Email</th>
                      <th>Terdaftar</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody id="usersTable">
                    <tr class="loading-row">
                      <td colspan="5" style="text-align: center; padding: 3rem;">
                        <div class="kelola-user-loading">
                          <p>⏳ Memuat data user...</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
    </div>
  `,go(),N()}let ce=[];function go(){const e=document.getElementById("userSearch");e&&e.addEventListener("input",t=>{ho(t.target.value)}),Pa()}async function Pa(){const e=document.getElementById("usersTable"),t=document.getElementById("totalUserCount");if(e)try{ce=(await Wa()).data.filter(n=>n.role==="pasien"),t&&(t.textContent=`${ce.length} Pasien Terdaftar`),Aa(ce)}catch(a){console.error("Error loading users:",a),e.innerHTML=`
      <tr>
        <td colspan="7" style="text-align: center; padding: 3rem;">
          <div class="kelola-user-error">
            <p>❌ Gagal memuat data user</p>
            <small>${a.message}</small>
          </div>
        </td>
      </tr>
    `}}function Aa(e){const t=document.getElementById("usersTable");if(t){if(e.length===0){t.innerHTML=`
      <tr class="empty-row">
        <td colspan="5" style="text-align: center; padding: 3rem;">
          <div class="kelola-user-empty">
            <p>✨ Belum ada user terdaftar</p>
            <small>User baru akan muncul di sini setelah registrasi</small>
          </div>
        </td>
      </tr>
    `;return}t.innerHTML=e.map((a,n)=>{const s=new Date(a.created_at).toLocaleDateString("id-ID",{year:"numeric",month:"short",day:"numeric"});return`
      <tr class="user-row" data-user-id="${a.id}">
        <td><span class="row-number">${n+1}</span></td>
        <td>
          <div class="user-name">
            <div class="user-avatar">${a.name?.charAt(0).toUpperCase()||"?"}</div>
            <span>${a.name||"-"}</span>
          </div>
        </td>
        <td><span class="email-badge">${a.email||"-"}</span></td>
        <td><span class="date-badge">${s}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn-detail" onclick="viewUserDetail(${a.id})">Detail</button>
            <button class="btn-delete" onclick="deleteUserAction(${a.id}, '${a.name}')">Hapus</button>
          </div>
        </td>
      </tr>
    `}).join("")}}function ho(e){const t=ce.filter(a=>{const n=e.toLowerCase();return a.name&&a.name.toLowerCase().includes(n)||a.email&&a.email.toLowerCase().includes(n)});Aa(t)}window.viewUserDetail=function(e){const t=ce.find(a=>a.id===e);if(t){const a=new Date(t.created_at).toLocaleDateString("id-ID");alert(`Detail User:

Nama: ${t.name}
Email: ${t.email}
Role: ${t.role}
Terdaftar: ${a}`)}};window.deleteUserAction=async function(e,t){if(confirm(`Apakah Anda yakin ingin menghapus user "${t}"?

Tindakan ini tidak dapat dibatalkan.`))try{const a=await Va(e);a.success?(alert(`✅ ${a.message}`),Pa()):alert(`❌ Gagal: ${a.message}`)}catch(a){alert(`❌ Error: ${a.message}`),console.error("Delete user error:",a)}};let G={all:[],filtered:[]};function vo(e){const t=P();if(!t||t.role!=="ahli_gizi"){window.location.href="/login";return}e.innerHTML=`
    <div class="laporan-wrapper">
        ${F("laporan")}
        
        <main class="laporan-main-content">
          <div class="laporan-topbar">
            <div class="laporan-topbar-left">
              <button class="laporan-toggle-sidebar" id="toggleSidebar">☰</button>
              <div class="laporan-topbar-title">
                <h1>Laporan</h1>
                <p>Laporan analisis gizi masyarakat</p>
              </div>
            </div>
            <div class="laporan-topbar-user">
              <div class="laporan-user-avatar">${t.nama?.charAt(0).toUpperCase()}</div>
              <div class="laporan-user-info">
                <p class="laporan-user-name">${t.nama}</p>
                <p class="laporan-user-role">Petugas Gizi</p>
              </div>
            </div>
          </div>

          <div class="laporan-dashboard-content">
            <!-- Overview Cards -->
            <div class="laporan-overview-cards">
              <div class="laporan-overview-card">
                <div class="laporan-card-icon">📋</div>
                <div class="laporan-card-content">
                  <h3>Total Laporan</h3>
                  <p class="laporan-card-value" id="totalLaporan">0</p>
                </div>
              </div>
              <div class="laporan-overview-card">
                <div class="laporan-card-icon">✅</div>
                <div class="laporan-card-content">
                  <h3>Laporan Aktif</h3>
                  <p class="laporan-card-value" id="activeLaporan">0</p>
                </div>
              </div>
            </div>

            <!-- Laporan Table Section -->
            <div class="laporan-table-section">
              <div class="laporan-table-header">
                <h2>Daftar Laporan Rekomendasi Gizi</h2>
                <div class="laporan-search-container">
                  <input
                    type="text"
                    id="laporanSearchInput"
                    class="laporan-search-input"
                    placeholder="🔍 Cari nama atau email user..."
                  />
                </div>
              </div>
              
              <div class="laporan-table-responsive">
                <table class="laporan-table">
                  <thead>
                    <tr>
                      <th>Nama User</th>
                      <th>Email</th>
                      <th>Usia</th>
                      <th>Tujuan</th>
                      <th>Target Kalori</th>
                      <th>Jumlah Makanan</th>
                      <th>Status</th>
                      <th>Tanggal</th>
                      <th style="text-align:center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody id="laporanTable">
                    <tr>
                      <td colspan="10" style="text-align: center; padding: 2rem;"><div class="laporan-loading">Memuat laporan...</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
    </div>

    <!-- Modal Detail Laporan -->
    <div class="laporan-modal" id="detailModal">
      <div class="laporan-modal-content">
        <button class="laporan-modal-close" id="closeModal">X</button>
        <div class="laporan-modal-body" id="modalBody">
          <!-- Detail akan di-load di sini -->
        </div>
      </div>
    </div>
  `,fo(),N(),_a()}function fo(){const e=document.getElementById("toggleSidebar"),t=document.getElementById("petugasSidebar"),a=document.getElementById("closeModal"),n=document.getElementById("detailModal"),s=document.getElementById("laporanSearchInput");e&&t&&e.addEventListener("click",()=>{t.classList.toggle("active")}),a&&a.addEventListener("click",()=>{n.classList.remove("active")}),n&&n.addEventListener("click",i=>{i.target===n&&n.classList.remove("active")}),s&&s.addEventListener("input",i=>{const o=i.target.value.toLowerCase();wo(o)})}async function _a(){try{const e=await Za();G.all=e,G.filtered=e,Da(G.filtered),bo(e)}catch(e){console.error("Error loading laporan:",e);const t=document.getElementById("laporanTable");t&&(t.innerHTML=`
        <tr>
          <td colspan="10" style="text-align: center; padding: 2rem; color: #e53e3e;">
            Error memuat laporan. Silakan coba lagi nanti.
          </td>
        </tr>
      `)}}function wo(e){e?G.filtered=G.all.filter(t=>(t.nama_user||"").toLowerCase().includes(e)||(t.email_user||"").toLowerCase().includes(e)):G.filtered=G.all,Da(G.filtered)}function Da(e){const t=document.getElementById("laporanTable");if(t){if(t.innerHTML="",!e||e.length===0){t.innerHTML=`
      <tr>
        <td colspan="10" style="text-align: center; padding: 2rem; color: #a0aec0;">
          Belum ada laporan. Buat rekomendasi terlebih dahulu.
        </td>
      </tr>
    `;return}e.forEach(a=>{const n=document.createElement("tr"),s=a.status==="aktif"?"laporan-status-aktif":"laporan-status-arsip",i=new Date(a.created_at).toLocaleDateString("id-ID",{year:"numeric",month:"short",day:"numeric"});n.innerHTML=`
      <td><strong>${a.nama_user||"N/A"}</strong></td>
      <td><code>${a.email_user||"N/A"}</code></td>
      <td>${a.usia||"N/A"} tahun</td>
      <td>
        <span class="laporan-badge laporan-badge-${a.tujuan}">
          ${a.tujuan==="turun"?"Turun BB":a.tujuan==="naik"?"Naik BB":"Seimbang"}
        </span>
      </td>
      <td>${Math.round(a.target_calories||0)} kkal</td>
      <td><strong>${a.total_makanan}</strong> item</td>
      <td>
        <span class="laporan-status ${s}">
          ${a.status==="aktif"?"Aktif":"📁 Arsip"}
        </span>
      </td>
      <td>${i}</td>
      <td id="laporanActions">
        <button class="laporan-btn-detail" onclick="window.showLaporanDetail(${a.id})">
          Detail
        </button>
        <button class="laporan-btn-delete" onclick="window.deleteLaporan(${a.id})" title="Hapus laporan">
          🗑️
        </button>
      </td>
    `,t.appendChild(n)})}}function bo(e){const t=e.length,a=e.filter(i=>i.status==="aktif").length,n=document.getElementById("totalLaporan"),s=document.getElementById("activeLaporan");n&&(n.textContent=t),s&&(s.textContent=a)}window.showLaporanDetail=async function(e){try{const t=document.getElementById("detailModal"),a=document.getElementById("modalBody");a.innerHTML='<div class="laporan-modal-loading">Memuat detail laporan...</div>',t.classList.add("active");const n=await an(e),{rekomendasi:s,detail_makanan:i}=n;let o=`
      <h2>Detail Laporan Rekomendasi</h2>
      
      <div class="laporan-detail-grid">
        <div class="laporan-detail-group">
          <h3>Profil Pengguna</h3>
          <div class="laporan-detail-row">
            <span>Nama</span>
            <strong>${s.nama_user}</strong>
          </div>
          <div class="laporan-detail-row">
            <span>Usia</span>
            <strong>${s.usia} tahun</strong>
          </div>
          <div class="laporan-detail-row">
            <span>Berat Badan</span>
            <strong>${s.berat_badan} kg</strong>
          </div>
          <div class="laporan-detail-row">
            <span>Tinggi Badan</span>
            <strong>${s.tinggi_badan} cm</strong>
          </div>
          <div class="laporan-detail-row">
            <span>BMI</span>
            <strong>${s.bmi?parseFloat(s.bmi).toFixed(1):"N/A"}</strong>
          </div>
          <div class="laporan-detail-row">
            <span>Jenis Kelamin</span>
            <strong>${s.jenis_kelamin==="pria"?"Pria":"Wanita"}</strong>
          </div>
        </div>

        <div class="laporan-detail-group">
          <h3>Hasil Kalkulasi</h3>
          <div class="laporan-detail-row">
            <span>BMR</span>
            <strong>${Math.round(s.bmr)} kkal/hari</strong>
          </div>
          <div class="laporan-detail-row">
            <span>TDEE</span>
            <strong>${Math.round(s.tdee)} kkal/hari</strong>
          </div>
          <div class="laporan-detail-row">
            <span>Target Kalori</span>
            <strong>${Math.round(s.target_calories)} kkal/hari</strong>
          </div>
          <div class="laporan-detail-row">
            <span>Tujuan</span>
            <strong>${s.tujuan==="turun"?"Turun Berat Badan":s.tujuan==="naik"?"Naik Berat Badan":"Seimbang"}</strong>
          </div>
          <div class="laporan-detail-row">
            <span>Tingkat Aktivitas</span>
            <strong>${s.aktivitas}</strong>
          </div>
        </div>

        <div class="laporan-detail-group">
          <h3>Target Nutrisi</h3>
          <div class="laporan-detail-row">
            <span>Protein</span>
            <strong>${s.target_protein_g?parseFloat(s.target_protein_g).toFixed(1):"N/A"} g</strong>
          </div>
          <div class="laporan-detail-row">
            <span>Lemak</span>
            <strong>${s.target_lemak_g?parseFloat(s.target_lemak_g).toFixed(1):"N/A"} g</strong>
          </div>
          <div class="laporan-detail-row">
            <span>Karbohidrat</span>
            <strong>${s.target_karbohidrat_g?parseFloat(s.target_karbohidrat_g).toFixed(1):"N/A"} g</strong>
          </div>
        </div>
      </div>

      <h3 style="margin-top: 2rem;">Rekomendasi Makanan (${i.length} item)</h3>
      <div class="laporan-foods-table">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Makanan</th>
              <th>Energi (kal)</th>
              <th>Protein (g)</th>
              <th>Lemak (g)</th>
              <th>Karbohidrat (g)</th>
              <th>Similarity</th>
            </tr>
          </thead>
          <tbody>
    `;i.forEach(r=>{o+=`
        <tr>
          <td style="text-align: center; font-weight: bold;">${r.rank}</td>
          <td>${r.nama_makanan}</td>
          <td style="text-align:center;">${r.energi_kal?parseFloat(r.energi_kal).toFixed(0):"N/A"}</td>
          <td style="text-align:center;">${r.protein_g?parseFloat(r.protein_g).toFixed(1):"N/A"}</td>
          <td style="text-align:center;">${r.lemak_g?parseFloat(r.lemak_g).toFixed(1):"N/A"}</td>
          <td style="text-align:center;">${r.karbohidrat_g?parseFloat(r.karbohidrat_g).toFixed(1):"N/A"}</td>
          <td>
            <span class="laporan-similarity-bar">
              <span class="laporan-similarity-fill" style="width: ${r.similarity_score*100}%"></span>
            </span>
            ${(r.similarity_score*100).toFixed(0)}%
          </td>
        </tr>
      `}),o+=`
          </tbody>
        </table>
      </div>
    `,a.innerHTML=o}catch(t){console.error("Error loading detail:",t);const a=document.getElementById("modalBody");a&&(a.innerHTML=`
        <div style="color: #e53e3e; padding: 2rem; text-align: center;">
          Error memuat detail laporan
        </div>
      `)}};window.deleteLaporan=async function(e){try{(await w.fire({title:"Hapus Laporan?",text:"Laporan yang dihapus tidak dapat dipulihkan",icon:"warning",showCancelButton:!0,confirmButtonColor:"#ef4444",cancelButtonColor:"#6b7280",confirmButtonText:"Hapus",cancelButtonText:"Batal"})).isConfirmed&&(await nn(e),await w.fire({title:"Berhasil!",text:"Laporan berhasil dihapus",icon:"success",confirmButtonColor:"#10b981"}),_a())}catch(t){console.error("Error deleting laporan:",t),await w.fire({title:"Gagal!",text:t.message||"Gagal menghapus laporan",icon:"error",confirmButtonColor:"#ef4444"})}};function ko(e){const t=P();if(!t||t.role!=="ahli_gizi"){window.location.href="/login";return}e.innerHTML=`
    <div class="rekomendasi-wrapper">
      <div class="rekomendasi-container">
        ${F("rekomendasi")}

        <main class="rekomendasi-main-content">
          <div class="rekomendasi-topbar">
            <div class="rekomendasi-topbar-left">
              <div class="rekomendasi-topbar-title">
                <h1>Rekomendasi Gizi</h1>
                <p>Berikan rekomendasi nutrisi kepada Pasien berdasarkan profil mereka</p>
              </div>
            </div>
            <div class="rekomendasi-topbar-user">
              <div class="rekomendasi-user-avatar">
                ${t.nama?.charAt(0).toUpperCase()}
              </div>
              <div class="rekomendasi-user-info">
                <p class="rekomendasi-user-name">${t.nama}</p>
                <p class="rekomendasi-user-role">Petugas Gizi</p>
              </div>
            </div>
          </div>

          <div class="rekomendasi-content">
            <div class="rekomendasi-form-section">
              <h2>Form Input Data Pasien</h2>
              <form id="rekomasiForm" class="rekomendasi-form">
                <div class="rekomendasi-form-grid">
                  <!-- Nama -->
                  <div class="rekomendasi-form-group">
                    <label for="nama" class="rekomendasi-label">Nama Pasien</label>
                    <input
                      type="text"
                      id="nama"
                      name="nama"
                      class="rekomendasi-input"
                      placeholder="Masukkan nama lengkap Pasien"
                      required
                    />
                  </div>

                  <!-- Email -->
                  <div class="rekomendasi-form-group">
                    <label for="email" class="rekomendasi-label">Email Pasien</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      class="rekomendasi-input"
                      placeholder="Masukkan email Pasien"
                      required
                    />
                  </div>

                  <!-- Usia -->
                  <div class="rekomendasi-form-group">
                    <label for="usia" class="rekomendasi-label">Usia (tahun) <span class="rekomendasi-required">*Min 18 tahun</span></label>
                    <input
                      type="number"
                      id="usia"
                      name="usia"
                      class="rekomendasi-input"
                      placeholder="Contoh: 25 (minimum 18 tahun)"
                      min="18"
                      max="150"
                      required
                    />
                  </div>

                  <!-- Jenis Kelamin -->
                  <div class="rekomendasi-form-group">
                    <label for="jenisKelamin" class="rekomendasi-label">Jenis Kelamin</label>
                    <select id="jenisKelamin" name="jenisKelamin" class="rekomendasi-select" required>
                      <option value="">-- Pilih Jenis Kelamin --</option>
                      <option value="pria">Pria</option>
                      <option value="wanita">Wanita</option>
                    </select>
                  </div>

                  <!-- Berat Badan -->
                  <div class="rekomendasi-form-group">
                    <label for="beratBadan" class="rekomendasi-label">Berat Badan (kg)</label>
                    <input
                      type="number"
                      id="beratBadan"
                      name="beratBadan"
                      class="rekomendasi-input"
                      placeholder="Contoh: 70"
                      step="0.1"
                      min="1"
                      max="300"
                      required
                    />
                  </div>

                  <!-- Tinggi Badan -->
                  <div class="rekomendasi-form-group">
                    <label for="tinggiBadan" class="rekomendasi-label">Tinggi Badan (cm)</label>
                    <input
                      type="number"
                      id="tinggiBadan"
                      name="tinggiBadan"
                      class="rekomendasi-input"
                      placeholder="Contoh: 170"
                      step="0.1"
                      min="1"
                      max="300"
                      required
                    />
                  </div>

                  <!-- Tingkat Aktivitas -->
                  <div class="rekomendasi-form-group">
                    <label for="aktivitas" class="rekomendasi-label">Tingkat Aktivitas</label>
                    <select id="aktivitas" name="aktivitas" class="rekomendasi-select" required>
                      <option value="">-- Pilih Tingkat Aktivitas --</option>
                      <option value="ringan">Ringan (Jarang olahraga)</option>
                      <option value="sedang">Sedang (Olahraga 3-5x seminggu)</option>
                      <option value="berat">Berat (Olahraga setiap hari)</option>
                    </select>
                  </div>

                  <!-- Tujuan -->
                  <div class="rekomendasi-form-group">
                    <label for="tujuan" class="rekomendasi-label">Tujuan</label>
                    <select id="tujuan" name="tujuan" class="rekomendasi-select" required>
                      <option value="">-- Pilih Tujuan --</option>
                      <option value="naik">Menaikkan Berat Badan</option>
                      <option value="turun">Menurunkan Berat Badan</option>
                      <option value="seimbang">Menyeimbangkan Berat Badan</option>
                    </select>
                  </div>

                  <!-- Kategori (Optional) -->
                  <div class="rekomendasi-form-group">
                    <label for="kategori" class="rekomendasi-label">Kategori</label>
                    <select id="kategori" name="kategori" class="rekomendasi-select">
                      <option value="all">Semua Kategori</option>
                      <option value="Buah">Buah</option>
                      <option value="Sayur">Sayur</option>
                      <option value="Kacang-kacangan">Kacang-kacangan</option>
                      <option value="Mentah">Mentah</option>
                    </select>
                  </div>
                </div>

                <div class="rekomendasi-form-actions">
                  <button type="submit" class="rekomendasi-btn-submit">
                    <span id="submitBtnText">Dapatkan Rekomendasi</span>
                    <span id="submitBtnSpinner" style="display: none;">⏳ Memproses...</span>
                  </button>
                  <button type="reset" class="rekomendasi-btn-reset">Reset Form</button>
                </div>
              </form>
            </div>

            <!-- Alert Messages -->
            <div id="alertMessage" class="rekomendasi-alert" style="display: none;"></div>
          </div>
        </main>
      </div>
    </div>
  `,N(),Bo(),yo()}function yo(){try{const e=sessionStorage.getItem("preFilledRekomendasiData");if(e){const t=JSON.parse(e);t.nama&&(document.getElementById("nama").value=t.nama),t.email&&(document.getElementById("email").value=t.email),t.usia&&(document.getElementById("usia").value=t.usia),t.jenisKelamin&&(document.getElementById("jenisKelamin").value=t.jenisKelamin),t.beratBadan&&(document.getElementById("beratBadan").value=t.beratBadan),t.tinggiBadan&&(document.getElementById("tinggiBadan").value=t.tinggiBadan),t.aktivitas&&(document.getElementById("aktivitas").value=t.aktivitas),t.tujuan&&(document.getElementById("tujuan").value=t.tujuan),t.kategori&&(document.getElementById("kategori").value=t.kategori),sessionStorage.removeItem("preFilledRekomendasiData"),console.log("Form berhasil di-fill dengan data dari konsultasi")}}catch(e){console.error("Error auto-filling form:",e)}}function Bo(){const e=document.getElementById("rekomasiForm"),t=document.getElementById("alertMessage"),a=document.querySelector(".rekomendasi-btn-submit"),n=document.getElementById("submitBtnText"),s=document.getElementById("submitBtnSpinner");e.addEventListener("submit",async i=>{i.preventDefault();const o={nama:document.getElementById("nama").value,email:document.getElementById("email").value,usia:parseInt(document.getElementById("usia").value),jenis_kelamin:document.getElementById("jenisKelamin").value,berat:parseFloat(document.getElementById("beratBadan").value),tinggi:parseFloat(document.getElementById("tinggiBadan").value),aktivitas:document.getElementById("aktivitas").value,tujuan:document.getElementById("tujuan").value,kategori:document.getElementById("kategori").value||"all"};if(o.usia<18){t.style.display="block",t.className="rekomendasi-alert alert-error",t.innerHTML=`
        <div class="alert-content">
          <strong>❌ Perhatian!</strong> Sistem hanya mendukung pengguna dewasa (minimal usia 18 tahun). Pasien harus berusia minimal 18 tahun untuk mendapatkan rekomendasi melalui sistem ini.
        </div>
      `;return}a.disabled=!0,n.style.display="none",s.style.display="inline",t.style.display="none";try{let r=[];try{r=await At(o)}catch(c){console.warn("API Error:",c.message),r=xo(7),t.style.display="block",t.className="rekomendasi-alert alert-warning",t.innerHTML=`
          <div class="alert-content">
            <strong>⚠️ Info:</strong> Menggunakan data rekomendasi example (backend tidak tersedia)
          </div>
        `}const d=Eo(o.berat,o.tinggi,o.usia,o.jenis_kelamin,o.aktivitas,o.tujuan),u={profileData:o,recommendations:r,targetNutrients:d};sessionStorage.setItem("rekomendasiResults",JSON.stringify(u)),setTimeout(()=>{window.location.href="/petugas/hasil-rekomendasi"},500)}catch(r){console.error("Error:",r),t.style.display="block",t.className="rekomendasi-alert alert-error",t.innerHTML=`
        <div class="alert-content">
          <strong>❌ Error!</strong> ${r.message||"Terjadi kesalahan saat memproses data"}
        </div>
      `}finally{a.disabled=!1,n.style.display="inline",s.style.display="none"}})}function Eo(e,t,a,n,s,i){let o;n==="pria"?o=88.362+13.397*e+4.799*t-5.677*a:o=447.593+9.247*e+3.098*t-4.33*a;let r=1.55;switch(s){case"ringan":r=1.375;break;case"berat":r=1.725;break}const d=o*r;let u=d;switch(i){case"turun":u=d*.85;break;case"naik":u=d*1.15;break}let c,g,m;switch(i){case"turun":c=.35,g=.2,m=.45;break;case"naik":c=.15,g=.3,m=.55;break;default:c=.25,g=.25,m=.5}const v=u*c,h=u*g,B=u*m,y=Math.round(u/4),q=Math.round(v/4/4*10)/10,Y=Math.round(h/4/9*10)/10,Re=Math.round(B/4/4*10)/10;return{calories:Math.round(u),caloriesPerMeal:y,protein_g:Math.round(v/4*10)/10,lemak_g:Math.round(h/9*10)/10,karbohidrat_g:Math.round(B/4*10)/10,protein_g_per_meal:q,lemak_g_per_meal:Y,karbohidrat_g_per_meal:Re}}function xo(e=7){const t=[{nama:"Nasi Putih",kode:"NPT001",energi:180,protein:3.6,lemak:.3,karbohidrat:40,similarity:.95},{nama:"Telur Rebus",kode:"TLR001",energi:155,protein:13,lemak:11,karbohidrat:1.1,similarity:.88},{nama:"Daging Ayam Goreng",kode:"DAG001",energi:320,protein:30,lemak:21,karbohidrat:0,similarity:.85},{nama:"Sayur Bayam",kode:"SBY001",energi:23,protein:2.7,lemak:.4,karbohidrat:3.7,similarity:.82},{nama:"Buah Pisang",kode:"BPS001",energi:89,protein:1.1,lemak:.3,karbohidrat:23,similarity:.79},{nama:"Tahu Goreng",kode:"THG001",energi:150,protein:15.7,lemak:8.7,karbohidrat:1.7,similarity:.76},{nama:"Wortel Rebus",kode:"WRB001",energi:41,protein:.9,lemak:.2,karbohidrat:10,similarity:.73},{nama:"Ikan Bakar",kode:"IBK001",energi:206,protein:22,lemak:12,karbohidrat:0,similarity:.7},{nama:"Kangkung Tumis",kode:"KGT001",energi:53,protein:2.3,lemak:3.4,karbohidrat:3.8,similarity:.67},{nama:"Susu Sapi",kode:"SUS001",energi:61,protein:3.2,lemak:3.3,karbohidrat:4.8,similarity:.65}];return t.slice(0,Math.min(e,t.length))}function To(e){const t=P();if(!t||t.role!=="ahli_gizi"){window.location.href="/login";return}const a=sessionStorage.getItem("rekomendasiResults");if(!a){e.innerHTML=`
      <div class="hasil-rekomendasi-wrapper">
        <div class="hasil-rekomendasi-container">
          ${F("rekomendasi")}
          <main class="hasil-rekomendasi-empty">
            <div class="empty-state">
              <div class="empty-icon">📄</div>
              <h2>Tidak Ada Data</h2>
              <p>Silakan buat rekomendasi terlebih dahulu</p>
              <a href="/petugas/rekomendasi" class="btn-back">Kembali ke Form</a>
            </div>
          </main>
        </div>
      </div>
    `,N();return}const n=JSON.parse(a),{profileData:s,recommendations:i}=n;e.innerHTML=`
    <div class="hasil-rekomendasi-wrapper">
        ${F("rekomendasi")}

        <main class="hasil-rekomendasi-main-content">
          <div class="hasil-rekomendasi-topbar">
            <div class="hasil-rekomendasi-topbar-left">
              <div class="hasil-rekomendasi-topbar-title">
                <h1>Hasil Rekomendasi Gizi</h1>
                <p>Detail rekomendasi makanan untuk klien</p>
              </div>
            </div>
            <div class="hasil-rekomendasi-topbar-user">
              <div class="hasil-rekomendasi-user-avatar">
                ${t.nama?.charAt(0).toUpperCase()}
              </div>
              <div class="hasil-rekomendasi-user-info">
                <p class="hasil-rekomendasi-user-name">${t.nama}</p>
                <p class="hasil-rekomendasi-user-role">Petugas Gizi</p>
              </div>
            </div>
          </div>

          <div class="hasil-rekomendasi-content">
            <!-- Profil Klien -->
            <div class="hasil-rekomendasi-profile-section">
              <h2>📋 Profil Klien</h2>
              <div id="profileCard" class="hasil-rekomendasi-profile-card"></div>
            </div>

            <!-- Analisis Kesehatan -->
            <div class="hasil-rekomendasi-analysis-section">
              <h2>📊 Analisis Kesehatan</h2>
              <div id="analysisCard" class="hasil-rekomendasi-analysis-card"></div>
            </div>

            <!-- Rekomendasi Makanan -->
            <div class="hasil-rekomendasi-foods-section">
              <h2>🍎 Rekomendasi Makanan</h2>
              <div id="foodsList" class="hasil-rekomendasi-foods-grid"></div>
            </div>

            <!-- Action Buttons -->
            <div class="hasil-rekomendasi-actions">
              <button id="saveBtn" class="btn-save">💾 Simpan Laporan</button>
              <button id="backBtn" class="btn-back">⬅️ Kembali ke Form</button>
            </div>
          </div>
        </main>
    </div>
  `,N(),$o(s)}async function $o(e,t){try{console.log("📥 Mengambil rekomendasi dari ML Service via Backend..."),w.fire({title:"Memproses...",text:"Menganalisis profil gizi Anda dengan sistem cerdas",allowOutsideClick:!1,didOpen:()=>{w.showLoading()}});const a=await At(e);if(w.close(),console.log("📊 Data rekomendasi ML Service berhasil diterima:",a.length,"items"),a&&a.length>0){const n=JSON.parse(sessionStorage.getItem("rekomendasiResults"))||{};n.recommendations=a,sessionStorage.setItem("rekomendasiResults",JSON.stringify(n)),Ge(e,a),qe(e,a)}else console.warn("⚠️ Data rekomendasi dari backend kosong."),w.fire("Informasi","Tidak menemukan rekomendasi yang cocok di database.","info"),Ge(e,[]),qe(e,[])}catch(a){w.close(),console.error("✗ Error in loadAndPopulateResults:",a.message),w.fire({title:"Terjadi Kesalahan",text:"Gagal menghubungi server rekomendasi. Pastikan ML Service berjalan di production.",icon:"error"}),Ge(e,[]),qe(e,[])}}function qe(e,t){const a=document.getElementById("saveBtn"),n=document.getElementById("backBtn");a.addEventListener("click",async()=>{await Io(e,t)}),n.addEventListener("click",()=>{sessionStorage.removeItem("rekomendasiResults"),window.location.href="/petugas/rekomendasi"})}function Ge(e,t){const a=e.berat/(e.tinggi/100)**2,n=Co(a),s=So(a),i=ht(e),o=vt(e),r=ja(e),d=document.getElementById("profileCard");d.innerHTML=`
    <div class="profile-grid">
      <div class="profile-item">
        <span class="item-label">Nama Klien</span>
        <span class="item-value">${e.nama||"-"}</span>
      </div>
      <div class="profile-item">
        <span class="item-label">Email Klien</span>
        <span class="item-value">${e.email||"-"}</span>
      </div>
      <div class="profile-item">
        <span class="item-label">Usia</span>
        <span class="item-value">${e.usia||"-"} tahun</span>
      </div>
      <div class="profile-item">
        <span class="item-label">Jenis Kelamin</span>
        <span class="item-value">${e.jenis_kelamin==="pria"?"Pria":e.jenis_kelamin==="wanita"?"Wanita":"-"}</span>
      </div>
      <div class="profile-item">
        <span class="item-label">Berat Badan</span>
        <span class="item-value">${e.berat||"-"} kg</span>
      </div>
      <div class="profile-item">
        <span class="item-label">Tinggi Badan</span>
        <span class="item-value">${e.tinggi||"-"} cm</span>
      </div>
      <div class="profile-item">
        <span class="item-label">Tingkat Aktivitas</span>
        <span class="item-value">${Lo(e.aktivitas)}</span>
      </div>
      <div class="profile-item">
        <span class="item-label">Tujuan</span>
        <span class="item-value">${Lt(e.tujuan)}</span>
      </div>
      <div class="profile-item">
        <span class="item-label">Kategori</span>
        <span class="item-value">${e.kategori==="all"?"Semua Kategori":e.kategori||"-"}</span>
      </div>
    </div>
  `;const u=document.getElementById("analysisCard"),c=Math.round(r/4);u.innerHTML=`
    <div class="analysis-grid">
      <div class="analysis-item">
        <div class="analysis-label">BMI</div>
        <div class="analysis-value" style="color: ${s}; font-size: 1.75rem; font-weight: 700;">
          ${a.toFixed(1)}
        </div>
        <div class="analysis-status" style="color: ${s};">${n}</div>
      </div>
      <div class="analysis-item">
        <div class="analysis-label">BMR (Basal Metabolic Rate)</div>
        <div class="analysis-value">${Math.round(i).toLocaleString("id-ID")} kal</div>
        <div class="analysis-status">Kalori minimum harian</div>
      </div>
      <div class="analysis-item">
        <div class="analysis-label">TDEE (Total Daily Energy Expenditure)</div>
        <div class="analysis-value">${Math.round(o).toLocaleString("id-ID")} kal</div>
        <div class="analysis-status">Kalori harian normal</div>
      </div>
      <div class="analysis-item">
        <div class="analysis-label">Target Kalori Harian</div>
        <div class="analysis-value">${Math.round(r).toLocaleString("id-ID")} kal</div>
        <div class="analysis-status">${Lt(e.tujuan)}</div>
      </div>
      <div class="analysis-item">
        <div class="analysis-label">🔥 Kalori Per Makan</div>
        <div class="analysis-value" style="color: #ff6b6b; font-size: 1.75rem; font-weight: 700;">
          ${c.toLocaleString("id-ID")} kal
        </div>
        <div class="analysis-status">Sarapan Per-harinya</div>
      </div>
    </div>
  `;const g=document.getElementById("foodsList");if(t&&t.length>0){const m=[...t].sort((h,B)=>{const y=h.similarity||0;return(B.similarity||0)-y});let v="";m.forEach((h,B)=>{const y=h.nama_bahan||h.nama||h.kode||"Makanan",q=h.energi_kal||h.energi||0,Y=h.protein_g||h.protein||0,Re=h.lemak_g||h.lemak||0,Oa=h.karbohidrat_g||h.karbohidrat||0,ke=((h.similarity||0)*100).toFixed(1);let ze="#dc2626",Ke="#fee2e2",Oe="#7f1d1d";ke>=70?(ze="#16a34a",Ke="#dcfce7",Oe="#15803d"):ke>=50&&(ze="#ea580c",Ke="#fed7aa",Oe="#92400e"),v+=`
        <div class="food-card">
          <div class="food-header">
            <span class="food-number">#${B+1}</span>
            <h3 style="color:#ffff;" class="food-name">${y}</h3>
            <span class="food-similarity" style="background-color: ${Ke}; color: ${Oe}; border-left: 3px solid ${ze};">${ke}%</span>
          </div>
          <div class="food-details">
            <div class="detail-item">
              <span class="detail-label">Energi</span>
              <span class="detail-value">${q} kal</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Protein</span>
              <span class="detail-value">${Y} g</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Lemak</span>
              <span class="detail-value">${Re} g</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Karbohidrat</span>
              <span class="detail-value">${Oa} g</span>
            </div>
          </div>
        </div>
      `,console.log(`Food #${B+1}: ${y} - Similarity: ${ke}%`)}),g.innerHTML=v}else g.innerHTML=`
      <div class="no-recommendations">
        <p>❌ Tidak ada rekomendasi yang ditemukan</p>
      </div>
    `}function ht(e){return e.jenis_kelamin==="pria"?88.362+13.397*e.berat+4.799*e.tinggi-5.677*e.usia:447.593+9.247*e.berat+3.098*e.tinggi-4.33*e.usia}function vt(e){const t=ht(e);let a;switch(e.aktivitas){case"ringan":a=1.375;break;case"sedang":a=1.55;break;case"berat":a=1.725;break;default:a=1.55}return t*a}function ja(e){const t=vt(e);switch(e.tujuan){case"turun":return t*.85;case"naik":return t*1.15;default:return t}}function Co(e){return e<18.5?"Berat Badan Kurang":e<25?"Berat Badan Normal":e<30?"Berat Badan Berlebih":"Obesitas"}function So(e){return e<18.5?"#ff6b6b":e<25?"#51cf66":e<30?"#ffd43b":"#ff6b6b"}function Lo(e){return{ringan:"Ringan (Jarang olahraga)",sedang:"Sedang (Olahraga 3-5x seminggu)",berat:"Berat (Olahraga setiap hari)"}[e]||e}function Lt(e){return{naik:"Menaikkan Berat Badan",turun:"Menurunkan Berat Badan",seimbang:"Menyeimbangkan Berat Badan"}[e]||e}async function Io(e,t){const a=document.getElementById("saveBtn"),n=a.textContent;try{a.disabled=!0,a.textContent="💾 Menyimpan...";const s={nama_user:e.nama||"User",email_user:e.email||"",usia:e.usia,berat_badan:e.berat,tinggi_badan:e.tinggi,bmi:e.berat/(e.tinggi/100)**2,jenis_kelamin:e.jenis_kelamin,aktivitas:e.aktivitas,tujuan:e.tujuan,kategori:e.kategori||"all",bmr:ht(e),tdee:vt(e),target_calories:ja(e)},o=JSON.parse(sessionStorage.getItem("rekomendasiResults")||"{}").targetNutrients||{protein_g:0,lemak_g:0,karbohidrat_g:0};console.log("Saving laporan:",{user_profile:s,target_nutrients:o,recommendations_count:t.length});const r=await Xa(s,o,t,`Rekomendasi dibuat pada ${new Date().toLocaleString("id-ID")}`);if(r.success)await w.fire({title:"Berhasil!",html:`<p>Laporan berhasil disimpan</p><p><strong>ID Laporan: ${r.rekomendasi_id}</strong></p><p>Anda akan diarahkan ke halaman Laporan...</p>`,icon:"success",confirmButtonColor:"#10b981",confirmButtonText:"OK",allowOutsideClick:!1,didClose:()=>{sessionStorage.removeItem("rekomendasiResults"),window.location.href="/petugas/laporan"}});else throw new Error(r.message||"Gagal menyimpan laporan")}catch(s){console.error("Error saving laporan:",s),await w.fire({title:"Gagal!",text:s.message||"Gagal menyimpan laporan",icon:"error",confirmButtonColor:"#ef4444",confirmButtonText:"Kembali"})}finally{a.disabled=!1,a.textContent=n}}async function Mo(e){const t=P();if(!t||t.role!=="ahli_gizi"){window.location.href="/login";return}const n=new URLSearchParams(window.location.search).get("id");if(!n){e.innerHTML=`
      <div style="padding: 2rem; text-align: center;">
        <h2>❌ Error: ID Konsultasi tidak ditemukan</h2>
        <p><a href="/petugas/dashboard">Kembali ke Dashboard</a></p>
      </div>
    `;return}e.innerHTML=`
    <div class="konsultasi-response-wrapper">
      ${F("konsultasi")}
      
      <main class="konsultasi-response-main">
        <div class="konsultasi-response-topbar">
          <div class="response-topbar-left">
            <a href="/petugas/dashboard" class="btn-back">← Kembali</a>
            <div class="response-topbar-title">
              <h1>📋 Respons Konsultasi User</h1>
              <p>Berikan rekomendasi dan respons untuk request konsultasi</p>
            </div>
          </div>
          <div class="response-topbar-user">
            <div class="response-user-avatar">
              ${t.nama?.charAt(0).toUpperCase()}
            </div>
            <div class="response-user-info">
              <p class="response-user-name">${t.nama}</p>
              <p class="response-user-role">Petugas</p>
            </div>
          </div>
        </div>

        <div class="konsultasi-response-content">
          <div id="loadingState" class="loading-state">
            <p>⏳ Memuat data konsultasi...</p>
          </div>
          <div id="contentArea" style="display: none;">
            <!-- Content akan diisi dengan JavaScript -->
          </div>
        </div>
      </main>
    </div>

    <!-- Modal Beri Rekomendasi -->
    <div class="modal modal-rekomendasi" id="rekoModal" style="display: none;">
      <div class="modal-overlay" onclick="closeRekoModal()"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>🍽️ Beri Rekomendasi Gizi</h2>
          <button class="modal-close" onclick="closeRekoModal()">×</button>
        </div>
        <div class="modal-body" id="rekoModalBody">
          <!-- Form akan di-load di sini -->
        </div>
      </div>
    </div>
  `,N(),await Po(n)}async function Po(e,t){try{const a=await Dt(e),n=document.getElementById("loadingState"),s=document.getElementById("contentArea");n&&(n.style.display="none"),s&&(s.style.display="block");const i=Ho(a.berat,a.tinggi,a.usia,a.jenis_kelamin,a.aktivitas),o=new Date(a.created_at).toLocaleDateString("id-ID",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"}),r={pending:'<span class="status-badge status-pending">⏳ Pending</span>',diproses:'<span class="status-badge status-processing">🔄 Diproses</span>',selesai:'<span class="status-badge status-completed">✅ Selesai</span>',ditolak:'<span class="status-badge status-rejected">❌ Ditolak</span>'},d=`
      <div class="konsultasi-response-grid">
        
        <!-- Section 1: User Profile -->
        <div class="response-section user-profile-section">
          <h2>👤 Profil User</h2>
          <div class="profile-card">
            <div class="profile-row">
              <span class="profile-label">Nama:</span>
              <span class="profile-value">${f(a.nama)}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Email:</span>
              <span class="profile-value">${f(a.email)}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Usia:</span>
              <span class="profile-value">${f(String(a.usia))} tahun</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Jenis Kelamin:</span>
              <span class="profile-value">${f(a.jenis_kelamin)}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Tanggal Request:</span>
              <span class="profile-value">${f(o)}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Status:</span>
              <span class="profile-value">${r[a.status]}</span>
            </div>
          </div>
        </div>

        <!-- Section 2: Data Gizi -->
        <div class="response-section nutrition-section">
          <h2>📊 Data Gizi & Kalkulasi</h2>
          <div class="nutrition-card">
            <div class="nutrition-row">
              <span class="nutrition-label">Berat Badan:</span>
              <span class="nutrition-value">${f(String(a.berat))} kg</span>
            </div>
            <div class="nutrition-row">
              <span class="nutrition-label">Tinggi Badan:</span>
              <span class="nutrition-value">${f(String(a.tinggi))} cm</span>
            </div>
            <div class="nutrition-row">
              <span class="nutrition-label">Aktivitas:</span>
              <span class="nutrition-value">${f(a.aktivitas)}</span>
            </div>
            <div class="nutrition-row">
              <span class="nutrition-label">Tujuan:</span>
              <span class="nutrition-value">${f(a.tujuan)}</span>
            </div>
            <div class="nutrition-row">
              <span class="nutrition-label">Target TDEE:</span>
              <span class="nutrition-value nutrition-highlight">${Math.round(i)} Kcal/hari</span>
            </div>
            ${a.kategori?`<div class="nutrition-row">
                <span class="nutrition-label">Preferensi Kategori:</span>
                <span class="nutrition-value">${f(a.kategori)}</span>
              </div>`:""}
          </div>
        </div>

        <!-- Section 3: Catatan/Pesan -->
        ${a.catatan?`<div class="response-section notes-section">
          <h2>💬 Catatan dari User</h2>
          <div class="notes-card">
            <p>${f(a.catatan)}</p>
          </div>
        </div>`:""}

        <!-- Section 4: Response Form -->
        <div class="response-section response-form-section">
          <h2>✍️ Respons Konsultasi</h2>
          <form id="responseForm" class="response-form">
            <div class="form-group">
              <label for="status" class="form-label">Status Konsultasi *</label>
              <select id="status" name="status" class="form-control" required>
                <option value="">-- Pilih Status --</option>
                <option value="selesai" selected>✅ Selesai</option>
              </select>
            </div>

            <div class="form-group">
              <label for="respons" class="form-label">Respons/Rekomendasi *</label>
              <textarea
                id="respons"
                name="respons"
                class="form-control form-textarea"
                placeholder="Berikan rekomendasi gizi dan saran untuk user..."
                rows="6"
                required
              ></textarea>
              <div class="char-count">
                <span id="charCount">0</span> / 2000 karakter
              </div>
            </div>

            <!-- Notif wajib pilih rekomendasi -->
            <div id="rekoRequiredNotice" class="reko-required-notice">
              <span class="reko-required-icon">⚠️</span>
              <span>Anda wajib memilih rekomendasi terlebih dahulu sebelum mengirim respons.</span>
              <button type="button" class="btn-beri-reko btn-beri-reko-inline" onclick="openRekoModal(${a.user_id}, '${a.email}')">
                🍽️ Beri Rekomendasi Sekarang
              </button>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-submit" id="submitBtn" disabled>
                <span id="submitText">📤 Kirim Respons</span>
                <span id="submitSpinner" style="display: none;">⏳ Mengirim...</span>
              </button>
              <button type="button" class="btn-beri-reko" onclick="openRekoModal(${a.user_id}, '${a.email}')">
                🍽️ Beri Rekomendasi
              </button>
              <button type="button" class="btn-cancel" onclick="window.history.back()">
                ❌ Batal
              </button>
            </div>

            <!-- Preview Rekomendasi yang dipilih -->
            <div id="rekoPreviewSection" style="display: none; margin-top: 1.5rem; padding: 1.5rem; background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 0.5rem;">
              <h3 style="color: #0369a1; margin-bottom: 1rem;">✓ Rekomendasi Terpilih</h3>
              <div id="rekoPreviewContent" style="background: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;"></div>
              <div style="display: flex; gap: 1rem;">
                <button type="button" class="btn-batalkan-reko" onclick="batalkanRekomendasi()">❌ Batalkan</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    `;s.innerHTML=d,Do(e);const u=document.getElementById("respons"),c=document.getElementById("charCount");u&&c&&u.addEventListener("input",()=>{c.textContent=u.value.length})}catch(a){console.error("Error loading konsultasi detail:",a);const n=document.getElementById("loadingState");document.getElementById("contentArea"),n&&(n.innerHTML=`
        <div style="color: #dc2626;">
          <p>❌ Error: ${a.message}</p>
          <p><a href="/petugas/dashboard" style="color: #2563eb;">Kembali ke Dashboard</a></p>
        </div>
      `)}}let ie=null,Me=null;async function Ao(e,t){try{const n=(await jt(t)).find(s=>s.id==e);if(!n)throw new Error("Rekomendasi tidak ditemukan");ie=n,Me=t,_o(n),window.closeRekoModal()}catch(a){console.error("Error in submitGiveRekomendasi:",a),w.fire("Error",a.message||"Gagal memproses rekomendasi","error")}}function _o(e){const t=document.getElementById("rekoPreviewSection"),a=document.getElementById("rekoPreviewContent"),n=new Date(e.created_at).toLocaleDateString("id-ID",{year:"numeric",month:"long",day:"numeric"}),s=`
    <div style="line-height: 1.8;">
      <p><strong>👤 User:</strong> ${f(e.nama_user)}</p>
      <p><strong>📊 BMI:</strong> ${e.bmi?parseFloat(e.bmi).toFixed(1):"N/A"}</p>
      <p><strong>🎯 Target Kalori:</strong> ${e.target_calories?Math.round(e.target_calories):"N/A"} kkal/hari</p>
      <p><strong>🍽️ Jumlah Makanan:</strong> ${e.total_makanan} makanan</p>
      <p><strong>📅 Dibuat:</strong> ${f(n)}</p>
    </div>
  `;a.innerHTML=s,t.style.display="block";const i=document.getElementById("submitBtn"),o=document.getElementById("rekoRequiredNotice");i&&(i.disabled=!1),o&&(o.style.display="none")}window.batalkanRekomendasi=function(){document.getElementById("rekoPreviewSection").style.display="none",ie=null,Me=null;const e=document.getElementById("submitBtn"),t=document.getElementById("rekoRequiredNotice");e&&(e.disabled=!0),t&&(t.style.display="flex"),w.fire({icon:"info",title:"Batalkan",text:"Rekomendasi telah dibatalkan",confirmButtonText:"OK"})};function Do(e){const t=document.getElementById("responseForm");t&&t.addEventListener("submit",async a=>{a.preventDefault();const n=document.getElementById("status").value,s=document.getElementById("respons").value;if(!n||!s){w.fire("Perhatian","Silakan isi semua field yang diperlukan","warning");return}if(!ie){w.fire("Perhatian","Anda harus memilih rekomendasi terlebih dahulu sebelum mengirim respons.","warning");return}if(ie){if(!(await w.fire({icon:"question",title:"Konfirmasi",text:"Berikan rekomendasi kepada user?",showCancelButton:!0,confirmButtonText:"Ya, Berikan",cancelButtonText:"Batal"})).isConfirmed)return;await jo(e)}const i=t.querySelector("button[type='submit']"),o=document.getElementById("submitText"),r=document.getElementById("submitSpinner");i.disabled=!0,o.style.display="none",r.style.display="inline";try{await sn(e,n,s),w.fire({icon:"success",title:"Berhasil!",text:"Respons konsultasi telah dikirim",confirmButtonText:"OK"}).then(()=>{window.location.href="/petugas/dashboard"})}catch(d){console.error("Error updating konsultasi:",d),w.fire("Error",d.message,"error")}finally{i.disabled=!1,o.style.display="inline",r.style.display="none"}})}async function jo(e){try{console.log("[submitRealGiveRekomendasi] giving reko:",ie.id,"to user:",Me,"konsultasi:",e),await rn(ie.id,Me,e),console.log("[submitRealGiveRekomendasi] Rekomendasi diberikan")}catch(t){throw console.error("Error giving rekomendasi:",t),t}}window.closeRekoModal=function(){document.getElementById("rekoModal").style.display="none"};function Ho(e,t,a,n,s){let i;n==="pria"?i=88.362+13.397*e+4.799*t-5.677*a:i=447.593+9.247*e+3.098*t-4.33*a;let o=1.55;switch(s){case"ringan":o=1.375;break;case"berat":o=1.725;break}return i*o}window.openRekoModal=function(e,t){const a=document.getElementById("rekoModalBody"),n=`
    <div id="rekoLoadingState" style="text-align: center; padding: 2rem;">
      <p>⏳ Memuat daftar rekomendasi yang tersedia...</p>
    </div>
    <div id="rekoContentArea" style="display: none;">
      <!-- Content akan diisi dengan JavaScript -->
    </div>
  `;a.innerHTML=n,document.getElementById("rekoModal").style.display="flex",Ro(e,t)};async function Ro(e,t){try{const a=await jt(e),n=document.getElementById("rekoLoadingState"),s=document.getElementById("rekoContentArea");n&&(n.style.display="none"),s&&(s.style.display="block");const i=a.filter(r=>r.email_user===t);if(!i||i.length===0){s.innerHTML=`
        <div style="text-align: center; padding: 2rem; color: #a0aec0;">
          <p>❌ Belum ada laporan yang tersedia untuk <strong>${f(t)}</strong></p>
          <p style="font-size: 0.9rem; margin-top: 0.5rem;">Mohon buat rekomendasi terlebih dahulu di menu Rekomendasi Gizi</p>
        </div>
      `;return}let o=`
      <form id="rekoSelectionForm" class="reko-form">
        <div class="form-group">
          <label for="selectedLaporan" class="form-label">Pilih Laporan untuk <strong>${f(t)}</strong> *</label>
          <div class="laporan-selection-list">
    `;i.forEach(r=>{const d=new Date(r.created_at).toLocaleDateString("id-ID",{year:"numeric",month:"short",day:"numeric"});o+=`
        <div class="laporan-selection-item">
          <input type="radio" id="laporan_${r.id}" name="selectedLaporan" value="${r.id}" required>
          <label for="laporan_${r.id}" class="laporan-selection-label">
            <div class="laporan-selection-header">
              <strong>${f(r.email_user||r.nama_user)}</strong>
              <span class="laporan-date">${f(d)}</span>
            </div>
            <div class="laporan-selection-details">
              <span>📊 BMI: ${r.bmi?parseFloat(r.bmi).toFixed(1):"N/A"}</span>
              <span>🎯 Target: ${r.target_calories?Math.round(r.target_calories):"N/A"} kkal</span>
              <span>🍽️ ${r.total_makanan} makanan</span>
            </div>
          </label>
        </div>
      `}),o+=`
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit">
            <span id="giveRekoText">✓ Berikan Rekomendasi</span>
            <span id="giveRekoSpinner" style="display: none;">⏳ Memberikan...</span>
          </button>
          <button type="button" class="btn-cancel" onclick="closeRekoModal()">
            ❌ Batal
          </button>
        </div>
      </form>

      <style>
        .laporan-selection-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 350px;
          overflow-y: auto;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 0.75rem;
        }

        .laporan-selection-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
          box-sizing: border-box;
        }

        .laporan-selection-item:hover {
          background-color: #f7fafc;
          border-color: #cbd5e0;
        }

        .laporan-selection-item input[type="radio"] {
          flex-shrink: 0;
          cursor: pointer;
        }

        .laporan-selection-item input[type="radio"]:checked + .laporan-selection-label .laporan-selection-header strong {
          color: #2563eb;
        }

        .laporan-selection-label {
          flex: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .laporan-selection-header {
          display: flex;
          flex-direction: column;
          min-width: 100px;
        }

        .laporan-selection-header strong {
          font-size: 0.95rem;
        }

        .laporan-date {
          font-size: 0.78rem;
          color: #718096;
        }

        .laporan-selection-details {
          display: flex;
          flex-direction: row;
          gap: 0.5rem;
          font-size: 0.82rem;
          color: #4a5568;
          flex-wrap: wrap;
        }

        .laporan-selection-details span {
          display: flex;
          align-items: center;
          padding: 0.35rem 0.6rem;
          background-color: #f7fafc;
          border-radius: 4px;
          border-left: 3px solid #8b5cf6;
          white-space: nowrap;
        }
      </style>
    `,s.innerHTML=o,document.getElementById("rekoSelectionForm").addEventListener("submit",async r=>{r.preventDefault();const d=document.querySelector("input[name='selectedLaporan']:checked").value;await Ao(d,e)})}catch(a){console.error("Error loading available laporan:",a);const n=document.getElementById("rekoContentArea"),s=document.getElementById("rekoLoadingState");s&&(s.style.display="none"),n&&(n.style.display="block",n.innerHTML=`
        <div style="text-align: center; padding: 2rem; color: #dc2626;">
          <p>❌ Error: ${a.message}</p>
        </div>
      `)}}window.closeRekoModal=function(){document.getElementById("rekoModal").style.display="none"};const T={all:[],filtered:[],page:1,perPage:10};function Ha(e){const{berat:t,tinggi:a,usia:n,jenis_kelamin:s,aktivitas:i,tujuan:o}=e;if(!t||!a||!n)return{perHari:null,perMakan:null};let r;s==="pria"?r=88.362+13.397*t+4.799*a-5.677*n:r=447.593+9.247*t+3.098*a-4.33*n;const d={ringan:1.375,sedang:1.55,berat:1.725,aktif:1.725,sedentary:1.2,sangat_aktif:1.9}[i]||1.55,u=r*d;let c;o==="turun"?c=u*.85:o==="naik"?c=u*1.15:c=u;const g=Math.round(c),m=Math.round(c/4);return{perHari:g,perMakan:m}}async function zo(e){const t=P();if(!t||t.role!=="ahli_gizi"){window.location.href="/login";return}e.innerHTML=`
    <div class="arsip-wrapper">
      ${F("arsip")}

      <main class="arsip-main">
        <!-- Topbar -->
        <div class="arsip-topbar">
          <div class="arsip-topbar-left">
            <div class="arsip-topbar-title">
              <h1>🗂️ Arsip Konsultasi</h1>
              <p>Riwayat laporan hasil konsultasi user yang telah selesai atau ditolak</p>
            </div>
          </div>
          <div class="arsip-topbar-user">
            <div class="arsip-user-avatar">${t.nama?.charAt(0).toUpperCase()}</div>
            <div>
              <p class="arsip-user-name">${t.nama}</p>
              <p class="arsip-user-role">Petugas Gizi</p>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="arsip-content">

          <!-- Stat Cards -->
          <div class="arsip-stats">
            <div class="arsip-stat-card green">
              <div class="arsip-stat-icon">✅</div>
              <div class="arsip-stat-info">
                <h4>Total Selesai</h4>
                <p class="arsip-stat-value" id="statSelesai">—</p>
              </div>
            </div>
          </div>

          <!-- Table Section -->
          <div class="arsip-table-section">
            <div class="arsip-table-header">
              <h2>📋 Daftar Arsip Konsultasi</h2>
              <div class="arsip-table-controls">
                <input
                  type="text"
                  id="arsipSearch"
                  class="arsip-search-input"
                  placeholder="🔍 Cari nama / email..."
                />
              </div>
            </div>

            <div class="arsip-table-responsive">
              <table class="arsip-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama User</th>
                    <th>Email</th>
                    <th>Usia</th>
                    <th>Kalori/Hari</th>
                    <th>Kalori/Makan</th>
                    <th>Tujuan</th>
                    <th>Status</th>
                    <th>Tanggal</th>
                    <th style="text-align:center">Aksi</th>
                  </tr>
                </thead>
                <tbody id="arsipTableBody">
                  <tr>
                    <td colspan="9">
                      <div class="arsip-empty-state"><p>⏳ Memuat data arsip...</p></div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="arsip-pagination" id="arsipPagination" style="display:none;"></div>
          </div>

        </div>
      </main>
    </div>

    <!-- Modal Detail -->
    <div class="arsip-modal-overlay" id="arsipModal">
      <div class="arsip-modal-box">
        <div class="arsip-modal-head">
          <h2>📄 Detail Konsultasi</h2>
          <button class="arsip-modal-close" id="arsipModalClose">✕</button>
        </div>
        <div class="arsip-modal-body" id="arsipModalBody"></div>
      </div>
    </div>
  `,N(),Ko(),await Oo()}function Ko(){const e=document.getElementById("arsipModal");document.getElementById("arsipModalClose")?.addEventListener("click",It),e?.addEventListener("click",a=>{a.target===e&&It()}),document.getElementById("arsipSearch")?.addEventListener("input",Pe),document.getElementById("arsipFilter")?.addEventListener("change",Pe)}function It(){document.getElementById("arsipModal")?.classList.remove("active")}async function Oo(){try{const e=await _t("selesai");T.all=e.sort((t,a)=>new Date(a.created_at)-new Date(t.created_at)),Ra(e.length),Pe()}catch(e){console.error("Error loading arsip:",e),Ka([]),w.fire("Error","Gagal memuat data arsip. Silakan coba lagi.","error")}}function Ra(e){((a,n)=>{const s=document.getElementById(a);s&&(s.textContent=n)})("statSelesai",e)}function Pe(){const e=(document.getElementById("arsipSearch")?.value||"").toLowerCase(),t=document.getElementById("arsipFilter")?.value||"all";T.filtered=T.all.filter(a=>{const n=!e||(a.nama||"").toLowerCase().includes(e)||(a.email||"").toLowerCase().includes(e),s=t==="all"||a.status===t;return n&&s}),T.page=1,za()}function za(){const{filtered:e,page:t,perPage:a}=T,n=(t-1)*a,s=e.slice(n,n+a);Ka(s,n),Fo(e.length)}function Ka(e,t=0){const a=document.getElementById("arsipTableBody");if(a){if(!e||e.length===0){a.innerHTML=`
      <tr>
        <td colspan="11">
          <div class="arsip-empty-state"><p>📭 Belum ada data arsip.</p></div>
        </td>
      </tr>`;return}a.innerHTML=e.map((n,s)=>{const i=t+s+1,{perHari:o,perMakan:r}=Ha(n),d=new Date(n.created_at).toLocaleDateString("id-ID",{year:"numeric",month:"short",day:"numeric"}),u={selesai:'<span class="arsip-badge arsip-badge-selesai">✅ Selesai</span>',ditolak:'<span class="arsip-badge arsip-badge-ditolak">❌ Ditolak</span>',diproses:'<span class="arsip-badge arsip-badge-diproses">🔄 Diproses</span>',pending:'<span class="arsip-badge arsip-badge-pending">⏳ Pending</span>'},c={turun:"Turun BB",naik:"Naik BB",seimbang:"Seimbang"};return`
        <tr>
          <td>${i}</td>
          <td><strong>${n.nama||"—"}</strong></td>
          <td>${n.email||"—"}</td>
          <td>${n.usia?n.usia+" thn":"—"}</td>
          <td>${o?`<strong>${o.toLocaleString("id-ID")}</strong> kkal`:"—"}</td>
          <td>${r?`${r.toLocaleString("id-ID")} kkal`:"—"}</td>
          <td>
            <span class="arsip-badge arsip-badge-${n.tujuan}">
              ${c[n.tujuan]||n.tujuan||"—"}
            </span>
          </td>
          <td>${u[n.status]||`<span class="arsip-badge">${n.status}</span>`}</td>
          <td>${d}</td>
          <td>
            <div class="arsip-actions">
              <button class="arsip-btn arsip-btn-lihat" onclick="window.arsipLihat(${n.id})">👁 Lihat</button>
              <button class="arsip-btn arsip-btn-hapus" onclick="window.arsipHapus(${n.id})">🗑 Hapus</button>
            </div>
          </td>
        </tr>`}).join("")}}function Fo(e){const t=document.getElementById("arsipPagination");if(!t)return;const a=Math.ceil(e/T.perPage);if(a<=1){t.style.display="none";return}t.style.display="flex";const n=(T.page-1)*T.perPage+1,s=Math.min(T.page*T.perPage,e);let i="";const o=5,r=Math.floor(o/2);let d=Math.max(1,T.page-r),u=Math.min(a,d+o-1);u-d<o-1&&(d=Math.max(1,u-o+1));for(let c=d;c<=u;c++)i+=`<button class="arsip-pagination-btn${c===T.page?" active":""}" onclick="window.arsipGoPage(${c})">${c}</button>`;t.innerHTML=`
    <span>Menampilkan ${n}–${s} dari ${e} data</span>
    <div class="arsip-pagination-btns">
      <button class="arsip-pagination-btn" onclick="window.arsipGoPage(${T.page-1})" ${T.page===1?"disabled":""}>‹ Prev</button>
      ${i}
      <button class="arsip-pagination-btn" onclick="window.arsipGoPage(${T.page+1})" ${T.page===a?"disabled":""}>Next ›</button>
    </div>`}window.arsipGoPage=function(e){const t=Math.ceil(T.filtered.length/T.perPage);e<1||e>t||(T.page=e,za())};window.arsipLihat=async function(e){const t=document.getElementById("arsipModal"),a=document.getElementById("arsipModalBody");if(!(!t||!a)){a.innerHTML='<div class="arsip-empty-state"><p>⏳ Memuat detail...</p></div>',t.classList.add("active");try{const n=await Dt(e),s=new Date(n.created_at).toLocaleString("id-ID",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"}),i=n.updated_at?new Date(n.updated_at).toLocaleString("id-ID",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}):"—",o={selesai:"✅ Selesai",ditolak:"❌ Ditolak",diproses:"🔄 Diproses",pending:"⏳ Pending"},r={turun:"Turun Berat Badan",naik:"Naik Berat Badan",seimbang:"Berat Badan Seimbang"},d={sedentary:"Tidak Aktif (Sedentary)",ringan:"Ringan",sedang:"Sedang",aktif:"Aktif",sangat_aktif:"Sangat Aktif"},{perHari:u,perMakan:c}=Ha(n);a.innerHTML=`
      <div class="arsip-detail-grid">
        <div class="arsip-detail-item">
          <div class="arsip-detail-label">Nama</div>
          <div class="arsip-detail-value">${n.nama||"—"}</div>
        </div>
        <div class="arsip-detail-item">
          <div class="arsip-detail-label">Email</div>
          <div class="arsip-detail-value">${n.email||"—"}</div>
        </div>
        <div class="arsip-detail-item">
          <div class="arsip-detail-label">Usia</div>
          <div class="arsip-detail-value">${n.usia?n.usia+" tahun":"—"}</div>
        </div>
        <div class="arsip-detail-item">
          <div class="arsip-detail-label">Jenis Kelamin</div>
          <div class="arsip-detail-value">${n.jenis_kelamin||"—"}</div>
        </div>
        <div class="arsip-detail-item">
          <div class="arsip-detail-label">Berat Badan</div>
          <div class="arsip-detail-value">${n.berat?n.berat+" kg":"—"}</div>
        </div>
        <div class="arsip-detail-item">
          <div class="arsip-detail-label">Tinggi Badan</div>
          <div class="arsip-detail-value">${n.tinggi?n.tinggi+" cm":"—"}</div>
        </div>
        <div class="arsip-detail-item">
          <div class="arsip-detail-label">Aktivitas</div>
          <div class="arsip-detail-value">${d[n.aktivitas]||n.aktivitas||"—"}</div>
        </div>
        <div class="arsip-detail-item">
          <div class="arsip-detail-label">Target Kalori/Hari</div>
          <div class="arsip-detail-value">${u?`<strong>${u.toLocaleString("id-ID")}</strong> kkal`:"—"}</div>
        </div>
        <div class="arsip-detail-item">
          <div class="arsip-detail-label">Target Kalori/Makan (÷3)</div>
          <div class="arsip-detail-value">${c?`${c.toLocaleString("id-ID")} kkal`:"—"}</div>
        </div>
        <div class="arsip-detail-item">
          <div class="arsip-detail-label">Tujuan</div>
          <div class="arsip-detail-value">${r[n.tujuan]||n.tujuan||"—"}</div>
        </div>
        <div class="arsip-detail-item">
          <div class="arsip-detail-label">Status</div>
          <div class="arsip-detail-value">${o[n.status]||n.status||"—"}</div>
        </div>
        <div class="arsip-detail-item">
          <div class="arsip-detail-label">Dibuat</div>
          <div class="arsip-detail-value">${s}</div>
        </div>
        <div class="arsip-detail-item">
          <div class="arsip-detail-label">Diperbarui</div>
          <div class="arsip-detail-value">${i}</div>
        </div>
        ${n.catatan?`<div class="arsip-detail-item full-width">
                <div class="arsip-detail-label">Catatan User</div>
                <div class="arsip-detail-value">${n.catatan}</div>
              </div>`:""}
        ${n.respons?`<div class="arsip-detail-item full-width">
                <div class="arsip-detail-label">Respons Petugas</div>
                <div class="arsip-detail-value">${n.respons}</div>
              </div>`:""}
      </div>`}catch(n){console.error("Error loading detail:",n),a.innerHTML='<div class="arsip-empty-state"><p>❌ Gagal memuat detail konsultasi.</p></div>'}}};window.arsipHapus=async function(e){if((await w.fire({title:"Hapus Arsip?",text:"Data konsultasi ini akan dihapus secara permanen dan tidak dapat dikembalikan.",icon:"warning",showCancelButton:!0,confirmButtonColor:"#e53e3e",cancelButtonColor:"#718096",confirmButtonText:"Ya, Hapus",cancelButtonText:"Batal"})).isConfirmed)try{await on(e),T.all=T.all.filter(n=>n.id!==e),Pe();const a=T.all.filter(n=>n.status==="selesai").length;Ra(a),w.fire({title:"Terhapus!",text:"Data konsultasi berhasil dihapus.",icon:"success",timer:1800,showConfirmButton:!1})}catch(a){console.error("Error deleting konsultasi:",a),w.fire("Gagal",a.message||"Tidak dapat menghapus data.","error")}};function we(e=""){return`
    <!-- Burger Button -->
    <button class="sidebar-burger" id="sidebarBurger" aria-label="Toggle menu">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Overlay Backdrop -->
    <div class="sidebar-overlay" id="sidebarOverlay"></div>

    <!-- Sidebar Drawer -->
    <div class="user-sidebar" id="userSidebar">
      <div class="sidebar-header">
        <span>NutriFood</span>
        <button class="sidebar-close" id="sidebarClose" aria-label="Close menu">✕</button>
      </div>
      <nav class="sidebar-nav">
        <a href="/user/dashboard" class="nav-link ${e==="dashboard"?"active":""}">
          <span class="nav-icon">🏠</span>
          <span class="nav-text">Beranda</span>
        </a>
        <a href="/user/hasil-rekomendasi" class="nav-link ${e==="hasil-rekomendasi"?"active":""}">
          <span class="nav-icon">📋</span>
          <span class="nav-text">Hasil Rekomendasi</span>
        </a>
        <a href="/user/konsultasi-rekomendasi" class="nav-link ${e==="konsultasi"?"active":""}">
          <span class="nav-icon">💬</span>
          <span class="nav-text">Konsultasi</span>
        </a>
        <a href="/user/data-makanan" class="nav-link ${e==="data-gizi"?"active":""}">
          <span class="nav-icon">🍔</span>
          <span class="nav-text">Gizi Makanan</span>
        </a>
        <a href="/user/konsumsi-makanan" class="nav-link ${e==="konsumsi-makanan"?"active":""}">
          <span class="nav-icon">🍽️</span>
          <span class="nav-text">Konsumsi Harian</span>
        </a>
      </nav>
      <div class="sidebar-footer">
        <button class="sidebar-logout" id="logoutBtn">
          <span class="nav-icon">🚪</span>
          <span class="nav-text">Logout</span>
        </button>
      </div>
    </div>
  `}function be(){const e=document.getElementById("sidebarBurger"),t=document.getElementById("userSidebar"),a=document.getElementById("sidebarOverlay"),n=document.getElementById("sidebarClose");function s(){t.classList.add("open"),a.classList.add("active"),e.classList.add("active")}function i(){t.classList.remove("open"),a.classList.remove("active"),e.classList.remove("active")}e?.addEventListener("click",s),a?.addEventListener("click",i),n?.addEventListener("click",i);const o=document.getElementById("logoutBtn");o&&o.addEventListener("click",r=>{r.preventDefault(),w.fire({title:"Logout",text:"Anda yakin ingin keluar?",icon:"question",showCancelButton:!0,confirmButtonText:"Ya",cancelButtonText:"Batal"}).then(d=>{d.isConfirmed&&(localStorage.removeItem("user"),localStorage.removeItem("token"),window.location.href="/login")})})}async function No(e){const t=P();if(!t||t.role!=="pasien"){window.location.href="/login";return}let a="Belum ada data",n="0 Kcal",s=!1;try{const i=await Qa();if(i&&i.rekomendasi){s=!0;const o=i.rekomendasi,r=Number(o.berat_badan)||0,d=Number(o.tinggi_badan)||0;let u=Number(o.bmi)||0;d>0&&!o.bmi&&(u=r/(d/100)**2);let c="";u<18.5?c="Kurus":u>=18.5&&u<25?c="Normal":u>=25&&u<30?c="Kelebihan Berat":u>=30&&(c="Obesitas"),a=u?`${u.toFixed(1)} (${c})`:"-",n=o.target_calories?`${Math.round(Number(o.target_calories))} Kcal`:"0 Kcal"}}catch{}e.innerHTML=`
    <div class="user-wrapper">
      <div class="user-container">
        ${we("dashboard")}
        
        <main class="user-main-content">
          <div class="user-topbar">
            <div class="topbar-welcome">
              <h1>👋 Halo, ${f(t.nama)}</h1>
              <p>Selamat datang di dashboard kesehatan Anda</p>
            </div>
            
            <div class="topbar-actions">
              <div class="user-badge">Pasien</div>
            </div>
          </div>

          <div class="dashboard-grid">
            <div class="dashboard-card welcome-card">
              <div class="card-content">
                <h2>Mulai Hidup Sehat Hari Ini!</h2>
                <p>Dapatkan rekomendasi makanan yang sesuai dengan kebutuhan gizi harianmu dengan mudah.</p>
                <button class="btn-primary-action" onclick="window.location.href='/user/hasil-rekomendasi'">
                  ${s?"Lihat Hasil Terbaru":"Cek Rekomendasi Gizi"}
                </button>
              </div>
              <div class="card-illustration">🥗</div>
            </div>

            <div class="dashboard-card status-card">
              <h3>Status Terakhir</h3>
              <div class="stats-row">
                <div class="stat-item">
                  <span class="stat-label">Status BMI</span>
                  <span class="stat-value">${a}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Target Kalori</span>
                  <span class="stat-value">${n}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="features-section">
            <h3>Fitur Anda</h3>
            <div class="features-grid">
              <div class="feature-item" onclick="window.location.href='/user/hasil-rekomendasi'">
                <span class="feature-icon">📋</span>
                <h4>Rekomendasi</h4>
                <p>Lihat menu makanan sehat</p>
              </div>
              <div class="feature-item" onclick="window.location.href='/user/data-makanan'">
                <span class="feature-icon">🥗</span>
                <h4>Data Makanan & Gizi</h4>
                <p>Lihat data makanan beserta kandungan gizinya</p>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  `,Uo(),be()}function Uo(){const e=document.getElementById("headerLogoutBtn");e&&e.addEventListener("click",()=>{w.fire({title:"Logout?",text:"Anda akan keluar dari aplikasi",icon:"warning",showCancelButton:!0,confirmButtonColor:"#10b981",cancelButtonColor:"#d33",confirmButtonText:"Ya, Keluar"}).then(t=>{t.isConfirmed&&(localStorage.removeItem("user"),localStorage.removeItem("token"),window.location.href="/login")})})}async function qo(e){const t=P();if(!t||t.role!=="pasien"){window.location.href="/login";return}e.innerHTML=`
        <div class="user-wrapper">
            <div class="user-container">
                ${we("hasil-rekomendasi")}
                <main class="user-main-content" id="mainContentArea"></main>
            </div>
        </div>

        <!-- Modal Detail Rekomendasi -->
        <div class="hasil-modal" id="detailModal">
            <div class="hasil-modal-content">
                <button class="hasil-modal-close" id="closeModal">X</button>
                <div class="hasil-modal-body" id="modalBody">
                    <!-- Detail akan di-load di sini -->
                </div>
            </div>
        </div>
    `,be();const a=document.getElementById("mainContentArea");try{a.innerHTML=`
            <div class="hasil-rekomendasi-container">
                <div class="hasil-header">
                    <div class="header-content">
                        <h1>📊 Hasil Rekomendasi Gizi</h1>
                        <p class="subtitle">
                            Halo <b>${f(t.nama)}</b>, berikut adalah daftar rekomendasi gizi Anda.
                        </p>
                    </div>
                </div>

                <!-- Overview Cards -->
                <div class="hasil-overview-cards">
                    <div class="hasil-overview-card">
                        <div class="hasil-card-icon">📋</div>
                        <div class="hasil-card-content">
                            <h3>Total Rekomendasi</h3>
                            <p class="hasil-card-value" id="totalRekomendasi">0</p>
                        </div>
                    </div>
                </div>

                <!-- Tabel Rekomendasi -->
                <div class="hasil-table-section">
                    <h2>Daftar Rekomendasi Gizi</h2>
                    
                    <div class="hasil-table-responsive">
                        <table class="hasil-table">
                            <thead>
                                <tr>
                                    <th>Tanggal</th>
                                    <th>Tujuan</th>
                                    <th>BMI</th>
                                    <th>Target Kalori</th>
                                    <th>Jumlah Makanan</th>
                                    <th style="text-align:center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="rekomendasiTable">
                                <tr>
                                    <td colspan="6" style="text-align: center; padding: 2rem;">
                                        <div class="hasil-loading">Memuat rekomendasi...</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `,Go(),Wo()}catch(n){console.error("Error loading hasil rekomendasi:",n),a.innerHTML=`
            <div class="hasil-rekomendasi-container">
                <div class="error-message" style="text-align:center; margin-top:50px;">
                    <h2>⚠️ Data Belum Tersedia</h2>
                    <p>${n.message}</p>
                    <button class="btn-kembali" id="btnToDashboard"
                        style="padding:10px 20px; background:#10b981; color:white; border:none; border-radius:5px; cursor:pointer; margin-top:10px;">
                        Ke Dashboard
                    </button>
                </div>
            </div>
        `,document.getElementById("btnToDashboard")?.addEventListener("click",()=>{window.location.href="/user/dashboard"})}}function Go(){const e=document.getElementById("closeModal"),t=document.getElementById("detailModal");e&&e.addEventListener("click",()=>{t.classList.remove("active")}),t&&t.addEventListener("click",a=>{a.target===t&&t.classList.remove("active")})}async function Wo(){try{const e=await en();Vo(e.data||[]),Jo(e.data||[])}catch(e){console.error("Error loading rekomendasi:",e);const t=document.getElementById("rekomendasiTable");t&&(t.innerHTML=`
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: #e53e3e;">
                        Error memuat rekomendasi. Silakan coba lagi nanti.
                    </td>
                </tr>
            `)}}function Vo(e){const t=document.getElementById("rekomendasiTable");if(t){if(t.innerHTML="",!e||e.length===0){t.innerHTML=`
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem; color: #a0aec0;">
                    Belum ada rekomendasi. Konsultasi dengan petugas gizi terlebih dahulu.
                </td>
            </tr>
        `;return}e.forEach(a=>{const n=document.createElement("tr"),s=new Date(a.created_at).toLocaleDateString("id-ID",{year:"numeric",month:"short",day:"numeric"}),i={turun:"Turun BB",naik:"Naik BB",seimbang:"Seimbang"};n.innerHTML=`
            <td>${s}</td>
            <td>
                <span class="hasil-badge hasil-badge-${a.tujuan}">
                    ${i[a.tujuan]||a.tujuan}
                </span>
            </td>
            <td>${a.bmi?parseFloat(a.bmi).toFixed(1):"N/A"}</td>
            <td>${Math.round(a.target_calories||0)} kkal</td>
            <td><strong>${a.total_makanan||0}</strong> item</td>
            <td id="rekomendasiActions">
                <button class="hasil-btn-detail" onclick="window.showUserRekomendasiDetail(${a.id})">
                    Detail
                </button>
            </td>
        `,t.appendChild(n)})}}function Jo(e){const t=e.length,a=document.getElementById("totalRekomendasi");a&&(a.textContent=t)}window.showUserRekomendasiDetail=async function(e){try{const t=document.getElementById("detailModal"),a=document.getElementById("modalBody");a.innerHTML='<div class="hasil-modal-loading">Memuat detail rekomendasi...</div>',t.classList.add("active");const n=await tn(e),{rekomendasi:s,detail_makanan:i}=n,o=parseFloat(s.bmi)||0;let r="";o<18.5?r="Kurus":o>=18.5&&o<25?r="Normal":o>=25&&o<30?r="Kelebihan Berat":r="Obesitas";const d={turun:"Turunkan Berat Badan",naik:"Naikkan Berat Badan",seimbang:"Seimbangkan Berat"},u={ringan:"Ringan",sedang:"Sedang",berat:"Berat"};let c=`
            <h2>Detail Rekomendasi Gizi</h2>
            
            <div class="hasil-detail-grid">
                <div class="hasil-detail-group">
                    <h3>Profil Pengguna</h3>
                    <div class="hasil-detail-row">
                        <span>Nama</span>
                        <strong>${f(s.nama_user)}</strong>
                    </div>
                    <div class="hasil-detail-row">
                        <span>Usia</span>
                        <strong>${f(String(s.usia))} tahun</strong>
                    </div>
                    <div class="hasil-detail-row">
                        <span>Berat Badan</span>
                        <strong>${f(String(s.berat_badan))} kg</strong>
                    </div>
                    <div class="hasil-detail-row">
                        <span>Tinggi Badan</span>
                        <strong>${f(String(s.tinggi_badan))} cm</strong>
                    </div>
                    <div class="hasil-detail-row">
                        <span>BMI</span>
                        <strong>${o?o.toFixed(1):"N/A"} (${f(r)})</strong>
                    </div>
                    <div class="hasil-detail-row">
                        <span>Jenis Kelamin</span>
                        <strong>${f(s.jenis_kelamin==="pria"?"Pria":"Wanita")}</strong>
                    </div>
                </div>

                <div class="hasil-detail-group">
                    <h3>Hasil Kalkulasi</h3>
                    <div class="hasil-detail-row">
                        <span>BMR</span>
                        <strong>${Math.round(s.bmr)} kkal/hari</strong>
                    </div>
                    <div class="hasil-detail-row">
                        <span>TDEE</span>
                        <strong>${Math.round(s.tdee)} kkal/hari</strong>
                    </div>
                    <div class="hasil-detail-row">
                        <span>Target Kalori</span>
                        <strong>${Math.round(s.target_calories)} kkal/hari</strong>
                    </div>
                    <div class="hasil-detail-row">
                        <span>Tujuan</span>
                        <strong>${f(d[s.tujuan]||s.tujuan)}</strong>
                    </div>
                    <div class="hasil-detail-row">
                        <span>Tingkat Aktivitas</span>
                        <strong>${f(u[s.aktivitas]||s.aktivitas)}</strong>
                    </div>
                </div>

                <div class="hasil-detail-group">
                    <h3>Target Nutrisi</h3>
                    <div class="hasil-detail-row">
                        <span>Protein</span>
                        <strong>${s.target_protein_g?parseFloat(s.target_protein_g).toFixed(1):"N/A"} g</strong>
                    </div>
                    <div class="hasil-detail-row">
                        <span>Lemak</span>
                        <strong>${s.target_lemak_g?parseFloat(s.target_lemak_g).toFixed(1):"N/A"} g</strong>
                    </div>
                    <div class="hasil-detail-row">
                        <span>Karbohidrat</span>
                        <strong>${s.target_karbohidrat_g?parseFloat(s.target_karbohidrat_g).toFixed(1):"N/A"} g</strong>
                    </div>
                </div>
            </div>

            ${s.catatan_petugas?`
            <div class="hasil-catatan-petugas">
                <div class="catatan-header">
                    <span class="catatan-icon">📝</span>
                    <h3>Catatan dari Petugas</h3>
                </div>
                <div class="catatan-body">
                    <p>${f(s.catatan_petugas)}</p>
                </div>
            </div>`:""}

            <h3 style="margin-top: 2rem;">Rekomendasi Makanan (${i.length} item)</h3>
            <div class="hasil-foods-table">
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Makanan</th>
                            <th>Energi (kal)</th>
                            <th>Protein (g)</th>
                            <th>Lemak (g)</th>
                            <th>Karbohidrat (g)</th>
                            <th>Similarity</th>
                        </tr>
                    </thead>
                    <tbody>
        `;i.forEach(g=>{c+=`
                <tr>
                    <td style="text-align: center; font-weight: bold;">${g.rank}</td>
                    <td>${f(g.nama_makanan)}</td>
                    <td style="text-align:center;">${g.energi_kal?parseFloat(g.energi_kal).toFixed(0):"N/A"}</td>
                    <td style="text-align:center;">${g.protein_g?parseFloat(g.protein_g).toFixed(1):"N/A"}</td>
                    <td style="text-align:center;">${g.lemak_g?parseFloat(g.lemak_g).toFixed(1):"N/A"}</td>
                    <td style="text-align:center;">${g.karbohidrat_g?parseFloat(g.karbohidrat_g).toFixed(1):"N/A"}</td>
                    <td>
                        <span class="hasil-similarity-bar">
                            <span class="hasil-similarity-fill" style="width: ${g.similarity_score*100}%"></span>
                        </span>
                        ${(g.similarity_score*100).toFixed(0)}%
                    </td>
                </tr>
            `}),c+=`
                    </tbody>
                </table>
            </div>
        `,a.innerHTML=c}catch(t){console.error("Error loading detail:",t);const a=document.getElementById("modalBody");a&&(a.innerHTML=`
                <div style="color: #e53e3e; padding: 2rem; text-align: center;">
                    Error memuat detail rekomendasi
                </div>
            `)}};function Yo(e){const t=P();if(!t||t.role!=="pasien"){window.location.href="/login";return}e.innerHTML=`
    <div class="data-makanan-wrapper">
      <div class="data-makanan-container">
        ${we("data-makanan")}

        <main class="data-makanan-main-content">
          <div class="data-makanan-topbar">
            <div class="data-makanan-topbar-left">
              <div class="data-makanan-topbar-title">
                <h1>Data Makanan</h1>
                <p>Lihat daftar makanan dan informasi nutrisi</p>
              </div>
            </div>
            <div class="data-makanan-topbar-user">
              <div class="data-makanan-user-info">
                <p class="data-makanan-user-name">${f(t.nama)}</p>
                <p class="data-makanan-user-role">Pasien</p>
              </div>
            </div>
          </div>

          <div class="data-makanan-dashboard-content">
            <!-- Filters -->
            <div class="data-makanan-table-section">
              <div class="data-makanan-filters">
                <input 
                  type="text" 
                  placeholder="Cari makanan... (cth: beras, daging, sayur)" 
                  class="data-makanan-filter-input" 
                  id="foodSearch"
                >
              </div>

              <!-- Table -->
              <div class="data-makanan-table-responsive">
                <table class="data-makanan-table">
                  <thead>
                    <tr>
                      <th style="width: 6%;">No</th>
                      <th style="width: 35%;">Nama Bahan & Pangan</th>
                      <th style="width: 12%;">Energi</th>
                      <th style="width: 12%;">Karbo</th>
                      <th style="width: 12%;">Protein</th>
                      <th style="width: 12%;">Lemak</th>
                    </tr>
                  </thead>
                  <tbody id="foodTable">
                    <tr>
                      <td colspan="6" style="text-align: center; padding: 2rem; color: #a0aec0;">
                        <div class="data-makanan-loading">Memuat data makanan...</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Stats -->
              <div class="data-makanan-stats">
                <div class="data-makanan-stat-item">
                  <span class="stat-label">Total Makanan:</span>
                  <span class="stat-value" id="totalFoods">0</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,Xo()}function Xo(){const e=document.getElementById("toggleSidebar"),t=document.getElementById("userSidebar"),a=document.getElementById("foodSearch");e&&t&&e.addEventListener("click",()=>{t.classList.toggle("active")}),a&&a.addEventListener("input",Qo),be(),Zo()}async function Zo(){try{const e=await Mt();e.success&&e.data&&(Ze(e.data),Qe(e.data),window.allFoodData=e.data)}catch(e){console.error("Error loading food data:",e);const t=document.getElementById("foodTable");t&&(t.innerHTML=`
        <tr>
          <td colspan="6" style="text-align: center; padding: 2rem; color: #e53e3e;">
            ❌ Gagal memuat data makanan. Silakan coba lagi nanti.
          </td>
        </tr>
      `)}}async function Qo(e){const t=e.target.value.trim();if(t===""){window.allFoodData&&(Ze(window.allFoodData),Qe(window.allFoodData));return}try{const a=await Pt(t);if(a.success&&a.data)Ze(a.data),Qe(a.data);else{const n=document.getElementById("foodTable");n&&(n.innerHTML=`
          <tr>
            <td colspan="6" style="text-align: center; padding: 2rem; color: #a0aec0;">
              Tidak ada hasil untuk "${t}"
            </td>
          </tr>
        `)}}catch(a){console.error("Error searching food data:",a)}}function Ze(e){const t=document.getElementById("foodTable");if(t){if(t.innerHTML="",!e||e.length===0){t.innerHTML=`
      <tr>
        <td colspan="6" style="text-align: center; padding: 2rem; color: #a0aec0;">
          Tidak ada data makanan yang ditemukan
        </td>
      </tr>
    `;return}e.forEach((a,n)=>{const s=document.createElement("tr");s.innerHTML=`
      <td style="text-align: center; font-weight: bold;">
        <span class="row-number">${n+1}</span>
      </td>
      <td>
        <span class="food-name">${f(a.nama_bahan||"N/A")}</span>
      </td>
      <td>
        <span class="nutrition-value">${a.energi_kal?parseFloat(a.energi_kal).toFixed(0):"0"}</span>
      </td>
      <td>
        <span class="nutrition-value">${a.karbohidrat_g?parseFloat(a.karbohidrat_g).toFixed(1):"0"}</span>
      </td>
      <td>
        <span class="nutrition-value">${a.protein_g?parseFloat(a.protein_g).toFixed(1):"0"}</span>
      </td>
      <td>
        <span class="nutrition-value">${a.lemak_g?parseFloat(a.lemak_g).toFixed(1):"0"}</span>
      </td>
    `,t.appendChild(s)})}}function Qe(e){const t=e?e.length:0,a=document.getElementById("totalFoods");a&&(a.textContent=t)}function er(e){const t=P();if(!t||t.role!=="pasien"){window.location.href="/login";return}e.innerHTML=`
    <div class="konsultasi-wrapper">
      <div class="konsultasi-container">
        ${we("konsultasi")}

        <main class="konsultasi-main-content">
          <div class="konsultasi-topbar">
            <div class="konsultasi-topbar-left">
              <div class="konsultasi-topbar-title">
                <h1>Konsultasi Rekomendasi Gizi</h1>
                <p>Ajukan kebutuhan gizi Anda kepada petugas kesehatan profesional</p>
              </div>
            </div>
            <div class="konsultasi-topbar-user">
              <div class="konsultasi-user-info">
                <p class="konsultasi-user-name">${t.nama}</p>
                <p class="konsultasi-user-role">Pasien</p>
              </div>
            </div>
          </div>

          <div class="konsultasi-content">
            <div class="konsultasi-form-section">
              <h2>Form Input Data Diri</h2>
              <p class="konsultasi-form-desc">Lengkapi data berikut agar petugas dapat memberikan rekomendasi yang tepat</p>
              
              <form id="konsultasiForm" class="konsultasi-form">
                <div class="konsultasi-form-grid">
                  <!-- Nama -->
                  <div class="konsultasi-form-group">
                    <label for="nama" class="konsultasi-label">Nama Lengkap</label>
                    <input
                      type="text"
                      id="nama"
                      name="nama"
                      class="konsultasi-input"
                      placeholder="Masukkan nama lengkap Anda"
                      value="${t.nama||""}"
                      readonly
                    />
                  </div>

                  <!-- Email -->
                  <div class="konsultasi-form-group">
                    <label for="email" class="konsultasi-label">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      class="konsultasi-input"
                      placeholder="Email Anda"
                      value="${t.email||""}"
                      readonly
                    />
                  </div>

                  <!-- Usia -->
                  <div class="konsultasi-form-group">
                    <label for="usia" class="konsultasi-label">Usia (tahun) <span class="konsultasi-required">*Min 18 tahun</span></label>
                    <input
                      type="number"
                      id="usia"
                      name="usia"
                      class="konsultasi-input"
                      placeholder="Contoh: 25 (minimum 18 tahun)"
                      min="18"
                      max="150"
                      required
                    />
                  </div>

                  <!-- Jenis Kelamin -->
                  <div class="konsultasi-form-group">
                    <label for="jenisKelamin" class="konsultasi-label">Jenis Kelamin</label>
                    <select id="jenisKelamin" name="jenisKelamin" class="konsultasi-select" required>
                      <option value="">-- Pilih Jenis Kelamin --</option>
                      <option value="pria">Pria</option>
                      <option value="wanita">Wanita</option>
                    </select>
                  </div>

                  <!-- Berat Badan -->
                  <div class="konsultasi-form-group">
                    <label for="beratBadan" class="konsultasi-label">Berat Badan (kg)</label>
                    <input
                      type="number"
                      id="beratBadan"
                      name="beratBadan"
                      class="konsultasi-input"
                      placeholder="Contoh: 70"
                      step="0.1"
                      min="1"
                      max="300"
                      required
                    />
                  </div>

                  <!-- Tinggi Badan -->
                  <div class="konsultasi-form-group">
                    <label for="tinggiBadan" class="konsultasi-label">Tinggi Badan (cm)</label>
                    <input
                      type="number"
                      id="tinggiBadan"
                      name="tinggiBadan"
                      class="konsultasi-input"
                      placeholder="Contoh: 170"
                      step="0.1"
                      min="1"
                      max="300"
                      required
                    />
                  </div>

                  <!-- Tingkat Aktivitas -->
                  <div class="konsultasi-form-group">
                    <label for="aktivitas" class="konsultasi-label">Tingkat Aktivitas</label>
                    <select id="aktivitas" name="aktivitas" class="konsultasi-select" required>
                      <option value="">-- Pilih Tingkat Aktivitas --</option>
                      <option value="ringan">Ringan (Jarang olahraga)</option>
                      <option value="sedang">Sedang (Olahraga 3-5x seminggu)</option>
                      <option value="berat">Berat (Olahraga setiap hari)</option>
                    </select>
                  </div>

                  <!-- Tujuan -->
                  <div class="konsultasi-form-group">
                    <label for="tujuan" class="konsultasi-label">Tujuan Gizi</label>
                    <select id="tujuan" name="tujuan" class="konsultasi-select" required>
                      <option value="">-- Pilih Tujuan --</option>
                      <option value="naik">Menaikkan Berat Badan</option>
                      <option value="turun">Menurunkan Berat Badan</option>
                      <option value="seimbang">Menyeimbangkan Berat Badan</option>
                    </select>
                  </div>

                  <!-- Kategori Makanan (Optional) -->
                  <div class="konsultasi-form-group">
                    <label for="kategori" class="konsultasi-label">Preferensi Kategori (Opsional)</label>
                    <select id="kategori" name="kategori" class="konsultasi-select">
                      <option value="all">Semua Kategori</option>
                      <option value="Buah">Buah</option>
                      <option value="Sayur">Sayur</option>
                      <option value="Kacang-kacangan">Kacang-kacangan</option>
                      <option value="Mentah">Mentah</option>
                    </select>
                  </div>

                  <!-- Catatan Khusus -->
                  <div class="konsultasi-form-group full-width">
                    <label for="catatan" class="konsultasi-label">Catatan Khusus (Opsional)</label>
                    <textarea
                      id="catatan"
                      name="catatan"
                      class="konsultasi-textarea"
                      placeholder="Jelaskan kondisi kesehatan khusus, alergi, atau informasi penting lainnya..."
                      rows="4"
                    ></textarea>
                  </div>
                </div>

                <div class="konsultasi-form-actions">
                  <button type="submit" class="konsultasi-btn-submit">
                    <span id="submitBtnText">💬 Kirim ke Petugas</span>
                    <span id="submitBtnSpinner" style="display: none;">⏳ Mengirim...</span>
                  </button>
                  <button type="reset" class="konsultasi-btn-reset">Reset Form</button>
                </div>
              </form>
            </div>

            <!-- Alert Messages -->
            <div id="alertMessage" class="konsultasi-alert" style="display: none;"></div>
          </div>
        </main>
      </div>
    </div>
  `,be(),tr()}function tr(){const e=document.getElementById("konsultasiForm"),t=document.getElementById("alertMessage"),a=document.querySelector(".konsultasi-btn-submit"),n=document.getElementById("submitBtnText"),s=document.getElementById("submitBtnSpinner");e.addEventListener("submit",async i=>{i.preventDefault();const o=P(),r={user_id:o.id,nama:o.nama,email:o.email,usia:parseInt(document.getElementById("usia").value),jenis_kelamin:document.getElementById("jenisKelamin").value,berat:parseFloat(document.getElementById("beratBadan").value),tinggi:parseFloat(document.getElementById("tinggiBadan").value),aktivitas:document.getElementById("aktivitas").value,tujuan:document.getElementById("tujuan").value,kategori:document.getElementById("kategori").value||"all",catatan:document.getElementById("catatan").value||"",status:"pending",created_at:new Date().toISOString()};if(r.usia<13){t.style.display="block",t.className="konsultasi-alert alert-error",t.innerHTML=`
        <div class="alert-content">
          <strong>❌ Error!</strong> Sistem hanya mendukung pengguna dewasa (minimal usia 18 tahun). Anda harus berusia minimal 18 tahun untuk menggunakan fitur konsultasi ini.
        </div>
      `;return}if(r.usia>150){t.style.display="block",t.className="konsultasi-alert alert-error",t.innerHTML=`
        <div class="alert-content">
          <strong>❌ Error!</strong> Usia tidak valid (melebihi batas wajar)
        </div>
      `;return}if(r.berat<1||r.berat>300){t.style.display="block",t.className="konsultasi-alert alert-error",t.innerHTML=`
        <div class="alert-content">
          <strong>❌ Error!</strong> Berat badan harus antara 1-300 kg
        </div>
      `;return}if(r.tinggi<50||r.tinggi>300){t.style.display="block",t.className="konsultasi-alert alert-error",t.innerHTML=`
        <div class="alert-content">
          <strong>❌ Error!</strong> Tinggi badan harus antara 50-300 cm
        </div>
      `;return}a.disabled=!0,n.style.display="none",s.style.display="inline",t.style.display="none";try{const d=sessionStorage.getItem("token"),u=await fetch("https://backend-nutrient-production.up.railway.app/api/konsultasi",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${d}`},body:JSON.stringify(r)}),c=await u.json();if(!u.ok)throw new Error(c.message||"Gagal mengirim konsultasi");t.style.display="block",t.className="konsultasi-alert alert-success",t.innerHTML=`
        <div class="alert-content">
          <strong>✅ Berhasil!</strong> Konsultasi Anda telah dikirim ke petugas. Petugas akan merespons dalam 1-2 hari kerja.
        </div>
      `,e.reset(),setTimeout(()=>{window.location.href="/user/dashboard"},2e3)}catch(d){console.error("Error:",d),t.style.display="block",t.className="konsultasi-alert alert-error",t.innerHTML=`
        <div class="alert-content">
          <strong>❌ Error!</strong> ${d.message||"Terjadi kesalahan saat mengirim konsultasi"}
        </div>
      `}finally{a.disabled=!1,n.style.display="inline",s.style.display="none"}})}function ar(e){const t=P();if(!t||t.role!=="pasien"){window.location.href="/login";return}const a=new Date().toISOString().split("T")[0];e.innerHTML=`
    <div class="konsumsi-wrapper">
      <div class="konsumsi-container">
        ${we("konsumsi-makanan")}

        <main class="konsumsi-main-content">
          <div class="konsumsi-topbar">
            <div class="konsumsi-topbar-title">
              <h1>🍽️ Catatan Konsumsi Harian</h1>
              <p>Catat makanan dan minuman yang Anda konsumsi setiap hari</p>
            </div>
            <div class="konsumsi-topbar-user">
              <div class="konsumsi-user-info">
                <p class="konsumsi-user-name">${f(t.nama)}</p>
                <p class="konsumsi-user-role">Pasien</p>
              </div>
            </div>
          </div>

          <div class="konsumsi-content">
            <!-- FORM TAMBAH KONSUMSI -->
            <div class="konsumsi-form-card">
              <div class="konsumsi-form-card-header">
                <h2>➕ Tambah Konsumsi Makanan/Minuman</h2>
                <p>Isi informasi di bawah ini lalu klik Simpan</p>
              </div>
              <div class="konsumsi-form-body">
                <form id="formKonsumsi">
                  <div class="konsumsi-form-row three-col">
                    <div class="konsumsi-form-group">
                      <label class="konsumsi-label">Tanggal</label>
                      <input type="date" id="fTanggal" class="konsumsi-input" value="${a}" max="${a}" required />
                    </div>
                    <div class="konsumsi-form-group">
                      <label class="konsumsi-label">Waktu Makan</label>
                      <select id="fWaktu" class="konsumsi-select" required>
                        <option value="">-- Pilih Waktu --</option>
                        <option value="pagi">🌅 Pagi</option>
                        <option value="siang">☀️ Siang</option>
                        <option value="sore">🌤️ Sore</option>
                        <option value="malam">🌙 Malam</option>
                        <option value="minuman">💧 Minuman</option>
                      </select>
                    </div>
                    <div class="konsumsi-form-group">
                      <label class="konsumsi-label">Porsi (opsional)</label>
                      <input type="text" id="fPorsi" class="konsumsi-input" placeholder="cth: 1 piring, 200ml" />
                    </div>
                  </div>
                  <div class="konsumsi-form-row">
                    <div class="konsumsi-form-group full-width">
                      <label class="konsumsi-label">Nama Makanan / Minuman <span style="color:#e53e3e">*</span></label>
                      <input type="text" id="fNama" class="konsumsi-input" placeholder="cth: Nasi putih, Ayam goreng, Air putih, Teh manis..." required />
                    </div>
                  </div>
                  <div class="konsumsi-form-row">
                    <div class="konsumsi-form-group full-width">
                      <label class="konsumsi-label">Catatan (opsional)</label>
                      <textarea id="fCatatan" class="konsumsi-textarea" placeholder="Tambahkan catatan jika ada, misalnya: dimasak sendiri, beli di warung, dsb..."></textarea>
                    </div>
                  </div>
                  <div class="konsumsi-form-actions">
                    <button type="button" class="btn-cancel" id="btnReset">Reset</button>
                    <button type="submit" class="btn-save" id="btnSimpan">💾 Simpan</button>
                  </div>
                </form>
              </div>
            </div>

            <!-- TABEL RIWAYAT KONSUMSI -->
            <div class="konsumsi-table-card">
              <div class="konsumsi-table-header">
                <h2>📋 Riwayat Konsumsi Saya</h2>
                <div class="konsumsi-table-filters">
                  <input type="date" id="filterTanggal" class="konsumsi-filter-input" placeholder="Filter tanggal" max="${a}" />
                  <select id="filterWaktu" class="konsumsi-filter-select">
                    <option value="">Semua Waktu</option>
                    <option value="pagi">Pagi</option>
                    <option value="siang">Siang</option>
                    <option value="sore">Sore</option>
                    <option value="malam">Malam</option>
                    <option value="minuman">Minuman</option>
                  </select>
                </div>
              </div>
              <div class="konsumsi-table-responsive">
                <table class="konsumsi-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Tanggal</th>
                      <th>Waktu</th>
                      <th>Nama Makanan / Minuman</th>
                      <th>Porsi</th>
                      <th>Catatan</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody id="tabelKonsumsi">
                    <tr class="empty-row"><td colspan="7">Memuat data...</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- MODAL EDIT -->
    <div class="konsumsi-modal-overlay" id="modalEdit" style="display:none;">
      <div class="konsumsi-modal">
        <div class="konsumsi-modal-header">
          <h3>✏️ Edit Konsumsi</h3>
          <button class="btn-modal-close" id="btnModalClose">✕</button>
        </div>
        <div class="konsumsi-modal-body">
          <input type="hidden" id="editId" />
          <div class="konsumsi-form-row">
            <div class="konsumsi-form-group">
              <label class="konsumsi-label">Tanggal</label>
              <input type="date" id="editTanggal" class="konsumsi-input" max="${a}" />
            </div>
          </div>
          <div class="konsumsi-form-row">
            <div class="konsumsi-form-group">
              <label class="konsumsi-label">Waktu Makan</label>
              <select id="editWaktu" class="konsumsi-select">
                <option value="pagi">🌅 Pagi</option>
                <option value="siang">☀️ Siang</option>
                <option value="sore">🌤️ Sore</option>
                <option value="malam">🌙 Malam</option>
                <option value="minuman">💧 Minuman</option>
              </select>
            </div>
          </div>
          <div class="konsumsi-form-row">
            <div class="konsumsi-form-group">
              <label class="konsumsi-label">Nama Makanan / Minuman</label>
              <input type="text" id="editNama" class="konsumsi-input" />
            </div>
          </div>
          <div class="konsumsi-form-row">
            <div class="konsumsi-form-group">
              <label class="konsumsi-label">Porsi</label>
              <input type="text" id="editPorsi" class="konsumsi-input" placeholder="cth: 1 piring, 200ml" />
            </div>
          </div>
          <div class="konsumsi-form-row">
            <div class="konsumsi-form-group">
              <label class="konsumsi-label">Catatan</label>
              <textarea id="editCatatan" class="konsumsi-textarea"></textarea>
            </div>
          </div>
        </div>
        <div class="konsumsi-modal-footer">
          <button class="btn-cancel" id="btnEditCancel">Batal</button>
          <button class="btn-save" id="btnEditSave">💾 Simpan Perubahan</button>
        </div>
      </div>
    </div>
  `,be();let n=[];async function s(c=null){try{n=(await dn(t.id,c)).data||[],r(n)}catch{r([])}}function i(c){return new Date(c).toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"})}function o(c){return{pagi:"🌅 Pagi",siang:"☀️ Siang",sore:"🌤️ Sore",malam:"🌙 Malam",minuman:"💧 Minuman"}[c]||c}function r(c){const g=document.getElementById("tabelKonsumsi");if(!c.length){g.innerHTML='<tr class="empty-row"><td colspan="7">Belum ada data konsumsi. Tambahkan makanan/minuman yang Anda konsumsi.</td></tr>';return}g.innerHTML=c.map((m,v)=>`
      <tr>
        <td>${v+1}</td>
        <td>${i(m.tanggal)}</td>
        <td><span class="waktu-badge waktu-${m.waktu_makan}">${o(m.waktu_makan)}</span></td>
        <td><strong>${f(m.nama_makanan)}</strong></td>
        <td>${f(m.porsi||"-")}</td>
        <td>${f(m.catatan||"-")}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon edit" title="Edit" onclick="openEdit(${m.id})">✏️</button>
            <button class="btn-icon delete" title="Hapus" onclick="hapusKonsumsi(${m.id})">🗑️</button>
          </div>
        </td>
      </tr>
    `).join("")}document.getElementById("filterTanggal").addEventListener("change",d),document.getElementById("filterWaktu").addEventListener("change",d);function d(){const c=document.getElementById("filterTanggal").value,g=document.getElementById("filterWaktu").value;s(c||null).then(()=>{if(g){const m=n.filter(v=>v.waktu_makan===g);r(m)}})}document.getElementById("formKonsumsi").addEventListener("submit",async c=>{c.preventDefault();const g=document.getElementById("fTanggal").value,m=document.getElementById("fWaktu").value,v=document.getElementById("fNama").value.trim(),h=document.getElementById("fPorsi").value.trim(),B=document.getElementById("fCatatan").value.trim();if(!g||!m||!v){w.fire("Perhatian","Tanggal, waktu makan, dan nama makanan wajib diisi.","warning");return}const y=document.getElementById("btnSimpan");y.disabled=!0,y.textContent="Menyimpan...";try{await ln({user_id:t.id,tanggal:g,waktu_makan:m,nama_makanan:v,porsi:h||null,catatan:B||null}),w.fire({icon:"success",title:"Berhasil!",text:"Data konsumsi berhasil disimpan.",timer:1500,showConfirmButton:!1}),document.getElementById("formKonsumsi").reset(),document.getElementById("fTanggal").value=a,await s()}catch(q){w.fire("Gagal",q.message||"Terjadi kesalahan saat menyimpan.","error")}finally{y.disabled=!1,y.textContent="💾 Simpan"}}),document.getElementById("btnReset").addEventListener("click",()=>{document.getElementById("formKonsumsi").reset(),document.getElementById("fTanggal").value=a}),window.openEdit=c=>{const g=n.find(m=>m.id===c);g&&(document.getElementById("editId").value=c,document.getElementById("editTanggal").value=g.tanggal?.split("T")[0]||"",document.getElementById("editWaktu").value=g.waktu_makan,document.getElementById("editNama").value=g.nama_makanan,document.getElementById("editPorsi").value=g.porsi||"",document.getElementById("editCatatan").value=g.catatan||"",document.getElementById("modalEdit").style.display="flex")},document.getElementById("btnModalClose").addEventListener("click",u),document.getElementById("btnEditCancel").addEventListener("click",u);function u(){document.getElementById("modalEdit").style.display="none"}document.getElementById("modalEdit").addEventListener("click",c=>{c.target===document.getElementById("modalEdit")&&u()}),document.getElementById("btnEditSave").addEventListener("click",async()=>{const c=document.getElementById("editId").value,g=document.getElementById("editTanggal").value,m=document.getElementById("editWaktu").value,v=document.getElementById("editNama").value.trim(),h=document.getElementById("editPorsi").value.trim(),B=document.getElementById("editCatatan").value.trim();if(!g||!m||!v){w.fire("Perhatian","Semua field wajib diisi.","warning");return}try{await un(c,{user_id:t.id,tanggal:g,waktu_makan:m,nama_makanan:v,porsi:h||null,catatan:B||null}),u(),w.fire({icon:"success",title:"Berhasil!",text:"Data berhasil diperbarui.",timer:1500,showConfirmButton:!1}),await s(document.getElementById("filterTanggal").value||null)}catch(y){w.fire("Gagal",y.message||"Terjadi kesalahan.","error")}}),window.hapusKonsumsi=async c=>{if((await w.fire({title:"Hapus Data?",text:"Data konsumsi ini akan dihapus permanen.",icon:"warning",showCancelButton:!0,confirmButtonColor:"#e53e3e",cancelButtonText:"Batal",confirmButtonText:"Ya, Hapus"})).isConfirmed)try{await Ht(c),w.fire({icon:"success",title:"Terhapus!",text:"Data berhasil dihapus.",timer:1500,showConfirmButton:!1}),await s(document.getElementById("filterTanggal").value||null)}catch(m){w.fire("Gagal",m.message||"Terjadi kesalahan.","error")}},s()}function nr(e){const t=P();if(!t||t.role!=="ahli_gizi"){window.location.href="/login";return}const a=new Date().toISOString().split("T")[0];e.innerHTML=`
    <div class="konsumsi-pt-wrapper">
      <div class="konsumsi-pt-container">
        ${F("konsumsi-user")}

        <main class="konsumsi-pt-main">
          <div class="konsumsi-pt-topbar">
            <div class="konsumsi-pt-topbar-title">
              <h1>🍽️ Pola Makan Pengguna</h1>
              <p>Pantau catatan konsumsi makanan harian semua pengguna</p>
            </div>
            <div class="konsumsi-pt-topbar-user">
              <div class="konsumsi-pt-avatar">${t.nama?.charAt(0).toUpperCase()}</div>
              <div>
                <p class="konsumsi-pt-user-name">${t.nama}</p>
                <p class="konsumsi-pt-user-role">Petugas Gizi</p>
              </div>
            </div>
          </div>

          <div class="konsumsi-pt-content">
            <!-- SUMMARY CARDS -->
            <div class="konsumsi-pt-summary">
              <div class="konsumsi-pt-card">
                <div class="card-icon">👤</div>
                <div class="card-value" id="statUser">-</div>
                <div class="card-label">User Aktif</div>
              </div>
              <div class="konsumsi-pt-card">
                <div class="card-icon">🍽️</div>
                <div class="card-value" id="statTotal">-</div>
                <div class="card-label">Total Entri</div>
              </div>
              <div class="konsumsi-pt-card">
                <div class="card-icon">📅</div>
                <div class="card-value" id="statHari">-</div>
                <div class="card-label">Hari Tercatat</div>
              </div>
            </div>

            <!-- TABLE -->
            <div class="konsumsi-pt-table-card">
              <div class="konsumsi-pt-table-header">
                <h2>📋 Data Konsumsi Pengguna</h2>
                <div class="konsumsi-pt-filters">
                  <select id="filterUser" class="konsumsi-pt-filter-select">
                    <option value="">Semua User</option>
                  </select>
                  <input type="date" id="filterTanggal" class="konsumsi-pt-filter-input" max="${a}" title="Filter tanggal" />
                  <select id="filterWaktu" class="konsumsi-pt-filter-select">
                    <option value="">Semua Waktu</option>
                    <option value="pagi">Pagi</option>
                    <option value="siang">Siang</option>
                    <option value="sore">Sore</option>
                    <option value="malam">Malam</option>
                    <option value="minuman">Minuman</option>
                  </select>
                  <button class="btn-icon" id="btnRefresh" title="Refresh data" style="background:#ebf8ff;color:#2b6cb0;width:auto;padding:0 0.8rem;font-size:0.85rem;border-radius:8px;height:36px;">🔄 Refresh</button>
                </div>
              </div>
              <div class="konsumsi-pt-table-responsive">
                <table class="konsumsi-pt-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Pengguna</th>
                      <th>Tanggal</th>
                      <th>Waktu</th>
                      <th>Makanan / Minuman</th>
                      <th>Porsi</th>
                      <th>Catatan</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody id="tabelKonsumsi">
                    <tr class="empty-row"><td colspan="8">Memuat data...</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,N();let n=[];function s(m){return String(m).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function i(m){return new Date(m).toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"})}function o(m){return{pagi:"🌅 Pagi",siang:"☀️ Siang",sore:"🌤️ Sore",malam:"🌙 Malam",minuman:"💧 Minuman"}[m]||m}function r(m){const v=new Set(m.map(B=>B.user_id)).size,h=new Set(m.map(B=>B.tanggal?.split("T")[0])).size;document.getElementById("statUser").textContent=v,document.getElementById("statTotal").textContent=m.length,document.getElementById("statHari").textContent=h}function d(m){const v=document.getElementById("tabelKonsumsi");if(!m.length){v.innerHTML='<tr class="empty-row"><td colspan="8">Tidak ada data konsumsi untuk filter yang dipilih.</td></tr>';return}v.innerHTML=m.map((h,B)=>`
      <tr>
        <td>${B+1}</td>
        <td><span class="user-badge-pt">👤 ${s(h.nama_user||"-")}</span></td>
        <td>${i(h.tanggal)}</td>
        <td><span class="waktu-badge waktu-${h.waktu_makan}">${o(h.waktu_makan)}</span></td>
        <td><strong>${s(h.nama_makanan)}</strong></td>
        <td>${s(h.porsi||"-")}</td>
        <td>${s(h.catatan||"-")}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon delete" title="Hapus" onclick="ptHapusKonsumsi(${h.id})">🗑️</button>
          </div>
        </td>
      </tr>
    `).join("")}function u(m){const v=document.getElementById("filterUser");v.querySelectorAll("option:not([value=''])").forEach(y=>y.remove());const B={};m.forEach(y=>{y.user_id&&y.nama_user&&(B[y.user_id]=y.nama_user)}),Object.entries(B).forEach(([y,q])=>{const Y=document.createElement("option");Y.value=y,Y.textContent=q,v.appendChild(Y)})}async function c(){const m=document.getElementById("filterUser").value||null,v=document.getElementById("filterTanggal").value||null;try{n=(await cn(m,v)).data||[],u(n),g(),r(n)}catch{d([])}}function g(){const m=document.getElementById("filterWaktu").value,v=m?n.filter(h=>h.waktu_makan===m):n;d(v)}document.getElementById("filterUser").addEventListener("change",c),document.getElementById("filterTanggal").addEventListener("change",c),document.getElementById("filterWaktu").addEventListener("change",g),document.getElementById("btnRefresh").addEventListener("click",c),window.ptHapusKonsumsi=async m=>{if((await w.fire({title:"Hapus Data?",text:"Data konsumsi pengguna ini akan dihapus.",icon:"warning",showCancelButton:!0,confirmButtonColor:"#e53e3e",cancelButtonText:"Batal",confirmButtonText:"Ya, Hapus"})).isConfirmed)try{await Ht(m),w.fire({icon:"success",title:"Terhapus!",text:"Data berhasil dihapus.",timer:1500,showConfirmButton:!1}),await c()}catch(h){w.fire("Gagal",h.message||"Terjadi kesalahan.","error")}},c()}const S=document.querySelector("#app");function sr(e){history.pushState({},"",e),ft()}function ft(){const e=window.location.pathname;if(S.innerHTML="",e==="/"||e==="/home")vn(S);else if(e==="/login")mn(S);else if(e==="/register")gn(S);else if(e==="/verify-otp"){const t=sessionStorage.getItem("verifyEmail")||"";pn(S,t)}else e==="/petugas/dashboard"?oo(S):e==="/petugas/data-gizi"?lo(S):e==="/petugas/rekomendasi"?ko(S):e==="/petugas/hasil-rekomendasi"?To(S):e==="/petugas/konsultasi"?Mo(S):e==="/petugas/kelola-user"?po(S):e==="/petugas/laporan"?vo(S):e==="/petugas/arsip"?zo(S):e==="/user/dashboard"?No(S):e==="/user/hasil-rekomendasi"?qo(S):e==="/user/konsultasi-rekomendasi"?er(S):e==="/user/data-makanan"?Yo(S):e==="/user/konsumsi-makanan"?ar(S):e==="/petugas/konsumsi-user"?nr(S):S.innerHTML="<h1>404 - Halaman Tidak Ditemukan</h1>"}window.addEventListener("popstate",ft);document.addEventListener("DOMContentLoaded",ft);window.navigateTo=sr;
