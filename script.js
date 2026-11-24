const STORAGE_KEY='attendly_class_data_v1';

const defaultNames = [
  "AISYAH HARI AFIKA LIAWATI",
  "Andika Wahyu Utama",
  "Anita",
  "AUREL EFFILIAN NADIJUWA PUTRI",
  "CHAIDARUR ROHMAN",
  "CHARISSA MARTHA DEWI",
  "DINDA NUR LANIA DEWI",
  "DWI ASTUTI",
  "ERDIVA BERLIANA PUTRI",
  "Keany Agatha Nadzif",
  "KHOIRUN NIYSA",
  "Khoyrul Rahmandhani",
  "KIRANA DWI RAHMAYANI",
  "Kusnul Khotimah",
  "Lila Nur Latifah",
  "LUKMAN ARDIANSYAH ROMADHONI",
  "MACHFUDZ KHASAN",
  "MAR'ATUS SHOLIHAH",
  "MARSYA NISWA AZZAHRA",
  "Moh. Rafael Rizky Abadi",
  "NOVITA ANGGRAENI",
  "NUR KHASAN",
  "NUR KHOLIFAH",
  "RENATHA PUTRI",
  "Rifa Arinal Haq",
  "Ririn Ida Aulia",
  "RISMA VINUSTIKA",
  "SASMITA ADINDA PUTRI",
  "SHAFA ATIKA ZAHRA",
  "Sholekha",
  "SILVIA NUR ROHMAH",
  "SUPRIADI",
  "Tiara Celcilya Putri",
  "WAHIDATUL MUHAROM"
];
const todayKey=()=>new Date().toLocaleDateString('id-ID',{year:'numeric',month:'2-digit',day:'2-digit'});
const prettyDate=()=>new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
let data=loadData(); let activeDate=todayKey();
function loadData(){try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY));if(saved&&Array.isArray(saved.students))return saved;}catch(e){}return {students:defaultNames.map((name,i)=>({id:i+1,name})),attendance:{},history:[]};}
function persist(){localStorage.setItem(STORAGE_KEY,JSON.stringify(data));}
function currentAttendance(){if(!data.attendance[activeDate])data.attendance[activeDate]={};return data.attendance[activeDate];}
function getStatus(id){return currentAttendance()[id]||'';}
function statusLabel(s){return ({hadir:'Hadir',sakit:'Sakit',izin:'Izin',alfa:'Alfa'})[s]||'Belum absen';}
function statusBadge(s){return `<span class="status status-${s||'pending'}">${statusLabel(s)}</span>`;}
function counts(){const c={hadir:0,sakit:0,izin:0,alfa:0,pending:0};data.students.forEach(st=>{const s=getStatus(st.id);c[s||'pending']++;});return c;}
function renderDashboard(){const c=counts();document.getElementById('totalStat').textContent=data.students.length;document.getElementById('presentStat').textContent=c.hadir;document.getElementById('excuseStat').textContent=c.sakit+c.izin;document.getElementById('pendingStat').textContent=c.pending;const total=data.students.length||1;const percent=Math.round(c.hadir/total*100);document.getElementById('presentPercent').textContent=percent+'%';document.getElementById('donut').style.background=`conic-gradient(var(--green) ${percent*3.6}deg,#e9edf3 ${percent*3.6}deg)`;document.getElementById('legendPresent').textContent=c.hadir;document.getElementById('legendSick').textContent=c.sakit;document.getElementById('legendPermit').textContent=c.izin;document.getElementById('legendAbsent').textContent=c.alfa;document.getElementById('dateChip').textContent=new Date().toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'});document.getElementById('dashboardStudents').innerHTML=data.students.slice(0,6).map(st=>`<tr><td><strong>${escapeHTML(st.name)}</strong></td><td>${statusBadge(getStatus(st.id))}</td></tr>`).join('')||emptyRow(2,'Belum ada siswa');}
function renderAttendance(){document.getElementById('attendanceDate').textContent=prettyDate();document.getElementById('attendanceRows').innerHTML=data.students.map((st,i)=>`<tr><td>${i+1}</td><td><strong>${escapeHTML(st.name)}</strong></td><td><select class="status-select" data-id="${st.id}"><option value="" ${!getStatus(st.id)?'selected':''}>Pilih status</option><option value="hadir" ${getStatus(st.id)==='hadir'?'selected':''}>Hadir</option><option value="sakit" ${getStatus(st.id)==='sakit'?'selected':''}>Sakit</option><option value="izin" ${getStatus(st.id)==='izin'?'selected':''}>Izin</option><option value="alfa" ${getStatus(st.id)==='alfa'?'selected':''}>Alfa</option></select></td></tr>`).join('')||emptyRow(3,'Belum ada siswa');document.querySelectorAll('.status-select').forEach(sel=>sel.addEventListener('change',e=>{currentAttendance()[e.target.dataset.id]=e.target.value;persist();renderDashboard();document.getElementById('saveMessage').textContent='Perubahan tersimpan otomatis ✓';}));}
function renderStudents(){const query=(document.getElementById('searchStudent')?.value||'').toLowerCase();const filtered=data.students.filter(s=>s.name.toLowerCase().includes(query));document.getElementById('studentCountText').textContent=`${data.students.length} siswa terdaftar`;document.getElementById('studentRows').innerHTML=filtered.map((st,i)=>`<tr><td>${i+1}</td><td><strong>${escapeHTML(st.name)}</strong></td><td>${statusBadge(getStatus(st.id))}</td><td><button class="text-btn remove-student" data-id="${st.id}">Hapus</button></td></tr>`).join('')||emptyRow(4,'Siswa tidak ditemukan');document.querySelectorAll('.remove-student').forEach(btn=>btn.addEventListener('click',()=>{if(confirm('Hapus siswa ini dari daftar?')){data.students=data.students.filter(s=>String(s.id)!==btn.dataset.id);persist();renderAll();}}));renderHistory();}
function renderHistory(){const list=document.getElementById('historyList');if(!data.history.length){list.innerHTML='<div class="empty">Belum ada riwayat absensi yang disimpan.</div>';return;}list.innerHTML=[...data.history].reverse().map(item=>`<div class="history-item"><div><strong>${escapeHTML(item.date)}</strong><small>Rekap kehadiran kelas</small></div><div class="history-counts"><span>Hadir ${item.counts.hadir}</span><span>Sakit ${item.counts.sakit}</span><span>Izin ${item.counts.izin}</span><span>Alfa ${item.counts.alfa}</span></div></div>`).join('');}
function emptyRow(n,msg){return `<tr><td colspan="${n}" class="empty">${msg}</td></tr>`;}
function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[m]));
}
function renderAll(){renderDashboard();renderAttendance();renderStudents();}
function navigate(page){document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));document.getElementById(page+'Page').classList.add('active');document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.page===page));const titles={dashboard:'Dashboard',attendance:'Absensi',students:'Data & Riwayat'};document.getElementById('crumbTitle').textContent=titles[page];window.scrollTo({top:0,behavior:'smooth'});}
document.querySelectorAll('[data-page]').forEach(btn=>btn.addEventListener('click',()=>navigate(btn.dataset.page)));document.querySelectorAll('[data-goto]').forEach(btn=>btn.addEventListener('click',()=>navigate(btn.dataset.goto)));
document.getElementById('todayLabel').textContent=new Date().toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'});
document.getElementById('themeToggle').addEventListener('click',()=>{document.body.classList.toggle('dark');localStorage.setItem('attendly_dark',document.body.classList.contains('dark')?'1':'0');});if(localStorage.getItem('attendly_dark')==='1')document.body.classList.add('dark');
document.getElementById('addStudentForm').addEventListener('submit',e=>{e.preventDefault();const input=document.getElementById('newStudentName');const name=input.value.trim();if(!name)return;if(data.students.some(s=>s.name.toLowerCase()===name.toLowerCase())){alert('Nama siswa sudah ada.');return;}data.students.push({id:Date.now(),name});persist();input.value='';renderAll();});
document.getElementById('searchStudent').addEventListener('input',renderStudents);
document.getElementById('resetAttendance').addEventListener('click',()=>{if(confirm('Reset semua status absensi hari ini?')){data.attendance[activeDate]={};persist();renderAll();document.getElementById('saveMessage').textContent='Status absensi direset.';}});
document.getElementById('saveAttendance').addEventListener('click',()=>{const c=counts();const date=prettyDate();const item={date,counts:{hadir:c.hadir,sakit:c.sakit,izin:c.izin,alfa:c.alfa}};const existing=data.history.findIndex(h=>h.date===date);if(existing>=0)data.history[existing]=item;else data.history.push(item);persist();renderHistory();document.getElementById('saveMessage').textContent='Rekap absensi berhasil disimpan ✓';});
document.getElementById('clearHistory').addEventListener('click',()=>{if(confirm('Hapus semua riwayat absensi?')){data.history=[];persist();renderHistory();}});
renderAll();
