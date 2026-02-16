import { auth, db } from './firebaseConfig.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy, serverTimestamp, increment, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let ownerMode=false;

function escapeHTML(str){ return str.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]); }

window.loginOwner = async function(){
  const email=prompt("Owner Email:");
  const pass=prompt("Password:");
  try{
    await signInWithEmailAndPassword(auth,email,pass);
  }catch{
    alert("Wrong Login");
  }
}

onAuthStateChanged(auth,user=>{
  if(user){
    ownerMode=true;
    document.getElementById("ownerPanel").style.display="block";
  }
});

const scriptsRef = collection(db,"scripts");
const q = query(scriptsRef,orderBy("createdAt","desc"));

onSnapshot(q,snapshot=>{
  const container=document.getElementById("scriptsContainer");
  container.innerHTML="";
  snapshot.forEach(docSnap=>{
    const s=docSnap.data();
    const id=docSnap.id;
    const card=document.createElement("div");
    card.className="card";
    card.innerHTML=`
      <h2>${escapeHTML(s.title)}</h2>
      <span class="status ${s.status}">${s.status}</span>
      <pre>${escapeHTML(s.code)}</pre>
      ${ownerMode?`
        <button onclick="editScript('${id}')">Edit</button>
        <button onclick="deleteScript('${id}')">Delete</button>
      `:""}
    `;
    container.appendChild(card);
  });
});

window.addScript=async function(){
  const title=document.getElementById("newTitle").value.trim();
  const code=document.getElementById("newScript").value.trim();
  const status=document.getElementById("newStatus").value;
  if(!title||!code) return alert("Fill all fields");
  await addDoc(scriptsRef,{title,code,status,createdAt:serverTimestamp()});
  document.getElementById("newTitle").value="";
  document.getElementById("newScript").value="";
}

window.editScript=async function(id){
  const newCode=prompt("Edit Script:");
  const newStatus=prompt("Status (working/patched):");
  if(!newCode) return;
  await updateDoc(doc(db,"scripts",id),{code:newCode,status:newStatus==="patched"?"patched":"working"});
}

window.deleteScript=async function(id){
  if(confirm("Delete Script?")) await deleteDoc(doc(db,"scripts",id));
}

const statsRef=doc(db,"stats","visitors");
async function increaseVisitor(){
  const docSnap=await getDoc(statsRef);
  if(!docSnap.exists()) await setDoc(statsRef,{count:1});
  else await updateDoc(statsRef,{count:increment(1)});
}
onSnapshot(statsRef,(docSnap)=>{ if(docSnap.exists()) document.getElementById("visitorCount").innerText=docSnap.data().count; });
increaseVisitor();