import { useState } from "react";
import { usePosts } from "../context/PostsContext";
import type { Post } from "../types";

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "たった今";
  if (min < 60) return `${min}分前`;
  return `${Math.floor(min / 60)}時間前`;
}

const DEMO_NAME = "デモユーザー";

interface Props {
  post: Post;
  onClose: () => void;
}

export default function BoardDetailPage({ post, onClose }: Props) {
  const { replies, addReply } = usePosts();
  const postReplies = replies[post.id] ?? [];
  const [text, setText] = useState("");

  const handleReply = () => {
    if (!text.trim()) return;
    addReply(post.id, { displayName: DEMO_NAME, text: text.trim(), createdAt: Date.now() });
    setText("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 h-12 flex items-center flex-shrink-0">
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 transition -ml-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-gray-800 ml-2 truncate">{post.title}</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Original post */}
        <div className="bg-white rounded-2xl px-4 py-4 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-700">{post.displayName}</p>
            <p className="text-[11px] text-gray-400">{timeAgo(post.createdAt)}</p>
          </div>
          {post.title && <p className="text-sm font-bold text-gray-900 mb-1">{post.title}</p>}
          <p className="text-sm text-gray-700 leading-relaxed">{post.text}</p>
        </div>

        {/* Replies */}
        {postReplies.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-400 font-medium px-1">返信 {postReplies.length}件</p>
            {postReplies.map((reply) => (
              <div key={reply.id} className="bg-white rounded-2xl px-4 py-3 border border-gray-100">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold text-gray-700">{reply.displayName}</p>
                  <p className="text-[11px] text-gray-400">{timeAgo(reply.createdAt)}</p>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{reply.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply input */}
      <div className="bg-white border-t border-gray-100 px-4 py-3 flex gap-2 flex-shrink-0">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleReply(); }}
          placeholder="返信を入力..."
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition"
        />
        <button
          onClick={handleReply}
          disabled={!text.trim()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-indigo-700 transition"
        >
          送信
        </button>
      </div>
    </div>
  );
}
