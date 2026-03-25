import { useMemo, useState } from "react";
import { usePosts } from "../context/PostsContext";
import type { LatLng } from "../App";
import type { Post, PostType } from "../types";
import { GEOFENCE_RADIUS_M, getLocation, haversineDistance, type LocationId, LOCATIONS } from "../geo";

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "たった今";
  if (min < 60) return `${min}分前`;
  return `${Math.floor(min / 60)}時間前`;
}

type Tab = "all" | PostType;

const TABS: { key: Tab; label: string }[] = [
  { key: "all",          label: "すべて" },
  { key: "post",         label: "投稿" },
  { key: "board",        label: "掲示板" },
  { key: "announcement", label: "告知" },
];

const TYPE_COLORS: Record<PostType, string> = {
  post:         "#6366f1",
  board:        "#f97316",
  announcement: "#10b981",
};

const TYPE_LABELS: Record<PostType, string> = {
  post:         "投稿",
  board:        "掲示板",
  announcement: "告知",
};

interface Props {
  activeLocationId: LocationId;
  onActiveLocationChange: (id: LocationId) => void;
  onLocate: (pos: LatLng) => void;
  onBoardSelect: (post: Post) => void;
}

export default function ListPage({ activeLocationId, onActiveLocationChange, onLocate, onBoardSelect }: Props) {
  const { posts } = usePosts();
  const [tab, setTab] = useState<Tab>("all");

  const [showLocationMenu, setShowLocationMenu] = useState(false);

  const activeLocation = useMemo(() => getLocation(activeLocationId), [activeLocationId]);

  const filtered = useMemo(() => {
    const byType = tab === "all" ? posts : posts.filter((p) => p.type === tab);

    // 選択中のエリア（ジオフェンス半径内）に紐づく投稿だけ表示する
    return byType.filter((p) => {
      if (p.lat == null || p.lng == null) return true; // 念のため（データが無い場合でもUIが空にならない）
      const d = haversineDistance(p.lat, p.lng, activeLocation.lat, activeLocation.lng);
      return d <= GEOFENCE_RADIUS_M;
    });
  }, [activeLocation.lat, activeLocation.lng, posts, tab]);

  const activeLocationName = activeLocation.name;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-end justify-between mb-5">
        <h1 className="text-xl font-bold text-gray-900">タイムライン</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLocationMenu((v) => !v)}
            className="flex items-center gap-1.5 bg-white border border-gray-100 text-gray-700 px-3 py-1.5 rounded-full shadow-sm hover:bg-gray-50 transition text-xs font-semibold"
          >
            <span className="text-indigo-600">{activeLocationName}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />

          <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full">
            <span className="text-xs font-medium">{filtered.length}件</span>
          </div>
        </div>
      </div>

      {showLocationMenu && (
        <div className="relative -mt-4 mb-4">
          <div className="absolute right-0 top-0 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden w-44">
            {LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => {
                  onActiveLocationChange(loc.id);
                  setShowLocationMenu(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition flex items-center justify-between ${
                  loc.id === activeLocationId
                    ? "bg-indigo-50 text-indigo-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {loc.name}
                {loc.id === activeLocationId && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
              tab === key
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-gray-50 text-gray-500 border-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-500">まだ投稿がありません</p>
        </div>
      ) : (
        <div className="space-y-3 pb-32">
          {filtered.map((post) => {
            const color = TYPE_COLORS[post.type];
            const label = post.type === "post" && post.anonymous ? "匿名" : post.displayName;
            const hasLocation = post.type === "post" && post.lat != null && post.lng != null;
            const isBoard = post.type === "board";

            return (
              <div
                key={post.id}
                onClick={() => isBoard && onBoardSelect(post)}
                className={`bg-white rounded-2xl px-4 py-4 border border-gray-100 ${isBoard ? "cursor-pointer active:scale-[0.99] hover:border-gray-200 transition-all" : ""}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                    style={{ backgroundColor: color + "18", color }}
                  >
                    {TYPE_LABELS[post.type]}
                  </span>
                  <span className="text-[11px] text-gray-400 ml-auto">{timeAgo(post.createdAt)}</span>
                </div>

                {post.title && (
                  <p className="text-sm font-semibold text-gray-900 mb-1">{post.title}</p>
                )}
                <p className="text-sm text-gray-700 leading-relaxed mb-2">{post.text}</p>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400 font-medium">{label}</p>
                  {isBoard && (
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${(post.replyCount ?? 0) > 0 ? "bg-orange-50 text-orange-500" : "bg-gray-100 text-gray-400"}`}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        {post.replyCount ?? 0}件
                      </span>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  )}
                  {hasLocation && (
                    <button
                      onClick={() => onLocate({ lat: post.lat!, lng: post.lng!, postId: post.id })}
                      className="flex items-center gap-1 text-[11px] text-indigo-500 font-medium hover:text-indigo-700 transition"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      地図で見る
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
