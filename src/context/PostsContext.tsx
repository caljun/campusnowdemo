import { createContext, useContext, useState, type ReactNode } from "react";
import type { Post, Reply } from "../types";

interface PostsContextType {
  posts: Post[];
  replies: Record<string, Reply[]>;
  addPost: (post: Omit<Post, "id">) => void;
  addReply: (postId: string, reply: Omit<Reply, "id">) => void;
}

const PostsContext = createContext<PostsContextType | null>(null);

const now = Date.now();
const min = 60000;

const DUMMY_POSTS: Post[] = [
  // 投稿
  {
    id: "d1",
    type: "post",
    displayName: "田中 蓮",
    text: "NTT西日本本社のカフェスペースめっちゃ作業しやすい！電源もWi-Fiも快適すぎる",
    createdAt: now - 8 * min,
    anonymous: false,
    lat: 34.699200, lng: 135.530050,
  },
  {
    id: "d2",
    type: "post",
    displayName: "匿名",
    text: "3Fのイベントホール今日も何かやってる。賑やかすぎて集中できんw",
    createdAt: now - 22 * min,
    anonymous: true,
    lat: 34.699100, lng: 135.529900,
  },
  {
    id: "d3",
    type: "post",
    displayName: "山本 葵",
    text: "ここ来るたびに新しい人と繋がれる。大学の外でこういう場所あるの最高すぎ",
    createdAt: now - 47 * min,
    anonymous: false,
    lat: 34.699250, lng: 135.530100,
  },
  // 掲示板
  {
    id: "d4",
    type: "board",
    displayName: "中村 悠",
    title: "一緒にハッカソン出る人いませんか？",
    text: "来月のハッカソンに向けてチーム探してます。デザインできる人がいると嬉しいです！",
    createdAt: now - 35 * min,
    replyCount: 4,
  },
  {
    id: "d5",
    type: "board",
    displayName: "林 さくら",
    title: "おすすめの勉強スペース教えて",
    text: "NTT西日本本社ビル内でテスト前に籠もれる静かな場所ってどこですか？",
    createdAt: now - 90 * min,
    replyCount: 7,
  },
  {
    id: "d6",
    type: "board",
    displayName: "伊藤 颯",
    title: "起業に興味ある人あつまれ",
    text: "ビジネスアイデアを気軽に話し合える場を作りたいと思ってます。興味ある人いますか？",
    createdAt: now - 3 * 60 * min,
    replyCount: 2,
  },
  // 告知
  {
    id: "d7",
    type: "announcement",
    displayName: "運営スタッフ",
    title: "【本日】ピッチイベント開催のお知らせ",
    text: "本日17:00よりイベントホールにてスタートアップピッチイベントを開催します。参加無料・事前申込不要です。ぜひお越しください！",
    createdAt: now - 15 * min,
    replyCount: 0,
  },
  {
    id: "d8",
    type: "announcement",
    displayName: "施設管理",
    title: "Wi-Fiメンテナンスのご連絡",
    text: "本日22:00〜23:00の間、館内Wi-Fiのメンテナンスを行います。ご不便をおかけして申し訳ありません。",
    createdAt: now - 60 * min,
    replyCount: 0,
  },
  {
    id: "d9",
    type: "announcement",
    displayName: "コミュニティ担当",
    title: "新機能リリース：位置連動投稿",
    text: "CampusNowに新機能が追加されました！NTT西日本本社エリア内にいるときだけ投稿できる「その場投稿」機能をぜひ使ってみてください。",
    createdAt: now - 2 * 60 * min,
    replyCount: 3,
  },
];

const DUMMY_REPLIES: Record<string, Reply[]> = {
  d4: [
    { id: "r1", displayName: "松本 彩", text: "興味あります！デザイン専攻なので参加したいです。いつ頃予定ですか？", createdAt: now - 28 * min },
    { id: "r2", displayName: "中村 悠", text: "ありがとうございます！来週末あたりを考えてます。DMしますね", createdAt: now - 20 * min },
    { id: "r3", displayName: "吉田 拓海", text: "自分もエンジニアとして参加したいです！フロント得意です", createdAt: now - 10 * min },
  ],
  d5: [
    { id: "r4", displayName: "高橋 麻衣", text: "3Fの奥のラウンジが静かでおすすめです！コンセントも多いですよ", createdAt: now - 80 * min },
    { id: "r5", displayName: "田中 蓮", text: "2Fのガラス張りのスペースも集中できます。朝早めに行くと空いてる", createdAt: now - 70 * min },
    { id: "r6", displayName: "林 さくら", text: "ありがとうございます！両方試してみます", createdAt: now - 55 * min },
  ],
  d6: [
    { id: "r7", displayName: "小林 健太", text: "めっちゃ興味あります。どんなアイデア持ってますか？", createdAt: now - 170 * min },
    { id: "r8", displayName: "伊藤 颯", text: "まだ具体的には決まってないけど、学生向けのサービスを考えてます。気軽に話しましょう！", createdAt: now - 150 * min },
    { id: "r9", displayName: "山本 葵", text: "私も起業に興味あります。参加させてください！", createdAt: now - 130 * min },
  ],
};

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(DUMMY_POSTS);
  const [replies, setReplies] = useState<Record<string, Reply[]>>(DUMMY_REPLIES);

  const addPost = (post: Omit<Post, "id">) => {
    const newPost: Post = { ...post, id: crypto.randomUUID() };
    setPosts((prev) => [newPost, ...prev]);
  };

  const addReply = (postId: string, reply: Omit<Reply, "id">) => {
    const newReply: Reply = { ...reply, id: crypto.randomUUID() };
    setReplies((prev) => ({ ...prev, [postId]: [...(prev[postId] ?? []), newReply] }));
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, replyCount: (p.replyCount ?? 0) + 1 } : p));
  };

  return (
    <PostsContext.Provider value={{ posts, replies, addPost, addReply }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error("usePosts must be used within PostsProvider");
  return ctx;
}
