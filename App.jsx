import React, { useState, useMemo } from "react";
import {
  Search,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Star,
  X,
} from "lucide-react";

/* ---------------------------------------------------------
   Sample catalogue — original, invented titles & synopses.
--------------------------------------------------------- */

const GENRES = [
  "اکشن",
  "فانتزی",
  "عاشقانه",
  "ترسناک",
  "علمی-تخیلی",
  "کمدی",
  "درام",
  "رازآلود",
  "زندگی روزمره",
  "ورزشی",
];

function makeChapters(count, startDaysAgo) {
  const list = [];
  for (let i = count; i >= 1; i--) {
    const daysAgo = startDaysAgo + (count - i) * 6;
    list.push({ num: i, daysAgo });
  }
  return list;
}

const RAW_SERIES = [
  {
    id: "moonlit-fangs",
    title: "Moonlit Fangs",
    author: "R. Amano",
    genres: ["اکشن", "فانتزی", "ترسناک"],
    status: "در حال انتشار",
    rating: 4.8,
    hue: 262,
    synopsis:
      "روستایی که زیر یه نفرین قدیمی گیر افتاده، یه شکارچی دوره‌گرد استخدام می‌کنه؛ غافل از اینکه خون خودِ شکارچی هم آلوده‌ست.",
    chapters: makeChapters(64, 1),
  },
  {
    id: "paper-constellations",
    title: "Paper Constellations",
    author: "Y. Kessler",
    genres: ["عاشقانه", "درام"],
    status: "در حال انتشار",
    rating: 4.6,
    hue: 328,
    synopsis:
      "دو رئیس رقیبِ باشگاه اوریگامی شروع می‌کنن به رد و بدل کردن یادداشت‌های ناشناس، بدون اینکه بدونن یک سال تمام با هم روبروی هم بحث می‌کردن.",
    chapters: makeChapters(31, 2),
  },
  {
    id: "last-cartographer",
    title: "The Last Cartographer",
    author: "D. Osei",
    genres: ["فانتزی", "رازآلود"],
    status: "در حال انتشار",
    rating: 4.9,
    hue: 178,
    synopsis:
      "یک قرن پیش دنیا از تغییر شکل دادن دست کشید. آخرین نقشه‌کشی که دلیلش رو یادشه، داره کاغذش تموم می‌شه.",
    chapters: makeChapters(88, 0),
  },
  {
    id: "static-hearts",
    title: "Static Hearts",
    author: "L. Marchetti",
    genres: ["علمی-تخیلی", "عاشقانه"],
    status: "تکمیل شده",
    rating: 4.5,
    hue: 205,
    synopsis:
      "آندرویدی که ساخته شده تا صاحب‌هاش رو فراموش کنه، عاشق تکنسینی می‌شه که برای نهمین بار اومده حافظه‌شو پاک کنه.",
    chapters: makeChapters(42, 40),
  },
  {
    id: "ninth-hour-diner",
    title: "Ninth Hour Diner",
    author: "T. Basara",
    genres: ["زندگی روزمره", "کمدی"],
    status: "در حال انتشار",
    rating: 4.4,
    hue: 38,
    synopsis:
      "رستورانی که فقط بین نیمه‌شب تا یک بامداد بازه، دقیقاً همون مشتری‌هایی رو جذب می‌کنه که باید.",
    chapters: makeChapters(19, 3),
  },
  {
    id: "crownless",
    title: "Crownless",
    author: "H. Voss",
    genres: ["اکشن", "درام"],
    status: "در حال انتشار",
    rating: 4.7,
    hue: 12,
    synopsis:
      "وارث تاج و تخت مرگ خودشو جعل می‌کنه تا زیر نظر همون شورشی‌هایی آموزش ببینه که قسم خوردن نسلشو ریشه‌کن کنن.",
    chapters: makeChapters(55, 1),
  },
  {
    id: "glass-orchard",
    title: "Glass Orchard",
    author: "N. Ferreira",
    genres: ["رازآلود", "درام"],
    status: "در حال انتشار",
    rating: 4.3,
    hue: 150,
    synopsis:
      "هر درخت توی این باغ از یه راز دفن‌شده روییده. باغبون تازه باید یاد بگیره این حرف چقدر واقعیه.",
    chapters: makeChapters(24, 5),
  },
  {
    id: "wolftide",
    title: "Wolftide",
    author: "K. Sundberg",
    genres: ["فانتزی", "اکشن"],
    status: "در حال انتشار",
    rating: 4.6,
    hue: 220,
    synopsis:
      "یک بار در ماه، به جای آب، جزر و مد گرگ میاره. یه دهکده‌ی ماهیگیری یاد گرفته به‌جاش گرگ صید کنه.",
    chapters: makeChapters(37, 2),
  },
  {
    id: "echoes-of-recess",
    title: "Echoes of Recess",
    author: "M. Iida",
    genres: ["کمدی", "زندگی روزمره"],
    status: "تکمیل شده",
    rating: 4.2,
    hue: 48,
    synopsis:
      "یه قهرمان سابق زنگ تفریح، این‌بار به عنوان معلم جانشین برمی‌گرده به همون سیاست‌های کلاس چهارمی.",
    chapters: makeChapters(16, 90),
  },
  {
    id: "iron-bloom",
    title: "Iron Bloom",
    author: "P. Adeyemi",
    genres: ["ورزشی", "درام"],
    status: "در حال انتشار",
    rating: 4.8,
    hue: 350,
    synopsis:
      "یه پروتز شمشیربازی کنار گذاشته‌شده و یه ورزشکار محروم از مسابقه، تنها یه فرصت غیررسمی برای قهرمانی دارن.",
    chapters: makeChapters(29, 4),
  },
  {
    id: "cicada-room",
    title: "The Cicada Room",
    author: "S. Whitlock",
    genres: ["ترسناک", "رازآلود"],
    status: "در حال انتشار",
    rating: 4.7,
    hue: 95,
    synopsis:
      "همین که وارد اتاق بشی صدا قطع می‌شه. هرکی رفته بفهمه چرا، موندگار شده که سکوتشو حفظ کنه.",
    chapters: makeChapters(21, 6),
  },
  {
    id: "neon-requiem",
    title: "Neon Requiem",
    author: "F. Castellano",
    genres: ["علمی-تخیلی", "اکشن"],
    status: "در حال انتشار",
    rating: 4.5,
    hue: 285,
    synopsis:
      "توی شهری که با خاطرات قرضی می‌چرخه، یه مأمور وصول قرض شروع می‌کنه به پس‌گرفتن خاطرات اشتباهی.",
    chapters: makeChapters(46, 3),
  },
  {
    id: "sundial-letters",
    title: "Sundial Letters",
    author: "A. Novak",
    genres: ["عاشقانه", "زندگی روزمره"],
    status: "در حال انتشار",
    rating: 4.4,
    hue: 25,
    synopsis:
      "مکاتبه‌ی دو نگهبان فانوس دریایی معلوم می‌شه یازده سال با تأخیر به دست هم می‌رسه، نامه به نامه.",
    chapters: makeChapters(27, 7),
  },
  {
    id: "hollow-meridian",
    title: "Hollow Meridian",
    author: "C. Renwick",
    genres: ["فانتزی", "رازآلود"],
    status: "در حال انتشار",
    rating: 4.9,
    hue: 240,
    synopsis:
      "همه‌ی نقشه‌ها می‌گن کوه خالیه. قطب‌نمای نقشه‌بردار اصرار داره یه قله‌ی دومم داخلشه.",
    chapters: makeChapters(71, 1),
  },
];

function timeAgo(days) {
  if (days < 1) return "امروز";
  if (days === 1) return "۱ روز پیش";
  if (days < 30) return `${days} روز پیش`;
  const months = Math.floor(days / 30);
  return months === 1 ? "۱ ماه پیش" : `${months} ماه پیش`;
}

/* ---------------------------------------------------------
   Cover art — generated gradient "jackets", the one bold
   recurring visual signature of the whole site.
--------------------------------------------------------- */

function Cover({ manga, size = "md" }) {
  const h = manga.hue;
  const bg = `linear-gradient(160deg, hsl(${h} 65% 16%) 0%, hsl(${
    (h + 35) % 360
  } 55% 10%) 55%, hsl(${(h + 10) % 360} 70% 6%) 100%)`;
  return (
    <div className={`cover cover-${size}`} style={{ backgroundImage: bg }}>
      <svg className="cover-moon" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="70" cy="26" r="14" fill={`hsl(${h} 70% 82%)`} opacity="0.9" />
        <circle cx="64" cy="22" r="14" fill={`hsl(${(h + 30) % 360} 55% 12%)`} opacity="0.95" />
      </svg>
      <svg className="cover-grain" viewBox="0 0 100 140" aria-hidden="true">
        <filter id={`n-${manga.id}`}>
          <feTurbulence baseFrequency="0.9" numOctaves="2" seed={h} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100" height="140" filter={`url(#n-${manga.id})`} opacity="0.05" />
      </svg>
      <div className="cover-title">{manga.title}</div>
      <div className="cover-author">{manga.author}</div>
    </div>
  );
}

/* ---------------------------------------------------------
   Card used in grids
--------------------------------------------------------- */

function SeriesCard({ manga, onOpen, bookmarked, onToggleBookmark }) {
  const latest = manga.chapters[0];
  return (
    <div className="card">
      <button className="card-cover-btn" onClick={() => onOpen(manga.id)} aria-label={`باز کردن ${manga.title}`}>
        <Cover manga={manga} size="md" />
        {latest && timeAgo(latest.daysAgo) === "امروز" && <span className="badge-new">جدید</span>}
      </button>
      <div className="card-body">
        <button className="card-title" onClick={() => onOpen(manga.id)}>
          {manga.title}
        </button>
        <div className="card-meta">
          <span className="rating">
            <Star size={12} strokeWidth={2.5} /> {manga.rating}
          </span>
          <span className="dot">·</span>
          <span>فصل {latest ? latest.num : "—"}</span>
        </div>
        <div className="card-genres">
          {manga.genres.slice(0, 2).map((g) => (
            <span key={g} className="chip-mini">
              {g}
            </span>
          ))}
        </div>
      </div>
      <button
        className={`bookmark-btn ${bookmarked ? "is-active" : ""}`}
        onClick={() => onToggleBookmark(manga.id)}
        aria-label={bookmarked ? "حذف از لیست من" : "افزودن به لیست من"}
        title={bookmarked ? "حذف از لیست من" : "افزودن به لیست من"}
      >
        {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
      </button>
    </div>
  );
}

/* ---------------------------------------------------------
   Home / browse view
--------------------------------------------------------- */

function HomeView({
  series,
  query,
  activeGenres,
  toggleGenre,
  statusFilter,
  setStatusFilter,
  sort,
  setSort,
  onOpen,
  bookmarks,
  onToggleBookmark,
}) {
  const featured = series[0];
  const trending = series.slice(1, 5);

  const filtered = useMemo(() => {
    let list = series.filter((m) => {
      const matchesQuery = m.title.toLowerCase().includes(query.toLowerCase());
      const matchesGenre =
        activeGenres.length === 0 || activeGenres.every((g) => m.genres.includes(g));
      const matchesStatus = statusFilter === "همه" || m.status === statusFilter;
      return matchesQuery && matchesGenre && matchesStatus;
    });
    if (sort === "az") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "newest")
      list = [...list].sort((a, b) => a.chapters[0].daysAgo - b.chapters[0].daysAgo);
    return list;
  }, [series, query, activeGenres, statusFilter, sort]);

  const showHero = !query && activeGenres.length === 0 && statusFilter === "همه";

  return (
    <>
      {showHero && (
        <section className="hero">
          <button className="hero-cover" onClick={() => onOpen(featured.id)}>
            <Cover manga={featured} size="lg" />
          </button>
          <div className="hero-copy">
            <span className="eyebrow-soft">پیشنهاد امشب</span>
            <h1>{featured.title}</h1>
            <p className="hero-synopsis">{featured.synopsis}</p>
            <div className="card-genres">
              {featured.genres.map((g) => (
                <span key={g} className="chip-mini">
                  {g}
                </span>
              ))}
            </div>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => onOpen(featured.id)}>
                شروع مطالعه
              </button>
              <button className="btn-ghost" onClick={() => onToggleBookmark(featured.id)}>
                {bookmarks.includes(featured.id) ? "در لیست من" : "افزودن به لیست"}
              </button>
            </div>

            <div className="trending">
              <span className="trending-label">پرطرفدارهای امشب</span>
              <ol>
                {trending.map((m, i) => (
                  <li key={m.id}>
                    <button onClick={() => onOpen(m.id)}>
                      <span className="trending-num">{i + 1}</span>
                      <span className="trending-title">{m.title}</span>
                      <span className="trending-ch">فصل {m.chapters[0].num}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      )}

      <section className="filters">
        <div className="chip-row">
          <button
            className={`chip status-chip ${statusFilter === "همه" ? "chip-active" : ""}`}
            onClick={() => setStatusFilter("همه")}
          >
            همه
          </button>
          <button
            className={`chip status-chip ${statusFilter === "در حال انتشار" ? "chip-active" : ""}`}
            onClick={() => setStatusFilter("در حال انتشار")}
          >
            در حال انتشار
          </button>
          <button
            className={`chip status-chip ${statusFilter === "تکمیل شده" ? "chip-active" : ""}`}
            onClick={() => setStatusFilter("تکمیل شده")}
          >
            تکمیل‌شده
          </button>
        </div>
        <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="trending">پرطرفدار</option>
          <option value="newest">جدیدترین فصل‌ها</option>
          <option value="rating">بالاترین امتیاز</option>
          <option value="az">الفبایی</option>
        </select>
      </section>

      <section className="filters filters-genres">
        <div className="chip-row">
          {GENRES.map((g) => (
            <button
              key={g}
              className={`chip ${activeGenres.includes(g) ? "chip-active" : ""}`}
              onClick={() => toggleGenre(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </section>

      <section className="grid-heading">
        <h2>{query || activeGenres.length || statusFilter !== "همه" ? "نتایج" : "همه‌ی سری‌ها"}</h2>
        <span className="muted">{filtered.length} عنوان</span>
      </section>

      {filtered.length === 0 ? (
        <div className="empty">
          <p>چیزی با این جستجو پیدا نشد.</p>
          <p className="muted">عبارت دیگه‌ای رو امتحان کن یا فیلترها رو پاک کن.</p>
        </div>
      ) : (
        <div className="grid">
          {filtered.map((m) => (
            <SeriesCard
              key={m.id}
              manga={m}
              onOpen={onOpen}
              bookmarked={bookmarks.includes(m.id)}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      )}
    </>
  );
}

/* ---------------------------------------------------------
   Series detail view
--------------------------------------------------------- */

function DetailView({ manga, onBack, onOpenChapter, bookmarked, onToggleBookmark }) {
  return (
    <div className="detail">
      <button className="back-link" onClick={onBack}>
        <ChevronRight size={16} /> بازگشت
      </button>
      <div className="detail-head">
        <Cover manga={manga} size="lg" />
        <div className="detail-info">
          <h1>{manga.title}</h1>
          <p className="detail-author">نویسنده: {manga.author}</p>
          <div className="detail-meta">
            <span className="rating">
              <Star size={13} strokeWidth={2.5} /> {manga.rating}
            </span>
            <span className="dot">·</span>
            <span>{manga.status}</span>
            <span className="dot">·</span>
            <span>{manga.chapters.length} فصل</span>
          </div>
          <div className="card-genres">
            {manga.genres.map((g) => (
              <span key={g} className="chip-mini">
                {g}
              </span>
            ))}
          </div>
          <p className="detail-synopsis">{manga.synopsis}</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => onOpenChapter(manga.chapters[0].num)}>
              خواندن فصل {manga.chapters[0].num}
            </button>
            <button className="btn-ghost" onClick={() => onToggleBookmark(manga.id)}>
              {bookmarked ? "در لیست من" : "افزودن به لیست"}
            </button>
          </div>
        </div>
      </div>

      <h2 className="chapter-list-heading">لیست فصل‌ها</h2>
      <div className="chapter-list">
        {manga.chapters.map((c) => (
          <button key={c.num} className="chapter-row" onClick={() => onOpenChapter(c.num)}>
            <span className="chapter-num">فصل {c.num}</span>
            <span className="chapter-title">
              {c.num === manga.chapters[0].num ? "آخرین انتشار" : `فصل ${c.num}`}
            </span>
            <span className="chapter-date">{timeAgo(c.daysAgo)}</span>
            <ChevronLeft size={16} className="chapter-chevron" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Reader view (placeholder panels)
--------------------------------------------------------- */

function ReaderView({ manga, chapterNum, onBack, onChangeChapter }) {
  const idx = manga.chapters.findIndex((c) => c.num === chapterNum);
  const next = manga.chapters[idx - 1]; // list is stored newest-first
  const prev = manga.chapters[idx + 1];

  const panelCount = 6;

  return (
    <div className="reader">
      <div className="reader-bar">
        <button className="back-link" onClick={onBack}>
          <ChevronRight size={16} /> {manga.title}
        </button>
        <span className="reader-chapter">فصل {chapterNum}</span>
      </div>

      <div className="reader-panels">
        {Array.from({ length: panelCount }).map((_, i) => {
          const h = (manga.hue + i * 18) % 360;
          return (
            <div
              key={i}
              className="panel"
              style={{
                backgroundImage: `linear-gradient(${100 + i * 12}deg, hsl(${h} 40% 14%), hsl(${(h + 40) % 360} 30% 8%))`,
              }}
            >
              <span className="panel-label">پنل {i + 1}</span>
            </div>
          );
        })}
      </div>

      <div className="reader-nav">
        <button className="btn-ghost" disabled={!prev} onClick={() => prev && onChangeChapter(prev.num)}>
          <ChevronRight size={16} /> فصل قبل
        </button>
        <span className="muted">
          فصل {chapterNum} از {manga.chapters.length}
        </span>
        <button className="btn-primary" disabled={!next} onClick={() => next && onChangeChapter(next.num)}>
          فصل بعد <ChevronLeft size={16} />
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Bookmarks drawer
--------------------------------------------------------- */

function BookmarksDrawer({ open, onClose, bookmarks, series, onOpen }) {
  if (!open) return null;
  const list = series.filter((m) => bookmarks.includes(m.id));
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <h2>لیست من</h2>
          <button className="icon-btn" onClick={onClose} aria-label="بستن">
            <X size={18} />
          </button>
        </div>
        {list.length === 0 ? (
          <p className="muted" style={{ padding: "0 20px 20px" }}>
            برای دسترسی سریع، یه سری رو به لیستت اضافه کن.
          </p>
        ) : (
          <div className="drawer-list">
            {list.map((m) => (
              <button
                key={m.id}
                className="drawer-item"
                onClick={() => {
                  onOpen(m.id);
                  onClose();
                }}
              >
                <div className="drawer-cover">
                  <Cover manga={m} size="sm" />
                </div>
                <div>
                  <div className="drawer-item-title">{m.title}</div>
                  <div className="muted" style={{ fontSize: "0.8rem" }}>
                    فصل {m.chapters[0].num} · {m.status}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Root app
--------------------------------------------------------- */

export default function MangaNova() {
  const [view, setView] = useState({ page: "home" });
  const [query, setQuery] = useState("");
  const [activeGenres, setActiveGenres] = useState([]);
  const [statusFilter, setStatusFilter] = useState("همه");
  const [sort, setSort] = useState("trending");
  const [bookmarks, setBookmarks] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleGenre = (g) =>
    setActiveGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  const toggleBookmark = (id) =>
    setBookmarks((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const openManga = (id) => {
    setView({ page: "detail", mangaId: id });
    window.scrollTo?.({ top: 0 });
  };
  const openChapter = (chapterNum) => {
    setView((v) => ({ page: "reader", mangaId: v.mangaId, chapterNum }));
    window.scrollTo?.({ top: 0 });
  };
  const goHome = () => {
    setView({ page: "home" });
    setQuery("");
  };

  const currentManga =
    view.page === "detail" || view.page === "reader"
      ? RAW_SERIES.find((m) => m.id === view.mangaId)
      : null;

  return (
    <div className="app" dir="rtl" lang="fa">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600&display=swap');

        .app {
          --bg: #090a0f;
          --surface: #11131aee;
          --surface-solid: #11131a;
          --surface-2: #181b24;
          --text: #f5f6f8;
          --muted: #9297a5;
          --accent: #ff6b35;
          --accent-soft: #ff8a5c;
          --accent-warm: #ffb08f;
          --border: #262a35;
          direction: rtl;
          background: var(--bg);
          background-image:
            radial-gradient(ellipse 60% 40% at 85% -5%, rgba(255,107,53,0.12), transparent),
            radial-gradient(ellipse 50% 30% at 0% 0%, rgba(255,176,143,0.05), transparent);
          color: var(--text);
          font-family: 'Vazirmatn', sans-serif;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }
        .app * { box-sizing: border-box; }
        .app h1, .app h2 { font-family: 'Vazirmatn', sans-serif; font-weight: 700; margin: 0; }
        .app button { font-family: inherit; cursor: pointer; }
        .app button:disabled { cursor: not-allowed; opacity: 0.4; }
        .app :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

        .muted { color: var(--muted); }
        .dot { color: var(--muted); }

        /* Nav */
        .nav {
          position: sticky; top: 0; z-index: 20;
          display: flex; align-items: center; gap: 18px;
          padding: 14px 28px;
          background: rgba(9,10,15,0.88);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border);
        }
        .logo { display: flex; align-items: center; gap: 8px; background: none; border: none; color: var(--text); }
        .logo-mark { color: var(--accent-warm); }
        .logo-accent { color: var(--accent); }\n        .logo-text { font-family: 'Vazirmatn', sans-serif; direction: ltr; font-size: 1.2rem; font-weight: 600; letter-spacing: 0.01em; }
        .search-wrap { position: relative; flex: 1; max-width: 420px; }
        .search-wrap svg { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--muted); }
        .search-wrap input {
          width: 100%; padding: 9px 36px 9px 12px; border-radius: 10px;
          background: var(--surface-2); border: 1px solid var(--border); color: var(--text);
          font-size: 0.9rem; font-family: inherit;
        }
        .search-wrap input::placeholder { color: var(--muted); }
        .nav-spacer { flex: 1; }
        .nav-links { display: flex; align-items: center; gap: 4px; }
        .icon-btn {
          background: var(--surface-2); border: 1px solid var(--border); color: var(--text);
          width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
          position: relative;
        }
        .bookmark-count {
          position: absolute; top: -5px; left: -5px; background: var(--accent-warm); color: #2a1a00;
          font-size: 0.65rem; font-weight: 700; border-radius: 999px; min-width: 16px; height: 16px;
          display: flex; align-items: center; justify-content: center; padding: 0 3px;
        }

        .container { max-width: 1180px; margin: 0 auto; padding: 28px 28px 80px; }

        /* Hero */
        .hero { display: grid; grid-template-columns: 220px 1fr; gap: 36px; padding: 8px 0 40px; border-bottom: 1px solid var(--border); margin-bottom: 28px; }
        .hero-cover { border: none; background: none; padding: 0; display: block; }
        .eyebrow-soft { color: var(--accent-warm); font-size: 0.82rem; font-weight: 600; }
        .hero-copy h1 { font-size: 2rem; margin: 6px 0 10px; direction: ltr; text-align: right; }
        .hero-synopsis { max-width: 62ch; line-height: 1.9; color: #cdd9d1; margin: 0 0 14px; }
        .hero-actions { display: flex; gap: 10px; margin-top: 16px; }

        .btn-primary, .btn-ghost {
          border-radius: 10px; padding: 10px 18px; font-size: 0.88rem; font-weight: 600; border: 1px solid transparent;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .btn-primary { background: var(--accent); color: #06120d; }
        .btn-primary:hover:not(:disabled) { background: var(--accent-soft); }
        .btn-ghost { background: transparent; border-color: var(--border); color: var(--text); }
        .btn-ghost:hover:not(:disabled) { border-color: var(--accent); }

        .trending { margin-top: 26px; }
        .trending-label { font-size: 0.8rem; color: var(--muted); }
        .trending ol { list-style: none; margin: 10px 0 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
        .trending button {
          display: flex; align-items: center; gap: 12px; width: 100%; background: none; border: none;
          color: var(--text); padding: 7px 6px; border-radius: 8px; text-align: right;
        }
        .trending button:hover { background: var(--surface-2); }
        .trending-num { color: var(--muted); font-size: 0.8rem; width: 14px; }
        .trending-title { flex: 1; font-size: 0.92rem; direction: ltr; text-align: right; }
        .trending-ch { color: var(--muted); font-size: 0.8rem; }

        /* Filters */
        .filters { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 12px; flex-wrap: wrap; }
        .filters-genres { margin-bottom: 24px; }
        .chip-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .chip {
          background: var(--surface-2); border: 1px solid var(--border); color: var(--muted);
          padding: 6px 13px; border-radius: 999px; font-size: 0.82rem;
        }
        .chip-active { color: #06120d; background: var(--accent); border-color: var(--accent); font-weight: 600; }
        .sort-select {
          background: var(--surface-2); border: 1px solid var(--border); color: var(--text);
          padding: 7px 10px; border-radius: 8px; font-size: 0.82rem; font-family: inherit;
        }

        .grid-heading { display: flex; align-items: baseline; justify-content: space-between; margin: 10px 0 16px; }
        .grid-heading h2 { font-size: 1.15rem; }

        .empty { padding: 60px 0; text-align: center; }
        .empty p { margin: 4px 0; }

        /* Grid & cards */
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 20px; }
        .card { position: relative; display: flex; flex-direction: column; }
        .card-cover-btn { border: none; background: none; padding: 0; display: block; position: relative; width: 100%; }
        .card-title {
          background: none; border: none; color: var(--text); text-align: right; padding: 0;
          font-size: 0.92rem; font-weight: 600; line-height: 1.3; direction: ltr; display: block;
        }
        .card-title:hover { color: var(--accent-soft); }
        .card-body { padding-top: 9px; display: flex; flex-direction: column; gap: 5px; }
        .card-meta { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: var(--muted); }
        .rating { display: inline-flex; align-items: center; gap: 3px; color: var(--accent-warm); }
        .card-genres { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 2px; }
        .chip-mini { font-size: 0.72rem; color: var(--muted); border: 1px solid var(--border); padding: 2px 8px; border-radius: 999px; }

        .badge-new {
          position: absolute; top: 8px; right: 8px; background: var(--accent-warm); color: #2a1a00;
          font-size: 0.66rem; font-weight: 700; padding: 3px 7px; border-radius: 6px;
        }
        .bookmark-btn {
          position: absolute; top: 8px; left: 8px; background: rgba(10,15,13,0.75); border: 1px solid var(--border);
          color: var(--text); width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
        }
        .bookmark-btn.is-active { color: var(--accent-warm); border-color: var(--accent-warm); }

        /* Covers */
        .cover {
          position: relative; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column;
          justify-content: flex-end; padding: 12px; border: 1px solid rgba(255,255,255,0.06); direction: ltr; text-align: left;
        }
        .cover-sm { width: 64px; height: 90px; padding: 6px; border-radius: 8px; }
        .cover-md { aspect-ratio: 5 / 7; width: 100%; }
        .cover-lg { width: 220px; aspect-ratio: 5 / 7; }
        .cover-moon { position: absolute; top: 0; left: 0; width: 60%; height: 60%; opacity: 0.85; }
        .cover-grain { position: absolute; inset: 0; width: 100%; height: 100%; mix-blend-mode: overlay; }
        .cover-title {
          position: relative; font-family: 'Vazirmatn', sans-serif; font-weight: 600; line-height: 1.15;
          font-size: 0.98rem; text-shadow: 0 2px 10px rgba(0,0,0,0.6);
        }
        .cover-sm .cover-title { font-size: 0.6rem; }
        .cover-lg .cover-title { font-size: 1.3rem; }
        .cover-author { position: relative; font-size: 0.68rem; color: rgba(255,255,255,0.65); margin-top: 3px; }
        .cover-sm .cover-author { display: none; }

        /* Detail */
        .back-link { background: none; border: none; color: var(--muted); display: inline-flex; align-items: center; gap: 6px; padding: 0; font-size: 0.88rem; margin-bottom: 20px; direction: ltr; }
        .back-link:hover { color: var(--text); }
        .detail-head { display: grid; grid-template-columns: 220px 1fr; gap: 32px; margin-bottom: 36px; }
        .detail-info h1 { font-size: 1.8rem; direction: ltr; text-align: right; }
        .detail-author { color: var(--muted); margin: 4px 0 10px; direction: ltr; text-align: right; }
        .detail-meta { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--muted); margin-bottom: 12px; }
        .detail-synopsis { max-width: 64ch; line-height: 1.9; color: #cdd9d1; margin: 16px 0 4px; }
        .chapter-list-heading { font-size: 1.1rem; margin-bottom: 14px; }
        .chapter-list { display: flex; flex-direction: column; border-top: 1px solid var(--border); }
        .chapter-row {
          display: flex; align-items: center; gap: 14px; width: 100%; background: none; border: none; border-bottom: 1px solid var(--border);
          color: var(--text); padding: 13px 6px; text-align: right; font-size: 0.9rem;
        }
        .chapter-row:hover { background: var(--surface-2); }
        .chapter-num { color: var(--accent-soft); font-weight: 600; width: 70px; flex-shrink: 0; }
        .chapter-title { flex: 1; }
        .chapter-date { color: var(--muted); font-size: 0.8rem; }
        .chapter-chevron { color: var(--muted); }

        /* Reader */
        .reader-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }
        .reader-bar .back-link { margin-bottom: 0; }
        .reader-chapter { color: var(--muted); font-size: 0.88rem; }
        .reader-panels { display: flex; flex-direction: column; gap: 4px; max-width: 560px; margin: 0 auto; }
        .panel { aspect-ratio: 3 / 4; border-radius: 4px; display: flex; align-items: center; justify-content: center; }
        .panel-label { color: rgba(255,255,255,0.35); font-size: 0.8rem; letter-spacing: 0.05em; }
        .reader-nav { display: flex; align-items: center; justify-content: space-between; max-width: 560px; margin: 26px auto 0; }

        /* Drawer */
        .drawer-overlay { position: fixed; inset: 0; background: rgba(3,6,4,0.6); z-index: 40; display: flex; justify-content: flex-start; }
        .drawer { width: min(340px, 88vw); background: var(--surface-solid); height: 100%; border-left: none; border-right: 1px solid var(--border); overflow-y: auto; }
        .drawer-head { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; border-bottom: 1px solid var(--border); }
        .drawer-list { display: flex; flex-direction: column; padding: 10px; gap: 4px; }
        .drawer-item { display: flex; gap: 12px; align-items: center; background: none; border: none; color: var(--text); padding: 8px; border-radius: 10px; text-align: right; }
        .drawer-item:hover { background: var(--surface-2); }
        .drawer-item-title { font-size: 0.88rem; font-weight: 600; direction: ltr; text-align: right; }

        .footer { text-align: center; padding: 30px 0 10px; color: var(--muted); font-size: 0.8rem; border-top: 1px solid var(--border); margin-top: 40px; }

        @media (max-width: 720px) {
          .nav { padding: 12px 16px; gap: 10px; }
          .logo-accent { color: var(--accent); }\n        .logo-text { display: none; }
          .container { padding: 20px 16px 60px; }
          .hero { grid-template-columns: 1fr; }
          .hero-cover { width: 150px; }
          .detail-head { grid-template-columns: 1fr; }
          .detail-head .cover-lg { width: 150px; }
          .grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 14px; }
        }
      `}</style>

      <nav className="nav">
        <button className="logo" onClick={goHome}>
          <span className="logo-mark">M</span>
          <span className="logo-text">Manga<span className="logo-accent">Nova</span></span>
        </button>
        <div className="search-wrap">
          <Search size={15} />
          <input
            placeholder="جستجوی عنوان..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (view.page !== "home") setView({ page: "home" });
            }}
          />
        </div>
        <div className="nav-spacer" />
        <div className="nav-links">
          <button className="icon-btn" onClick={() => setDrawerOpen(true)} aria-label="لیست من">
            <Bookmark size={16} />
            {bookmarks.length > 0 && <span className="bookmark-count">{bookmarks.length}</span>}
          </button>
        </div>
      </nav>

      <div className="container">
        {view.page === "home" && (
          <HomeView
            series={RAW_SERIES}
            query={query}
            activeGenres={activeGenres}
            toggleGenre={toggleGenre}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sort={sort}
            setSort={setSort}
            onOpen={openManga}
            bookmarks={bookmarks}
            onToggleBookmark={toggleBookmark}
          />
        )}

        {view.page === "detail" && currentManga && (
          <DetailView
            manga={currentManga}
            onBack={goHome}
            onOpenChapter={openChapter}
            bookmarked={bookmarks.includes(currentManga.id)}
            onToggleBookmark={toggleBookmark}
          />
        )}

        {view.page === "reader" && currentManga && (
          <ReaderView
            manga={currentManga}
            chapterNum={view.chapterNum}
            onBack={() => setView({ page: "detail", mangaId: currentManga.id })}
            onChangeChapter={openChapter}
          />
        )}

        <div className="footer">MangaNova — پلتفرم مطالعه مانگا و مانهوا آنلاین.</div>
      </div>

      <BookmarksDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        bookmarks={bookmarks}
        series={RAW_SERIES}
        onOpen={openManga}
      />
    </div>
  );
}
