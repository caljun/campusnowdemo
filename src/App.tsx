import { useState } from "react";
import { PostsProvider } from "./context/PostsContext";
import MapView from "./pages/MapView";
import ListPage from "./pages/ListPage";
import ProfilePage from "./pages/ProfilePage";
import BoardDetailPage from "./pages/BoardDetailPage";
import type { Post } from "./types";

export type LatLng = { lat: number; lng: number; postId?: string };

export default function App() {
  const [mapOpen, setMapOpen] = useState(false);
  const [flyTarget, setFlyTarget] = useState<LatLng | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Post | null>(null);

  const handleLocate = (pos: LatLng) => {
    setFlyTarget(pos);
    setMapOpen(true);
  };

  return (
    <PostsProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-100 px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-indigo-600 tracking-tight">CampusNow</span>
            <span className="text-xs text-gray-400">NTT西日本本社</span>
          </div>
          <button
            onClick={() => setProfileOpen(true)}
            className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm hover:bg-indigo-200 transition"
          >
            デ
          </button>
        </header>

        {/* Timeline */}
        <div className="pt-12">
          <ListPage onLocate={handleLocate} onBoardSelect={setSelectedBoard} />
        </div>

        {/* Map — thumbnail or fullscreen */}
        <div
          onClick={() => { if (!mapOpen) setMapOpen(true); }}
          className={
            mapOpen
              ? "fixed inset-0 z-50"
              : "fixed bottom-5 right-4 z-40 w-36 h-24 rounded-2xl overflow-hidden shadow-xl cursor-pointer border-2 border-white"
          }
          style={{ transition: "all 0.3s ease" }}
        >
          <MapView
            mapOpen={mapOpen}
            onClose={() => setMapOpen(false)}
            flyTarget={flyTarget}
            onFlied={() => setFlyTarget(null)}
          />

          {/* Overlay label when thumbnail */}
          {!mapOpen && (
            <div className="absolute inset-0 flex items-end justify-center pb-1.5 pointer-events-none">
              <span className="text-[10px] font-semibold text-white bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                マップ
              </span>
            </div>
          )}
        </div>
        {/* Profile overlay */}
        {profileOpen && <ProfilePage onClose={() => setProfileOpen(false)} />}

        {/* Board detail overlay */}
        {selectedBoard && <BoardDetailPage post={selectedBoard} onClose={() => setSelectedBoard(null)} />}
      </div>
    </PostsProvider>
  );
}
