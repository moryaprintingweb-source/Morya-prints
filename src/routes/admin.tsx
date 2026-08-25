import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Boxes,
  ChevronDown,
  ExternalLink,
  Image,
  LayoutDashboard,
  LogOut,
  Mail,
  Package,
  Phone,
  RefreshCcw,
  Save,
  Search,
  ShoppingBag,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { allProducts as frontendProducts, catalog as frontendCatalog } from "../data/catalog";
import heroImg from "../assets/hero.jpg";
import ledImg from "../assets/led-sign.jpg";
import printingImg from "../assets/printing.jpg";
import {
  api,
  clearAdminToken,
  getAdminToken,
  setAdminToken,
  type ApiCategory,
  type ApiBlogPost,
  type ApiGalleryItem,
  type ApiProduct,
} from "../lib/api";
import { toast } from "sonner";

type Summary = {
  products: number;
  orders: number;
  newInquiries: number;
  quotedValue: number;
};

type Inquiry = {
  id: number;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  status: "new" | "contacted" | "closed";
  created_at: string;
};

type Order = {
  id: number;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  total: number;
  status: "new" | "quoted" | "in_progress" | "completed" | "cancelled";
  created_at: string;
  items: Array<{
    id: number;
    product_name: string;
    category_name?: string;
    quantity: number;
    price: number;
  }>;
};

type ProductForm = {
  id?: number;
  categoryId: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  startingAt: string;
  mrp: string;
  quantity: string;
  singleSidePrice: string;
  bothSidePrice: string;
  offerLabel: string;
  offerPercent: string;
  offerActive: boolean;
  offerStartsAt: string;
  offerEndsAt: string;
  isActive: boolean;
};

type CategoryForm = {
  id?: number;
  name: string;
  slug: string;
  eyebrow: string;
  sortOrder: string;
  isActive: boolean;
};

type GalleryForm = {
  id?: number;
  title: string;
  imageUrl: string;
  height: string;
  sortOrder: string;
  isActive: boolean;
};

type BlogForm = {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  tag: string;
  publishedAt: string;
  isActive: boolean;
};

type SiteSetting = {
  setting_key: string;
  setting_value: string;
  label: string;
  fallback_value?: string;
};

type Section =
  | "dashboard"
  | "products"
  | "categories"
  | "announcement"
  | "banners"
  | "business"
  | "homepage"
  | "gallery"
  | "blogs"
  | "orders";
type ProductView = "list" | "add";
type UploadHandler = (file: File) => Promise<string>;

const emptyProduct: ProductForm = {
  categoryId: "",
  slug: "",
  name: "",
  description: "",
  imageUrl: "",
  startingAt: "",
  mrp: "",
  quantity: "",
  singleSidePrice: "",
  bothSidePrice: "",
  offerLabel: "",
  offerPercent: "",
  offerActive: false,
  offerStartsAt: "",
  offerEndsAt: "",
  isActive: true,
};

const emptyCategory: CategoryForm = {
  name: "",
  slug: "",
  eyebrow: "",
  sortOrder: "",
  isActive: true,
};

const emptyGalleryItem: GalleryForm = {
  title: "",
  imageUrl: "",
  height: "420",
  sortOrder: "",
  isActive: true,
};

const emptyBlogPost: BlogForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  imageUrl: "",
  tag: "",
  publishedAt: "",
  isActive: true,
};

const fallbackCategories: ApiCategory[] = frontendCatalog.map((category, index) => ({
  id: index + 1,
  slug: category.slug,
  name: category.name,
  eyebrow: category.eyebrow,
  is_active: 1,
  sort_order: index,
}));

const fallbackProducts: ApiProduct[] = frontendProducts.map((product, index) => {
  const categoryIndex = frontendCatalog.findIndex(
    (category) => category.slug === product.category.slug,
  );
  return {
    id: index + 1,
    slug: product.slug,
    name: product.name,
    description: product.description,
    imageUrl: product.image,
    startingAt: product.startingAt,
    mrp: product.mrp,
    quantity: product.quantity,
    singleSidePrice: product.singleSidePrice,
    bothSidePrice: product.bothSidePrice,
    offerLabel: product.offerLabel,
    offerPercent: product.offerPercent,
    offerActive: product.offerActive,
    offerStartsAt: product.offerStartsAt,
    offerEndsAt: product.offerEndsAt,
    isActive: true,
    category: {
      id: categoryIndex + 1,
      slug: product.category.slug,
      name: product.category.name,
      eyebrow: product.category.eyebrow,
    },
  };
});

const defaultSiteSettings: SiteSetting[] = [
  {
    setting_key: "announcement_bar_text",
    setting_value: "YOUR TRUSTED PRINTING PARTNER FOR FAST & QUALITY PRINTS.",
    label: "Announcement bar text",
  },
  {
    setting_key: "home_hero_1_image",
    setting_value: "",
    label: "Homepage banner 1 image URL",
    fallback_value: heroImg,
  },
  {
    setting_key: "home_hero_2_image",
    setting_value: "",
    label: "Homepage banner 2 image URL",
    fallback_value: printingImg,
  },
  {
    setting_key: "home_hero_3_image",
    setting_value: "",
    label: "Homepage banner 3 image URL",
    fallback_value: ledImg,
  },
  {
    setting_key: "home_hero_1_eyebrow",
    setting_value: "Business essentials",
    label: "Hero 1 small heading",
  },
  {
    setting_key: "home_hero_1_title",
    setting_value: "Premium visiting cards, flyers and brand stationery.",
    label: "Hero 1 title",
  },
  {
    setting_key: "home_hero_1_text",
    setting_value:
      "Create a polished first impression with sharp print quality and custom finishes.",
    label: "Hero 1 description",
  },
  {
    setting_key: "home_hero_1_button",
    setting_value: "Explore products",
    label: "Hero 1 button text",
  },
  {
    setting_key: "home_hero_1_slug",
    setting_value: "visiting-cards",
    label: "Hero 1 button product category",
  },
  {
    setting_key: "home_hero_2_eyebrow",
    setting_value: "Outdoor visibility",
    label: "Hero 2 small heading",
  },
  {
    setting_key: "home_hero_2_title",
    setting_value: "Flex, vinyl, sunboard and signage that gets noticed.",
    label: "Hero 2 title",
  },
  {
    setting_key: "home_hero_2_text",
    setting_value: "Durable branding for shops, events, exhibitions and local promotions.",
    label: "Hero 2 description",
  },
  {
    setting_key: "home_hero_2_button",
    setting_value: "Shop signage",
    label: "Hero 2 button text",
  },
  {
    setting_key: "home_hero_2_slug",
    setting_value: "flex-printing",
    label: "Hero 2 button product category",
  },
  {
    setting_key: "home_hero_3_eyebrow",
    setting_value: "Custom print jobs",
    label: "Hero 3 small heading",
  },
  {
    setting_key: "home_hero_3_title",
    setting_value: "Labels, stickers, brochures and packaging print.",
    label: "Hero 3 title",
  },
  {
    setting_key: "home_hero_3_text",
    setting_value:
      "Choose practical materials, sharp finishing and local support for every print job.",
    label: "Hero 3 description",
  },
  {
    setting_key: "home_hero_3_button",
    setting_value: "Get a quote",
    label: "Hero 3 button text",
  },
  {
    setting_key: "home_hero_3_slug",
    setting_value: "brochure-book",
    label: "Hero 3 button product category",
  },
  {
    setting_key: "home_promo_left_image",
    setting_value: "",
    label: "Left promo image URL",
    fallback_value: ledImg,
  },
  {
    setting_key: "home_promo_right_image",
    setting_value: "",
    label: "Right promo image URL",
    fallback_value: printingImg,
  },
  {
    setting_key: "home_promo_left_eyebrow",
    setting_value: "Preserve a premium first impression",
    label: "Left promo small heading",
  },
  {
    setting_key: "home_promo_left_title",
    setting_value: "Print polished brochures, letter heads and bill books.",
    label: "Left promo title",
  },
  {
    setting_key: "home_promo_right_eyebrow",
    setting_value: "Wear and display your brand",
    label: "Right promo small heading",
  },
  {
    setting_key: "home_promo_right_title",
    setting_value: "Custom stickers, flex, vinyl and sunboard prints for teams and events.",
    label: "Right promo title",
  },
  {
    setting_key: "business_phone_display",
    setting_value: "+91 85548 42103",
    label: "Phone display text",
  },
  {
    setting_key: "business_phone_link",
    setting_value: "+918554842103",
    label: "Phone link number",
  },
  {
    setting_key: "business_whatsapp_number",
    setting_value: "918554842103",
    label: "WhatsApp number",
  },
  {
    setting_key: "business_email",
    setting_value: "Moryaprintingweb@gmail.com",
    label: "Email address",
  },
  {
    setting_key: "business_address",
    setting_value:
      "Shop No. 3, Jeet Building, near Jeet Ground, Lokmanya Colony, Kothrud, Pune 411038",
    label: "Business address",
  },
  {
    setting_key: "business_maps_url",
    setting_value: "https://maps.app.goo.gl/TSBbNMXqBig85rtJ9",
    label: "Google Maps URL",
  },
  {
    setting_key: "business_google_url",
    setting_value: "https://share.google/3stt5fmHZPr0ByYUY",
    label: "Google Business Profile URL",
  },
];

async function settle<T>(request: Promise<T>, fallback: T) {
  try {
    return await request;
  } catch {
    return fallback;
  }
}

function isAuthError(error: unknown) {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("token") || message.includes("credential") || message.includes("unauthorized")
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function Admin() {
  const [token, setToken] = useState(() => getAdminToken() ?? "");
  const [email, setEmail] = useState("admin@moryaprints.local");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [galleryItems, setGalleryItems] = useState<ApiGalleryItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<ApiBlogPost[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSetting[]>(defaultSiteSettings);
  const [usingFallbackCatalog, setUsingFallbackCatalog] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyProduct);
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(emptyCategory);
  const [galleryForm, setGalleryForm] = useState<GalleryForm>(emptyGalleryItem);
  const [blogForm, setBlogForm] = useState<BlogForm>(emptyBlogPost);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [productView, setProductView] = useState<ProductView>("list");
  const [search, setSearch] = useState("");

  const selectedCategory = useMemo(
    () => categories.find((category) => String(category.id) === form.categoryId),
    [categories, form.categoryId],
  );

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        `${product.name} ${product.slug} ${product.category.name}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [products, search],
  );

  useEffect(() => {
    if (token) void loadAdminData();
  }, [token]);

  async function loadAdminData() {
    setError("");
    setNotice("");
    let summaryData: Summary;

    try {
      summaryData = await api<Summary>("/api/admin/summary");
    } catch (summaryError) {
      if (isAuthError(summaryError)) {
        clearAdminToken();
        setToken("");
        setError("Session expired. Please sign in again.");
        return;
      }

      summaryData = {
        products: fallbackProducts.length,
        orders: 0,
        newInquiries: 0,
        quotedValue: 0,
      };
    }

    const [categoryData, productData, orderData, inquiryData, settingsData, galleryData, blogData] =
      await Promise.all([
        settle<{ categories: ApiCategory[] }>(api("/api/admin/categories"), {
          categories: fallbackCategories,
        }),
        settle<{ products: ApiProduct[] }>(api("/api/admin/products"), {
          products: fallbackProducts,
        }),
        settle<{ orders: Order[] }>(api("/api/admin/orders"), { orders: [] }),
        settle<{ inquiries: Inquiry[] }>(api("/api/admin/inquiries"), { inquiries: [] }),
        settle<{ settings: SiteSetting[] }>(api("/api/admin/site-settings"), {
          settings: defaultSiteSettings,
        }),
        settle<{ items: ApiGalleryItem[] }>(api("/api/admin/gallery"), { items: [] }),
        settle<{ posts: ApiBlogPost[] }>(api("/api/admin/blog-posts"), { posts: [] }),
      ]);

    const fallbackMode = productData.products === fallbackProducts;
    setSummary(summaryData);
    setCategories(categoryData.categories);
    setProducts(productData.products);
    setOrders(orderData.orders);
    setInquiries(inquiryData.inquiries);
    setGalleryItems(galleryData.items);
    setBlogPosts(blogData.posts);
    setSiteSettings(mergeSettings(settingsData.settings));
    setUsingFallbackCatalog(fallbackMode);
    setForm((current) => ({
      ...current,
      categoryId: current.categoryId || String(categoryData.categories[0]?.id ?? ""),
    }));

    if (fallbackMode) {
      setError(
        "Website database is not connected. You can view the current catalog, but changes cannot be saved yet.",
      );
    }
  }

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setError("");
      const result = await api<{ token: string }>("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setAdminToken(result.token);
      setToken(result.token);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed");
    }
  }

  function logout() {
    clearAdminToken();
    setToken("");
    setSummary(null);
    setError("");
    setNotice("");
    setUsingFallbackCatalog(false);
  }

  function changeSection(section: Section) {
    setActiveSection(section);
    setNotice("");
    setError("");
  }

  function openProductView(view: ProductView) {
    setActiveSection("products");
    setProductView(view);
    setNotice("");
    setError("");
    if (view === "add") {
      setForm({ ...emptyProduct, categoryId: form.categoryId || String(categories[0]?.id ?? "") });
    }
  }

  function editProduct(product: ApiProduct) {
    setForm({
      id: product.id,
      categoryId: String(product.category.id),
      slug: product.slug,
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl ?? "",
      startingAt: String(product.startingAt),
      mrp: product.mrp ? String(product.mrp) : "",
      quantity: product.quantity ?? "",
      singleSidePrice: product.singleSidePrice ?? "",
      bothSidePrice: product.bothSidePrice ?? "",
      offerLabel: product.offerLabel ?? "",
      offerPercent: product.offerPercent ? String(product.offerPercent) : "",
      offerActive: Boolean(product.offerActive),
      offerStartsAt: product.offerStartsAt?.slice(0, 10) ?? "",
      offerEndsAt: product.offerEndsAt?.slice(0, 10) ?? "",
      isActive: product.isActive,
    });
    setActiveSection("products");
    setProductView("add");
    setNotice(`Editing ${product.name}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (usingFallbackCatalog) {
      setError("Website database is not connected. Product changes cannot be saved yet.");
      return;
    }
    setSaving(true);
    try {
      await api(form.id ? `/api/admin/products/${form.id}` : "/api/admin/products", {
        method: form.id ? "PUT" : "POST",
        body: JSON.stringify({
          ...form,
          categoryId: Number(form.categoryId),
          startingAt: Number(form.startingAt),
          mrp: form.mrp ? Number(form.mrp) : null,
          offerPercent: Number(form.offerPercent) || 0,
          offerStartsAt: form.offerStartsAt || null,
          offerEndsAt: form.offerEndsAt || null,
        }),
      });
      setNotice(form.id ? "Product updated." : "Product added.");
      setForm({ ...emptyProduct, categoryId: form.categoryId });
      await loadAdminData();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save product");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(productId: number) {
    if (usingFallbackCatalog) {
      setError("Website database is not connected. Products cannot be deleted yet.");
      return;
    }
    if (!window.confirm("Delete this product from the website catalog?")) return;
    try {
      await api(`/api/admin/products/${productId}`, { method: "DELETE" });
      setNotice("Product deleted.");
      await loadAdminData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete product");
    }
  }

  async function saveCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (usingFallbackCatalog) {
      setError("Website database is not connected. Category changes cannot be saved yet.");
      return;
    }

    try {
      await api(
        categoryForm.id ? `/api/admin/categories/${categoryForm.id}` : "/api/admin/categories",
        {
          method: categoryForm.id ? "PUT" : "POST",
          body: JSON.stringify({
            ...categoryForm,
            sortOrder: Number(categoryForm.sortOrder) || categories.length,
          }),
        },
      );
      setNotice(categoryForm.id ? "Category updated." : "Category added.");
      setCategoryForm(emptyCategory);
      await loadAdminData();
    } catch (categoryError) {
      setError(categoryError instanceof Error ? categoryError.message : "Unable to save category");
    }
  }

  function editCategory(category: ApiCategory) {
    setActiveSection("categories");
    setCategoryForm({
      id: category.id,
      name: category.name,
      slug: category.slug,
      eyebrow: category.eyebrow ?? "",
      sortOrder: String(category.sort_order ?? 0),
      isActive: Boolean(category.is_active),
    });
    setNotice(`Editing ${category.name}`);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetCategoryForm() {
    setCategoryForm(emptyCategory);
    setNotice("");
    setError("");
  }

  async function deleteCategory(category: ApiCategory) {
    if (usingFallbackCatalog) {
      setError("Website database is not connected. Categories cannot be deleted yet.");
      return;
    }

    const productCount = products.filter(
      (product) => product.category.slug === category.slug,
    ).length;
    const productMessage =
      productCount > 0
        ? ` This will also delete ${productCount} ${productCount === 1 ? "product" : "products"} in this category.`
        : "";

    if (!window.confirm(`Delete category ${category.name}?${productMessage}`)) return;
    try {
      await api(`/api/admin/categories/${category.id}`, { method: "DELETE" });
      setNotice("Category deleted.");
      if (categoryForm.id === category.id) setCategoryForm(emptyCategory);
      await loadAdminData();
    } catch (categoryError) {
      setError(
        categoryError instanceof Error ? categoryError.message : "Unable to delete category",
      );
    }
  }

  function editGalleryItem(item: ApiGalleryItem) {
    setActiveSection("gallery");
    setGalleryForm({
      id: item.id,
      title: item.title,
      imageUrl: item.image_url,
      height: String(item.height),
      sortOrder: String(item.sort_order ?? 0),
      isActive: Boolean(item.is_active),
    });
    setNotice(`Editing ${item.title}`);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveGalleryItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (usingFallbackCatalog) {
      setError("Website database is not connected. Gallery changes cannot be saved yet.");
      return;
    }

    try {
      await api(galleryForm.id ? `/api/admin/gallery/${galleryForm.id}` : "/api/admin/gallery", {
        method: galleryForm.id ? "PUT" : "POST",
        body: JSON.stringify({
          ...galleryForm,
          height: Number(galleryForm.height) || 420,
          sortOrder: Number(galleryForm.sortOrder) || galleryItems.length,
        }),
      });
      setNotice(galleryForm.id ? "Gallery item updated." : "Gallery item added.");
      setGalleryForm(emptyGalleryItem);
      await loadAdminData();
    } catch (galleryError) {
      setError(
        galleryError instanceof Error ? galleryError.message : "Unable to save gallery item",
      );
    }
  }

  async function deleteGalleryItem(id: number) {
    if (usingFallbackCatalog) {
      setError("Website database is not connected. Gallery items cannot be deleted yet.");
      return;
    }
    if (!window.confirm("Delete this gallery item?")) return;
    try {
      await api(`/api/admin/gallery/${id}`, { method: "DELETE" });
      setNotice("Gallery item deleted.");
      await loadAdminData();
    } catch (galleryError) {
      setError(
        galleryError instanceof Error ? galleryError.message : "Unable to delete gallery item",
      );
    }
  }

  function editBlogPost(post: ApiBlogPost) {
    setActiveSection("blogs");
    setBlogForm({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content ?? "",
      imageUrl: post.image_url,
      tag: post.tag ?? "",
      publishedAt: post.published_at ?? "",
      isActive: Boolean(post.is_active),
    });
    setNotice(`Editing ${post.title}`);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveBlogPost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (usingFallbackCatalog) {
      setError("Website database is not connected. Blog changes cannot be saved yet.");
      return;
    }

    try {
      await api(blogForm.id ? `/api/admin/blog-posts/${blogForm.id}` : "/api/admin/blog-posts", {
        method: blogForm.id ? "PUT" : "POST",
        body: JSON.stringify(blogForm),
      });
      setNotice(blogForm.id ? "Blog post updated." : "Blog post added.");
      setBlogForm(emptyBlogPost);
      await loadAdminData();
    } catch (blogError) {
      setError(blogError instanceof Error ? blogError.message : "Unable to save blog post");
    }
  }

  async function deleteBlogPost(id: number) {
    if (usingFallbackCatalog) {
      setError("Website database is not connected. Blog posts cannot be deleted yet.");
      return;
    }
    if (!window.confirm("Delete this blog post?")) return;
    try {
      await api(`/api/admin/blog-posts/${id}`, { method: "DELETE" });
      setNotice("Blog post deleted.");
      await loadAdminData();
    } catch (blogError) {
      setError(blogError instanceof Error ? blogError.message : "Unable to delete blog post");
    }
  }

  async function updateStatus(kind: "orders" | "inquiries", id: number, status: string) {
    await api(`/api/admin/${kind}/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    await loadAdminData();
  }

  async function saveSiteSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (usingFallbackCatalog) {
      setError("Website database is not connected. Website settings cannot be saved yet.");
      toast.error("Database is not connected. Settings were not saved.");
      return;
    }
    try {
      await api("/api/admin/site-settings", {
        method: "PUT",
        body: JSON.stringify({ settings: siteSettings }),
      });
      setNotice("Settings saved. Refresh the storefront to see changes.");
      toast.success("Settings saved.");
      await loadAdminData();
    } catch (settingError) {
      const message =
        settingError instanceof Error ? settingError.message : "Unable to save settings";
      setError(message);
      toast.error(message);
    }
  }

  async function uploadAdminImage(file: File) {
    const dataUrl = await readFileAsDataUrl(file);
    const result = await api<{ url: string }>("/api/uploads", {
      method: "POST",
      body: JSON.stringify({
        fileName: file.name,
        mimeType: file.type,
        dataUrl,
      }),
    });
    return result.url;
  }

  if (!token) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#eef0f4] p-4">
        <form onSubmit={login} className="w-full max-w-md rounded-[1.25rem] bg-white p-7 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-[.2em] text-[#6d50d9]">Admin</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-navy">
            Morya Prints Admin Panel
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage products, banners, announcement bar and orders.
          </p>
          <Field label="Email" value={email} onChange={setEmail} />
          <Field label="Password" value={password} type="password" onChange={setPassword} />
          {error && <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>}
          <button className="mt-6 w-full rounded-2xl bg-[#6d50d9] px-4 py-3 font-bold text-white">
            Sign in
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#eef0f4] p-2 md:p-4">
      <div className="mx-auto grid w-full max-w-[1760px] gap-4 rounded-2xl bg-white p-3 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)] xl:p-4">
        <aside className="rounded-[1.6rem] bg-[#6d50d9] p-5 text-white lg:min-h-[calc(100vh-56px)] xl:p-7">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15">
              <LayoutDashboard className="h-7 w-7 text-yellow-300" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-[.28em] text-white/75">
                Admin
              </div>
              <h1 className="font-display text-2xl font-bold">Morya Panel</h1>
            </div>
          </div>
          <p className="mt-7 max-w-[280px] text-sm leading-7 text-white">
            Manage store content, products, banners, announcement text, enquiries and orders.
          </p>
          <nav className="mt-9 space-y-2">
            <SidebarButton
              icon={LayoutDashboard}
              label="Dashboard"
              active={activeSection === "dashboard"}
              onClick={() => changeSection("dashboard")}
            />
            <SidebarProductMenu
              active={activeSection === "products"}
              productView={productView}
              onOpenList={() => openProductView("list")}
              onOpenAdd={() => openProductView("add")}
            />
            <SidebarButton
              icon={Boxes}
              label="Categories"
              active={activeSection === "categories"}
              onClick={() => changeSection("categories")}
            />
            <SidebarButton
              icon={Bell}
              label="Announcement Bar"
              active={activeSection === "announcement"}
              onClick={() => changeSection("announcement")}
            />
            <SidebarButton
              icon={Image}
              label="Banners"
              active={activeSection === "banners"}
              onClick={() => changeSection("banners")}
            />
            <SidebarButton
              icon={LayoutDashboard}
              label="Homepage Text"
              active={activeSection === "homepage"}
              onClick={() => changeSection("homepage")}
            />
            <SidebarButton
              icon={Phone}
              label="Business Info"
              active={activeSection === "business"}
              onClick={() => changeSection("business")}
            />
            <SidebarButton
              icon={Image}
              label="Gallery"
              active={activeSection === "gallery"}
              onClick={() => changeSection("gallery")}
            />
            <SidebarButton
              icon={Mail}
              label="Blogs"
              active={activeSection === "blogs"}
              onClick={() => changeSection("blogs")}
            />
            <SidebarButton
              icon={ShoppingBag}
              label="Orders"
              active={activeSection === "orders"}
              onClick={() => changeSection("orders")}
            />
          </nav>
        </aside>

        <section className="min-w-0 overflow-hidden rounded-2xl bg-[#eef0f4] p-3 md:p-4 xl:p-5">
          <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_auto]">
            <label className="flex min-h-16 overflow-hidden rounded-xl border bg-white">
              <span className="sr-only">Search admin content</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products"
                className="min-w-0 flex-1 px-5 text-lg outline-none placeholder:text-slate-400"
              />
              <span className="grid w-16 place-items-center border-l">
                <Search className="h-6 w-6" />
              </span>
            </label>
            <div className="flex min-w-0 flex-wrap items-center justify-end gap-3 rounded-xl border bg-white p-3">
              <div className="hidden text-right sm:block">
                <div className="font-display text-2xl font-bold">Admin</div>
                <div className="text-sm text-muted-foreground">Website Manager</div>
              </div>
              <a
                href="/"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-bold"
              >
                View Store <ExternalLink className="h-4 w-4" />
              </a>
              <button
                onClick={loadAdminData}
                className="inline-flex items-center gap-2 rounded-full bg-[#6d50d9] px-5 py-3 text-sm font-bold text-white"
              >
                <RefreshCcw className="h-4 w-4" /> Refresh
              </button>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}
          {notice && (
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm font-semibold text-green-700">
              {notice}
            </div>
          )}

          <DashboardCards summary={summary} products={products} orders={orders} />

          {activeSection === "dashboard" && (
            <section className="mt-6 rounded-xl border bg-white p-5">
              <h2 className="font-display text-3xl font-bold">Recent Orders</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Orders placed from the website show up here automatically.
              </p>
              <OrdersTable orders={orders} onStatusChange={updateStatus} />
            </section>
          )}

          {activeSection === "products" && (
            <section className="mt-6 grid gap-5">
              {productView === "add" && (
                <ProductEditor
                  form={form}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  saving={saving}
                  disabled={usingFallbackCatalog}
                  onSubmit={saveProduct}
                  onNew={() => setForm({ ...emptyProduct, categoryId: form.categoryId })}
                  onChange={setFormField}
                  onUpload={uploadAdminImage}
                />
              )}
              {productView === "list" && (
                <ProductsTable
                  products={filteredProducts}
                  disabled={usingFallbackCatalog}
                  onEdit={editProduct}
                  onDelete={deleteProduct}
                />
              )}
            </section>
          )}

          {activeSection === "categories" && (
            <section className="mt-6 grid gap-5 2xl:grid-cols-[360px_minmax(0,1fr)]">
              <CategoryEditor
                form={categoryForm}
                disabled={usingFallbackCatalog}
                onSubmit={saveCategory}
                onNew={resetCategoryForm}
                onChange={setCategoryField}
              />
              <CategoriesGrid
                categories={categories}
                products={products}
                disabled={usingFallbackCatalog}
                onEdit={editCategory}
                onDelete={deleteCategory}
              />
            </section>
          )}

          {activeSection === "announcement" && (
            <SettingsPanel
              title="Announcement Bar"
              description="Change the red announcement bar text shown at the top of the website."
              settings={siteSettings.filter(
                (setting) => setting.setting_key === "announcement_bar_text",
              )}
              disabled={usingFallbackCatalog}
              onChange={updateSetting}
              onSubmit={saveSiteSettings}
              onUpload={uploadAdminImage}
            />
          )}

          {activeSection === "banners" && (
            <SettingsPanel
              title="Banners"
              description="Change homepage hero images and the two promotional images."
              settings={siteSettings.filter(
                (setting) =>
                  ["home_hero_1_image", "home_hero_2_image", "home_hero_3_image"].includes(
                    setting.setting_key,
                  ) ||
                  (setting.setting_key.startsWith("home_promo_") &&
                    setting.setting_key.endsWith("_image")),
              )}
              disabled={usingFallbackCatalog}
              onChange={updateSetting}
              onSubmit={saveSiteSettings}
              onUpload={uploadAdminImage}
            />
          )}

          {activeSection === "homepage" && (
            <SettingsPanel
              title="Homepage Text"
              description="Change hero slide text, button text, linked product categories and promotional banner text."
              settings={siteSettings.filter(
                (setting) =>
                  (setting.setting_key.startsWith("home_hero_") &&
                    !setting.setting_key.endsWith("_image")) ||
                  (setting.setting_key.startsWith("home_promo_") &&
                    !setting.setting_key.endsWith("_image")),
              )}
              disabled={usingFallbackCatalog}
              onChange={updateSetting}
              onSubmit={saveSiteSettings}
            />
          )}

          {activeSection === "business" && (
            <SettingsPanel
              title="Business Info"
              description="Change phone, WhatsApp, email, address and map links shown on the website."
              settings={siteSettings.filter((setting) =>
                setting.setting_key.startsWith("business_"),
              )}
              disabled={usingFallbackCatalog}
              onChange={updateSetting}
              onSubmit={saveSiteSettings}
            />
          )}

          {activeSection === "gallery" && (
            <section className="mt-6 grid gap-5 2xl:grid-cols-[360px_minmax(0,1fr)]">
              <GalleryEditor
                form={galleryForm}
                disabled={usingFallbackCatalog}
                onSubmit={saveGalleryItem}
                onNew={() => setGalleryForm(emptyGalleryItem)}
                onChange={setGalleryField}
                onUpload={uploadAdminImage}
              />
              <GalleryGrid
                items={galleryItems}
                disabled={usingFallbackCatalog}
                onEdit={editGalleryItem}
                onDelete={deleteGalleryItem}
              />
            </section>
          )}

          {activeSection === "blogs" && (
            <section className="mt-6 grid gap-5 2xl:grid-cols-[420px_minmax(0,1fr)]">
              <BlogEditor
                form={blogForm}
                disabled={usingFallbackCatalog}
                onSubmit={saveBlogPost}
                onNew={() => setBlogForm(emptyBlogPost)}
                onChange={setBlogField}
                onUpload={uploadAdminImage}
              />
              <BlogList
                posts={blogPosts}
                disabled={usingFallbackCatalog}
                onEdit={editBlogPost}
                onDelete={deleteBlogPost}
              />
            </section>
          )}

          {activeSection === "orders" && (
            <section className="mt-6 grid gap-5 2xl:grid-cols-2">
              <AdminList title="Orders">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} onStatusChange={updateStatus} />
                ))}
              </AdminList>
              <AdminList title="Enquiries">
                {inquiries.map((inquiry) => (
                  <InquiryCard key={inquiry.id} inquiry={inquiry} onStatusChange={updateStatus} />
                ))}
              </AdminList>
            </section>
          )}
        </section>
      </div>
    </main>
  );

  function setFormField<Key extends keyof ProductForm>(key: Key, value: ProductForm[Key]) {
    setForm((current) => {
      if (current.id) return { ...current, [key]: value };

      if (key === "name" && typeof value === "string") {
        const previousAutoSlug = productSlug(current.name, current.categoryId);
        const shouldUpdateSlug = !current.slug || current.slug === previousAutoSlug;
        return {
          ...current,
          name: value,
          slug: shouldUpdateSlug ? productSlug(value, current.categoryId) : current.slug,
        };
      }

      if (key === "categoryId" && typeof value === "string") {
        const previousAutoSlug = productSlug(current.name, current.categoryId);
        const shouldUpdateSlug = !current.slug || current.slug === previousAutoSlug;
        return {
          ...current,
          categoryId: value,
          slug: shouldUpdateSlug ? productSlug(current.name, value) : current.slug,
        };
      }

      return { ...current, [key]: value };
    });
  }

  function updateSetting(key: string, value: string) {
    setSiteSettings((current) =>
      current.map((setting) =>
        setting.setting_key === key ? { ...setting, setting_value: value } : setting,
      ),
    );
  }

  function setCategoryField<Key extends keyof CategoryForm>(key: Key, value: CategoryForm[Key]) {
    setCategoryForm((current) => {
      if (current.id || key !== "name" || typeof value !== "string") {
        return { ...current, [key]: value };
      }

      const previousAutoSlug = slugify(current.name);
      const shouldUpdateSlug = !current.slug || current.slug === previousAutoSlug;
      return {
        ...current,
        name: value,
        slug: shouldUpdateSlug ? slugify(value) : current.slug,
      };
    });
  }

  function productSlug(name: string, categoryId: string) {
    const category = categories.find((item) => String(item.id) === categoryId);
    return slugify(`${category?.slug ?? ""} ${name}`);
  }

  function setGalleryField<Key extends keyof GalleryForm>(key: Key, value: GalleryForm[Key]) {
    setGalleryForm((current) => ({ ...current, [key]: value }));
  }

  function setBlogField<Key extends keyof BlogForm>(key: Key, value: BlogForm[Key]) {
    setBlogForm((current) => {
      if (current.id || key !== "title" || typeof value !== "string") {
        return { ...current, [key]: value };
      }

      const previousAutoSlug = slugify(current.title);
      const shouldUpdateSlug = !current.slug || current.slug === previousAutoSlug;
      return {
        ...current,
        title: value,
        slug: shouldUpdateSlug ? slugify(value) : current.slug,
      };
    });
  }
}

function mergeSettings(settings: SiteSetting[]) {
  const merged = defaultSiteSettings.map((defaultSetting) => {
    const saved = settings.find((setting) => setting.setting_key === defaultSetting.setting_key);
    return saved
      ? {
          ...saved,
          label: defaultSetting.label,
          fallback_value: defaultSetting.fallback_value,
        }
      : defaultSetting;
  });
  return merged;
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    new: "New",
    quoted: "Quote Sent",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
    contacted: "Contacted",
    closed: "Closed",
  };
  return labels[status] ?? status;
}

function settingPlaceholder(key: string) {
  if (key === "announcement_bar_text") return "Announcement text";
  if (key.endsWith("_image")) return "Paste image URL here";
  if (key.endsWith("_slug")) return "visiting-cards";
  if (key.endsWith("_button")) return "Button text";
  if (key.endsWith("_title")) return "Heading shown on the website";
  if (key.endsWith("_text")) return "Short description shown on the website";
  if (key.includes("phone")) return "+91 85548 42103";
  if (key.includes("whatsapp")) return "918554842103";
  if (key.includes("email")) return "name@example.com";
  if (key.includes("url")) return "https://example.com";
  return "Enter website content";
}

function isImageSetting(key: string) {
  return key.endsWith("_image");
}

function SidebarProductMenu({
  active,
  productView,
  onOpenList,
  onOpenAdd,
}: {
  active: boolean;
  productView: ProductView;
  onOpenList: () => void;
  onOpenAdd: () => void;
}) {
  return (
    <div
      className={`rounded-2xl transition ${
        active ? "bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]" : ""
      }`}
    >
      <button
        type="button"
        onClick={onOpenList}
        className={`flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-left font-bold transition ${
          active ? "bg-white/15 text-white" : "bg-white/10 text-white hover:bg-white/15"
        }`}
      >
        <Package className={`h-5 w-5 ${active ? "text-white" : "text-yellow-200"}`} />
        <span className="flex-1">Products</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${active ? "rotate-180" : ""}`} />
      </button>
      {active && (
        <div className="space-y-1 px-8 pb-4 pt-3 text-sm">
          <button
            type="button"
            onClick={onOpenList}
            className={`block w-full rounded-xl px-3 py-2 text-left transition ${
              productView === "list" ? "bg-white/10 font-bold text-yellow-200" : "text-white"
            }`}
          >
            Product List
          </button>
          <button
            type="button"
            onClick={onOpenAdd}
            className={`block w-full rounded-xl px-3 py-2 text-left transition ${
              productView === "add" ? "bg-white/10 font-bold text-yellow-200" : "text-white"
            }`}
          >
            Add Product
          </button>
        </div>
      )}
    </div>
  );
}

function SidebarButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof LayoutDashboard;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-left font-bold transition ${
        active ? "bg-white/20 text-yellow-200" : "bg-white/10 text-white hover:bg-white/15"
      }`}
    >
      <Icon className="h-5 w-5" /> {label}
    </button>
  );
}

function DashboardCards({
  summary,
  products,
  orders,
}: {
  summary: Summary | null;
  products: ApiProduct[];
  orders: Order[];
}) {
  const cards = [
    { label: "Products", value: summary?.products ?? products.length, icon: Package },
    { label: "Orders", value: summary?.orders ?? orders.length, icon: ShoppingBag },
    { label: "New Enquiries", value: summary?.newInquiries ?? 0, icon: Mail },
    { label: "Total Order Value", value: `Rs. ${summary?.quotedValue ?? 0}`, icon: Save },
  ];
  return (
    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground">{card.label}</div>
              <div className="mt-4 font-display text-3xl font-bold">{card.value}</div>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-full bg-[#f1ebff] text-[#6d50d9]">
              <card.icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductEditor({
  form,
  categories,
  selectedCategory,
  saving,
  disabled,
  onSubmit,
  onNew,
  onChange,
  onUpload,
}: {
  form: ProductForm;
  categories: ApiCategory[];
  selectedCategory?: ApiCategory;
  saving: boolean;
  disabled: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onNew: () => void;
  onChange: <Key extends keyof ProductForm>(key: Key, value: ProductForm[Key]) => void;
  onUpload: UploadHandler;
}) {
  return (
    <form onSubmit={onSubmit} className="h-fit rounded-xl border bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">
          {form.id ? "Edit Product" : "Add Product"}
        </h2>
        {form.id && (
          <button type="button" onClick={onNew} className="text-sm font-bold text-[#6d50d9]">
            New Product
          </button>
        )}
      </div>
      <div className="grid gap-3">
        <Field label="Name" value={form.name} onChange={(value) => onChange("name", value)} />
        <Field
          label="Page URL (auto)"
          value={form.slug}
          onChange={(value) => onChange("slug", value)}
        />
        <label className="block text-sm font-bold text-navy">
          Category
          <select
            value={form.categoryId}
            onChange={(event) => onChange("categoryId", event.target.value)}
            className="mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#6d50d9]"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <Field
          label="Starting Price"
          value={form.startingAt}
          type="number"
          onChange={(value) => onChange("startingAt", value)}
        />
        <Field
          label="Old Price / MRP"
          value={form.mrp}
          type="number"
          required={false}
          onChange={(value) => onChange("mrp", value)}
        />
        <Field
          label="Quantity"
          value={form.quantity}
          onChange={(value) => onChange("quantity", value)}
        />
        <Field
          label="Image Link"
          value={form.imageUrl}
          onChange={(value) => onChange("imageUrl", value)}
        />
        <ImageUploadField
          disabled={disabled}
          label="Upload Product Image"
          value={form.imageUrl}
          onUpload={onUpload}
          onChange={(value) => onChange("imageUrl", value)}
        />
        <Field
          label="Single Side Price"
          value={form.singleSidePrice}
          onChange={(value) => onChange("singleSidePrice", value)}
        />
        <Field
          label="Both Side Price"
          value={form.bothSidePrice}
          onChange={(value) => onChange("bothSidePrice", value)}
        />
        <div className="rounded-xl border bg-[#fffef5] p-4">
          <div className="font-display text-lg font-bold text-navy">Offer</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Show a sale badge and old price on the storefront.
          </p>
          <Field
            label="Offer Label"
            value={form.offerLabel}
            required={false}
            onChange={(value) => onChange("offerLabel", value)}
          />
          <Field
            label="Offer Percent"
            value={form.offerPercent}
            type="number"
            required={false}
            onChange={(value) => onChange("offerPercent", value)}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Offer Start Date"
              value={form.offerStartsAt}
              type="date"
              required={false}
              onChange={(value) => onChange("offerStartsAt", value)}
            />
            <Field
              label="Offer End Date"
              value={form.offerEndsAt}
              type="date"
              required={false}
              onChange={(value) => onChange("offerEndsAt", value)}
            />
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm font-bold text-navy">
            <input
              type="checkbox"
              checked={form.offerActive}
              onChange={(event) => onChange("offerActive", event.target.checked)}
            />
            Show Offer on Website
          </label>
        </div>
        <label className="block text-sm font-bold text-navy">
          Description
          <textarea
            value={form.description}
            onChange={(event) => onChange("description", event.target.value)}
            rows={4}
            required
            className="mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#6d50d9]"
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-bold text-navy">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(event) => onChange("isActive", event.target.checked)}
          />
          Show on Website
        </label>
      </div>
      <button
        disabled={saving || disabled}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6d50d9] px-4 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
      >
        <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Product"}
      </button>
      {selectedCategory && (
        <p className="mt-3 text-xs text-muted-foreground">Saving under {selectedCategory.name}.</p>
      )}
    </form>
  );
}

function ProductsTable({
  products,
  disabled,
  onEdit,
  onDelete,
}: {
  products: ApiProduct[];
  disabled: boolean;
  onEdit: (product: ApiProduct) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <section className="rounded-xl border bg-white p-5">
      <h2 className="font-display text-3xl font-bold">Products</h2>
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-[760px] w-full table-auto text-left text-sm">
          <thead className="border-b text-xs uppercase text-muted-foreground">
            <tr>
              <th className="w-[36%] py-3">Product</th>
              <th className="w-[18%]">Category</th>
              <th className="w-[12%]">Price</th>
              <th className="w-[12%]">Status</th>
              <th className="w-[22%] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="py-3 pr-3">
                  <div className="break-words font-bold text-navy">{product.name}</div>
                  <div className="break-words text-xs text-muted-foreground">
                    Page: /products/{product.slug}
                  </div>
                </td>
                <td className="pr-3">{product.category.name}</td>
                <td className="pr-3">Rs. {product.startingAt}</td>
                <td className="pr-3">{product.isActive ? "Visible" : "Hidden"}</td>
                <td className="whitespace-nowrap text-right">
                  <button
                    onClick={() => onEdit(product)}
                    className="rounded-full bg-[#f1ebff] px-3 py-1.5 font-bold text-[#6d50d9]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    disabled={disabled}
                    className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 font-bold text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CategoryEditor({
  form,
  disabled,
  onSubmit,
  onNew,
  onChange,
}: {
  form: CategoryForm;
  disabled: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onNew: () => void;
  onChange: <Key extends keyof CategoryForm>(key: Key, value: CategoryForm[Key]) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="h-fit rounded-xl border bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-bold">
          {form.id ? "Edit Category" : "Add Category"}
        </h2>
        {form.id && (
          <button type="button" onClick={onNew} className="text-sm font-bold text-[#6d50d9]">
            New Category
          </button>
        )}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {form.id
          ? "Update the category shown on the website."
          : "Create a product category for the website catalog."}
      </p>
      <Field label="Name" value={form.name} onChange={(value) => onChange("name", value)} />
      <Field
        label="Page URL (auto)"
        value={form.slug}
        onChange={(value) => onChange("slug", value)}
      />
      <Field
        label="Small Heading"
        value={form.eyebrow}
        onChange={(value) => onChange("eyebrow", value)}
      />
      <Field
        label="Display Order"
        type="number"
        value={form.sortOrder}
        onChange={(value) => onChange("sortOrder", value)}
      />
      <label className="mt-4 flex items-center gap-2 text-sm font-bold text-navy">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(event) => onChange("isActive", event.target.checked)}
        />
        Show on Website
      </label>
      <button
        disabled={disabled}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6d50d9] px-4 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Save className="h-4 w-4" /> {form.id ? "Update Category" : "Save Category"}
      </button>
    </form>
  );
}

function CategoriesGrid({
  categories,
  products,
  disabled,
  onEdit,
  onDelete,
}: {
  categories: ApiCategory[];
  products: ApiProduct[];
  disabled: boolean;
  onEdit: (category: ApiCategory) => void;
  onDelete: (category: ApiCategory) => void;
}) {
  return (
    <section className="rounded-xl border bg-white p-5">
      <h2 className="font-display text-3xl font-bold">Categories</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          const productCount = products.filter(
            (product) => product.category.slug === category.slug,
          ).length;
          return (
            <article key={category.slug} className="rounded-xl border bg-[#fffef5] p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-orange">
                {productCount} {productCount === 1 ? "product" : "products"}
              </div>
              <h3 className="mt-2 font-display text-xl font-bold text-navy">{category.name}</h3>
              <p className="mt-1 min-h-5 text-sm text-muted-foreground">{category.eyebrow}</p>
              <div className="mt-3 break-words text-xs font-semibold text-muted-foreground">
                Page URL: {category.slug}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onEdit(category)}
                  className="inline-flex items-center gap-1 rounded-full bg-[#f1ebff] px-3 py-1.5 text-xs font-bold text-[#6d50d9] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Edit
                </button>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onDelete(category)}
                  className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function SettingsPanel({
  title,
  description,
  settings,
  disabled,
  onChange,
  onSubmit,
  onUpload,
}: {
  title: string;
  description: string;
  settings: SiteSetting[];
  disabled: boolean;
  onChange: (key: string, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onUpload?: UploadHandler;
}) {
  return (
    <form onSubmit={onSubmit} className="mt-6 rounded-xl border bg-white p-5">
      <h2 className="font-display text-3xl font-bold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-5 grid gap-4">
        {settings.map((setting) => (
          <div key={setting.setting_key}>
            <label className="block text-sm font-bold text-navy">
              {setting.label}
              <input
                value={setting.setting_value}
                placeholder={settingPlaceholder(setting.setting_key)}
                onChange={(event) => onChange(setting.setting_key, event.target.value)}
                className="mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#6d50d9]"
              />
            </label>
            {isImageSetting(setting.setting_key) && setting.fallback_value && (
              <div className="mt-2 grid gap-3 rounded-xl border bg-[#fffef5] p-3 sm:grid-cols-[120px_minmax(0,1fr)]">
                <img
                  src={setting.setting_value.trim() || setting.fallback_value}
                  alt=""
                  className="aspect-[4/3] w-full rounded-lg object-cover"
                />
                <div className="min-w-0 text-xs font-semibold text-muted-foreground">
                  <div className="text-navy">
                    {setting.setting_value.trim()
                      ? "Custom banner URL saved."
                      : "No custom URL saved. Website is using the default image shown here."}
                  </div>
                  {!setting.setting_value.trim() && setting.fallback_value && (
                    <div className="mt-1 break-all">Default image: {setting.fallback_value}</div>
                  )}
                </div>
              </div>
            )}
            {isImageSetting(setting.setting_key) && onUpload && (
              <ImageUploadField
                disabled={disabled}
                label="Upload Image"
                value={setting.setting_value}
                onUpload={onUpload}
                onChange={(value) => onChange(setting.setting_key, value)}
              />
            )}
          </div>
        ))}
      </div>
      <button
        disabled={disabled}
        className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#6d50d9] px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Save className="h-4 w-4" /> Save Changes
      </button>
    </form>
  );
}

function GalleryEditor({
  form,
  disabled,
  onSubmit,
  onNew,
  onChange,
  onUpload,
}: {
  form: GalleryForm;
  disabled: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onNew: () => void;
  onChange: <Key extends keyof GalleryForm>(key: Key, value: GalleryForm[Key]) => void;
  onUpload: UploadHandler;
}) {
  return (
    <form onSubmit={onSubmit} className="h-fit rounded-xl border bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-bold">
          {form.id ? "Edit Gallery Image" : "Add Gallery Image"}
        </h2>
        {form.id && (
          <button type="button" onClick={onNew} className="text-sm font-bold text-[#6d50d9]">
            New Image
          </button>
        )}
      </div>
      <Field label="Title" value={form.title} onChange={(value) => onChange("title", value)} />
      <Field
        label="Image Link"
        value={form.imageUrl}
        onChange={(value) => onChange("imageUrl", value)}
      />
      <ImageUploadField
        disabled={disabled}
        label="Upload Gallery Image"
        value={form.imageUrl}
        onUpload={onUpload}
        onChange={(value) => onChange("imageUrl", value)}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Image Height"
          value={form.height}
          type="number"
          onChange={(value) => onChange("height", value)}
        />
        <Field
          label="Display Order"
          value={form.sortOrder}
          type="number"
          required={false}
          onChange={(value) => onChange("sortOrder", value)}
        />
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm font-bold text-navy">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(event) => onChange("isActive", event.target.checked)}
        />
        Show on Website
      </label>
      <button
        disabled={disabled}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6d50d9] px-4 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Save className="h-4 w-4" /> {form.id ? "Update Image" : "Save Image"}
      </button>
    </form>
  );
}

function GalleryGrid({
  items,
  disabled,
  onEdit,
  onDelete,
}: {
  items: ApiGalleryItem[];
  disabled: boolean;
  onEdit: (item: ApiGalleryItem) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <section className="rounded-xl border bg-white p-5">
      <h2 className="font-display text-3xl font-bold">Gallery Images</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-xl border bg-white">
            <img
              src={item.image_url}
              alt={item.title}
              className="aspect-[5/4] w-full object-cover"
            />
            <div className="p-4">
              <h3 className="font-display text-lg font-bold text-navy">{item.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.is_active ? "Visible" : "Hidden"} | Position {item.sort_order}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="rounded-full bg-[#f1ebff] px-3 py-1.5 text-xs font-bold text-[#6d50d9]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onDelete(item.id)}
                  className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BlogEditor({
  form,
  disabled,
  onSubmit,
  onNew,
  onChange,
  onUpload,
}: {
  form: BlogForm;
  disabled: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onNew: () => void;
  onChange: <Key extends keyof BlogForm>(key: Key, value: BlogForm[Key]) => void;
  onUpload: UploadHandler;
}) {
  return (
    <form onSubmit={onSubmit} className="h-fit rounded-xl border bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-bold">
          {form.id ? "Edit Blog Post" : "Add Blog Post"}
        </h2>
        {form.id && (
          <button type="button" onClick={onNew} className="text-sm font-bold text-[#6d50d9]">
            New Post
          </button>
        )}
      </div>
      <Field label="Title" value={form.title} onChange={(value) => onChange("title", value)} />
      <Field
        label="Page URL (auto)"
        value={form.slug}
        onChange={(value) => onChange("slug", value)}
      />
      <Field
        label="Image Link"
        value={form.imageUrl}
        onChange={(value) => onChange("imageUrl", value)}
      />
      <ImageUploadField
        disabled={disabled}
        label="Upload Blog Image"
        value={form.imageUrl}
        onUpload={onUpload}
        onChange={(value) => onChange("imageUrl", value)}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Tag"
          value={form.tag}
          required={false}
          onChange={(value) => onChange("tag", value)}
        />
        <Field
          label="Published Date"
          value={form.publishedAt}
          required={false}
          onChange={(value) => onChange("publishedAt", value)}
        />
      </div>
      <label className="mt-4 block text-sm font-bold text-navy">
        Excerpt
        <textarea
          value={form.excerpt}
          onChange={(event) => onChange("excerpt", event.target.value)}
          rows={4}
          required
          className="mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#6d50d9]"
        />
      </label>
      <label className="mt-4 block text-sm font-bold text-navy">
        Article Content
        <textarea
          value={form.content}
          onChange={(event) => onChange("content", event.target.value)}
          rows={10}
          placeholder="Write the full article. Use blank lines between paragraphs."
          className="mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#6d50d9]"
        />
      </label>
      <label className="mt-4 flex items-center gap-2 text-sm font-bold text-navy">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(event) => onChange("isActive", event.target.checked)}
        />
        Show on Website
      </label>
      <button
        disabled={disabled}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6d50d9] px-4 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Save className="h-4 w-4" /> {form.id ? "Update Post" : "Save Post"}
      </button>
    </form>
  );
}

function BlogList({
  posts,
  disabled,
  onEdit,
  onDelete,
}: {
  posts: ApiBlogPost[];
  disabled: boolean;
  onEdit: (post: ApiBlogPost) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <section className="rounded-xl border bg-white p-5">
      <h2 className="font-display text-3xl font-bold">Blog Posts</h2>
      <div className="mt-5 space-y-3">
        {posts.map((post) => (
          <article
            key={post.id}
            className="grid gap-4 rounded-xl border p-4 md:grid-cols-[140px_1fr]"
          >
            <img
              src={post.image_url}
              alt={post.title}
              className="aspect-[16/10] w-full rounded-lg object-cover"
            />
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-orange">
                {post.tag || "Print"} | {post.is_active ? "Visible" : "Hidden"}
              </div>
              <h3 className="mt-1 font-display text-xl font-bold text-navy">{post.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{post.slug}</p>
              <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(post)}
                  className="rounded-full bg-[#f1ebff] px-3 py-1.5 text-xs font-bold text-[#6d50d9]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onDelete(post.id)}
                  className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ImageUploadField({
  label,
  value,
  disabled,
  onUpload,
  onChange,
}: {
  label: string;
  value: string;
  disabled: boolean;
  onUpload: UploadHandler;
  onChange: (value: string) => void;
}) {
  const [status, setStatus] = useState("");

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setStatus("Uploading image...");
    try {
      const url = await onUpload(file);
      onChange(url);
      setStatus("Image uploaded. Save changes to publish it.");
      toast.success("Image uploaded. Click Save Changes to publish it.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to upload image";
      setStatus(message);
      toast.error(message);
    } finally {
      event.target.value = "";
    }
  }

  return (
    <div className="mt-3 rounded-xl border border-dashed bg-[#fffef5] p-3">
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-[#6d50d9]">
        <Upload className="h-3.5 w-3.5" />
        {label}
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          disabled={disabled}
          className="sr-only"
          onChange={(event) => void handleFileChange(event)}
        />
      </label>
      {value && (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="ml-3 align-middle text-xs font-semibold text-[#6d50d9] underline"
        >
          Preview current image
        </a>
      )}
      {status && <p className="mt-2 text-xs font-semibold text-muted-foreground">{status}</p>}
    </div>
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function OrdersTable({
  orders,
  onStatusChange,
}: {
  orders: Order[];
  onStatusChange: (kind: "orders" | "inquiries", id: number, status: string) => void;
}) {
  return (
    <div className="mt-5 overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b">
          <tr>
            <th className="py-3">ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Price</th>
            <th>Status</th>
            <th>Placed At</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {orders.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-8 text-center text-muted-foreground">
                No orders yet.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id}>
                <td className="py-3 font-bold">#{order.id}</td>
                <td>{order.customer_name || "Website cart"}</td>
                <td>{order.items.length}</td>
                <td>Rs. {order.total}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(event) => onStatusChange("orders", order.id, event.target.value)}
                    className="rounded-full border px-3 py-1 text-xs font-bold"
                  >
                    {["new", "quoted", "in_progress", "completed", "cancelled"].map((status) => (
                      <option key={status} value={status}>
                        {statusLabel(status)}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function OrderCard({
  order,
  onStatusChange,
}: {
  order: Order;
  onStatusChange: (kind: "orders" | "inquiries", id: number, status: string) => void;
}) {
  return (
    <article className="rounded-xl border bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-bold text-navy">Order #{order.id}</div>
          <div className="text-xs text-muted-foreground">
            {order.customer_name || "Website cart"} | Rs. {order.total}
          </div>
        </div>
        <select
          value={order.status}
          onChange={(event) => onStatusChange("orders", order.id, event.target.value)}
          className="rounded-md border px-2 py-1 text-xs font-bold"
        >
          {["new", "quoted", "in_progress", "completed", "cancelled"].map((status) => (
            <option key={status} value={status}>
              {statusLabel(status)}
            </option>
          ))}
        </select>
      </div>
      <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
        {order.items.map((item) => (
          <li key={item.id}>
            {item.product_name} x {item.quantity}
          </li>
        ))}
      </ul>
    </article>
  );
}

function InquiryCard({
  inquiry,
  onStatusChange,
}: {
  inquiry: Inquiry;
  onStatusChange: (kind: "orders" | "inquiries", id: number, status: string) => void;
}) {
  return (
    <article className="rounded-xl border bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-bold text-navy">{inquiry.name}</div>
          <div className="text-xs text-muted-foreground">
            {inquiry.phone} | {inquiry.service}
          </div>
        </div>
        <select
          value={inquiry.status}
          onChange={(event) => onStatusChange("inquiries", inquiry.id, event.target.value)}
          className="rounded-md border px-2 py-1 text-xs font-bold"
        >
          {["new", "contacted", "closed"].map((status) => (
            <option key={status} value={status}>
              {statusLabel(status)}
            </option>
          ))}
        </select>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{inquiry.message}</p>
      <a className="mt-2 block text-sm font-bold text-[#6d50d9]" href={`mailto:${inquiry.email}`}>
        {inquiry.email}
      </a>
    </article>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="mt-4 block text-sm font-bold text-navy">
      {label}
      <input
        value={value}
        type={type}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#6d50d9]"
      />
    </label>
  );
}

function AdminList({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 font-display text-3xl font-bold">{title}</h2>
      <div className="max-h-[560px] space-y-3 overflow-auto pr-1">{children}</div>
    </div>
  );
}
