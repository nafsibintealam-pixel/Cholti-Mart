import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  BookOpen, 
  CheckCircle2, 
  Calendar, 
  Megaphone,
  Save
} from 'lucide-react';
import { BlogPostItem } from '../../../types';
import { AdminCard, AdminBadge, AdminButton, AdminModal } from '../common/AdminUiElements';
import { contentService } from '../../../services';

export interface ContentViewProps {
  subnav?: string;
  onNavigateSubnav: (sub: string) => void;
}

export const ContentView: React.FC<ContentViewProps> = ({
  subnav = 'blog_posts',
  onNavigateSubnav
}) => {
  const [posts, setPosts] = useState<BlogPostItem[]>(() => contentService.getBlogPostsSync() as any);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostItem | null>(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'Style & Trends',
    author: 'Cholti Editorial Team',
    status: 'published' as 'published' | 'draft',
    featuredImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
    excerpt: '',
    content: ''
  });

  const staticPages = [
    { title: 'About Cholti Mart', slug: 'about-us', updated: '12 Sep 2026', status: 'Published' },
    { title: 'Return & Exchange Policy', slug: 'return-policy', updated: '15 Sep 2026', status: 'Published' },
    { title: 'Privacy Policy', slug: 'privacy-policy', updated: '10 Aug 2026', status: 'Published' },
    { title: 'Terms & Conditions', slug: 'terms', updated: '10 Aug 2026', status: 'Published' },
    { title: 'Contact & Support', slug: 'contact', updated: '18 Sep 2026', status: 'Published' }
  ];

  const handleOpenAdd = () => {
    setEditingPost(null);
    setForm({
      title: '',
      slug: '',
      category: 'Style & Trends',
      author: 'Cholti Editorial Team',
      status: 'published',
      featuredImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
      excerpt: '',
      content: ''
    });
    setIsPostModalOpen(true);
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      const updated = posts.map(p => p.id === editingPost.id ? { ...p, ...form } : p);
      setPosts(updated);
      contentService.saveBlogPosts(updated);
    } else {
      const created: BlogPostItem = {
        id: `post-${Date.now()}`,
        ...form,
        coverImage: form.featuredImage,
        date: new Date().toISOString().split('T')[0],
        publishedDate: new Date().toISOString().split('T')[0],
        readTime: '3 min',
        viewsCount: 0
      };
      const updated = [created, ...posts];
      setPosts(updated);
      contentService.saveBlogPosts(updated);
    }
    setIsPostModalOpen(false);
  };

  const handleDeletePost = (id: string) => {
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    contentService.saveBlogPosts(updated);
  };

  return (
    <div className="space-y-6">
      
      {/* Subnav Navigation */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3 text-xs gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'blog_posts', label: `Blog Articles (${posts.length})` },
            { id: 'pages', label: `Static Pages (${staticPages.length})` },
            { id: 'announcements', label: 'Storefront Announcements' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onNavigateSubnav(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl transition-colors font-medium ${
                subnav === tab.id
                  ? 'bg-[#2D5128] text-[#E4EB9C] font-bold border border-[#8DA750]/40'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {subnav === 'blog_posts' && (
          <AdminButton
            variant="lime"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleOpenAdd}
          >
            New Article
          </AdminButton>
        )}
      </div>

      {subnav === 'pages' ? (
        /* Static Pages View */
        <AdminCard title="Policy & Informational Pages" subtitle="Legal, contact, and support documentation" noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950 text-neutral-400 text-[10px] uppercase font-bold border-b border-neutral-800">
                <tr>
                  <th className="px-5 py-3">Page Title</th>
                  <th className="px-4 py-3">URL Slug</th>
                  <th className="px-4 py-3">Last Modified</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
                {staticPages.map((pg, idx) => (
                  <tr key={idx} className="hover:bg-neutral-800/40">
                    <td className="px-5 py-3.5 font-bold text-white">
                      {pg.title}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-neutral-400 text-[11px]">
                      /{pg.slug}
                    </td>
                    <td className="px-4 py-3.5 text-neutral-400 text-[11px]">
                      {pg.updated}
                    </td>
                    <td className="px-4 py-3.5">
                      <AdminBadge variant="success" size="xs">
                        {pg.status}
                      </AdminBadge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <AdminButton variant="outline" size="xs" icon={<Edit2 className="w-3 h-3" />}>
                        Edit Content
                      </AdminButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      ) : subnav === 'announcements' ? (
        /* Topbar Announcements View */
        <AdminCard title="Storefront Header Announcement Bar" subtitle="Top ticker displayed across all customer storefront pages">
          <div className="space-y-4 max-w-xl text-xs">
            <div>
              <label className="text-neutral-300 font-semibold block mb-1">Announcement Message Text</label>
              <input
                type="text"
                defaultValue="Free Express Delivery inside Dhaka on orders above ৳2,000! Use code CHOLTI10"
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ann-active"
                defaultChecked
                className="rounded bg-neutral-950 border-neutral-700 text-[#8DA750]"
              />
              <label htmlFor="ann-active" className="text-neutral-200 font-medium cursor-pointer">
                Display announcement bar to storefront shoppers
              </label>
            </div>

            <AdminButton variant="lime" size="sm">
              Save Announcement
            </AdminButton>
          </div>
        </AdminCard>
      ) : (
        /* Blog Posts List View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <AdminCard
              key={post.id}
              title={post.title}
              subtitle={`${post.category} &bull; ${post.publishedDate || post.date}`}
              action={
                <div className="flex items-center gap-1.5">
                  <AdminBadge variant={post.status === 'published' ? 'success' : 'neutral'} size="xs">
                    {post.status}
                  </AdminBadge>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400"
                    title="Delete Post"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              }
            >
              <div className="space-y-3 text-xs">
                {(post.featuredImage || post.coverImage) && (
                  <img
                    src={post.featuredImage || post.coverImage}
                    alt={post.title}
                    className="w-full h-36 rounded-xl object-cover border border-neutral-800"
                  />
                )}
                <p className="text-neutral-300 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                  <span>Author: <strong className="text-neutral-200">{post.author}</strong></span>
                  <span className="font-mono text-[#E4EB9C]">{post.viewsCount ?? 0} reads</span>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      {/* New/Edit Article Modal */}
      <AdminModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        title={editingPost ? 'Edit Blog Article' : 'Write New Blog Article'}
        subtitle="Publish editorial content, fashion trends, and customer stories"
        maxWidth="xl"
        footer={
          <>
            <AdminButton variant="outline" size="sm" onClick={() => setIsPostModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="lime" size="sm" onClick={handleSavePost}>
              Publish Article
            </AdminButton>
          </>
        }
      >
        <form onSubmit={handleSavePost} className="space-y-3 text-xs">
          <div>
            <label className="text-neutral-300 font-semibold block mb-1">Article Headline *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. The Heritage of Jamdani Weaving in Narayanganj"
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-300 font-semibold block mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
              >
                <option value="Style & Trends">Style & Trends</option>
                <option value="Heritage Craft">Heritage Craft</option>
                <option value="Store News">Store News</option>
                <option value="Care Guide">Care Guide</option>
              </select>
            </div>
            <div>
              <label className="text-neutral-300 font-semibold block mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
              >
                <option value="published">Published Live</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-neutral-300 font-semibold block mb-1">Featured Cover Image URL</label>
            <input
              type="url"
              value={form.featuredImage}
              onChange={(e) => setForm({ ...form, featuredImage: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
            />
          </div>

          <div>
            <label className="text-neutral-300 font-semibold block mb-1">Short Summary / Excerpt</label>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="Brief preview sentence displayed in card grids..."
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
            />
          </div>

          <div>
            <label className="text-neutral-300 font-semibold block mb-1">Article Body Content</label>
            <textarea
              rows={4}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Full article markdown or text content..."
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
            />
          </div>
        </form>
      </AdminModal>

    </div>
  );
};
