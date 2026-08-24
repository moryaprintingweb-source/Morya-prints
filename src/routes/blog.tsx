import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "../components/site/Link";
import { SiteLayout } from "../components/site/SiteLayout";
import { PageHero } from "../components/site/PageHero";
import { CTA } from "../components/site/CTA";
import { api, type ApiBlogPost } from "../lib/api";

type BlogCard = {
  title: string;
  slug: string;
  excerpt: string;
  img: string;
  date: string;
  tag: string;
  content: string[];
};

const posts: BlogCard[] = [
  {
    title: "Importance of Professional Printing for Businesses",
    slug: "importance-of-professional-printing-for-businesses",
    excerpt: "Why quality printing still shapes brand perception in a digital-first world.",
    img: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=1000",
    date: "Jun 2026",
    tag: "Printing",
    content: [
      "Professional printing gives your business a sharper first impression. Visiting cards, brochures, flyers, menus, invoices and packaging labels are often handled by customers before they speak to your team.",
      "Good paper, clean color, correct alignment and neat finishing make the brand feel reliable. Poor print quality can quietly reduce trust, even when the product or service is strong.",
      "For local businesses, consistent printed material also helps customers remember the name, phone number, address and offer. That is why print still matters alongside websites, WhatsApp and social media.",
    ],
  },
  {
    title: "How LED Signage Helps Brand Visibility",
    slug: "how-led-signage-helps-brand-visibility",
    excerpt: "The measurable impact of illuminated signage on foot traffic and recall.",
    img: "https://images.unsplash.com/photo-1541417904950-b855846fe074?w=1000",
    date: "May 2026",
    tag: "Signage",
    content: [
      "LED signage helps a shop or office stay visible in crowded streets, evening traffic and low-light conditions. A clear illuminated board can guide walk-in customers from a distance.",
      "The biggest benefit is recall. When people pass the same location daily, a bright and readable sign helps them remember the business name when they need that service later.",
      "For best results, keep the message short, use strong contrast and choose durable materials suitable for the location.",
    ],
  },
  {
    title: "Why Corporate Branding Matters",
    slug: "why-corporate-branding-matters",
    excerpt: "Consistent branding across every touchpoint builds unshakeable trust.",
    img: "https://images.unsplash.com/photo-1611095973763-414019e72400?w=1000",
    date: "Apr 2026",
    tag: "Branding",
    content: [
      "Corporate branding is not only a logo. It includes the colors, fonts, tone, packaging, business stationery, signage and every printed item customers see.",
      "When these materials look consistent, the business feels organized and dependable. This is especially important for companies that meet clients, send quotations, deliver products or run events.",
      "A practical way to begin is by standardizing visiting cards, letterheads, envelopes, brochures, ID cards and presentation folders.",
    ],
  },
  {
    title: "Benefits of High-Quality Packaging Labels",
    slug: "benefits-of-high-quality-packaging-labels",
    excerpt: "How premium labels influence purchase decisions and reduce returns.",
    img: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1000",
    date: "Mar 2026",
    tag: "Packaging",
    content: [
      "Packaging labels carry important details such as brand name, product type, price, ingredients, usage instructions, batch information and contact details.",
      "High-quality labels make products look more professional on shelves and during delivery. They also reduce confusion by keeping information readable and durable.",
      "Choose label material based on where the product will be used. Paper stickers work for many indoor products, while non-tearable or waterproof options are better for tougher handling.",
    ],
  },
  {
    title: "Digital Printing vs Offset Printing",
    slug: "digital-printing-vs-offset-printing",
    excerpt: "Which technology fits your project - a practical decision framework.",
    img: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=1000",
    date: "Feb 2026",
    tag: "Guide",
    content: [
      "Digital printing is usually faster for small quantities and quick changes. It works well for short-run visiting cards, flyers, stickers, certificates and urgent marketing material.",
      "Offset printing is often better for large quantities where color consistency and per-piece cost matter. It is commonly used for bulk brochures, books, packaging and stationery.",
      "The right choice depends on quantity, deadline, paper, finishing, budget and whether the artwork may change later.",
    ],
  },
];

function toBlogCard(post: ApiBlogPost): BlogCard {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    img: post.image_url,
    date: post.published_at || "Latest",
    tag: post.tag || "Print",
    content: splitArticleContent(post.content || post.excerpt),
  };
}

function splitArticleContent(content: string) {
  return content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogCard[]>(posts);

  useEffect(() => {
    api<{ posts: ApiBlogPost[] }>("/api/blog-posts")
      .then((result) => {
        if (result.posts.length) {
          setBlogPosts(result.posts.map(toBlogCard));
        }
      })
      .catch(() => setBlogPosts(posts));
  }, []);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Blog"
        title="Insights from the print & signage floor."
        subtitle="Practical guides and industry perspectives from our team."
        crumb="Blog"
      />

      <section className="container-x grid gap-6 py-20 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <article
            key={post.slug}
            className="card-lift group overflow-hidden rounded-2xl border bg-white"
          >
            <Link to="/blog/$slug" params={{ slug: post.slug }} className="block">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={post.img}
                  alt={post.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-orange px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                  {post.tag}
                </span>
              </div>
            </Link>
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" /> {post.date}
              </div>
              <h3 className="mt-2 font-display text-lg font-bold leading-snug text-navy">
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="transition-colors hover:text-orange"
                >
                  {post.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy transition-colors hover:text-orange"
              >
                Read more <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </section>

      <CTA />
    </SiteLayout>
  );
}

export function BlogDetail({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogCard | null>(
    posts.find((item) => item.slug === slug) ?? null,
  );

  useEffect(() => {
    api<{ posts: ApiBlogPost[] }>("/api/blog-posts")
      .then((result) => {
        const savedPost = result.posts.find((item) => item.slug === slug);
        if (savedPost) setPost(toBlogCard(savedPost));
      })
      .catch(() => undefined);
  }, [slug]);

  if (!post) {
    return (
      <SiteLayout>
        <PageHero
          eyebrow="Blog"
          title="Blog post not found"
          subtitle="The article you are looking for may have been moved or removed."
          crumb="Blog"
        />
        <section className="container-x py-16">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-bold text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHero eyebrow={post.tag} title={post.title} subtitle={post.excerpt} crumb="Blog" />

      <article className="container-x py-16">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border bg-white">
          <img src={post.img} alt={post.title} className="aspect-[16/8] w-full object-cover" />
          <div className="p-6 md:p-10">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" /> {post.date}
            </div>
            <div className="mt-6 space-y-5 text-base leading-8 text-muted-foreground">
              {post.content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link
              to="/blog"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-bold text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Link>
          </div>
        </div>
      </article>

      <CTA />
    </SiteLayout>
  );
}
