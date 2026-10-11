"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  ArrowDown,
  ArrowUp,
  Building2,
  Check,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Pencil,
  Plus,
  Save,
  Settings2,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { loginWithGoogle, logout } from "@/services/firebase/auth-service";
import { useAdminSession } from "./hooks/useAdminSession";
import { errorText } from "./utils/errors";
import { loadRecord, publishContent, saveDraft } from "@/services/firebase/content-repository";
import {
  defaultSiteContent,
  parseSiteContent,
  type Localized,
  type Partner,
  type PortfolioItem,
  type SiteContent,
} from "@/shared/content/site-content";
import "./styles/admin.css";
import { TextField, ImageField } from "./components/Fields";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const sections = [
  { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
  { id: "settings", label: "البيانات الأساسية", icon: Settings2 },
  { id: "projects", label: "الأعمال السابقة", icon: Building2 },
  { id: "partners", label: "الشركاء", icon: Users },
] as const;
type Section = (typeof sections)[number]["id"];
type Editor =
  | { kind: "projects"; item: PortfolioItem }
  | { kind: "partners"; item: Partner };
type DeletedItem = Editor & { index: number };
const blankText = (): Localized => ({ ar: "", en: "" });

function fetchRecords() {
  return Promise.all([loadRecord("draft"), loadRecord("published")]);
}

export default function AdminPage() {
  const [dataLoading, setDataLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [section, setSection] = useState<Section>("overview");
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [saved, setSaved] = useState(JSON.stringify(defaultSiteContent));
  const [published, setPublished] = useState("");
  const [draftRevision, setDraftRevision] = useState(0);
  const [publishedRevision, setPublishedRevision] = useState(0);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ text: string; error: boolean } | null>(
    null,
  );
  const [editor, setEditor] = useState<Editor | null>(null);
  const [deleted, setDeleted] = useState<DeletedItem | null>(null);
  const current = JSON.stringify(content);
  const dirty = current !== saved;
  const unpublished = current !== published;
  const editorOpen = editor !== null;
  const report = useCallback(
    (text: string, error = true) => setNotice({ text, error }),
    [],
  );

  const { user, authorized, authLoading } = useAdminSession(report);
  const ready = authorized && !dataLoading && loaded;

  useEffect(() => {
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
  }, []);

  const applyContent = useCallback(
    ([draft, live]: Awaited<ReturnType<typeof fetchRecords>>) => {
      const next = draft.exists ? draft.content : live.content;
      setContent(next);
      setSaved(JSON.stringify(next));
      setPublished(JSON.stringify(live.content));
      setDraftRevision(draft.revision);
      setPublishedRevision(live.revision);
      setLoaded(true);
    },
    [],
  );
  const reload = useCallback(async () => {
    setDataLoading(true);
    setLoaded(false);
    try {
      applyContent(await fetchRecords());
    } catch (error) {
      report(errorText(error));
    } finally {
      setDataLoading(false);
    }
  }, [applyContent, report]);
  useEffect(() => {
    if (!authorized) return;
    let active = true;
    fetchRecords()
      .then((records) => {
        if (active) applyContent(records);
      })
      .catch((error: unknown) => {
        if (active) report(errorText(error));
      })
      .finally(() => {
        if (active) setDataLoading(false);
      });
    return () => {
      active = false;
    };
  }, [authorized, applyContent, report]);
  useEffect(() => {
    if (!dirty && !editor) return;
    const prevent = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [dirty, editor]);
  useEffect(() => {
    if (!editorOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const dialog = document.querySelector<HTMLDialogElement>(".adm-dialog");
    dialog?.showModal();
    return () => {
      dialog?.close();
      previous?.focus();
    };
  }, [editorOpen]);

  function update<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setContent((prev) => ({ ...prev, [key]: value }));
  }
  function localizedField(
    key:
      | "heroFirst"
      | "heroSecond"
      | "heroDescription"
      | "aboutFirst"
      | "aboutSecond"
      | "aboutDescription"
      | "contactDescription"
      | "address",
    label: string,
    multiline = false,
  ) {
    return (
      <TextField
        label={label}
        value={content[key][language]}
        multiline={multiline}
        onChange={(value) =>
          update(key, { ...content[key], [language]: value })
        }
      />
    );
  }
  async function login() {
    setBusy(true);
    setNotice(null);
    try {
      await loginWithGoogle();
    } catch (error) {
      report(errorText(error));
    } finally {
      setBusy(false);
    }
  }
  async function save(publish: boolean) {
    setBusy(true);
    setNotice(null);
    try {
      if (publish) {
        const result = await publishContent(
          content,
          draftRevision,
          publishedRevision,
        );
        setDraftRevision(result.draftRevision);
        setPublishedRevision(result.publishedRevision);
        setPublished(current);
        report("تم نشر التغييرات على الموقع.", false);
      } else {
        setDraftRevision(await saveDraft(content, draftRevision));
        report("تم حفظ المسودة.", false);
      }
      setSaved(current);
      setDeleted(null);
    } catch (error) {
      report(errorText(error));
    } finally {
      setBusy(false);
    }
  }
  function add(kind: "projects" | "partners") {
    if (content[kind].length >= 40) {
      report("وصلت إلى الحد الأقصى: 40 عنصرًا.");
      return;
    }
    const id = crypto.randomUUID();
    setEditor(
      kind === "projects"
        ? {
            kind,
            item: {
              id,
              title: blankText(),
              description: blankText(),
              category: blankText(),
              image: "",
              url: "",
              visible: true,
            },
          }
        : { kind, item: { id, name: "", image: "", url: "", visible: true } },
    );
  }
  function applyEditor(event: React.FormEvent) {
    event.preventDefault();
    if (!editor) return;
    const next = structuredClone(content);
    if (editor.kind === "projects")
      next.projects = [
        ...next.projects.filter((x) => x.id !== editor.item.id),
        editor.item,
      ];
    else
      next.partners = [
        ...next.partners.filter((x) => x.id !== editor.item.id),
        editor.item,
      ];
    const originalIndex = content[editor.kind].findIndex(
      (x) => x.id === editor.item.id,
    );
    if (originalIndex >= 0) {
      const list = next[editor.kind];
      const [item] = list.splice(list.length - 1, 1);
      list.splice(originalIndex, 0, item as PortfolioItem & Partner);
    }
    try {
      parseSiteContent(JSON.stringify(next));
      setContent(next);
      setEditor(null);
    } catch (error) {
      report(errorText(error));
    }
  }
  function move(
    kind: "projects" | "partners",
    index: number,
    direction: number,
  ) {
    const next = structuredClone(content);
    const list = next[kind];
    [list[index], list[index + direction]] = [
      list[index + direction],
      list[index],
    ];
    setContent(next);
  }
  function toggle(kind: "projects" | "partners", id: string) {
    const next = structuredClone(content);
    const item = next[kind].find((x) => x.id === id);
    if (item) item.visible = !item.visible;
    setContent(next);
  }
  function remove(kind: "projects" | "partners", id: string) {
    const index = content[kind].findIndex((x) => x.id === id);
    if (index < 0) return;
    setDeleted(
      kind === "projects"
        ? { kind, index, item: content.projects[index] }
        : { kind, index, item: content.partners[index] },
    );
    setContent((prev) => ({
      ...prev,
      [kind]: prev[kind].filter((x) => x.id !== id),
    }));
    report("تمت إزالة العنصر من المسودة.", false);
  }
  function undoDelete() {
    if (!deleted) return;
    setContent((prev) => {
      const next = structuredClone(prev);
      if (deleted.kind === "projects")
        next.projects.splice(deleted.index, 0, deleted.item);
      else next.partners.splice(deleted.index, 0, deleted.item);
      return next;
    });
    setDeleted(null);
    setNotice(null);
  }
  function preview() {
    try {
      parseSiteContent(current);
      sessionStorage.setItem("ldg-preview", current);
      window.open(`${basePath}/?preview=1`, "_blank");
    } catch (error) {
      report(errorText(error));
    }
  }

  if (authLoading)
    return (
      <main className="adm-gate" dir="rtl">
        <LoaderCircle className="adm-spin" />
        <p>جاري التحقق من تسجيل الدخول…</p>
      </main>
    );
  if (!authorized)
    return (
      <main className="adm-gate" dir="rtl">
        <a className="adm-brand" href={`${basePath}/`}>
          <img src={`${basePath}/ldg-ribbon-logo.webp`} alt="LDG" />
          <b>Lilian Data Group</b>
        </a>
        <div className="adm-login">
          <ShieldCheck size={30} />
          <h1>إدارة الموقع</h1>
          <p>سجّل الدخول بحساب الإدارة.</p>
          {user ? (
            <p className="adm-account" dir="ltr">
              {user.email}
            </p>
          ) : null}
          {notice ? (
            <p className="adm-alert" role="alert">
              {notice.text}
            </p>
          ) : null}
          <button
            className="adm-button adm-primary"
            disabled={busy}
            onClick={
              user
                ? async () => {
                    await logout();
                    setNotice(null);
                  }
                : login
            }
          >
            {busy ? (
              <LoaderCircle size={17} className="adm-spin" />
            ) : (
              <ShieldCheck size={17} />
            )}{" "}
            {user ? "استخدام حساب آخر" : "تسجيل الدخول بحساب Google"}
          </button>
          <a href={`${basePath}/`} className="adm-return">
            العودة إلى الموقع <ExternalLink size={14} />
          </a>
        </div>
      </main>
    );

  return (
    <main className="adm-shell" dir="rtl">
      <aside className="adm-sidebar">
        <a className="adm-brand" href={`${basePath}/`}>
          <img src={`${basePath}/ldg-ribbon-logo.webp`} alt="LDG" />
          <b>
            LDG <span>إدارة الموقع</span>
          </b>
        </a>
        <nav aria-label="أقسام لوحة الإدارة">
          {sections.map((tab) => (
            <button
              key={tab.id}
              className={section === tab.id ? "active" : ""}
              onClick={() => setSection(tab.id)}
              aria-current={section === tab.id ? "page" : undefined}
            >
              <tab.icon size={19} />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="adm-sidebar-bottom">
          <a href={`${basePath}/`} target="_blank" rel="noreferrer">
            <ExternalLink size={17} />
            فتح الموقع
          </a>
          <button
            onClick={async () => {
              if (
                dirty &&
                !window.confirm(
                  "هناك تعديلات غير محفوظة. هل تريد تسجيل الخروج؟",
                )
              )
                return;
              await logout();
              setEditor(null);
              setDeleted(null);
              setNotice(null);
            }}
          >
            <LogOut size={17} />
            تسجيل الخروج
          </button>
          <span dir="ltr">{user?.email}</span>
        </div>
      </aside>
      <div className="adm-workspace">
        <header className="adm-header">
          <div>
            <span className="adm-breadcrumb">
              الموقع / {sections.find((x) => x.id === section)?.label}
            </span>
            <h1>{sections.find((x) => x.id === section)?.label}</h1>
          </div>
          <div className="adm-header-actions">
            <span className={`adm-save-state ${dirty ? "dirty" : ""}`}>
              <span />
              {dirty
                ? "تعديلات غير محفوظة"
                : unpublished
                  ? "مسودة محفوظة"
                  : "المحتوى منشور"}
            </span>
            <button
              className="adm-icon"
              title="معاينة المسودة"
              aria-label="معاينة المسودة"
              disabled={!ready || busy}
              onClick={preview}
            >
              <Eye size={19} />
            </button>
            <button
              className="adm-button"
              disabled={!ready || busy || !dirty}
              onClick={() => save(false)}
            >
              <Save size={16} />
              حفظ المسودة
            </button>
            <button
              className="adm-button adm-primary"
              disabled={!ready || busy || !unpublished}
              onClick={() => save(true)}
            >
              {busy ? (
                <LoaderCircle className="adm-spin" size={16} />
              ) : (
                <Check size={16} />
              )}
              نشر التغييرات
            </button>
          </div>
        </header>
        {notice ? (
          <div
            className={`adm-notice ${notice.error ? "error" : ""}`}
            role={notice.error ? "alert" : "status"}
          >
            {notice.error ? (
              <ShieldCheck size={18} />
            ) : (
              <CheckCircle2 size={18} />
            )}
            <span>{notice.text}</span>
            {deleted ? <button onClick={undoDelete}>تراجع</button> : null}
            <button
              className="adm-icon"
              title="إغلاق التنبيه"
              aria-label="إغلاق التنبيه"
              onClick={() => setNotice(null)}
            >
              <X size={16} />
            </button>
          </div>
        ) : null}
        {dataLoading ? (
          <div className="adm-loading">
            <LoaderCircle className="adm-spin" />
            جاري تحميل المحتوى…
          </div>
        ) : !loaded ? (
          <div className="adm-loading">
            <button className="adm-button" onClick={() => void reload()}>
              إعادة المحاولة
            </button>
          </div>
        ) : (
          <fieldset className="adm-content" disabled={busy}>
            {section === "overview" ? (
              <>
                <div className="adm-overview-title">
                  <h2>مرحبًا بك في لوحة LDG</h2>
                  <span className="adm-status">
                    <ShieldCheck size={16} />
                    حساب إدارة معتمد
                  </span>
                </div>
                <div className="adm-stats">
                  <button onClick={() => setSection("projects")}>
                    <Building2 />
                    <span>الأعمال السابقة</span>
                    <b>{content.projects.length}</b>
                    <small>
                      {content.projects.filter((x) => x.visible).length} ظاهر
                      على الموقع
                    </small>
                  </button>
                  <button onClick={() => setSection("partners")}>
                    <Users />
                    <span>الشركاء</span>
                    <b>{content.partners.length}</b>
                    <small>
                      {content.partners.filter((x) => x.visible).length} ظاهر
                      على الموقع
                    </small>
                  </button>
                  <div>
                    <FileText />
                    <span>حالة المحتوى</span>
                    <b className="adm-stat-text">
                      {unpublished ? "مسودة" : "منشور"}
                    </b>
                    <small>الإصدار المنشور {publishedRevision}</small>
                  </div>
                </div>
                <div className="adm-overview-links">
                  <h2>إدارة المحتوى</h2>
                  {sections.slice(1).map((tab) => (
                    <button key={tab.id} onClick={() => setSection(tab.id)}>
                      <tab.icon size={22} />
                      <span>{tab.label}</span>
                      <Pencil size={17} />
                    </button>
                  ))}
                </div>
                <div className="adm-version-row">
                  <span>آخر إصدار منشور: {publishedRevision}</span>
                  <button
                    className="adm-button"
                    onClick={() => {
                      if (
                        !dirty ||
                        window.confirm(
                          "إعادة التحميل ستزيل التعديلات غير المحفوظة. هل تريد المتابعة؟",
                        )
                      )
                        void reload();
                    }}
                  >
                    إعادة تحميل البيانات
                  </button>
                </div>
              </>
            ) : null}
            {section === "settings" ? (
              <>
                <div className="adm-section-toolbar">
                  <h2>هوية الشركة</h2>
                  <div className="adm-language" aria-label="لغة المحتوى">
                    <button
                      className={language === "ar" ? "active" : ""}
                      onClick={() => setLanguage("ar")}
                      aria-pressed={language === "ar"}
                    >
                      العربية
                    </button>
                    <button
                      className={language === "en" ? "active" : ""}
                      onClick={() => setLanguage("en")}
                      aria-pressed={language === "en"}
                    >
                      English
                    </button>
                  </div>
                </div>
                <div className="adm-form-grid">
                  <TextField
                    label="اسم الشركة"
                    value={content.companyName}
                    onChange={(value) => update("companyName", value)}
                    required
                  />
                  <ImageField
                    label="شعار الشركة"
                    value={content.logo}
                    onChange={(value) => update("logo", value)}
                    onError={report}
                  />
                </div>
                <section className="adm-form-section">
                  <h2>الرئيسية</h2>
                  <div className="adm-form-grid">
                    {localizedField("heroFirst", "العنوان الرئيسي")}
                    {localizedField("heroSecond", "السطر الثاني")}
                    {localizedField("heroDescription", "وصف الشركة", true)}
                  </div>
                </section>
                <section className="adm-form-section">
                  <h2>من نحن</h2>
                  <div className="adm-form-grid">
                    {localizedField("aboutFirst", "عنوان القسم")}
                    {localizedField("aboutSecond", "السطر الثاني")}
                    {localizedField("aboutDescription", "نبذة عن الشركة", true)}
                  </div>
                </section>
                <section className="adm-form-section">
                  <h2>التواصل</h2>
                  <div className="adm-form-grid">
                    <TextField
                      label="البريد الإلكتروني"
                      type="email"
                      value={content.email}
                      onChange={(value) => update("email", value)}
                    />
                    <TextField
                      label="رقم الهاتف"
                      type="tel"
                      value={content.phone}
                      onChange={(value) => update("phone", value)}
                    />
                    <TextField
                      label="واتساب مع كود الدولة"
                      type="tel"
                      value={content.whatsapp}
                      onChange={(value) => update("whatsapp", value)}
                    />
                    {localizedField("address", "العنوان")}
                    {localizedField("contactDescription", "نص التواصل", true)}
                    <TextField
                      label="LinkedIn"
                      type="url"
                      value={content.linkedin}
                      onChange={(value) => update("linkedin", value)}
                    />
                    <TextField
                      label="Facebook"
                      type="url"
                      value={content.facebook}
                      onChange={(value) => update("facebook", value)}
                    />
                  </div>
                </section>
              </>
            ) : null}
            {section === "projects" || section === "partners" ? (
              <>
                <div className="adm-section-toolbar">
                  <span>
                    {content[section].length}{" "}
                    {section === "projects" ? "عمل" : "شريك"}
                  </span>
                  <button
                    className="adm-button adm-primary"
                    onClick={() => add(section)}
                  >
                    <Plus size={17} />
                    {section === "projects" ? "إضافة عمل" : "إضافة شريك"}
                  </button>
                </div>
                {content[section].length === 0 ? (
                  <div className="adm-empty">
                    {section === "projects" ? (
                      <Building2 size={35} />
                    ) : (
                      <Users size={35} />
                    )}
                    <h2>
                      {section === "projects"
                        ? "لا توجد أعمال مضافة"
                        : "لا يوجد شركاء مضافون"}
                    </h2>
                    <button className="adm-button" onClick={() => add(section)}>
                      <Plus size={17} />
                      {section === "projects"
                        ? "إضافة أول عمل"
                        : "إضافة أول شريك"}
                    </button>
                  </div>
                ) : (
                  <div className="adm-list">
                    {content[section].map((item, index) => (
                      <div className="adm-list-row" key={item.id}>
                        {item.image ? (
                          <img
                            className="adm-thumbnail"
                            src={item.image}
                            alt={"title" in item ? item.title.ar : item.name}
                          />
                        ) : (
                          <div className="adm-thumbnail placeholder">
                            {section === "projects" ? (
                              <Building2 size={22} />
                            ) : (
                              <Users size={22} />
                            )}
                          </div>
                        )}
                        <div className="adm-item-name">
                          <b>{"title" in item ? item.title.ar : item.name}</b>
                          <small>
                            {"title" in item
                              ? item.category.ar
                              : item.url || "شريك"}
                          </small>
                        </div>
                        <span
                          className={`adm-status ${item.visible ? "" : "hidden"}`}
                        >
                          {item.visible ? "ظاهر" : "مخفي"}
                        </span>
                        <div className="adm-row-actions">
                          <button
                            className="adm-icon"
                            disabled={index === 0}
                            title="تحريك لأعلى"
                            aria-label="تحريك لأعلى"
                            onClick={() => move(section, index, -1)}
                          >
                            <ArrowUp size={17} />
                          </button>
                          <button
                            className="adm-icon"
                            disabled={index === content[section].length - 1}
                            title="تحريك لأسفل"
                            aria-label="تحريك لأسفل"
                            onClick={() => move(section, index, 1)}
                          >
                            <ArrowDown size={17} />
                          </button>
                          <button
                            className="adm-icon"
                            title={item.visible ? "إخفاء" : "إظهار"}
                            aria-label={item.visible ? "إخفاء" : "إظهار"}
                            onClick={() => toggle(section, item.id)}
                          >
                            {item.visible ? (
                              <Eye size={17} />
                            ) : (
                              <EyeOff size={17} />
                            )}
                          </button>
                          <button
                            className="adm-icon"
                            title="تعديل"
                            aria-label="تعديل"
                            onClick={() =>
                              setEditor(
                                section === "projects"
                                  ? {
                                      kind: section,
                                      item: item as PortfolioItem,
                                    }
                                  : { kind: section, item: item as Partner },
                              )
                            }
                          >
                            <Pencil size={17} />
                          </button>
                          <button
                            className="adm-icon adm-danger"
                            title="إزالة"
                            aria-label="إزالة"
                            onClick={() => remove(section, item.id)}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : null}
          </fieldset>
        )}
      </div>
      {editor ? (
        <dialog
          className="adm-dialog"
          onCancel={() => setEditor(null)}
          aria-labelledby="editor-title"
        >
          <form onSubmit={applyEditor}>
            <div className="adm-dialog-header">
              <h2 id="editor-title">
                {editor.kind === "projects" ? "بيانات العمل" : "بيانات الشريك"}
              </h2>
              <button
                className="adm-icon"
                type="button"
                aria-label="إغلاق"
                title="إغلاق"
                onClick={() => setEditor(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="adm-dialog-body">
              {editor.kind === "projects" ? (
                <>
                  <div className="adm-form-grid">
                    <TextField
                      label="اسم العمل بالعربية"
                      required
                      value={editor.item.title.ar}
                      onChange={(value) =>
                        setEditor({
                          ...editor,
                          item: {
                            ...editor.item,
                            title: { ...editor.item.title, ar: value },
                          },
                        })
                      }
                    />
                    <TextField
                      label="اسم العمل بالإنجليزية"
                      required
                      value={editor.item.title.en}
                      onChange={(value) =>
                        setEditor({
                          ...editor,
                          item: {
                            ...editor.item,
                            title: { ...editor.item.title, en: value },
                          },
                        })
                      }
                    />
                    <TextField
                      label="التصنيف بالعربية"
                      value={editor.item.category.ar}
                      onChange={(value) =>
                        setEditor({
                          ...editor,
                          item: {
                            ...editor.item,
                            category: { ...editor.item.category, ar: value },
                          },
                        })
                      }
                    />
                    <TextField
                      label="التصنيف بالإنجليزية"
                      value={editor.item.category.en}
                      onChange={(value) =>
                        setEditor({
                          ...editor,
                          item: {
                            ...editor.item,
                            category: { ...editor.item.category, en: value },
                          },
                        })
                      }
                    />
                    <TextField
                      label="وصف العمل بالعربية"
                      multiline
                      value={editor.item.description.ar}
                      onChange={(value) =>
                        setEditor({
                          ...editor,
                          item: {
                            ...editor.item,
                            description: {
                              ...editor.item.description,
                              ar: value,
                            },
                          },
                        })
                      }
                    />
                    <TextField
                      label="وصف العمل بالإنجليزية"
                      multiline
                      value={editor.item.description.en}
                      onChange={(value) =>
                        setEditor({
                          ...editor,
                          item: {
                            ...editor.item,
                            description: {
                              ...editor.item.description,
                              en: value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                </>
              ) : (
                <TextField
                  label="اسم الشريك"
                  required
                  value={editor.item.name}
                  onChange={(value) =>
                    setEditor({
                      ...editor,
                      item: { ...editor.item, name: value },
                    })
                  }
                />
              )}
              <ImageField
                label={
                  editor.kind === "projects" ? "صورة العمل" : "شعار الشريك"
                }
                value={editor.item.image}
                onChange={(value) =>
                  setEditor((prev) =>
                    prev
                      ? ({
                          ...prev,
                          item: { ...prev.item, image: value },
                        } as Editor)
                      : null,
                  )
                }
                onError={report}
              />
              <TextField
                label="رابط الموقع"
                type="url"
                value={editor.item.url}
                onChange={(value) =>
                  setEditor((prev) =>
                    prev
                      ? ({
                          ...prev,
                          item: { ...prev.item, url: value },
                        } as Editor)
                      : null,
                  )
                }
              />
              <label className="adm-checkbox">
                <input
                  type="checkbox"
                  checked={editor.item.visible}
                  onChange={(event) =>
                    setEditor((prev) =>
                      prev
                        ? ({
                            ...prev,
                            item: {
                              ...prev.item,
                              visible: event.target.checked,
                            },
                          } as Editor)
                        : null,
                    )
                  }
                />
                ظاهر على الموقع
              </label>
              {notice?.error ? (
                <p className="adm-alert" role="alert">
                  {notice.text}
                </p>
              ) : null}
            </div>
            <div className="adm-dialog-footer">
              <button
                className="adm-button"
                type="button"
                onClick={() => setEditor(null)}
              >
                إلغاء
              </button>
              <button className="adm-button adm-primary" type="submit">
                <Check size={16} />
                تطبيق
              </button>
            </div>
          </form>
        </dialog>
      ) : null}
    </main>
  );
}
