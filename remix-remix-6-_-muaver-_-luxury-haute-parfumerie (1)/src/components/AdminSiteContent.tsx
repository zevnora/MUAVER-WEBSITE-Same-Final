import React, { useState } from 'react';
import { 
  Sparkles, 
  Crown, 
  Image as ImageIcon, 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Star, 
  Eye, 
  EyeOff, 
  Sliders, 
  FileText, 
  Compass, 
  PhoneCall, 
  Layout, 
  Info,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Package,
  Droplets,
  HelpCircle
} from 'lucide-react';
import { SiteSettings, Product, WhyFeature, TestimonialItem } from '../types/store';
import { updateSiteSettings, DEFAULT_STATIC_IMAGES, DEFAULT_SETTINGS, DEFAULT_WHY_FEATURES, DEFAULT_TESTIMONIALS } from '../services/storeService';
import { AdminImageUpload } from './AdminImageUpload';

interface AdminSiteContentProps {
  settings: SiteSettings;
  products: Product[];
  onRefresh: () => Promise<void>;
}

type ContentSubTab = 
  | 'logos'
  | 'announcement'
  | 'hero'
  | 'featured-product'
  | 'brand-story'
  | 'why-features'
  | 'testimonials'
  | 'about-page'
  | 'contact-page'
  | 'footer-text'
  | 'static-images';

export const AdminSiteContent: React.FC<AdminSiteContentProps> = ({
  settings,
  products,
  onRefresh,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<ContentSubTab>('logos');
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Testimonial modal state
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [isNewTestimonial, setIsNewTestimonial] = useState(false);

  const showStatus = (text: string, type: 'success' | 'error') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleSave = async (updatedData?: Partial<SiteSettings>) => {
    try {
      setSaving(true);
      const toSave = updatedData ? { ...formData, ...updatedData } : formData;
      await updateSiteSettings(toSave);
      setFormData(toSave);
      await onRefresh();
      showStatus('Content successfully saved and updated on storefront!', 'success');
    } catch (err: any) {
      console.error('Error saving site content:', err);
      showStatus(err.message || 'Failed to save changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Why Features Helper
  const handleUpdateWhyFeature = (index: number, updated: Partial<WhyFeature>) => {
    const list = [...(formData.whyFeatures || DEFAULT_WHY_FEATURES)];
    list[index] = { ...list[index], ...updated };
    setFormData({ ...formData, whyFeatures: list });
  };

  // Testimonial Helpers
  const handleToggleTestimonial = (id: string) => {
    const list = (formData.testimonials || DEFAULT_TESTIMONIALS).map((t) =>
      t.id === id ? { ...t, isActive: !t.isActive } : t
    );
    setFormData({ ...formData, testimonials: list });
  };

  const handleDeleteTestimonial = (id: string, name: string) => {
    if (!window.confirm(`Delete review from "${name}"?`)) return;
    const list = (formData.testimonials || DEFAULT_TESTIMONIALS).filter((t) => t.id !== id);
    setFormData({ ...formData, testimonials: list });
    showStatus('Review removed from staging. Click "Save All Content" to persist.', 'success');
  };

  const handleSaveTestimonialModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;

    let list = [...(formData.testimonials || DEFAULT_TESTIMONIALS)];
    if (isNewTestimonial) {
      list = [editingTestimonial, ...list];
    } else {
      list = list.map((t) => (t.id === editingTestimonial.id ? editingTestimonial : t));
    }
    setFormData({ ...formData, testimonials: list });
    setEditingTestimonial(null);
    setIsNewTestimonial(false);
    showStatus('Review added/updated. Remember to click "Save All Content"!', 'success');
  };

  const subTabs: { id: ContentSubTab; label: string; icon: React.ElementType }[] = [
    { id: 'logos', label: 'Logos & Identity', icon: Crown },
    { id: 'announcement', label: 'Announcement Bar', icon: Sliders },
    { id: 'hero', label: 'Hero Content', icon: Layout },
    { id: 'featured-product', label: 'Featured Product', icon: Sparkles },
    { id: 'brand-story', label: 'Brand Story', icon: FileText },
    { id: 'why-features', label: '"Why MUAVER"', icon: ShieldCheck },
    { id: 'testimonials', label: 'Patron Reviews', icon: Star },
    { id: 'about-page', label: 'About Page', icon: Compass },
    { id: 'contact-page', label: 'Contact Page', icon: PhoneCall },
    { id: 'footer-text', label: 'Footer Text', icon: Info },
    { id: 'static-images', label: 'Static Images Directory', icon: ImageIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Save CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--gold-500)]/20">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl text-white font-bold tracking-wide flex items-center gap-2.5">
            <span>Site Content & Copywriting</span>
          </h2>
          <p className="text-xs text-white/60">
            Control brand narratives, logos, section copy, testimonials, and static images across the boutique.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave()}
            className="btn-gold-primary px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase flex items-center gap-2 shadow-lg shadow-amber-950/40 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-[var(--navy-900)]" />
            <span>{saving ? 'Publishing...' : 'Save All Content'}</span>
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between animate-fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)}>
            <X className="w-4 h-4 opacity-70 hover:opacity-100" />
          </button>
        </div>
      )}

      {/* Sub Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
        {subTabs.map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[var(--gold-500)] to-[var(--gold-300)] text-[var(--navy-900)] shadow-md shadow-amber-950/30'
                  : 'text-white/70 hover:text-white hover:bg-white/5 border border-white/5'
              }`}
            >
              <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-[var(--navy-900)]' : 'text-[var(--gold-300)]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Form Container */}
      <div className="bg-[#081438] rounded-2xl border border-[var(--gold-500)]/25 p-6 sm:p-8 space-y-6 shadow-xl">
        
        {/* 1. LOGOS & BRANDING IMAGERY */}
        {activeSubTab === 'logos' && (
          <div className="space-y-6 animate-fade-in">
            <div className="pb-3 border-b border-white/10">
              <h3 className="font-heading text-base font-bold text-white tracking-wide">
                Logos & Official Heraldry
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Official high-resolution branding assets. Paste direct image URLs or reset to official defaults at any time.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Header Landscape Logo */}
              <AdminImageUpload
                label="Header & Footer Landscape Logo"
                description="Displayed in navigation bar (44-70px) and footer."
                currentUrl={formData.landscapeLogoUrl}
                defaultUrl={DEFAULT_STATIC_IMAGES.landscapeLogoUrl}
                onChange={(url) => setFormData({ ...formData, landscapeLogoUrl: url })}
                aspectRatio="landscape"
                folder="branding"
              />

              {/* Full Square Crest */}
              <AdminImageUpload
                label="Full Square Crest Logo"
                description="Displayed in brand story, about heraldry, and luxury seals."
                currentUrl={formData.fullSquareLogoUrl}
                defaultUrl={DEFAULT_STATIC_IMAGES.fullSquareLogoUrl}
                onChange={(url) => setFormData({ ...formData, fullSquareLogoUrl: url })}
                aspectRatio="square"
                folder="branding"
              />

              {/* Icon / Monogram / Favicon */}
              <AdminImageUpload
                label="Icon / Monogram & Favicon"
                description="Displayed in loading screen, browser tab favicon, and admin logo."
                currentUrl={formData.iconUrl}
                defaultUrl={DEFAULT_STATIC_IMAGES.iconUrl}
                onChange={(url) => setFormData({ ...formData, iconUrl: url, faviconUrl: url })}
                aspectRatio="square"
                folder="branding"
              />
            </div>
          </div>
        )}

        {/* 2. ANNOUNCEMENT BAR */}
        {activeSubTab === 'announcement' && (
          <div className="space-y-6 animate-fade-in">
            <div className="pb-3 border-b border-white/10">
              <h3 className="font-heading text-base font-bold text-white tracking-wide">
                Top Announcement Bar
              </h3>
              <p className="text-xs text-white/50">
                High-priority banner pinned to the very top of every storefront page.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--navy-900)] border border-white/10 flex items-center justify-between">
              <div>
                <span className="font-heading text-sm text-white font-bold block">
                  Announcement Bar Visibility
                </span>
                <span className="text-xs text-white/50">
                  Toggle whether the top gold ticker is displayed.
                </span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.visibility?.showAnnouncementBar !== false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      visibility: {
                        ...(formData.visibility || {
                          showAnnouncementBar: true,
                          showHeroSlider: true,
                          showFeaturedProduct: true,
                          showBrandStory: true,
                          showWhyFeatures: true,
                          showTestimonials: true,
                          showWhatsAppStrip: true,
                        }),
                        showAnnouncementBar: e.target.checked,
                      },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--gold-500)]"></div>
              </label>
            </div>

            <div>
              <label className="text-[10px] uppercase font-heading tracking-widest text-[var(--gold-300)] font-semibold block mb-1.5">
                Announcement Message Text
              </label>
              <textarea
                rows={2}
                value={formData.announcementText}
                onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
                placeholder="e.g. Complimentary White-Glove Cash on Delivery Across Pakistan..."
                className="w-full p-3 rounded-lg bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:border-[var(--gold-300)] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* 3. HERO CONTENT */}
        {activeSubTab === 'hero' && (
          <div className="space-y-6 animate-fade-in">
            <div className="pb-3 border-b border-white/10">
              <h3 className="font-heading text-base font-bold text-white tracking-wide">
                Hero Section Configuration
              </h3>
              <p className="text-xs text-white/50">
                Fallback titles and imagery when slides are loading or single-banner mode is active.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-heading tracking-widest text-[var(--gold-300)] font-semibold block mb-1">
                  Default Badge Text
                </label>
                <input
                  type="text"
                  value={formData.heroDefaultBadge || 'ROYAL ATELIER COLLECTION'}
                  onChange={(e) => setFormData({ ...formData, heroDefaultBadge: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:border-[var(--gold-300)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-heading tracking-widest text-[var(--gold-300)] font-semibold block mb-1">
                  Default Headline
                </label>
                <input
                  type="text"
                  value={formData.heroDefaultHeading || 'Crafted for Distinction'}
                  onChange={(e) => setFormData({ ...formData, heroDefaultHeading: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:border-[var(--gold-300)] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-heading tracking-widest text-[var(--gold-300)] font-semibold block mb-1">
                Default Subheading Description
              </label>
              <textarea
                rows={2}
                value={formData.heroDefaultSubheading || 'Rare botanical essences, rich oud, and long-lasting fragrances crafted for those who value distinction.'}
                onChange={(e) => setFormData({ ...formData, heroDefaultSubheading: e.target.value })}
                className="w-full p-3 rounded-lg bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:border-[var(--gold-300)] focus:outline-none"
              />
            </div>

            <AdminImageUpload
              label="Hero Fallback Imagery"
              description="Used as background placeholder if slider is transitioning or single banner is chosen."
              currentUrl={formData.heroFallbackImage || DEFAULT_STATIC_IMAGES.heroFallbackImage}
              defaultUrl={DEFAULT_STATIC_IMAGES.heroFallbackImage}
              onChange={(url) => setFormData({ ...formData, heroFallbackImage: url })}
              aspectRatio="landscape"
              folder="banners"
            />
          </div>
        )}

        {/* 4. FEATURED PRODUCT SELECTION */}
        {activeSubTab === 'featured-product' && (
          <div className="space-y-6 animate-fade-in">
            <div className="pb-3 border-b border-white/10">
              <h3 className="font-heading text-base font-bold text-white tracking-wide">
                Homepage Featured Product Spotlight
              </h3>
              <p className="text-xs text-white/50">
                Select which product is highlighted in the spotlight section on the homepage.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-heading tracking-widest text-[var(--gold-300)] font-semibold block mb-1">
                  Selected Featured Product
                </label>
                <select
                  value={formData.featuredProductId || products[0]?.id || 'mv-001'}
                  onChange={(e) => setFormData({ ...formData, featuredProductId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--navy-900)] border border-[var(--gold-500)]/40 text-[var(--gold-300)] font-bold text-xs focus:outline-none"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#050F2E] text-white">
                      {p.name} ({p.subtitle || p.category}) - Rs. {p.price.toLocaleString()}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-white/40 block mt-1">
                  Updates the spotlight product with its imagery, size variants, notes, and pricing.
                </span>
              </div>

              <div>
                <label className="text-[10px] uppercase font-heading tracking-widest text-[var(--gold-300)] font-semibold block mb-1">
                  Section Badge Label
                </label>
                <input
                  type="text"
                  value={formData.featuredSectionBadge || 'Featured Fragrance'}
                  onChange={(e) => setFormData({ ...formData, featuredSectionBadge: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:border-[var(--gold-300)] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-heading tracking-widest text-[var(--gold-300)] font-semibold block mb-1">
                Section Title
              </label>
              <input
                type="text"
                value={formData.featuredSectionTitle || 'THE IMPERIAL CREATION'}
                onChange={(e) => setFormData({ ...formData, featuredSectionTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:border-[var(--gold-300)] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* 5. BRAND STORY */}
        {activeSubTab === 'brand-story' && (
          <div className="space-y-6 animate-fade-in">
            <div className="pb-3 border-b border-white/10">
              <h3 className="font-heading text-base font-bold text-white tracking-wide">
                Brand Story & Philosophy
              </h3>
              <p className="text-xs text-white/50">
                The inspiration, standards, and craftsmanship behind the brand.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-heading tracking-widest text-[var(--gold-300)] font-semibold block mb-1">
                  Badge Label
                </label>
                <input
                  type="text"
                  value={formData.brandStoryBadge || 'Crafted by Ashar Ul Haq Siddiqui'}
                  onChange={(e) => setFormData({ ...formData, brandStoryBadge: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:border-[var(--gold-300)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-heading tracking-widest text-[var(--gold-300)] font-semibold block mb-1">
                  Heading Title
                </label>
                <input
                  type="text"
                  value={formData.brandStoryTitle || 'CRAFTED FOR DISTINCTION By Ashar Ul Haq Siddiqui'}
                  onChange={(e) => setFormData({ ...formData, brandStoryTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:border-[var(--gold-300)] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-heading tracking-widest text-[var(--gold-300)] font-semibold block mb-1">
                Story Paragraph 1 (Emblem & Crown Philosophy)
              </label>
              <textarea
                rows={3}
                value={formData.brandStorySnippet}
                onChange={(e) => setFormData({ ...formData, brandStorySnippet: e.target.value })}
                className="w-full p-3 rounded-lg bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:border-[var(--gold-300)] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-heading tracking-widest text-[var(--gold-300)] font-semibold block mb-1">
                Story Paragraph 2 (Fragrance Concentration & Longevity)
              </label>
              <textarea
                rows={3}
                value={formData.brandStoryText2 || 'Every formulation is crafted by Ashar Ul Haq Siddiqui with a generous 35% concentration of pure perfume essences (Extrait de Parfum). This rich saturation allows the fragrance notes to unfold smoothly upon the skin over hours, leaving a memorable scent that lasts all day.'}
                onChange={(e) => setFormData({ ...formData, brandStoryText2: e.target.value })}
                className="w-full p-3 rounded-lg bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:border-[var(--gold-300)] focus:outline-none"
              />
            </div>

            <AdminImageUpload
              label="Brand Story Crest / Artwork"
              description="Featured alongside the story on the homepage."
              currentUrl={formData.brandStoryImage || DEFAULT_STATIC_IMAGES.brandStoryImage}
              defaultUrl={DEFAULT_STATIC_IMAGES.brandStoryImage}
              onChange={(url) => setFormData({ ...formData, brandStoryImage: url })}
              aspectRatio="square"
              folder="branding"
            />
          </div>
        )}

        {/* 6. "WHY MUAVER" - 4 ICON FEATURES */}
        {activeSubTab === 'why-features' && (
          <div className="space-y-6 animate-fade-in">
            <div className="pb-3 border-b border-white/10">
              <h3 className="font-heading text-base font-bold text-white tracking-wide">
                "Why MUAVER" 4 Pillars
              </h3>
              <p className="text-xs text-white/50">
                The 4 hallmark standards displayed with royal gold icons on the homepage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(formData.whyFeatures || DEFAULT_WHY_FEATURES).map((feat, idx) => (
                <div
                  key={feat.id}
                  className="p-4 rounded-xl bg-[var(--navy-900)] border border-[var(--gold-500)]/20 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-heading text-[var(--gold-300)] font-bold">
                      Pillar #{idx + 1}
                    </span>
                    <select
                      value={feat.icon}
                      onChange={(e) => handleUpdateWhyFeature(idx, { icon: e.target.value as any })}
                      className="px-2.5 py-1 rounded bg-[#03091D] border border-white/15 text-white text-xs focus:outline-none"
                    >
                      <option value="crown">Crown (Authenticity)</option>
                      <option value="clock">Clock (Long Lasting)</option>
                      <option value="shield">Shield (COD Nationwide)</option>
                      <option value="package">Package (Premium Packaging)</option>
                      <option value="sparkles">Sparkles (Luxury Distinction)</option>
                      <option value="droplet">Droplets (Pure Essence)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-white/50 uppercase block mb-1">Title</label>
                    <input
                      type="text"
                      value={feat.title}
                      onChange={(e) => handleUpdateWhyFeature(idx, { title: e.target.value })}
                      className="w-full px-3 py-1.5 rounded bg-[#03091D] border border-white/15 text-white text-xs font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-white/50 uppercase block mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={feat.description}
                      onChange={(e) => handleUpdateWhyFeature(idx, { description: e.target.value })}
                      className="w-full p-2.5 rounded bg-[#03091D] border border-white/15 text-white text-xs focus:outline-none font-light"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. PATRON REVIEWS / TESTIMONIALS */}
        {activeSubTab === 'testimonials' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <h3 className="font-heading text-base font-bold text-white tracking-wide">
                  Patron Acclaim & Testimonials
                </h3>
                <p className="text-xs text-white/50">
                  Manage reviews displayed under "Whispers of Distinction" on the homepage.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingTestimonial({
                    id: `t-${Date.now()}`,
                    name: '',
                    city: 'Karachi, Pakistan',
                    role: 'Verified Patron',
                    rating: 5,
                    comment: '',
                    isActive: true,
                  });
                  setIsNewTestimonial(true);
                }}
                className="btn-gold-outline px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-[var(--gold-300)]" />
                <span>Add Review</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(formData.testimonials || DEFAULT_TESTIMONIALS).map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl bg-[var(--navy-900)] border transition-all space-y-3 ${
                    item.isActive ? 'border-[var(--gold-500)]/30' : 'border-white/10 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-xs font-bold text-white">{item.name}</span>
                        <div className="flex text-[var(--gold-300)]">
                          {[...Array(item.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-white/50">{item.city} • {item.role || 'Patron'}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleTestimonial(item.id)}
                        className={`p-1.5 rounded text-xs ${
                          item.isActive ? 'text-emerald-400 hover:bg-emerald-950/40' : 'text-white/40 hover:bg-white/5'
                        }`}
                        title={item.isActive ? 'Active (Click to hide)' : 'Hidden (Click to show)'}
                      >
                        {item.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingTestimonial(item);
                          setIsNewTestimonial(false);
                        }}
                        className="p-1.5 rounded text-[var(--gold-300)] hover:bg-[var(--gold-500)]/15"
                        title="Edit review"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteTestimonial(item.id, item.name)}
                        className="p-1.5 rounded text-rose-400 hover:bg-rose-950/40"
                        title="Delete review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-white/80 italic font-light leading-relaxed">
                    "{item.comment}"
                  </p>
                </div>
              ))}
            </div>

            {/* Testimonial Edit/Add Modal */}
            {editingTestimonial && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="bg-[#050F2E] border-2 border-[var(--gold-500)]/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h4 className="font-heading text-base font-bold text-white">
                      {isNewTestimonial ? 'Add Patron Review' : 'Edit Patron Review'}
                    </h4>
                    <button onClick={() => setEditingTestimonial(null)}>
                      <X className="w-5 h-5 text-white/50 hover:text-white" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveTestimonialModal} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase font-heading text-[var(--gold-300)] block mb-1">
                          Patron Name
                        </label>
                        <input
                          type="text"
                          required
                          value={editingTestimonial.name}
                          onChange={(e) =>
                            setEditingTestimonial({ ...editingTestimonial, name: e.target.value })
                          }
                          placeholder="e.g. Hamza K."
                          className="w-full px-3 py-2 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-heading text-[var(--gold-300)] block mb-1">
                          City / Territory
                        </label>
                        <input
                          type="text"
                          value={editingTestimonial.city}
                          onChange={(e) =>
                            setEditingTestimonial({ ...editingTestimonial, city: e.target.value })
                          }
                          placeholder="Lahore, Pakistan"
                          className="w-full px-3 py-2 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase font-heading text-[var(--gold-300)] block mb-1">
                          Role / Title
                        </label>
                        <input
                          type="text"
                          value={editingTestimonial.role || ''}
                          onChange={(e) =>
                            setEditingTestimonial({ ...editingTestimonial, role: e.target.value })
                          }
                          placeholder="Verified Patron"
                          className="w-full px-3 py-2 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-heading text-[var(--gold-300)] block mb-1">
                          Rating (Stars)
                        </label>
                        <select
                          value={editingTestimonial.rating || 5}
                          onChange={(e) =>
                            setEditingTestimonial({
                              ...editingTestimonial,
                              rating: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:outline-none"
                        >
                          <option value={5}>★★★★★ (5 Stars)</option>
                          <option value={4}>★★★★☆ (4 Stars)</option>
                          <option value={3}>★★★☆☆ (3 Stars)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-heading text-[var(--gold-300)] block mb-1">
                        Review / Testimonial Text
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={editingTestimonial.comment}
                        onChange={(e) =>
                          setEditingTestimonial({ ...editingTestimonial, comment: e.target.value })
                        }
                        placeholder="Share the patron's impressions of the fragrance..."
                        className="w-full p-3 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingTestimonial(null)}
                        className="px-4 py-1.5 rounded border border-white/20 text-white/70 hover:text-white text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-gold-primary px-5 py-1.5 rounded text-xs font-semibold"
                      >
                        Save Review
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 8. ABOUT PAGE CONTENT & IMAGES */}
        {activeSubTab === 'about-page' && (
          <div className="space-y-6 animate-fade-in">
            <div className="pb-3 border-b border-white/10">
              <h3 className="font-heading text-base font-bold text-white tracking-wide">
                Maison Chronicle (About Page)
              </h3>
              <p className="text-xs text-white/50">
                Brand history, heraldry crest presentation, and the Three Laws of MUAVER.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-heading text-[var(--gold-300)] block mb-1">
                  About Hero Title
                </label>
                <input
                  type="text"
                  value={formData.aboutTitle || 'THE MAISON CHRONICLE'}
                  onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-heading text-[var(--gold-300)] block mb-1">
                  Heraldry Subtitle
                </label>
                <input
                  type="text"
                  value={formData.aboutStoryTitle || 'Heraldry of The Imperial Crown'}
                  onChange={(e) => setFormData({ ...formData, aboutStoryTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-heading text-[var(--gold-300)] block mb-1">
                Heraldry Narrative Paragraph 1
              </label>
              <textarea
                rows={3}
                value={formData.aboutStoryP1 || 'The insignia of MUAVER tells the story of our philosophy: a sovereign gold crown resting regally above the interlocked "MV" monogram, wrapped in ceremonial laurel flourishes. Metallic gold cast against an abyss of deep royal navy — a colorway chosen across centuries by royalty to symbolize authority, depth, and eternal prestige.'}
                onChange={(e) => setFormData({ ...formData, aboutStoryP1: e.target.value })}
                className="w-full p-3 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-heading text-[var(--gold-300)] block mb-1">
                Heraldry Narrative Paragraph 2
              </label>
              <textarea
                rows={2}
                value={formData.aboutStoryP2 || 'Behind the brand stands Founder & CEO Ashar Ul Haq Siddiqui — dedicated to crafting singular fragrant works of art without compromise, without synthetic shortcuts, and without ordinary formulations.'}
                onChange={(e) => setFormData({ ...formData, aboutStoryP2: e.target.value })}
                className="w-full p-3 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:outline-none"
              />
            </div>

            <AdminImageUpload
              label="Heraldic Royal Crest Artwork"
              description="Centerpiece emblem framed inside the royal navy shield on the About page."
              currentUrl={formData.aboutStoryImage || DEFAULT_STATIC_IMAGES.aboutStoryImage}
              defaultUrl={DEFAULT_STATIC_IMAGES.aboutStoryImage}
              onChange={(url) => setFormData({ ...formData, aboutStoryImage: url })}
              aspectRatio="square"
              folder="branding"
            />
          </div>
        )}

        {/* 9. CONTACT PAGE TEXT */}
        {activeSubTab === 'contact-page' && (
          <div className="space-y-6 animate-fade-in">
            <div className="pb-3 border-b border-white/10">
              <h3 className="font-heading text-base font-bold text-white tracking-wide">
                Concierge & Contact Page
              </h3>
              <p className="text-xs text-white/50">
                Personal assistance titles, response commitments, and courier dispatch depot copy.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-heading text-[var(--gold-300)] block mb-1">
                  Page Headline
                </label>
                <input
                  type="text"
                  value={formData.contactTitle || 'ROYALE CONCIERGE & CONTACT'}
                  onChange={(e) => setFormData({ ...formData, contactTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-heading text-[var(--gold-300)] block mb-1">
                  Operating Hours
                </label>
                <input
                  type="text"
                  value={formData.contactHours || 'Mon - Sat: 10:00 AM - 10:00 PM PKT'}
                  onChange={(e) => setFormData({ ...formData, contactHours: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-heading text-[var(--gold-300)] block mb-1">
                Subheading Promise
              </label>
              <textarea
                rows={2}
                value={formData.contactSubtitle || 'Our customer care team is at your service for fragrance recommendations, Cash on Delivery orders, and order status updates.'}
                onChange={(e) => setFormData({ ...formData, contactSubtitle: e.target.value })}
                className="w-full p-3 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-heading text-[var(--gold-300)] block mb-1">
                Dispatch Depot Stipulation
              </label>
              <input
                type="text"
                value={formData.contactDispatchNotice || 'Dispatches courier parcels nationwide directly from Karachi central reserve with inspection seals.'}
                onChange={(e) => setFormData({ ...formData, contactDispatchNotice: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* 10. FOOTER TEXT */}
        {activeSubTab === 'footer-text' && (
          <div className="space-y-6 animate-fade-in">
            <div className="pb-3 border-b border-white/10">
              <h3 className="font-heading text-base font-bold text-white tracking-wide">
                Footer Copy & Legal
              </h3>
              <p className="text-xs text-white/50">
                Bottom website brand blurb, official tagline, and copyright statement.
              </p>
            </div>

            <div>
              <label className="text-[10px] uppercase font-heading text-[var(--gold-300)] block mb-1">
                Footer Tagline
              </label>
              <input
                type="text"
                value={formData.footerTagline || formData.tagline || 'CRAFTED FOR DISTINCTION By Ashar Ul Haq Siddiqui'}
                onChange={(e) => setFormData({ ...formData, footerTagline: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-heading text-[var(--gold-300)] block mb-1">
                Footer Brand Summary Blurb
              </label>
              <textarea
                rows={2}
                value={formData.footerBlurb || 'Crafted with premium fragrance oils, long-lasting performance, and luxurious bottle design for everyday elegance.'}
                onChange={(e) => setFormData({ ...formData, footerBlurb: e.target.value })}
                className="w-full p-3 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-heading text-[var(--gold-300)] block mb-1">
                Copyright Notice
              </label>
              <input
                type="text"
                value={formData.footerCopyright || '© 2026 MUAVER. All rights reserved. Crafted for Distinction by Ashar Ul Haq Siddiqui.'}
                onChange={(e) => setFormData({ ...formData, footerCopyright: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* 11. STATIC IMAGES DIRECTORY */}
        {activeSubTab === 'static-images' && (
          <div className="space-y-6 animate-fade-in">
            <div className="pb-3 border-b border-white/10">
              <h3 className="font-heading text-base font-bold text-white tracking-wide">
                Central Static Images Directory
              </h3>
              <p className="text-xs text-white/50">
                Every static image on the website in one place. Paste direct image URLs, or click "Reset to default" to restore the original brand asset.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AdminImageUpload
                label="Landscape Header & Footer Logo"
                description="High-resolution gold crown monogram on transparent ground."
                currentUrl={formData.landscapeLogoUrl}
                defaultUrl={DEFAULT_STATIC_IMAGES.landscapeLogoUrl}
                onChange={(url) => setFormData({ ...formData, landscapeLogoUrl: url })}
                aspectRatio="landscape"
                folder="branding"
              />

              <AdminImageUpload
                label="Full Square Emblem Crest"
                description="Golden heraldic seal with royal laurels and crown."
                currentUrl={formData.fullSquareLogoUrl}
                defaultUrl={DEFAULT_STATIC_IMAGES.fullSquareLogoUrl}
                onChange={(url) => setFormData({ ...formData, fullSquareLogoUrl: url })}
                aspectRatio="square"
                folder="branding"
              />

              <AdminImageUpload
                label="Icon / Favicon Asset"
                description="Square icon loaded into browser tab and loading screens."
                currentUrl={formData.iconUrl}
                defaultUrl={DEFAULT_STATIC_IMAGES.iconUrl}
                onChange={(url) => setFormData({ ...formData, iconUrl: url })}
                aspectRatio="square"
                folder="branding"
              />

              <AdminImageUpload
                label="Brand Story Image"
                description="Featured presentation artwork beside the brand narrative."
                currentUrl={formData.brandStoryImage || DEFAULT_STATIC_IMAGES.brandStoryImage}
                defaultUrl={DEFAULT_STATIC_IMAGES.brandStoryImage}
                onChange={(url) => setFormData({ ...formData, brandStoryImage: url })}
                aspectRatio="square"
                folder="branding"
              />

              <AdminImageUpload
                label="About Page Emblem"
                description="Heraldic artwork framed on the About / Chronicle page."
                currentUrl={formData.aboutStoryImage || DEFAULT_STATIC_IMAGES.aboutStoryImage}
                defaultUrl={DEFAULT_STATIC_IMAGES.aboutStoryImage}
                onChange={(url) => setFormData({ ...formData, aboutStoryImage: url })}
                aspectRatio="square"
                folder="branding"
              />

              <AdminImageUpload
                label="Hero Fallback Product Image"
                description="High-resolution product visual with zero third-party logos."
                currentUrl={formData.heroFallbackImage || DEFAULT_STATIC_IMAGES.heroFallbackImage}
                defaultUrl={DEFAULT_STATIC_IMAGES.heroFallbackImage}
                onChange={(url) => setFormData({ ...formData, heroFallbackImage: url })}
                aspectRatio="landscape"
                folder="banners"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
