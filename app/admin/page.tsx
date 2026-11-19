"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, LogIn, X, Save, AlertCircle, CheckCircle2, BookOpen } from "lucide-react";

interface Question {
  id?: string;
  fan: string;
  mavzu: string;
  savol: string;
  variantlar: string[];
  javob: number;
  izoh: string;
  sinf: number;
}

const EMPTY_Q: Omit<Question, "id"> = {
  fan: "O'zbekiston tarixi",
  mavzu: "",
  savol: "",
  variantlar: ["", "", "", ""],
  javob: 0,
  izoh: "",
  sinf: 8,
};

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modal, setModal] = useState<{ open: boolean; q: Omit<Question, "id"> & { id?: string } }>({
    open: false,
    q: { ...EMPTY_Q },
  });
  const [deleting, setDeleting] = useState<string | null>(null);

  // Load saved token
  useEffect(() => {
    const saved = localStorage.getItem("admin_token") || "";
    setToken(saved);
  }, []);

  const fetchQuestions = useCallback(async (tok: string) => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/questions", {
      headers: { "x-admin-token": tok },
    });
    if (res.status === 401) { setError("Noto'g'ri token!"); setLoading(false); return; }
    const data = await res.json();
    setQuestions(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  const handleLogin = () => {
    localStorage.setItem("admin_token", tokenInput);
    setToken(tokenInput);
    fetchQuestions(tokenInput);
  };

  useEffect(() => {
    if (token) fetchQuestions(token);
  }, [token, fetchQuestions]);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  const saveQuestion = async () => {
    const q = modal.q;
    setLoading(true);
    const method = q.id ? "PUT" : "POST";
    const res = await fetch("/api/admin/questions", {
      method,
      headers: { "content-type": "application/json", "x-admin-token": token },
      body: JSON.stringify(q),
    });
    setLoading(false);
    if (!res.ok) { setError("Saqlashda xato!"); return; }
    setModal({ open: false, q: { ...EMPTY_Q } });
    showSuccess(q.id ? "Savol yangilandi ✓" : "Yangi savol qo'shildi ✓");
    fetchQuestions(token);
  };

  const deleteQuestion = async (id: string) => {
    setDeleting(id);
    const res = await fetch("/api/admin/questions", {
      method: "DELETE",
      headers: { "content-type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ id }),
    });
    setDeleting(null);
    if (!res.ok) { setError("O'chirishda xato!"); return; }
    showSuccess("Savol o'chirildi ✓");
    fetchQuestions(token);
  };

  const openEdit = (q: Question) =>
    setModal({ open: true, q: { ...q, variantlar: [...q.variantlar] } });

  const openAdd = () =>
    setModal({ open: true, q: { ...EMPTY_Q, variantlar: ["", "", "", ""] } });

  // ----- LOGIN -----
  if (!token) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass"
          style={{ padding: "40px", width: "100%", maxWidth: "420px", borderRadius: "24px", textAlign: "center" }}
        >
          <div style={{ width: "56px", height: "56px", background: "linear-gradient(135deg,#f5c842,#ff9f43)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <LogIn size={26} color="#0a0f1e" />
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "8px" }}>Admin Panel</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "28px", fontSize: "0.9rem" }}>
            Kirish uchun admin tokenni kiriting
          </p>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Admin token..."
            style={{
              width: "100%", padding: "14px 16px", borderRadius: "12px",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              color: "var(--text-primary)", fontSize: "1rem", fontFamily: "var(--font-outfit)",
              marginBottom: "14px", outline: "none",
            }}
          />
          <button className="btn-primary" onClick={handleLogin} style={{ width: "100%" }}>
            Kirish
          </button>
        </motion.div>
      </main>
    );
  }

  // ----- MAIN ADMIN -----
  const fanlar = [...new Set(questions.map((q) => q.fan))];
  const grouped = fanlar.map((fan) => ({
    fan,
    mavzular: [...new Set(questions.filter((q) => q.fan === fan).map((q) => q.mavzu))].map((mavzu) => ({
      mavzu,
      items: questions.filter((q) => q.fan === fan && q.mavzu === mavzu),
    })),
  }));

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 16px 80px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: "1.8rem", fontWeight: 800 }}>Admin Panel</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Jami {questions.length} ta savol
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => { localStorage.removeItem("admin_token"); setToken(""); setQuestions([]); }}
            className="btn-ghost"
          >
            Chiqish
          </button>
          <button className="btn-primary" onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Plus size={18} /> Savol qo'shish
          </button>
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "12px 16px", display: "flex", gap: "10px", alignItems: "center", marginBottom: "16px", color: "#ef4444" }}>
            <AlertCircle size={18} /> {error}
            <button onClick={() => setError("")} style={{ marginLeft: "auto", background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}><X size={16} /></button>
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "12px 16px", display: "flex", gap: "10px", alignItems: "center", marginBottom: "16px", color: "#22c55e" }}>
            <CheckCircle2 size={18} /> {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Questions grouped */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "var(--text-secondary)" }}>Yuklanmoqda...</div>
      ) : (
        grouped.map((group) => (
          <div key={group.fan} style={{ marginBottom: "36px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <BookOpen size={18} style={{ color: "var(--accent-gold)" }} />
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--accent-gold)" }}>{group.fan}</h2>
            </div>
            {group.mavzular.map((m) => (
              <div key={m.mavzu} style={{ marginBottom: "20px" }}>
                <h3 style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: 600, marginBottom: "10px", paddingLeft: "8px", borderLeft: "2px solid rgba(79,142,247,0.4)" }}>
                  {m.mavzu} <span style={{ color: "rgba(255,255,255,0.3)" }}>({m.items.length} ta)</span>
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {m.items.map((q) => (
                    <motion.div
                      key={q.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="glass"
                      style={{ padding: "14px 18px", borderRadius: "14px", display: "flex", alignItems: "center", gap: "12px" }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 500, fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{q.savol}</p>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.78rem", marginTop: "2px" }}>
                          To'g'ri: {q.variantlar[q.javob]}
                        </p>
                      </div>
                      <button
                        onClick={() => openEdit(q)}
                        style={{ background: "rgba(79,142,247,0.12)", border: "1px solid rgba(79,142,247,0.25)", borderRadius: "8px", padding: "8px", cursor: "pointer", color: "#4f8ef7" }}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => q.id && deleteQuestion(q.id)}
                        disabled={deleting === q.id}
                        style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "8px", padding: "8px", cursor: "pointer", color: "#ef4444" }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
            onClick={() => setModal({ open: false, q: { ...EMPTY_Q } })}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass"
              style={{ width: "100%", maxWidth: "580px", maxHeight: "90vh", overflow: "auto", padding: "28px", borderRadius: "24px" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                  {modal.q.id ? "Savolni tahrirlash" : "Yangi savol qo'shish"}
                </h2>
                <button onClick={() => setModal({ open: false, q: { ...EMPTY_Q } })} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {/* Fan */}
                <div>
                  <label style={labelStyle}>Fan</label>
                  <select
                    value={modal.q.fan}
                    onChange={(e) => setModal((m) => ({ ...m, q: { ...m.q, fan: e.target.value } }))}
                    style={inputStyle}
                  >
                    <option value="O'zbekiston tarixi">O'zbekiston tarixi</option>
                    <option value="Jahon tarixi">Jahon tarixi</option>
                  </select>
                </div>
                {/* Mavzu */}
                <div>
                  <label style={labelStyle}>Mavzu</label>
                  <input
                    value={modal.q.mavzu}
                    onChange={(e) => setModal((m) => ({ ...m, q: { ...m.q, mavzu: e.target.value } }))}
                    placeholder="Mavzu nomi..."
                    style={inputStyle}
                  />
                </div>
                {/* Savol */}
                <div>
                  <label style={labelStyle}>Savol matni</label>
                  <textarea
                    value={modal.q.savol}
                    onChange={(e) => setModal((m) => ({ ...m, q: { ...m.q, savol: e.target.value } }))}
                    placeholder="Savol..."
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>
                {/* Variantlar */}
                <div>
                  <label style={labelStyle}>Variantlar (A, B, C, D)</label>
                  {modal.q.variantlar.map((v, i) => (
                    <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{
                        width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 700, fontSize: "0.85rem", flexShrink: 0,
                        background: modal.q.javob === i ? "linear-gradient(135deg,#f5c842,#ff9f43)" : "rgba(255,255,255,0.08)",
                        color: modal.q.javob === i ? "#0a0f1e" : "var(--text-secondary)",
                      }}>
                        {["A", "B", "C", "D"][i]}
                      </span>
                      <input
                        value={v}
                        onChange={(e) => {
                          const vs = [...modal.q.variantlar];
                          vs[i] = e.target.value;
                          setModal((m) => ({ ...m, q: { ...m.q, variantlar: vs } }));
                        }}
                        placeholder={`${["A", "B", "C", "D"][i]} variant`}
                        style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
                      />
                      <button
                        onClick={() => setModal((m) => ({ ...m, q: { ...m.q, javob: i } }))}
                        style={{
                          padding: "8px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, fontFamily: "var(--font-outfit)",
                          background: modal.q.javob === i ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)",
                          border: `1px solid ${modal.q.javob === i ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.1)"}`,
                          color: modal.q.javob === i ? "#22c55e" : "var(--text-secondary)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {modal.q.javob === i ? "✓ To'g'ri" : "To'g'ri"}
                      </button>
                    </div>
                  ))}
                </div>
                {/* Izoh */}
                <div>
                  <label style={labelStyle}>Izoh (ixtiyoriy)</label>
                  <input
                    value={modal.q.izoh}
                    onChange={(e) => setModal((m) => ({ ...m, q: { ...m.q, izoh: e.target.value } }))}
                    placeholder="Qo'shimcha izoh..."
                    style={inputStyle}
                  />
                </div>
                {/* Save */}
                <button
                  className="btn-primary"
                  onClick={saveQuestion}
                  disabled={loading}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "8px" }}
                >
                  <Save size={18} /> {loading ? "Saqlanmoqda..." : "Saqlash"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "var(--text-primary)",
  fontSize: "0.95rem",
  fontFamily: "var(--font-outfit), sans-serif",
  outline: "none",
  marginBottom: "0",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "var(--text-secondary)",
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};
