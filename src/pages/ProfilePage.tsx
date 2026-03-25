import { useState } from "react";
import { usePosts } from "../context/PostsContext";

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "たった今";
  if (min < 60) return `${min}分前`;
  return `${Math.floor(min / 60)}時間前`;
}

const TYPE_LABELS: Record<string, string> = {
  post: "投稿", board: "掲示板", announcement: "告知",
};
const TYPE_COLORS: Record<string, string> = {
  post: "#6366f1", board: "#f97316", announcement: "#10b981",
};

interface Profile {
  displayName: string;
  bio: string;
}

interface Props {
  onClose: () => void;
}

export default function ProfilePage({ onClose }: Props) {
  const { posts } = usePosts();
  const [profile, setProfile] = useState<Profile>({
    displayName: "デモユーザー",
    bio: "NTT西日本本社エリアでよく作業してます！",
  });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Profile>(profile);

  const myPosts = posts.filter((p) => p.displayName === profile.displayName && !p.anonymous);

  const handleSave = () => {
    setProfile(draft);
    setEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 h-12 flex items-center z-10">
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 transition -ml-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-gray-800 ml-2">プロフィール</span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Edit modal */}
        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setEditing(false)} />
            <div className="relative bg-white w-full max-w-md mx-4 rounded-2xl px-5 pt-5 pb-6 space-y-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-gray-900 text-base">プロフィールを編集</h3>
                <button onClick={() => setEditing(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">名前</label>
                <input
                  value={draft.displayName}
                  onChange={(e) => setDraft((d) => ({ ...d, displayName: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">自己紹介</label>
                <textarea
                  value={draft.bio}
                  onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition resize-none"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={() => setEditing(false)} className="flex-1 border border-gray-200 text-gray-500 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition">
                  キャンセル
                </button>
                <button onClick={handleSave} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
                  保存
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-indigo-500 to-indigo-600" />
          <div className="px-5 pb-5">
            <div className="flex items-end justify-between -mt-8 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border-2 border-white flex items-center justify-center text-indigo-600 font-bold text-2xl">
                {profile.displayName.charAt(0)}
              </div>
              <button
                onClick={() => { setDraft(profile); setEditing(true); }}
                className="text-xs text-indigo-600 border border-indigo-200 bg-indigo-50 px-3 py-1.5 rounded-full font-medium hover:bg-indigo-100 transition"
              >
                編集
              </button>
            </div>
            <p className="font-bold text-gray-900 text-lg leading-tight">{profile.displayName}</p>
            {profile.bio && <p className="text-sm text-gray-600 mt-3 leading-relaxed">{profile.bio}</p>}
          </div>
        </div>

        {/* My posts */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-800 text-sm">自分の投稿</h2>
            <span className="text-xs text-gray-400 font-medium">{myPosts.length}件</span>
          </div>
          {myPosts.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-gray-400">まだ投稿がありません</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {myPosts.map((post) => (
                <div key={post.id} className="px-5 py-4 flex gap-3 items-start">
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 flex-shrink-0"
                    style={{ backgroundColor: (TYPE_COLORS[post.type] ?? "#6366f1") + "18", color: TYPE_COLORS[post.type] ?? "#6366f1" }}
                  >
                    {TYPE_LABELS[post.type]}
                  </span>
                  <div className="flex-1 min-w-0">
                    {post.title && <p className="text-xs font-semibold text-gray-700 mb-0.5">{post.title}</p>}
                    <p className="text-sm text-gray-700">{post.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{timeAgo(post.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
