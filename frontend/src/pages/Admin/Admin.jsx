import { useEffect, useState, useRef, useContext } from "react";
import {
  Mic2, Disc3, Music, X, Upload,
  CheckCircle2, AlertCircle, Loader2, Plus, Play
} from "lucide-react";
import { PlayerContext } from "../../context/PlayerContext";
import {
  getAllArtists, createArtist,
  getAllAlbums, createAlbum,
  getAllSongs, createSong,
} from "../../services/adminService";

const TABS = [
  { key: "artists", label: "Nghệ sĩ", Icon: Mic2  },
  { key: "albums",  label: "Album",    Icon: Disc3 },
  { key: "songs",   label: "Bài hát", Icon: Music },
];

// ─── Toast ────────────────────────────────────────────────
const Toast = ({ msg, type, onClose }) => (
  <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3
    px-5 py-3 rounded-full shadow-xl text-sm font-medium
    ${type === "ok" ? "bg-[#1db954] text-black" : "bg-red-500 text-white"}`}>
    {type === "ok"
      ? <CheckCircle2 className="w-4 h-4 shrink-0" />
      : <AlertCircle  className="w-4 h-4 shrink-0" />}
    {msg}
    <button onClick={onClose}><X className="w-3.5 h-3.5" /></button>
  </div>
);

// ─── FileField ────────────────────────────────────────────
const FileField = ({ label, accept, value, onChange, required }) => {
  const ref = useRef();
  return (
    <div>
      <label className="block text-xs text-[#a7a7a7] mb-1.5">
        {label}{required && <span className="text-[#1db954] ml-0.5">*</span>}
      </label>
      <div
        onClick={() => ref.current.click()}
        className="flex items-center gap-3 bg-[#1a1a1a] border border-[#333]
          rounded-lg px-4 py-2.5 cursor-pointer hover:border-[#555] transition"
      >
        <Upload className="w-4 h-4 text-[#a7a7a7] shrink-0" />
        <span className="text-sm truncate text-[#a7a7a7]">
          {value ? value.name : "Chọn file…"}
        </span>
      </div>
      <input ref={ref} type="file" accept={accept} className="hidden"
        onChange={e => onChange(e.target.files[0] || null)} />
    </div>
  );
};

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-xs text-[#a7a7a7] mb-1.5">
      {label}{required && <span className="text-[#1db954] ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inp = `w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5
  text-sm text-white placeholder:text-[#555]
  focus:outline-none focus:border-[#1db954] transition`;

// ─── Image preview ────────────────────────────────────────
const ImgPreview = ({ file }) => {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    if (!file) { setSrc(null); return; }
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  if (!src) return null;
  return (
    <div className="flex justify-center">
      <img src={src} alt="preview"
        className="w-28 h-28 rounded-xl object-cover border border-[#333] shadow-lg" />
    </div>
  );
};

// ─── Audio preview ────────────────────────────────────────
const AudioPreview = ({ file }) => {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    if (!file) { setSrc(null); return; }
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  if (!src) return null;
  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-3">
      <p className="text-xs text-[#a7a7a7] mb-2">Nghe thử trước khi tải lên</p>
      <audio controls src={src} className="w-full h-8" />
    </div>
  );
};

// ─── Modal ────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 w-full max-w-lg max-h-[90vh] bg-[#0d0d0d]
        border border-[#2a2a2a] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222] shrink-0">
          <h2 className="font-bold text-lg">{title}</h2>
          <button onClick={onClose}
            className="text-[#a7a7a7] hover:text-white transition p-1 rounded-full hover:bg-[#222]">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-auto px-6 py-5 flex flex-col gap-4">
          {children}
        </div>
      </div>
    </div>
  );
};

// ─── Forms ────────────────────────────────────────────────
const ArtistForm = ({ onSuccess }) => {
  const [f, setF] = useState({ name: "", bio: "", avatarFile: null });
  const [loading, setLoading] = useState(false);
  const set = k => v => setF(p => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!f.name.trim()) return;
    setLoading(true);
    try {
      await createArtist(f);
      onSuccess("Đã thêm nghệ sĩ thành công!");
      setF({ name: "", bio: "", avatarFile: null });
    } catch { onSuccess("Có lỗi xảy ra, thử lại nhé.", "err"); }
    finally { setLoading(false); }
  };

  return (
    <>
      <ImgPreview file={f.avatarFile} />
      <Field label="Tên nghệ sĩ" required>
        <input className={inp} placeholder="VD: Sơn Tùng M-TP"
          value={f.name} onChange={e => set("name")(e.target.value)} />
      </Field>
      <Field label="Tiểu sử">
        <textarea className={inp + " resize-none h-24"} placeholder="Mô tả ngắn về nghệ sĩ…"
          value={f.bio} onChange={e => set("bio")(e.target.value)} />
      </Field>
      <FileField label="Ảnh đại diện" accept="image/*"
        value={f.avatarFile} onChange={set("avatarFile")} />
      <button onClick={submit} disabled={loading || !f.name.trim()}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-full
          bg-[#1db954] text-black font-bold text-sm mt-1
          hover:bg-[#1ed760] disabled:opacity-40 disabled:cursor-not-allowed transition">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Thêm nghệ sĩ"}
      </button>
    </>
  );
};

const AlbumForm = ({ artists, onSuccess }) => {
  const [f, setF] = useState({ title: "", releaseDate: "", artistId: "", coverFile: null });
  const [loading, setLoading] = useState(false);
  const set = k => v => setF(p => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!f.title.trim() || !f.artistId) return;
    setLoading(true);
    try {
      await createAlbum(f);
      onSuccess("Đã thêm album thành công!");
      setF({ title: "", releaseDate: "", artistId: "", coverFile: null });
    } catch { onSuccess("Có lỗi xảy ra, thử lại nhé.", "err"); }
    finally { setLoading(false); }
  };

  return (
    <>
      <ImgPreview file={f.coverFile} />
      <Field label="Tên album" required>
        <input className={inp} placeholder="VD: Sky Tour"
          value={f.title} onChange={e => set("title")(e.target.value)} />
      </Field>
      <Field label="Nghệ sĩ" required>
        <select className={inp + " cursor-pointer"}
          value={f.artistId} onChange={e => set("artistId")(e.target.value)}>
          <option value="">-- Chọn nghệ sĩ --</option>
          {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </Field>
      <Field label="Ngày phát hành">
        <input type="date" className={inp}
          value={f.releaseDate} onChange={e => set("releaseDate")(e.target.value)} />
      </Field>
      <FileField label="Ảnh bìa album" accept="image/*"
        value={f.coverFile} onChange={set("coverFile")} />
      <button onClick={submit} disabled={loading || !f.title.trim() || !f.artistId}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-full
          bg-[#1db954] text-black font-bold text-sm mt-1
          hover:bg-[#1ed760] disabled:opacity-40 disabled:cursor-not-allowed transition">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Thêm album"}
      </button>
    </>
  );
};

const SongForm = ({ artists, albums, onSuccess }) => {
  const [f, setF] = useState({
    title: "", genre: "", duration: "", artistId: "", albumId: "",
    audioFile: null, imageFile: null,
  });
  const [loading, setLoading] = useState(false);
  const set = k => v => setF(p => ({ ...p, [k]: v }));

  const filteredAlbums = f.artistId
    ? albums.filter(al => String(al.artist?.id) === String(f.artistId))
    : albums;

  const submit = async () => {
    if (!f.title.trim() || !f.artistId || !f.audioFile || !f.duration) return;
    setLoading(true);
    try {
      await createSong({ ...f, duration: parseInt(f.duration) });
      onSuccess("Đã thêm bài hát thành công!");
      setF({ title: "", genre: "", duration: "", artistId: "", albumId: "", audioFile: null, imageFile: null });
    } catch { onSuccess("Có lỗi xảy ra, thử lại nhé.", "err"); }
    finally { setLoading(false); }
  };

  return (
    <>
      <ImgPreview file={f.imageFile} />
      <Field label="Tên bài hát" required>
        <input className={inp} placeholder="VD: Chúng Ta Của Hiện Tại"
          value={f.title} onChange={e => set("title")(e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Thể loại" required>
          <input className={inp} placeholder="VD: Pop"
            value={f.genre} onChange={e => set("genre")(e.target.value)} />
        </Field>
        <Field label="Thời lượng (giây)" required>
          <input type="number" min="1" className={inp} placeholder="VD: 245"
            value={f.duration} onChange={e => set("duration")(e.target.value)} />
        </Field>
      </div>
      <Field label="Nghệ sĩ" required>
        <select className={inp + " cursor-pointer"}
          value={f.artistId}
          onChange={e => { set("artistId")(e.target.value); set("albumId")(""); }}>
          <option value="">-- Chọn nghệ sĩ --</option>
          {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </Field>
      <Field label="Album (để trống nếu là single)">
        <select className={inp + " cursor-pointer"}
          value={f.albumId} onChange={e => set("albumId")(e.target.value)}>
          <option value="">-- Không thuộc album nào --</option>
          {filteredAlbums.map(al => <option key={al.id} value={al.id}>{al.title}</option>)}
        </select>
      </Field>
      <FileField label="File âm thanh" accept="audio/*"
        value={f.audioFile} onChange={set("audioFile")} required />
      <AudioPreview file={f.audioFile} />
      <FileField label="Ảnh bìa bài hát" accept="image/*"
        value={f.imageFile} onChange={set("imageFile")} />
      <button onClick={submit}
        disabled={loading || !f.title.trim() || !f.artistId || !f.audioFile || !f.duration}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-full
          bg-[#1db954] text-black font-bold text-sm mt-1
          hover:bg-[#1ed760] disabled:opacity-40 disabled:cursor-not-allowed transition">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Thêm bài hát"}
      </button>
    </>
  );
};

// ─── Tables ───────────────────────────────────────────────
const Ava = ({ src, round }) => (
  src
    ? <img src={src} alt="" className={`w-9 h-9 object-cover shrink-0 ${round ? "rounded-full" : "rounded"}`} />
    : <div className={`w-9 h-9 bg-[#2a2a2a] flex items-center justify-center text-base shrink-0 ${round ? "rounded-full" : "rounded"}`}>
        {round ? "🎤" : "🎵"}
      </div>
);

const th = "text-left py-3 px-4 text-xs font-semibold text-[#a7a7a7] uppercase tracking-wider";
const td = "py-3 px-4 text-sm";

const ArtistsTable = ({ data }) => (
  <table className="w-full">
    <thead><tr className="border-b border-[#1e1e1e]">
      <th className={th + " w-10"}>#</th>
      <th className={th}>Nghệ sĩ</th>
    </tr></thead>
    <tbody>
      {data.map((a, i) => (
        <tr key={a.id} className="border-b border-[#181818] hover:bg-[#1a1a1a] transition">
          <td className={td + " text-[#a7a7a7]"}>{i + 1}</td>
          <td className={td}>
            <div className="flex items-center gap-3">
              <Ava src={a.avatarUrl} round />
              <span className="font-medium">{a.name}</span>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const AlbumsTable = ({ data }) => (
  <table className="w-full">
    <thead><tr className="border-b border-[#1e1e1e]">
      <th className={th + " w-10"}>#</th>
      <th className={th}>Album</th>
      <th className={th}>Nghệ sĩ</th>
      <th className={th}>Phát hành</th>
    </tr></thead>
    <tbody>
      {data.map((al, i) => (
        <tr key={al.id} className="border-b border-[#181818] hover:bg-[#1a1a1a] transition">
          <td className={td + " text-[#a7a7a7]"}>{i + 1}</td>
          <td className={td}>
            <div className="flex items-center gap-3">
              <Ava src={al.coverUrl} />
              <span className="font-medium">{al.title}</span>
            </div>
          </td>
          <td className={td + " text-[#a7a7a7]"}>{al.artist?.name || "—"}</td>
          <td className={td + " text-[#a7a7a7]"}>{al.releaseDate || "—"}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

// SongsTable nhận thêm playWithId để click hàng → phát nhạc
const SongsTable = ({ data, playWithId }) => (
  <table className="w-full">
    <thead><tr className="border-b border-[#1e1e1e]">
      <th className={th + " w-10"}>#</th>
      <th className={th}>Bài hát</th>
      <th className={th}>Nghệ sĩ</th>
      <th className={th}>Thể loại</th>
      <th className={th}>Album</th>
      <th className={th + " w-12"}></th>
    </tr></thead>
    <tbody>
      {data.map((s, i) => (
        <tr key={s.id} className="border-b border-[#181818] hover:bg-[#1a1a1a] transition group">
          <td className={td + " text-[#a7a7a7]"}>{i + 1}</td>
          <td className={td}>
            <div className="flex items-center gap-3">
              <Ava src={s.imageUrl} />
              <span className="font-medium">{s.title}</span>
            </div>
          </td>
          <td className={td + " text-[#a7a7a7]"}>{s.artist?.name || "—"}</td>
          <td className={td + " text-[#a7a7a7]"}>{s.genre || "—"}</td>
          <td className={td + " text-[#a7a7a7]"}>{s.albumId ? `#${s.albumId}` : "Single"}</td>
          <td className={td}>
            <button
              onClick={() => playWithId(s.id)}
              className="opacity-0 group-hover:opacity-100 transition
                w-8 h-8 rounded-full bg-[#1db954] flex items-center justify-center
                hover:scale-110 hover:bg-[#1ed760]">
              <Play className="w-3.5 h-3.5 text-black fill-black" />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const Empty = ({ label, sub }) => (
  <div className="py-16 flex flex-col items-center gap-2 text-center">
    <p className="font-semibold">{label}</p>
    <p className="text-[#a7a7a7] text-sm">{sub}</p>
  </div>
);

// ─── Main ─────────────────────────────────────────────────
const Admin = () => {
  const { playWithId } = useContext(PlayerContext);

  const [tab, setTab]             = useState("artists");
  const [artists, setArtists]     = useState([]);
  const [albums,  setAlbums]      = useState([]);
  const [songs,   setSongs]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast,   setToast]       = useState(null);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [a, al, s] = await Promise.all([getAllArtists(), getAllAlbums(), getAllSongs()]);
      setArtists(a); setAlbums(al); setSongs(s);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadAll(); }, []);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
    if (type === "ok") { setModalOpen(false); loadAll(); }
  };

  const counts = { artists: artists.length, albums: albums.length, songs: songs.length };
  const modalTitle = tab === "artists" ? "Thêm nghệ sĩ mới"
    : tab === "albums" ? "Thêm album mới" : "Thêm bài hát mới";

  return (
    <div className="min-h-full pb-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs text-[#1db954] font-semibold uppercase tracking-widest mb-1">
          Trang quản trị
        </p>
        <h1 className="text-3xl font-bold">Quản lý nội dung</h1>
        <p className="text-[#a7a7a7] text-sm mt-1">
          Thêm nghệ sĩ, album và bài hát vào hệ thống
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {TABS.map(({ key, label, Icon }) => (
          <div key={key}
            className="bg-[#1a1a1a] rounded-xl p-5 flex items-center gap-4 border border-[#252525]">
            <div className="w-10 h-10 rounded-lg bg-[#1db954]/10 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-[#1db954]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{loading ? "…" : counts[key]}</p>
              <p className="text-xs text-[#a7a7a7]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tab bar + nút thêm */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {TABS.map(({ key, label, Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition
                ${tab === key
                  ? "bg-white text-black"
                  : "bg-[#1a1a1a] text-[#a7a7a7] hover:text-white hover:bg-[#242424]"}`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1db954]
            text-black text-sm font-bold hover:bg-[#1ed760] transition">
          <Plus className="w-4 h-4" /> Thêm mới
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#121212] rounded-xl border border-[#1e1e1e] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-[#a7a7a7]">
            <Loader2 className="w-5 h-5 animate-spin" /> Đang tải dữ liệu…
          </div>
        ) : (
          <>
            {tab === "artists" && (artists.length === 0
              ? <Empty label="Chưa có nghệ sĩ nào" sub='Nhấn "Thêm mới" để bắt đầu' />
              : <ArtistsTable data={artists} />)}
            {tab === "albums" && (albums.length === 0
              ? <Empty label="Chưa có album nào" sub="Hãy thêm nghệ sĩ trước, rồi tạo album" />
              : <AlbumsTable data={albums} />)}
            {tab === "songs" && (songs.length === 0
              ? <Empty label="Chưa có bài hát nào" sub="Hãy tạo nghệ sĩ và album trước" />
              : <SongsTable data={songs} playWithId={playWithId} />)}
          </>
        )}
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle}>
        {tab === "artists" && <ArtistForm onSuccess={showToast} />}
        {tab === "albums"  && <AlbumForm  artists={artists} onSuccess={showToast} />}
        {tab === "songs"   && <SongForm   artists={artists} albums={albums} onSuccess={showToast} />}
      </Modal>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Admin;