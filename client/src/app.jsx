import { useState, useEffect, createContext, useContext } from "react";

/* ─── Auth Context ─────────────────────────────────────────── */
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

/* ─── Constants ─────────────────────────────────────────────── */
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const CITIES = [
  "Mumbai","Delhi","Bangalore","Hyderabad","Chennai",
  "Ahmedabad","Pune","Jaipur","Kolkata","Lucknow","Surat","Mysuru",
];

const MOCK_DONORS = [
  { id:1, name:"Arjun Sharma",   bloodGroup:"A+", city:"Mumbai",    phone:"9876543210", age:28, availability:true,  lastDonation:"2024-11-15" },
  { id:2, name:"Priya Nair",     bloodGroup:"O-", city:"Bangalore", phone:"9123456789", age:24, availability:true,  lastDonation:"2024-10-20" },
  { id:3, name:"Rahul Verma",    bloodGroup:"B+", city:"Delhi",     phone:"9988776655", age:32, availability:false, lastDonation:"2025-01-05" },
  { id:4, name:"Sneha Patel",    bloodGroup:"AB+",city:"Ahmedabad", phone:"9001122334", age:26, availability:true,  lastDonation:"2024-09-30" },
  { id:5, name:"Vikram Singh",   bloodGroup:"O+", city:"Jaipur",    phone:"9765432109", age:35, availability:true,  lastDonation:"2024-12-01" },
  { id:6, name:"Meera Krishnan", bloodGroup:"A-", city:"Chennai",   phone:"9654321098", age:29, availability:true,  lastDonation:"2024-08-15" },
  { id:7, name:"Deepak Gupta",   bloodGroup:"B-", city:"Hyderabad", phone:"9543210987", age:31, availability:false, lastDonation:"2025-02-10" },
  { id:8, name:"Anjali Reddy",   bloodGroup:"AB-",city:"Pune",      phone:"9432109876", age:27, availability:true,  lastDonation:"2024-07-22" },
];

const MOCK_REQUESTS = [
  { id:1, patientName:"Kavya Menon",  bloodGroup:"O-", hospital:"City General Hospital", contact:"9000111222", location:"Mumbai",    emergencyLevel:"critical", status:"pending",   createdAt:"2025-05-05" },
  { id:2, patientName:"Ravi Kumar",   bloodGroup:"A+", hospital:"Apollo Hospital",       contact:"9111222333", location:"Bangalore", emergencyLevel:"high",     status:"fulfilled", createdAt:"2025-05-04" },
  { id:3, patientName:"Sunita Devi",  bloodGroup:"B+", hospital:"AIIMS Delhi",           contact:"9222333444", location:"Delhi",     emergencyLevel:"moderate", status:"pending",   createdAt:"2025-05-06" },
];

/* ─── Toast ──────────────────────────────────────────────────── */
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = { success:"#10b981", error:"#ef4444", info:"#3b82f6", warning:"#f59e0b" };
  const icons  = { success:"✓", error:"✕", info:"ℹ", warning:"⚠" };

  return (
    <div style={{
      position:"fixed", top:24, right:24, zIndex:9999,
      background:"#1a1a2e",
      border:`1px solid ${colors[type]}`,
      borderLeft:`4px solid ${colors[type]}`,
      color:"#fff", padding:"14px 20px", borderRadius:12,
      boxShadow:"0 20px 60px rgba(0,0,0,0.5)", maxWidth:340,
      animation:"slideIn 0.3s ease",
      display:"flex", alignItems:"center", gap:10,
    }}>
      <span style={{ fontSize:18, color:colors[type] }}>{icons[type]}</span>
      <span style={{ fontSize:14, flex:1 }}>{message}</span>
      <button onClick={onClose}
        style={{ background:"none", border:"none", color:"#999", cursor:"pointer", fontSize:18 }}>×</button>
    </div>
  );
}

/* ─── Navbar ─────────────────────────────────────────────────── */
function Navbar({ page, setPage, darkMode, setDarkMode }) {
  const { user, logout } = useAuth();

  const navBtn = (label, key) => (
    <button key={key} onClick={() => setPage(key)} style={{
      background: page === key ? "rgba(220,38,38,0.15)" : "none",
      border: page === key ? "1px solid rgba(220,38,38,0.4)" : "1px solid transparent",
      color: page === key ? "#dc2626" : (darkMode ? "#ccc" : "#555"),
      padding:"6px 14px", borderRadius:8, cursor:"pointer",
      fontSize:14, fontWeight:500, transition:"all 0.2s",
    }}>{label}</button>
  );

  return (
    <nav style={{
      background: darkMode ? "rgba(10,10,20,0.97)" : "rgba(255,255,255,0.97)",
      backdropFilter:"blur(20px)",
      borderBottom:"1px solid rgba(220,38,38,0.2)",
      position:"sticky", top:0, zIndex:1000, padding:"0 24px",
    }}>
      <div style={{
        maxWidth:1200, margin:"0 auto",
        display:"flex", alignItems:"center", justifyContent:"space-between", height:64,
      }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}
          onClick={() => setPage("home")}>
          <div style={{
            width:38, height:38, borderRadius:10,
            background:"linear-gradient(135deg,#dc2626,#991b1b)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:20,
          }}>🩸</div>
          <div>
            <div style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:18, color:"#dc2626" }}>LifeFlow</div>
            <div style={{ fontSize:10, color: darkMode?"#666":"#999", letterSpacing:1 }}>BLOOD BANK</div>
          </div>
        </div>

        {/* Nav Links */}
        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
          {navBtn("Home","home")}
          {navBtn("Find Donors","search")}
          {navBtn("Emergency","emergency")}
          {navBtn("Contact","contact")}
          {user?.role === "admin" && navBtn("Admin","admin")}
        </div>

        {/* Right Side */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={() => setDarkMode(!darkMode)} style={{
            background:"none", border:"1px solid rgba(220,38,38,0.3)",
            borderRadius:8, padding:"6px 10px", cursor:"pointer",
            fontSize:16, color: darkMode?"#fbbf24":"#555",
          }}>{darkMode ? "☀️" : "🌙"}</button>

          {user ? (
            <>
              <button onClick={() => setPage("dashboard")} style={{
                background:"linear-gradient(135deg,#dc2626,#991b1b)", color:"#fff",
                border:"none", borderRadius:8, padding:"8px 16px",
                cursor:"pointer", fontSize:14, fontWeight:600,
              }}>Dashboard</button>
              <button onClick={logout} style={{
                background:"none", border:"1px solid rgba(220,38,38,0.4)",
                color:"#dc2626", borderRadius:8, padding:"8px 14px",
                cursor:"pointer", fontSize:14,
              }}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => setPage("login")} style={{
                background:"none", border:"1px solid rgba(220,38,38,0.4)",
                color:"#dc2626", borderRadius:8, padding:"8px 16px",
                cursor:"pointer", fontSize:14, fontWeight:500,
              }}>Login</button>
              <button onClick={() => setPage("register")} style={{
                background:"linear-gradient(135deg,#dc2626,#991b1b)", color:"#fff",
                border:"none", borderRadius:8, padding:"8px 16px",
                cursor:"pointer", fontSize:14, fontWeight:600,
              }}>Register</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ─── Footer ─────────────────────────────────────────────────── */
function Footer({ darkMode }) {
  return (
    <footer style={{
      background:"#080810", borderTop:"1px solid rgba(220,38,38,0.2)",
      padding:"60px 24px 30px", marginTop:80,
    }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div style={{
          display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr",
          gap:40, marginBottom:48,
        }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <div style={{
                width:36, height:36,
                background:"linear-gradient(135deg,#dc2626,#991b1b)",
                borderRadius:8, display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:18,
              }}>🩸</div>
              <span style={{ fontFamily:"Georgia,serif", fontSize:20, color:"#dc2626", fontWeight:700 }}>LifeFlow</span>
            </div>
            <p style={{ color:"#666", fontSize:14, lineHeight:1.7, maxWidth:280 }}>
              Connecting blood donors with those in need. Every drop counts — be a hero today.
            </p>
          </div>
          {[
            { title:"Quick Links", links:["Home","Find Donors","Emergency","Contact"] },
            { title:"Blood Groups", links:["A+ Donors","B+ Donors","O+ Donors","AB+ Donors"] },
            { title:"Support",     links:["FAQ","Privacy Policy","Terms","Help Center"] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ color:"#fff", fontSize:14, fontWeight:700, marginBottom:16 }}>{col.title}</h4>
              {col.links.map(link => (
                <div key={link} style={{ color:"#555", fontSize:14, marginBottom:10, cursor:"pointer" }}
                  onMouseEnter={e => e.target.style.color = "#dc2626"}
                  onMouseLeave={e => e.target.style.color = "#555"}>{link}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{
          borderTop:"1px solid rgba(255,255,255,0.06)",
          paddingTop:24, display:"flex", justifyContent:"space-between",
        }}>
          <p style={{ color:"#333", fontSize:13 }}>© 2025 LifeFlow. All rights reserved.</p>
          <p style={{ color:"#333", fontSize:13 }}>Made with ❤️ to save lives</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Home Page ──────────────────────────────────────────────── */
function HomePage({ setPage, darkMode }) {
  const [count, setCount] = useState({ donors:0, lives:0, cities:0, requests:0 });

  useEffect(() => {
    const targets = { donors:12847, lives:38520, cities:284, requests:4291 };
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const p = step / 60;
      const e = 1 - Math.pow(1 - p, 3);
      setCount({
        donors:   Math.round(targets.donors   * e),
        lives:    Math.round(targets.lives    * e),
        cities:   Math.round(targets.cities   * e),
        requests: Math.round(targets.requests * e),
      });
      if (step >= 60) clearInterval(timer);
    }, 33);
    return () => clearInterval(timer);
  }, []);

  const bg   = darkMode ? "#070710" : "#fff";
  const text = darkMode ? "#e5e7eb" : "#1f2937";
  const muted= darkMode ? "#9ca3af" : "#6b7280";
  const card = darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)";
  const bord = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  return (
    <div style={{ background:bg }}>
      {/* Hero */}
      <div style={{
        background: darkMode
          ? "linear-gradient(135deg,#0a0a1a,#1a0a0a,#0a0a1a)"
          : "linear-gradient(135deg,#fff,#fff5f5,#fff)",
        padding:"100px 24px", position:"relative", overflow:"hidden",
      }}>
        <div style={{
          position:"absolute", top:-100, right:-100,
          width:500, height:500, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(220,38,38,0.12),transparent 70%)",
        }}/>
        <div style={{
          maxWidth:1200, margin:"0 auto",
          display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"center",
        }}>
          <div>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:8,
              background:"rgba(220,38,38,0.1)",
              border:"1px solid rgba(220,38,38,0.3)",
              borderRadius:20, padding:"6px 16px",
              marginBottom:24, color:"#dc2626", fontSize:13, fontWeight:600,
            }}>🩸 World Blood Donor Day — June 14</div>

            <h1 style={{
              fontFamily:"Georgia,serif", fontSize:56, fontWeight:800,
              lineHeight:1.1, color:text, marginBottom:24,
            }}>
              Donate Blood,<br/>
              <span style={{ color:"#dc2626" }}>Save Lives</span>
            </h1>

            <p style={{ fontSize:18, color:muted, lineHeight:1.7, marginBottom:36, maxWidth:480 }}>
              Every 2 seconds someone needs blood. Join India's largest blood donor
              network and become a hero today.
            </p>

            <div style={{ display:"flex", gap:14 }}>
              <button onClick={() => setPage("register")} style={{
                background:"linear-gradient(135deg,#dc2626,#991b1b)",
                color:"#fff", border:"none", borderRadius:12,
                padding:"16px 32px", fontSize:16, fontWeight:700,
                cursor:"pointer", boxShadow:"0 8px 32px rgba(220,38,38,0.4)",
              }}>🩸 Register as Donor</button>

              <button onClick={() => setPage("emergency")} style={{
                background:"transparent", color:"#dc2626",
                border:"2px solid rgba(220,38,38,0.5)",
                borderRadius:12, padding:"16px 32px",
                fontSize:16, fontWeight:700, cursor:"pointer",
              }}>🚨 Request Blood</button>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            {[
              { emoji:"👥", value:count.donors.toLocaleString(),   label:"Registered Donors" },
              { emoji:"❤️", value:count.lives.toLocaleString(),    label:"Lives Saved" },
              { emoji:"🏙️", value:count.cities.toLocaleString(),   label:"Cities Covered" },
              { emoji:"🩸", value:count.requests.toLocaleString(), label:"Requests Fulfilled" },
            ].map((s,i) => (
              <div key={i} style={{
                background:card, border:`1px solid ${bord}`,
                borderRadius:16, padding:24,
              }}>
                <div style={{ fontSize:32, marginBottom:8 }}>{s.emoji}</div>
                <div style={{
                  fontSize:32, fontWeight:800, color:"#dc2626",
                  fontFamily:"Georgia,serif",
                }}>{s.value}</div>
                <div style={{ fontSize:13, color:muted, marginTop:4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Blood Groups */}
      <div style={{ padding:"80px 24px", background: darkMode?"#0a0a14":"#fafafa" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <h2 style={{ fontFamily:"Georgia,serif", fontSize:38, color:text, marginBottom:12 }}>
              Blood Group Compatibility
            </h2>
            <p style={{ color:muted, fontSize:16 }}>Know your type and who you can help</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(8,1fr)", gap:12 }}>
            {BLOOD_GROUPS.map((bg2,i) => (
              <div key={bg2} onClick={() => setPage("search")} style={{
                background: i%2===0
                  ? "linear-gradient(135deg,#dc2626,#991b1b)"
                  : (darkMode?"rgba(220,38,38,0.1)":"rgba(220,38,38,0.08)"),
                border:"1px solid rgba(220,38,38,0.3)",
                borderRadius:16, padding:"24px 8px",
                textAlign:"center", cursor:"pointer", transition:"transform 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.transform="translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}>
                <div style={{
                  fontSize:28, fontWeight:800, fontFamily:"Georgia,serif",
                  color: i%2===0?"#fff":"#dc2626",
                }}>{bg2}</div>
                <div style={{
                  fontSize:11, marginTop:4,
                  color: i%2===0?"rgba(255,255,255,0.7)":muted,
                }}>Find Donors</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div style={{ padding:"80px 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <h2 style={{ fontFamily:"Georgia,serif", fontSize:38, color:text, marginBottom:12 }}>
              How It Works
            </h2>
            <p style={{ color:muted, fontSize:16 }}>Three simple steps to save a life</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:32 }}>
            {[
              { num:"01", icon:"📋", title:"Register as Donor", desc:"Create your profile with blood type, city and availability. Takes less than 2 minutes." },
              { num:"02", icon:"🔍", title:"Get Discovered",    desc:"Patients and hospitals search by blood group and city to find available donors near them." },
              { num:"03", icon:"🩸", title:"Donate & Save",     desc:"Connect directly, visit the hospital or camp, and make the life-saving difference." },
            ].map((s,i) => (
              <div key={i} style={{
                background:card, border:`1px solid ${bord}`,
                borderRadius:20, padding:36, position:"relative", overflow:"hidden",
              }}>
                <div style={{
                  position:"absolute", top:16, right:20,
                  fontSize:72, fontWeight:900,
                  color:"rgba(220,38,38,0.06)",
                  fontFamily:"Georgia,serif", lineHeight:1,
                }}>{s.num}</div>
                <div style={{ fontSize:40, marginBottom:20 }}>{s.icon}</div>
                <h3 style={{ color:text, fontSize:20, fontWeight:700, marginBottom:12 }}>{s.title}</h3>
                <p style={{ color:muted, lineHeight:1.7, fontSize:15 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div style={{
        background:"linear-gradient(135deg,#dc2626,#7f1d1d)",
        padding:"60px 24px",
      }}>
        <div style={{
          maxWidth:1200, margin:"0 auto",
          display:"flex", justifyContent:"space-between", alignItems:"center", gap:40,
        }}>
          <div>
            <h2 style={{ fontFamily:"Georgia,serif", fontSize:36, color:"#fff", marginBottom:10 }}>
              Ready to be a lifesaver?
            </h2>
            <p style={{ color:"rgba(255,255,255,0.8)", fontSize:16 }}>
              One donation can save up to 3 lives. Join thousands of heroes across India.
            </p>
          </div>
          <div style={{ display:"flex", gap:14, flexShrink:0 }}>
            <button onClick={() => setPage("register")} style={{
              background:"#fff", color:"#dc2626",
              border:"none", borderRadius:12, padding:"14px 28px",
              fontSize:15, fontWeight:700, cursor:"pointer",
            }}>Register Now →</button>
            <button onClick={() => setPage("search")} style={{
              background:"rgba(255,255,255,0.15)", color:"#fff",
              border:"1px solid rgba(255,255,255,0.4)",
              borderRadius:12, padding:"14px 28px",
              fontSize:15, fontWeight:600, cursor:"pointer",
            }}>Find a Donor</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Register Page ──────────────────────────────────────────── */
function RegisterPage({ setPage, showToast, darkMode }) {
  const { login } = useAuth();
  const [form, setForm] = useState({
    name:"", email:"", password:"", confirm:"",
    bloodGroup:"", city:"", phone:"", age:"",
  });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const bg      = darkMode ? "#070710" : "#f9fafb";
  const cardBg  = darkMode ? "rgba(255,255,255,0.04)" : "#fff";
  const text    = darkMode ? "#e5e7eb" : "#1f2937";
  const muted   = darkMode ? "#9ca3af" : "#6b7280";
  const inpBg   = darkMode ? "rgba(255,255,255,0.06)" : "#f9fafb";
  const bord    = darkMode ? "rgba(255,255,255,0.12)" : "#e5e7eb";

  const f = (field) => ({
    width:"100%", padding:"12px 16px", borderRadius:10, fontSize:14,
    background:inpBg,
    border:`1px solid ${errors[field] ? "#ef4444" : bord}`,
    color:text, outline:"none", boxSizing:"border-box",
  });

  const validate = () => {
    const e = {};
    if (!form.name.trim())                              e.name    = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email))            e.email   = "Invalid email";
    if (form.password.length < 6)                       e.password= "Min 6 characters";
    if (form.password !== form.confirm)                 e.confirm = "Passwords do not match";
    if (!form.bloodGroup)                               e.bloodGroup="Select blood group";
    if (!form.city)                                     e.city    = "Select city";
    if (!/^[0-9]{10}$/.test(form.phone))               e.phone   = "10-digit phone needed";
    if (!form.age || form.age < 18 || form.age > 65)   e.age     = "Age must be 18–65";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    login({ id:Date.now(), name:form.name, email:form.email,
      bloodGroup:form.bloodGroup, city:form.city, phone:form.phone,
      age:parseInt(form.age), availability:true, role:"donor" });
    showToast("Registration successful! Welcome to LifeFlow 🩸","success");
    setPage("dashboard");
    setLoading(false);
  };

  const label = { fontSize:13, fontWeight:600, color:muted, marginBottom:6, display:"block" };

  return (
    <div style={{ background:bg, minHeight:"100vh", padding:"60px 24px" }}>
      <div style={{ maxWidth:600, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🩸</div>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:32, color:text, marginBottom:8 }}>Join LifeFlow</h1>
          <p style={{ color:muted }}>Register as a blood donor and start saving lives</p>
        </div>

        <div style={{
          background:cardBg,
          border:`1px solid ${darkMode?"rgba(255,255,255,0.08)":"#e5e7eb"}`,
          borderRadius:20, padding:40,
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
              <div>
                <label style={label}>Full Name *</label>
                <input style={f("name")} value={form.name}
                  onChange={e => setForm({...form,name:e.target.value})} placeholder="Arjun Sharma"/>
                {errors.name && <p style={{ color:"#ef4444", fontSize:12, marginTop:4 }}>{errors.name}</p>}
              </div>
              <div>
                <label style={label}>Age *</label>
                <input style={f("age")} type="number" value={form.age}
                  onChange={e => setForm({...form,age:e.target.value})} placeholder="28" min={18} max={65}/>
                {errors.age && <p style={{ color:"#ef4444", fontSize:12, marginTop:4 }}>{errors.age}</p>}
              </div>
            </div>

            <div style={{ marginBottom:20 }}>
              <label style={label}>Email Address *</label>
              <input style={f("email")} type="email" value={form.email}
                onChange={e => setForm({...form,email:e.target.value})} placeholder="arjun@example.com"/>
              {errors.email && <p style={{ color:"#ef4444", fontSize:12, marginTop:4 }}>{errors.email}</p>}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
              <div>
                <label style={label}>Password *</label>
                <input style={f("password")} type="password" value={form.password}
                  onChange={e => setForm({...form,password:e.target.value})} placeholder="••••••••"/>
                {errors.password && <p style={{ color:"#ef4444", fontSize:12, marginTop:4 }}>{errors.password}</p>}
              </div>
              <div>
                <label style={label}>Confirm Password *</label>
                <input style={f("confirm")} type="password" value={form.confirm}
                  onChange={e => setForm({...form,confirm:e.target.value})} placeholder="••••••••"/>
                {errors.confirm && <p style={{ color:"#ef4444", fontSize:12, marginTop:4 }}>{errors.confirm}</p>}
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
              <div>
                <label style={label}>Blood Group *</label>
                <select style={{ ...f("bloodGroup"), cursor:"pointer" }} value={form.bloodGroup}
                  onChange={e => setForm({...form,bloodGroup:e.target.value})}>
                  <option value="">Select blood group</option>
                  {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                {errors.bloodGroup && <p style={{ color:"#ef4444", fontSize:12, marginTop:4 }}>{errors.bloodGroup}</p>}
              </div>
              <div>
                <label style={label}>City *</label>
                <select style={{ ...f("city"), cursor:"pointer" }} value={form.city}
                  onChange={e => setForm({...form,city:e.target.value})}>
                  <option value="">Select city</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.city && <p style={{ color:"#ef4444", fontSize:12, marginTop:4 }}>{errors.city}</p>}
              </div>
            </div>

            <div style={{ marginBottom:28 }}>
              <label style={label}>Phone Number *</label>
              <input style={f("phone")} value={form.phone}
                onChange={e => setForm({...form,phone:e.target.value})} placeholder="9876543210" maxLength={10}/>
              {errors.phone && <p style={{ color:"#ef4444", fontSize:12, marginTop:4 }}>{errors.phone}</p>}
            </div>

            <button type="submit" disabled={loading} style={{
              width:"100%",
              background:"linear-gradient(135deg,#dc2626,#991b1b)",
              color:"#fff", border:"none", borderRadius:12,
              padding:"16px", fontSize:16, fontWeight:700,
              cursor: loading?"not-allowed":"pointer", opacity: loading?0.8:1,
            }}>
              {loading ? "Creating Account..." : "🩸 Register as Donor"}
            </button>

            <p style={{ textAlign:"center", color:muted, fontSize:14, marginTop:20 }}>
              Already have an account?{" "}
              <span onClick={() => setPage("login")}
                style={{ color:"#dc2626", cursor:"pointer", fontWeight:600 }}>Sign In</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ─── Login Page ─────────────────────────────────────────────── */
function LoginPage({ setPage, showToast, darkMode }) {
  const { login } = useAuth();
  const [form,    setForm]    = useState({ email:"", password:"" });
  const [loading, setLoading] = useState(false);

  const bg     = darkMode ? "#070710" : "#f9fafb";
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "#fff";
  const text   = darkMode ? "#e5e7eb" : "#1f2937";
  const muted  = darkMode ? "#9ca3af" : "#6b7280";
  const inpBg  = darkMode ? "rgba(255,255,255,0.06)" : "#f9fafb";
  const bord   = darkMode ? "rgba(255,255,255,0.12)" : "#e5e7eb";

  const inp = {
    width:"100%", padding:"13px 16px", borderRadius:10, fontSize:14,
    background:inpBg, border:`1px solid ${bord}`,
    color:text, outline:"none", boxSizing:"border-box",
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!form.email || !form.password) {
      showToast("Please fill all fields","error"); return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r,1000));

    if (form.email === "admin@lifeflow.com" && form.password === "admin123") {
      login({ id:0, name:"Admin User", email:form.email, role:"admin" });
      showToast("Welcome Admin! 👋","success");
      setPage("admin");
    } else {
      login({ id:99, name:"Demo User", email:form.email,
        bloodGroup:"O+", city:"Mumbai", phone:"9876543210",
        age:28, availability:true, role:"donor" });
      showToast("Login successful! 🩸","success");
      setPage("dashboard");
    }
    setLoading(false);
  };

  return (
    <div style={{
      background:bg, minHeight:"100vh",
      display:"flex", alignItems:"center",
      justifyContent:"center", padding:"24px",
    }}>
      <div style={{ maxWidth:440, width:"100%" }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🔐</div>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:32, color:text, marginBottom:8 }}>Welcome Back</h1>
          <p style={{ color:muted }}>Sign in to your LifeFlow account</p>
        </div>

        <div style={{
          background:cardBg,
          border:`1px solid ${darkMode?"rgba(255,255,255,0.08)":"#e5e7eb"}`,
          borderRadius:20, padding:40,
        }}>
          {/* Demo hint */}
          <div style={{
            background:"rgba(220,38,38,0.08)",
            border:"1px solid rgba(220,38,38,0.2)",
            borderRadius:10, padding:"12px 16px", marginBottom:24,
            fontSize:13, color:"#dc2626",
          }}>
            <strong>Demo:</strong> Any email + password = donor login<br/>
            admin@lifeflow.com / admin123 = admin panel
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:13, fontWeight:600, color:muted, marginBottom:6, display:"block" }}>
                Email Address
              </label>
              <input style={inp} type="email" value={form.email}
                onChange={e => setForm({...form,email:e.target.value})} placeholder="arjun@example.com"/>
            </div>
            <div style={{ marginBottom:28 }}>
              <label style={{ fontSize:13, fontWeight:600, color:muted, marginBottom:6, display:"block" }}>
                Password
              </label>
              <input style={inp} type="password" value={form.password}
                onChange={e => setForm({...form,password:e.target.value})} placeholder="••••••••"/>
            </div>

            <button type="submit" disabled={loading} style={{
              width:"100%",
              background:"linear-gradient(135deg,#dc2626,#991b1b)",
              color:"#fff", border:"none", borderRadius:12,
              padding:"16px", fontSize:16, fontWeight:700,
              cursor: loading?"not-allowed":"pointer", opacity: loading?0.8:1,
            }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p style={{ textAlign:"center", color:muted, fontSize:14, marginTop:20 }}>
              New donor?{" "}
              <span onClick={() => setPage("register")}
                style={{ color:"#dc2626", cursor:"pointer", fontWeight:600 }}>Create Account</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ─── Dashboard ──────────────────────────────────────────────── */
function Dashboard({ setPage, showToast, darkMode }) {
  const { user } = useAuth();
  const [tab,          setTab]          = useState("overview");
  const [availability, setAvailability] = useState(true);

  const bg     = darkMode ? "#070710" : "#f9fafb";
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "#fff";
  const text   = darkMode ? "#e5e7eb" : "#1f2937";
  const muted  = darkMode ? "#9ca3af" : "#6b7280";
  const bord   = darkMode ? "rgba(255,255,255,0.08)" : "#e5e7eb";

  const stats = [
    { label:"Times Donated",  value:"4",        icon:"🩸", color:"#dc2626" },
    { label:"Lives Impacted", value:"12",       icon:"❤️", color:"#ef4444" },
    { label:"Last Donation",  value:"Nov 2024", icon:"📅", color:"#f97316" },
    { label:"Next Eligible",  value:"Feb 2025", icon:"✅", color:"#10b981" },
  ];

  const donationHistory = [
    { date:"Nov 15, 2024", type:"Whole Blood", hospital:"City Hospital",  volume:"450ml" },
    { date:"Jul 20, 2024", type:"Platelets",   hospital:"Apollo Mumbai",   volume:"300ml" },
    { date:"Mar 10, 2024", type:"Whole Blood", hospital:"KEM Hospital",    volume:"450ml" },
    { date:"Nov 5, 2023",  type:"Plasma",      hospital:"Lilavati",        volume:"250ml" },
  ];

  return (
    <div style={{ background:bg, minHeight:"100vh", padding:"40px 24px" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32 }}>
          <div>
            <h1 style={{ fontFamily:"Georgia,serif", fontSize:32, color:text, marginBottom:4 }}>
              Welcome, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p style={{ color:muted }}>Your blood donation dashboard</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:13, color:muted }}>Available to donate:</span>
            <div onClick={() => {
              setAvailability(!availability);
              showToast(
                !availability ? "You're now available 🩸" : "Set to unavailable",
                !availability ? "success" : "info"
              );
            }} style={{
              width:52, height:28, borderRadius:14,
              background: availability ? "#dc2626" : (darkMode?"#333":"#d1d5db"),
              cursor:"pointer", position:"relative", transition:"background 0.3s",
            }}>
              <div style={{
                position:"absolute", top:4,
                left: availability ? 26 : 4,
                width:20, height:20, borderRadius:"50%",
                background:"#fff", transition:"left 0.3s",
                boxShadow:"0 2px 4px rgba(0,0,0,0.3)",
              }}/>
            </div>
          </div>
        </div>

        {/* Profile Banner */}
        <div style={{
          background:"linear-gradient(135deg,#dc2626,#7f1d1d)",
          borderRadius:20, padding:28, marginBottom:28,
          display:"flex", alignItems:"center", gap:24,
        }}>
          <div style={{
            width:72, height:72, borderRadius:"50%",
            background:"rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:24, fontWeight:800, color:"#fff", fontFamily:"Georgia,serif",
          }}>{user?.bloodGroup || "O+"}</div>
          <div style={{ flex:1 }}>
            <h2 style={{ color:"#fff", fontSize:22, fontWeight:700, marginBottom:6 }}>{user?.name}</h2>
            <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
              {[
                { icon:"📍", val: user?.city    || "Mumbai" },
                { icon:"📱", val: user?.phone   || "9876543210" },
                { icon:"🎂", val:`Age ${user?.age || 28}` },
              ].map((it,i) => (
                <span key={i} style={{ color:"rgba(255,255,255,0.85)", fontSize:14 }}>
                  {it.icon} {it.val}
                </span>
              ))}
            </div>
          </div>
          <div style={{
            background: availability?"rgba(255,255,255,0.2)":"rgba(0,0,0,0.2)",
            borderRadius:10, padding:"8px 16px", color:"#fff",
            fontSize:13, fontWeight:600,
            border:"1px solid rgba(255,255,255,0.3)",
          }}>
            {availability ? "✅ Available" : "⏸ Unavailable"}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 }}>
          {stats.map((s,i) => (
            <div key={i} style={{ background:cardBg, border:`1px solid ${bord}`, borderRadius:16, padding:20 }}>
              <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
              <div style={{ fontSize:28, fontWeight:800, color:s.color, fontFamily:"Georgia,serif" }}>{s.value}</div>
              <div style={{ fontSize:13, color:muted, marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
          display:"flex", gap:4, marginBottom:24,
          background: darkMode?"rgba(255,255,255,0.04)":"#f3f4f6",
          borderRadius:12, padding:4,
        }}>
          {["overview","profile","history","requests"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex:1, padding:"10px", borderRadius:8, border:"none", cursor:"pointer",
              background: tab===t ? (darkMode?"#1a1a2e":"#fff") : "transparent",
              color: tab===t ? "#dc2626" : muted,
              fontWeight: tab===t ? 700 : 400,
              fontSize:14, textTransform:"capitalize", transition:"all 0.2s",
            }}>{t}</button>
          ))}
        </div>

        {/* Tab: Overview */}
        {tab === "overview" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            <div style={{ background:cardBg, border:`1px solid ${bord}`, borderRadius:16, padding:24 }}>
              <h3 style={{ color:text, fontWeight:700, marginBottom:16 }}>📊 Donation Timeline</h3>
              {donationHistory.map((d,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:"#dc2626", flexShrink:0 }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, color:text, fontWeight:600 }}>{d.type}</div>
                    <div style={{ fontSize:12, color:muted }}>{d.hospital} · {d.date}</div>
                  </div>
                  <span style={{
                    background:"rgba(220,38,38,0.1)", color:"#dc2626",
                    fontSize:12, padding:"3px 8px", borderRadius:6,
                  }}>✓</span>
                </div>
              ))}
            </div>

            <div style={{ background:cardBg, border:`1px solid ${bord}`, borderRadius:16, padding:24 }}>
              <h3 style={{ color:text, fontWeight:700, marginBottom:16 }}>🔔 Quick Actions</h3>
              {[
                { label:"Find Blood Requests",    icon:"🩸", action:() => setPage("search")    },
                { label:"Post Emergency Request", icon:"🚨", action:() => setPage("emergency") },
                { label:"Contact Support",        icon:"📞", action:() => setPage("contact")   },
              ].map((it,i) => (
                <button key={i} onClick={it.action} style={{
                  width:"100%", display:"flex", alignItems:"center", gap:12,
                  background: darkMode?"rgba(255,255,255,0.04)":"#f9fafb",
                  border:`1px solid ${bord}`, borderRadius:10,
                  padding:"12px 16px", cursor:"pointer",
                  marginBottom:10, color:text, fontSize:14,
                  fontWeight:500, textAlign:"left", transition:"all 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor="rgba(220,38,38,0.4)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor=bord}>
                  <span style={{ fontSize:20 }}>{it.icon}</span>
                  {it.label}
                  <span style={{ marginLeft:"auto", color:muted }}>→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Profile */}
        {tab === "profile" && (
          <div style={{ background:cardBg, border:`1px solid ${bord}`, borderRadius:16, padding:32 }}>
            <h3 style={{ color:text, fontWeight:700, fontSize:18, marginBottom:24 }}>Profile Information</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
              {[
                { label:"Full Name",   value:user?.name,       icon:"👤" },
                { label:"Email",       value:user?.email,      icon:"📧" },
                { label:"Blood Group", value:user?.bloodGroup, icon:"🩸" },
                { label:"City",        value:user?.city,       icon:"📍" },
                { label:"Phone",       value:user?.phone,      icon:"📱" },
                { label:"Age",         value:user?.age,        icon:"🎂" },
              ].map((f,i) => (
                <div key={i} style={{
                  background: darkMode?"rgba(255,255,255,0.03)":"#f9fafb",
                  borderRadius:10, padding:16,
                }}>
                  <div style={{ fontSize:12, color:muted, marginBottom:4 }}>{f.icon} {f.label}</div>
                  <div style={{ fontSize:16, color:text, fontWeight:600 }}>{f.value || "—"}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: History */}
        {tab === "history" && (
          <div style={{ background:cardBg, border:`1px solid ${bord}`, borderRadius:16, padding:24 }}>
            <h3 style={{ color:text, fontWeight:700, fontSize:18, marginBottom:20 }}>Donation History</h3>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${bord}` }}>
                  {["Date","Type","Hospital","Volume","Status"].map(h => (
                    <th key={h} style={{
                      textAlign:"left", padding:"10px 12px",
                      fontSize:12, color:muted, fontWeight:600,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {donationHistory.map((r,i) => (
                  <tr key={i} style={{ borderBottom:`1px solid ${bord}` }}>
                    <td style={{ padding:"14px 12px", fontSize:14, color:text }}>{r.date}</td>
                    <td style={{ padding:"14px 12px", fontSize:14, color:text }}>{r.type}</td>
                    <td style={{ padding:"14px 12px", fontSize:14, color:muted }}>{r.hospital}</td>
                    <td style={{ padding:"14px 12px", fontSize:14, color:muted }}>{r.volume}</td>
                    <td style={{ padding:"14px 12px" }}>
                      <span style={{
                        background:"rgba(16,185,129,0.1)", color:"#10b981",
                        fontSize:12, padding:"4px 10px", borderRadius:6, fontWeight:600,
                      }}>✓ Complete</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab: Requests */}
        {tab === "requests" && (
          <div style={{ background:cardBg, border:`1px solid ${bord}`, borderRadius:16, padding:24 }}>
            <h3 style={{ color:text, fontWeight:700, fontSize:18, marginBottom:20 }}>Blood Requests Near You</h3>
            {MOCK_REQUESTS.map(req => (
              <div key={req.id} style={{
                background: darkMode?"rgba(255,255,255,0.03)":"#f9fafb",
                border:`1px solid ${req.emergencyLevel==="critical"?"rgba(220,38,38,0.4)":bord}`,
                borderLeft:`4px solid ${req.emergencyLevel==="critical"?"#dc2626":"#f97316"}`,
                borderRadius:12, padding:20, marginBottom:14,
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                      <span style={{ fontSize:22, fontWeight:800, color:"#dc2626" }}>{req.bloodGroup}</span>
                      <span style={{
                        background:"rgba(220,38,38,0.1)", color:"#dc2626",
                        fontSize:11, padding:"3px 8px", borderRadius:6,
                        fontWeight:700, textTransform:"uppercase",
                      }}>{req.emergencyLevel}</span>
                    </div>
                    <div style={{ fontSize:14, color:text, fontWeight:600 }}>
                      {req.patientName} · {req.hospital}
                    </div>
                    <div style={{ fontSize:13, color:muted, marginTop:4 }}>
                      📍 {req.location} · 📱 {req.contact}
                    </div>
                  </div>
                  <button onClick={() => showToast(`Connecting you to ${req.patientName}'s request 🩸`,"success")}
                    style={{
                      background:"linear-gradient(135deg,#dc2626,#991b1b)",
                      color:"#fff", border:"none", borderRadius:8,
                      padding:"10px 18px", fontSize:13, fontWeight:600, cursor:"pointer",
                    }}>Respond</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Search Page ────────────────────────────────────────────── */
function SearchPage({ showToast, darkMode }) {
  const [bloodGroup, setBloodGroup] = useState("");
  const [city,       setCity]       = useState("");
  const [results,    setResults]    = useState(MOCK_DONORS);
  const [searching,  setSearching]  = useState(false);

  const bg     = darkMode ? "#070710" : "#f9fafb";
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "#fff";
  const text   = darkMode ? "#e5e7eb" : "#1f2937";
  const muted  = darkMode ? "#9ca3af" : "#6b7280";
  const bord   = darkMode ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const inpBg  = darkMode ? "rgba(255,255,255,0.06)" : "#fff";

  const sel = {
    padding:"12px 16px", borderRadius:10, fontSize:14,
    background:inpBg, border:`1px solid ${bord}`,
    color:text, outline:"none", minWidth:160,
  };

  const handleSearch = async () => {
    setSearching(true);
    await new Promise(r => setTimeout(r,600));
    const filtered = MOCK_DONORS.filter(d =>
      (!bloodGroup || d.bloodGroup === bloodGroup) &&
      (!city       || d.city.toLowerCase().includes(city.toLowerCase()))
    );
    setResults(filtered);
    showToast(`Found ${filtered.length} donor(s)`, filtered.length ? "success" : "info");
    setSearching(false);
  };

  return (
    <div style={{ background:bg, minHeight:"100vh", padding:"48px 24px" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:38, color:text, marginBottom:10 }}>Find Blood Donors</h1>
          <p style={{ color:muted, fontSize:16 }}>Search verified donors by blood group and city</p>
        </div>

        {/* Search bar */}
        <div style={{
          background:cardBg, border:`1px solid ${bord}`,
          borderRadius:20, padding:24,
          display:"flex", gap:14, alignItems:"center",
          marginBottom:32, flexWrap:"wrap",
        }}>
          <select style={sel} value={bloodGroup} onChange={e => setBloodGroup(e.target.value)}>
            <option value="">All Blood Groups</option>
            {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          <select style={sel} value={city} onChange={e => setCity(e.target.value)}>
            <option value="">All Cities</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <button onClick={handleSearch} disabled={searching} style={{
            background:"linear-gradient(135deg,#dc2626,#991b1b)", color:"#fff",
            border:"none", borderRadius:10, padding:"12px 28px",
            fontSize:15, fontWeight:700, cursor:"pointer",
          }}>
            {searching ? "🔍 Searching..." : "🔍 Search"}
          </button>

          <button onClick={() => { setBloodGroup(""); setCity(""); setResults(MOCK_DONORS); }} style={{
            background:"none", border:`1px solid ${bord}`,
            borderRadius:10, padding:"12px 20px",
            fontSize:14, color:muted, cursor:"pointer",
          }}>Reset</button>

          <span style={{ marginLeft:"auto", color:muted, fontSize:14 }}>
            {results.length} donor(s) found
          </span>
        </div>

        {/* Results grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
          {results.map(donor => (
            <div key={donor.id} style={{
              background:cardBg,
              border:`1px solid ${donor.availability?"rgba(220,38,38,0.2)":bord}`,
              borderTop:`3px solid ${donor.availability?"#dc2626":(darkMode?"#333":"#e5e7eb")}`,
              borderRadius:18, padding:24, transition:"transform 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.transform="translateY(-4px)"}
              onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}>

              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{
                    width:52, height:52, borderRadius:"50%",
                    background: donor.availability
                      ? "linear-gradient(135deg,#dc2626,#991b1b)"
                      : (darkMode?"#333":"#f3f4f6"),
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:16, fontWeight:800, fontFamily:"Georgia,serif",
                    color: donor.availability?"#fff":muted,
                  }}>{donor.bloodGroup}</div>
                  <div>
                    <div style={{ fontSize:16, fontWeight:700, color:text }}>{donor.name}</div>
                    <div style={{ fontSize:13, color:muted }}>Age {donor.age}</div>
                  </div>
                </div>
                <span style={{
                  background: donor.availability?"rgba(16,185,129,0.1)":"rgba(107,114,128,0.1)",
                  color: donor.availability?"#10b981":"#6b7280",
                  fontSize:11, padding:"4px 10px", borderRadius:20, fontWeight:700,
                }}>{donor.availability ? "Available" : "Unavailable"}</span>
              </div>

              {[
                { icon:"📍", val:donor.city },
                { icon:"📱", val:donor.phone },
                { icon:"📅", val:`Last donated: ${donor.lastDonation}` },
              ].map((it,i) => (
                <div key={i} style={{ fontSize:13, color:muted, display:"flex", gap:6, marginBottom:6 }}>
                  {it.icon} {it.val}
                </div>
              ))}

              {donor.availability && (
                <button onClick={() => showToast(`Connecting you to ${donor.name} 📞`,"success")}
                  style={{
                    width:"100%", marginTop:16,
                    background:"linear-gradient(135deg,#dc2626,#991b1b)", color:"#fff",
                    border:"none", borderRadius:10, padding:"11px",
                    fontSize:14, fontWeight:600, cursor:"pointer",
                  }}>📞 Contact Donor</button>
              )}
            </div>
          ))}
        </div>

        {results.length === 0 && (
          <div style={{ textAlign:"center", padding:"80px 0", color:muted }}>
            <div style={{ fontSize:64, marginBottom:16 }}>🔍</div>
            <h3 style={{ color:text, fontSize:20, marginBottom:8 }}>No donors found</h3>
            <p>Try different filters or post an emergency request</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Emergency Page ─────────────────────────────────────────── */
function EmergencyPage({ showToast, darkMode }) {
  const [form, setForm] = useState({
    patientName:"", bloodGroup:"", hospital:"",
    contact:"", location:"", emergencyLevel:"high", units:"1",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  const bg     = darkMode ? "#070710" : "#f9fafb";
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "#fff";
  const text   = darkMode ? "#e5e7eb" : "#1f2937";
  const muted  = darkMode ? "#9ca3af" : "#6b7280";
  const bord   = darkMode ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const inpBg  = darkMode ? "rgba(255,255,255,0.06)" : "#f9fafb";

  const inp = {
    width:"100%", padding:"12px 16px", borderRadius:10, fontSize:14,
    background:inpBg, border:`1px solid ${bord}`,
    color:text, outline:"none", boxSizing:"border-box",
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!form.patientName||!form.bloodGroup||!form.hospital||!form.contact||!form.location) {
      showToast("Please fill all required fields","error"); return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r,1500));
    setLoading(false);
    setSubmitted(true);
    showToast("Emergency request posted! Notifying nearby donors 🚨","success");
  };

  if (submitted) return (
    <div style={{
      background:bg, minHeight:"100vh",
      display:"flex", alignItems:"center", justifyContent:"center", padding:24,
    }}>
      <div style={{ textAlign:"center", maxWidth:480 }}>
        <div style={{ fontSize:80, marginBottom:20 }}>🚨</div>
        <h2 style={{ fontFamily:"Georgia,serif", fontSize:32, color:text, marginBottom:12 }}>Request Posted!</h2>
        <p style={{ color:muted, fontSize:16, lineHeight:1.7, marginBottom:28 }}>
          Your emergency request for <strong style={{ color:"#dc2626" }}>{form.bloodGroup}</strong> has been
          posted. We are alerting donors near <strong>{form.location}</strong>.
        </p>
        <div style={{
          background:"rgba(220,38,38,0.08)",
          border:"1px solid rgba(220,38,38,0.2)",
          borderRadius:14, padding:20, marginBottom:24,
        }}>
          <div style={{ fontSize:13, color:muted, marginBottom:8 }}>Request ID</div>
          <div style={{ fontSize:22, fontWeight:800, color:"#dc2626", fontFamily:"monospace" }}>
            REQ-{Date.now().toString().slice(-6)}
          </div>
        </div>
        <button onClick={() => setSubmitted(false)} style={{
          background:"linear-gradient(135deg,#dc2626,#991b1b)", color:"#fff",
          border:"none", borderRadius:10, padding:"14px 32px",
          fontSize:15, fontWeight:700, cursor:"pointer",
        }}>Post Another Request</button>
      </div>
    </div>
  );

  return (
    <div style={{ background:bg, minHeight:"100vh", padding:"48px 24px" }}>
      <div style={{ maxWidth:700, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            background:"rgba(220,38,38,0.1)",
            border:"1px solid rgba(220,38,38,0.3)",
            borderRadius:20, padding:"8px 20px",
            marginBottom:20, color:"#dc2626", fontSize:14, fontWeight:700,
          }}>🚨 Emergency Blood Request</div>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:38, color:text, marginBottom:10 }}>
            Need Blood Urgently?
          </h1>
          <p style={{ color:muted, fontSize:16 }}>
            Post your emergency — we'll alert nearby donors instantly
          </p>
        </div>

        <div style={{ background:cardBg, border:`1px solid ${bord}`, borderRadius:20, padding:36 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:muted, marginBottom:6, display:"block" }}>Patient Name *</label>
                <input style={inp} value={form.patientName}
                  onChange={e => setForm({...form,patientName:e.target.value})} placeholder="Kavya Menon"/>
              </div>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:muted, marginBottom:6, display:"block" }}>Blood Group *</label>
                <select style={{ ...inp, cursor:"pointer" }} value={form.bloodGroup}
                  onChange={e => setForm({...form,bloodGroup:e.target.value})}>
                  <option value="">Select blood group</option>
                  {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:13, fontWeight:600, color:muted, marginBottom:6, display:"block" }}>Hospital Name *</label>
              <input style={inp} value={form.hospital}
                onChange={e => setForm({...form,hospital:e.target.value})} placeholder="City General Hospital"/>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:muted, marginBottom:6, display:"block" }}>Contact Number *</label>
                <input style={inp} value={form.contact}
                  onChange={e => setForm({...form,contact:e.target.value})} placeholder="9000111222" maxLength={10}/>
              </div>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:muted, marginBottom:6, display:"block" }}>City / Location *</label>
                <select style={{ ...inp, cursor:"pointer" }} value={form.location}
                  onChange={e => setForm({...form,location:e.target.value})}>
                  <option value="">Select city</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:28 }}>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:muted, marginBottom:6, display:"block" }}>Emergency Level *</label>
                <select style={{ ...inp, cursor:"pointer" }} value={form.emergencyLevel}
                  onChange={e => setForm({...form,emergencyLevel:e.target.value})}>
                  <option value="critical">🔴 Critical — Immediate</option>
                  <option value="high">🟠 High — Within 6 hours</option>
                  <option value="moderate">🟡 Moderate — Within 24 hours</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:muted, marginBottom:6, display:"block" }}>Units Required</label>
                <select style={{ ...inp, cursor:"pointer" }} value={form.units}
                  onChange={e => setForm({...form,units:e.target.value})}>
                  {[1,2,3,4,5].map(u => <option key={u} value={u}>{u} unit{u>1?"s":""}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width:"100%",
              background:"linear-gradient(135deg,#dc2626,#991b1b)",
              color:"#fff", border:"none", borderRadius:12, padding:"18px",
              fontSize:16, fontWeight:700,
              cursor: loading?"not-allowed":"pointer", opacity: loading?0.8:1,
              boxShadow:"0 8px 32px rgba(220,38,38,0.4)",
            }}>
              {loading ? "🔄 Posting Request..." : "🚨 Post Emergency Request"}
            </button>
          </form>
        </div>

        {/* Active Requests */}
        <div style={{ marginTop:36 }}>
          <h3 style={{ color:text, fontWeight:700, fontSize:18, marginBottom:16 }}>Active Emergency Requests</h3>
          {MOCK_REQUESTS.map(req => (
            <div key={req.id} style={{
              background:cardBg,
              border:`1px solid ${req.status==="pending"?"rgba(220,38,38,0.3)":bord}`,
              borderLeft:`4px solid ${req.emergencyLevel==="critical"?"#dc2626":"#f97316"}`,
              borderRadius:14, padding:18, marginBottom:12,
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                    <span style={{ fontSize:20, fontWeight:800, color:"#dc2626" }}>{req.bloodGroup}</span>
                    <span style={{ color:text, fontWeight:600, fontSize:14 }}>{req.patientName}</span>
                    <span style={{
                      background:"rgba(220,38,38,0.1)", color:"#dc2626",
                      fontSize:11, padding:"2px 8px", borderRadius:6,
                      fontWeight:700, textTransform:"uppercase",
                    }}>{req.emergencyLevel}</span>
                  </div>
                  <div style={{ fontSize:13, color:muted }}>
                    🏥 {req.hospital} · 📍 {req.location} · 📱 {req.contact}
                  </div>
                </div>
                <span style={{
                  background: req.status==="fulfilled"?"rgba(16,185,129,0.1)":"rgba(220,38,38,0.1)",
                  color: req.status==="fulfilled"?"#10b981":"#dc2626",
                  fontSize:12, padding:"4px 12px", borderRadius:20, fontWeight:700,
                }}>{req.status==="fulfilled" ? "✓ Fulfilled" : "⏳ Pending"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Admin Panel ────────────────────────────────────────────── */
function AdminPanel({ showToast, darkMode }) {
  const [tab,      setTab]      = useState("overview");
  const [donors,   setDonors]   = useState(MOCK_DONORS);
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  const bg     = darkMode ? "#070710" : "#f9fafb";
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "#fff";
  const text   = darkMode ? "#e5e7eb" : "#1f2937";
  const muted  = darkMode ? "#9ca3af" : "#6b7280";
  const bord   = darkMode ? "rgba(255,255,255,0.08)" : "#e5e7eb";

  const topStats = [
    { label:"Total Donors",    value:donors.length,                            icon:"👥", color:"#dc2626" },
    { label:"Active Requests", value:requests.filter(r=>r.status==="pending").length, icon:"🚨", color:"#f97316" },
    { label:"Fulfilled Today", value:8,                                        icon:"✅", color:"#10b981" },
    { label:"Available",       value:donors.filter(d=>d.availability).length,  icon:"🩸", color:"#3b82f6" },
  ];

  const bgCounts = BLOOD_GROUPS.map(bg2 => ({
    bg: bg2, count: donors.filter(d => d.bloodGroup === bg2).length,
  }));
  const maxCount = Math.max(...bgCounts.map(b => b.count), 1);

  return (
    <div style={{ background:bg, minHeight:"100vh", padding:"40px 24px" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:32, color:text, marginBottom:4 }}>Admin Panel</h1>
          <p style={{ color:muted }}>Manage donors, requests and platform operations</p>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 }}>
          {topStats.map((s,i) => (
            <div key={i} style={{ background:cardBg, border:`1px solid ${bord}`, borderRadius:16, padding:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:28 }}>{s.icon}</span>
                <span style={{
                  background:"rgba(16,185,129,0.1)", color:"#10b981",
                  fontSize:11, padding:"3px 8px", borderRadius:6, fontWeight:700, alignSelf:"flex-start",
                }}>Live</span>
              </div>
              <div style={{ fontSize:32, fontWeight:800, color:s.color, fontFamily:"Georgia,serif", marginTop:8 }}>{s.value}</div>
              <div style={{ fontSize:13, color:muted }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
          display:"flex", gap:4, marginBottom:24,
          background: darkMode?"rgba(255,255,255,0.04)":"#f3f4f6",
          borderRadius:12, padding:4, width:"fit-content",
        }}>
          {["overview","donors","requests"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding:"10px 20px", borderRadius:8, border:"none", cursor:"pointer",
              background: tab===t ? (darkMode?"#1a1a2e":"#fff") : "transparent",
              color: tab===t ? "#dc2626" : muted,
              fontWeight: tab===t ? 700 : 400,
              fontSize:14, textTransform:"capitalize",
            }}>{t}</button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            <div style={{ background:cardBg, border:`1px solid ${bord}`, borderRadius:16, padding:24 }}>
              <h3 style={{ color:text, fontWeight:700, marginBottom:20 }}>📊 Donors by Blood Group</h3>
              {bgCounts.map(({ bg:bgr, count }) => (
                <div key={bgr} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                  <span style={{ width:40, fontSize:14, fontWeight:800, color:"#dc2626", fontFamily:"Georgia,serif" }}>{bgr}</span>
                  <div style={{
                    flex:1, background: darkMode?"rgba(255,255,255,0.06)":"#f3f4f6",
                    borderRadius:4, height:8, overflow:"hidden",
                  }}>
                    <div style={{
                      width:`${(count/maxCount)*100}%`, height:"100%",
                      background:"linear-gradient(90deg,#dc2626,#ef4444)",
                      borderRadius:4, transition:"width 0.5s",
                    }}/>
                  </div>
                  <span style={{ width:20, fontSize:13, color:muted, textAlign:"right" }}>{count}</span>
                </div>
              ))}
            </div>

            <div style={{ background:cardBg, border:`1px solid ${bord}`, borderRadius:16, padding:24 }}>
              <h3 style={{ color:text, fontWeight:700, marginBottom:20 }}>🏙️ Top Cities</h3>
              {["Mumbai","Delhi","Bangalore","Ahmedabad","Chennai"].map((city,i) => {
                const cnt = donors.filter(d => d.city === city).length;
                return (
                  <div key={city} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                    <span style={{
                      width:22, height:22,
                      background:"linear-gradient(135deg,#dc2626,#991b1b)",
                      borderRadius:"50%", display:"flex", alignItems:"center",
                      justifyContent:"center", fontSize:11, color:"#fff",
                      fontWeight:700, flexShrink:0,
                    }}>{i+1}</span>
                    <span style={{ flex:1, fontSize:14, color:text }}>{city}</span>
                    <span style={{
                      background:"rgba(220,38,38,0.1)", color:"#dc2626",
                      fontSize:12, padding:"3px 10px", borderRadius:6, fontWeight:700,
                    }}>{cnt} donor{cnt!==1?"s":""}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Donors Table */}
        {tab === "donors" && (
          <div style={{ background:cardBg, border:`1px solid ${bord}`, borderRadius:16, padding:24 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h3 style={{ color:text, fontWeight:700, fontSize:18 }}>All Registered Donors</h3>
              <button onClick={() => showToast("Exporting data...","info")} style={{
                background:"linear-gradient(135deg,#dc2626,#991b1b)", color:"#fff",
                border:"none", borderRadius:8, padding:"8px 16px",
                fontSize:13, fontWeight:600, cursor:"pointer",
              }}>📤 Export</button>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ borderBottom:`1px solid ${bord}` }}>
                    {["Name","Blood","City","Phone","Age","Status","Action"].map(h => (
                      <th key={h} style={{
                        textAlign:"left", padding:"10px 12px",
                        fontSize:12, color:muted, fontWeight:600,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {donors.map(d => (
                    <tr key={d.id} style={{ borderBottom:`1px solid ${bord}` }}>
                      <td style={{ padding:"12px", fontSize:14, color:text, fontWeight:600 }}>{d.name}</td>
                      <td style={{ padding:"12px" }}>
                        <span style={{
                          background:"linear-gradient(135deg,#dc2626,#991b1b)",
                          color:"#fff", fontSize:12, padding:"4px 10px",
                          borderRadius:6, fontWeight:800,
                        }}>{d.bloodGroup}</span>
                      </td>
                      <td style={{ padding:"12px", fontSize:14, color:muted }}>{d.city}</td>
                      <td style={{ padding:"12px", fontSize:14, color:muted }}>{d.phone}</td>
                      <td style={{ padding:"12px", fontSize:14, color:muted }}>{d.age}</td>
                      <td style={{ padding:"12px" }}>
                        <span style={{
                          background: d.availability?"rgba(16,185,129,0.1)":"rgba(107,114,128,0.1)",
                          color: d.availability?"#10b981":"#6b7280",
                          fontSize:12, padding:"4px 10px", borderRadius:20, fontWeight:600,
                        }}>{d.availability?"Active":"Inactive"}</span>
                      </td>
                      <td style={{ padding:"12px" }}>
                        <button onClick={() => {
                          setDonors(prev => prev.map(x => x.id===d.id ? {...x,availability:!x.availability} : x));
                          showToast(`${d.name}'s availability toggled`,"info");
                        }} style={{
                          background:"none", border:`1px solid ${bord}`,
                          borderRadius:6, padding:"5px 10px",
                          fontSize:12, color:muted, cursor:"pointer",
                        }}>Toggle</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Requests Table */}
        {tab === "requests" && (
          <div style={{ background:cardBg, border:`1px solid ${bord}`, borderRadius:16, padding:24 }}>
            <h3 style={{ color:text, fontWeight:700, fontSize:18, marginBottom:20 }}>Emergency Blood Requests</h3>
            {requests.map(req => (
              <div key={req.id} style={{
                background: darkMode?"rgba(255,255,255,0.03)":"#f9fafb",
                border:`1px solid ${bord}`,
                borderLeft:`4px solid ${req.emergencyLevel==="critical"?"#dc2626":"#f97316"}`,
                borderRadius:12, padding:18, marginBottom:14,
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                      <span style={{ fontSize:18, fontWeight:800, color:"#dc2626" }}>{req.bloodGroup}</span>
                      <span style={{ color:text, fontWeight:600, fontSize:14 }}>{req.patientName}</span>
                      <span style={{
                        background:"rgba(220,38,38,0.1)", color:"#dc2626",
                        fontSize:11, padding:"2px 8px", borderRadius:6,
                        fontWeight:700, textTransform:"uppercase",
                      }}>{req.emergencyLevel}</span>
                    </div>
                    <div style={{ fontSize:13, color:muted }}>
                      🏥 {req.hospital} · 📍 {req.location} · {req.createdAt}
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <span style={{
                      background: req.status==="fulfilled"?"rgba(16,185,129,0.1)":"rgba(220,38,38,0.1)",
                      color: req.status==="fulfilled"?"#10b981":"#dc2626",
                      fontSize:12, padding:"4px 12px", borderRadius:20, fontWeight:700,
                    }}>{req.status}</span>
                    {req.status==="pending" && (
                      <button onClick={() => {
                        setRequests(prev => prev.map(r => r.id===req.id ? {...r,status:"fulfilled"} : r));
                        showToast("Marked as fulfilled ✅","success");
                      }} style={{
                        background:"rgba(16,185,129,0.1)", color:"#10b981",
                        border:"1px solid rgba(16,185,129,0.3)", borderRadius:8,
                        padding:"6px 14px", fontSize:12, fontWeight:600, cursor:"pointer",
                      }}>Mark Fulfilled</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Contact Page ───────────────────────────────────────────── */
function ContactPage({ showToast, darkMode }) {
  const [form,    setForm]    = useState({ name:"", email:"", subject:"", message:"" });
  const [sending, setSending] = useState(false);

  const bg     = darkMode ? "#070710" : "#f9fafb";
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "#fff";
  const text   = darkMode ? "#e5e7eb" : "#1f2937";
  const muted  = darkMode ? "#9ca3af" : "#6b7280";
  const bord   = darkMode ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const inpBg  = darkMode ? "rgba(255,255,255,0.06)" : "#f9fafb";

  const inp = {
    width:"100%", padding:"12px 16px", borderRadius:10, fontSize:14,
    background:inpBg, border:`1px solid ${bord}`,
    color:text, outline:"none", boxSizing:"border-box",
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!form.name||!form.email||!form.message) {
      showToast("Please fill required fields","error"); return;
    }
    setSending(true);
    await new Promise(r => setTimeout(r,1200));
    setSending(false);
    setForm({ name:"", email:"", subject:"", message:"" });
    showToast("Message sent! We'll respond within 24 hours 📧","success");
  };

  return (
    <div style={{ background:bg, minHeight:"100vh", padding:"60px 24px" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:38, color:text, marginBottom:10 }}>Get In Touch</h1>
          <p style={{ color:muted, fontSize:16 }}>Have questions? We're here to help you save lives.</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:32 }}>
          {/* Info Cards */}
          <div>
            {[
              { icon:"📞", title:"Helpline",  info:"+91 1800-XXX-XXXX",    sub:"24/7 Emergency Support" },
              { icon:"📧", title:"Email",     info:"support@lifeflow.in",  sub:"Response within 24 hours" },
              { icon:"📍", title:"Office",    info:"Mumbai, Maharashtra",  sub:"India 400001" },
              { icon:"⏰", title:"Hours",     info:"Mon – Sat",             sub:"9 AM – 6 PM IST" },
            ].map((it,i) => (
              <div key={i} style={{
                background:cardBg, border:`1px solid ${bord}`,
                borderRadius:16, padding:20, marginBottom:14,
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{
                    width:44, height:44,
                    background:"rgba(220,38,38,0.1)",
                    borderRadius:12, display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:22,
                  }}>{it.icon}</div>
                  <div>
                    <div style={{ fontSize:12, color:muted, marginBottom:2 }}>{it.title}</div>
                    <div style={{ fontSize:15, color:text, fontWeight:700 }}>{it.info}</div>
                    <div style={{ fontSize:12, color:muted }}>{it.sub}</div>
                  </div>
                </div>
              </div>
            ))}

            <div style={{
              background:"linear-gradient(135deg,#dc2626,#7f1d1d)",
              borderRadius:16, padding:24,
            }}>
              <div style={{ fontSize:24, marginBottom:10 }}>🚨</div>
              <h3 style={{ color:"#fff", fontSize:16, fontWeight:700, marginBottom:6 }}>Emergency?</h3>
              <p style={{ color:"rgba(255,255,255,0.8)", fontSize:13, lineHeight:1.6 }}>
                For life-threatening emergencies, call 112 or use our emergency request feature.
              </p>
            </div>
          </div>

          {/* Form */}
          <div style={{ background:cardBg, border:`1px solid ${bord}`, borderRadius:20, padding:36 }}>
            <h3 style={{ color:text, fontWeight:700, fontSize:20, marginBottom:24 }}>Send us a Message</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
                <div>
                  <label style={{ fontSize:13, fontWeight:600, color:muted, marginBottom:6, display:"block" }}>Your Name *</label>
                  <input style={inp} value={form.name}
                    onChange={e => setForm({...form,name:e.target.value})} placeholder="Arjun Sharma"/>
                </div>
                <div>
                  <label style={{ fontSize:13, fontWeight:600, color:muted, marginBottom:6, display:"block" }}>Email Address *</label>
                  <input style={inp} type="email" value={form.email}
                    onChange={e => setForm({...form,email:e.target.value})} placeholder="arjun@example.com"/>
                </div>
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:13, fontWeight:600, color:muted, marginBottom:6, display:"block" }}>Subject</label>
                <input style={inp} value={form.subject}
                  onChange={e => setForm({...form,subject:e.target.value})} placeholder="How can we help?"/>
              </div>
              <div style={{ marginBottom:28 }}>
                <label style={{ fontSize:13, fontWeight:600, color:muted, marginBottom:6, display:"block" }}>Message *</label>
                <textarea style={{ ...inp, minHeight:140, resize:"vertical", fontFamily:"inherit" }}
                  value={form.message} onChange={e => setForm({...form,message:e.target.value})}
                  placeholder="Tell us how we can help..."/>
              </div>
              <button type="submit" disabled={sending} style={{
                background:"linear-gradient(135deg,#dc2626,#991b1b)", color:"#fff",
                border:"none", borderRadius:12, padding:"16px 32px",
                fontSize:15, fontWeight:700,
                cursor: sending?"not-allowed":"pointer", opacity: sending?0.8:1,
              }}>
                {sending ? "Sending..." : "📧 Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── App Root ───────────────────────────────────────────────── */
export default function App() {
  const [page,     setPage]     = useState("home");
  const [darkMode, setDarkMode] = useState(true);
  const [user,     setUser]     = useState(null);
  const [toast,    setToast]    = useState(null);

  const showToast = (message, type = "info") =>
    setToast({ message, type, id: Date.now() });

  const login  = (userData) => setUser(userData);
  const logout = () => { setUser(null); setPage("home"); };

  const props = { setPage, showToast, darkMode };

  const renderPage = () => {
    switch (page) {
      case "home":      return <HomePage      {...props}/>;
      case "register":  return <RegisterPage  {...props}/>;
      case "login":     return <LoginPage     {...props}/>;
      case "dashboard": return user  ? <Dashboard  {...props}/> : <LoginPage  {...props}/>;
      case "search":    return <SearchPage    {...props}/>;
      case "emergency": return <EmergencyPage {...props}/>;
      case "admin":     return user?.role==="admin" ? <AdminPanel {...props}/> : <LoginPage {...props}/>;
      case "contact":   return <ContactPage   {...props}/>;
      default:          return <HomePage      {...props}/>;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <div style={{ fontFamily:"'Inter',sans-serif", background: darkMode?"#070710":"#fff", minHeight:"100vh" }}>
        <style>{`
          * { margin:0; padding:0; box-sizing:border-box; }
          @keyframes slideIn {
            from { opacity:0; transform:translateX(20px); }
            to   { opacity:1; transform:translateX(0); }
          }
          input:focus, select:focus, textarea:focus {
            border-color: rgba(220,38,38,0.5) !important;
            box-shadow: 0 0 0 3px rgba(220,38,38,0.1);
          }
          ::-webkit-scrollbar { width:6px; }
          ::-webkit-scrollbar-thumb {
            background: rgba(220,38,38,0.3);
            border-radius:3px;
          }
          select option { background:#1a1a2e; color:#e5e7eb; }
      @media (max-width: 600px) {
  html, body, #root {
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: hidden !important;
  }

  /* Navbar */
  nav {
    padding: 0 8px !important;
  }

  nav > div {
    height: auto !important;
    min-height: 64px !important;
    flex-wrap: wrap !important;
    justify-content: center !important;
    gap: 6px !important;
  }

  /* Hero and other 2-column sections */
  div[style*="grid-template-columns: 1fr 1fr"] {
    grid-template-columns: 1fr !important;
  }

/* Contact page */
div[style*="grid-template-columns: 1fr 2fr"] {
  grid-template-columns: 1fr !important;
}
  /* Blood groups */
  div[style*="repeat(8,1fr)"] {
    grid-template-columns: repeat(2, 1fr) !important;
  }

  /* 3-column sections */
  div[style*="repeat(3,1fr)"] {
    grid-template-columns: 1fr !important;
  }

  /* Footer */
  div[style*="2fr 1fr 1fr 1fr"] {
    grid-template-columns: 1fr !important;
  }

  /* Hero heading */
  h1 {
    font-size: 38px !important;
  }

  h2 {
    font-size: 28px !important;
  }

  /* Hero buttons */
  div[style*="display: flex"] {
    max-width: 100% !important;
  }

  button {
    max-width: 100% !important;
  }
}   
  }
        `}</style>

        
        <Navbar page={page} setPage={setPage} darkMode={darkMode} setDarkMode={setDarkMode}/>
        {renderPage()}
        <Footer darkMode={darkMode}/>

        {toast && (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </AuthContext.Provider>
  );
}
