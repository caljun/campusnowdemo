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
    lat: 34.699200,
    lng: 135.530050,
  },
  {
    id: "d2",
    type: "post",
    displayName: "匿名",
    text: "3Fのイベントホール今日も何かやってる。賑やかすぎて集中できんw",
    createdAt: now - 22 * min,
    anonymous: true,
    lat: 34.699100,
    lng: 135.529900,
  },
  {
    id: "d3",
    type: "post",
    displayName: "山本 葵",
    text: "ここ来るたびに新しい人と繋がれる。大学の外でこういう場所あるの最高すぎ",
    createdAt: now - 47 * min,
    anonymous: false,
    lat: 34.699250,
    lng: 135.530100,
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
    lat: 34.699220,
    lng: 135.530000,
  },
  {
    id: "d5",
    type: "board",
    displayName: "林 さくら",
    title: "おすすめの勉強スペース教えて",
    text: "NTT西日本本社ビル内でテスト前に籠もれる静かな場所ってどこですか？",
    createdAt: now - 90 * min,
    replyCount: 7,
    lat: 34.699240,
    lng: 135.530120,
  },
  {
    id: "d6",
    type: "board",
    displayName: "伊藤 颯",
    title: "起業に興味ある人あつまれ",
    text: "ビジネスアイデアを気軽に話し合える場を作りたいと思ってます。興味ある人いますか？",
    createdAt: now - 3 * 60 * min,
    replyCount: 2,
    lat: 34.699260,
    lng: 135.530080,
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
    lat: 34.699200,
    lng: 135.530050,
  },
  {
    id: "d8",
    type: "announcement",
    displayName: "施設管理",
    title: "Wi-Fiメンテナンスのご連絡",
    text: "本日22:00〜23:00の間、館内Wi-Fiのメンテナンスを行います。ご不便をおかけして申し訳ありません。",
    createdAt: now - 60 * min,
    replyCount: 0,
    lat: 34.699180,
    lng: 135.530040,
  },
  {
    id: "d9",
    type: "announcement",
    displayName: "コミュニティ担当",
    title: "新機能リリース：位置連動投稿",
    text: "CampusNowに新機能が追加されました！NTT西日本本社エリア内にいるときだけ投稿できる「その場投稿」機能をぜひ使ってみてください。",
    createdAt: now - 2 * 60 * min,
    replyCount: 3,
    lat: 34.699250,
    lng: 135.530100,
  },
  // -------- 大阪城エリア（デモ：6件）--------
  {
    id: "d10",
    type: "post",
    displayName: "佐藤 太郎",
    text: "大阪城公園の近くで“読書＋ちょい勉強”してみた。風が気持ちよくて、景色のおかげで集中が切れにくかった。コンセント使える場所（もしくは電源いらない集中スポット）知ってたら教えて！",
    createdAt: now - 12 * min,
    anonymous: false,
    lat: 34.687350,
    lng: 135.526250,
  },
  {
    id: "d11",
    type: "post",
    displayName: "匿名",
    text: "観光客多めの日って、どこが一番落ち着くんだろう…？風は最高なんだけど、通り沿いだと視線が気になる。静かに読めるベンチ/場所、誰か教えて〜。",
    createdAt: now - 28 * min,
    anonymous: true,
    lat: 34.687280,
    lng: 135.526150,
  },
  {
    id: "d12",
    type: "post",
    displayName: "鈴木 花子",
    text: "散歩ついでに気分転換して、そのままノート開いてる。短い休憩→また集中、のリズムが作れると捗る！みんなは“ここで切り替える”って決めてる場所ある？",
    createdAt: now - 52 * min,
    anonymous: false,
    lat: 34.687420,
    lng: 135.526100,
  },
  {
    id: "d13",
    type: "board",
    displayName: "大阪 太郎",
    title: "城公園で“静かに読書/勉強”一緒にやりませんか？",
    text: "大阪城公園の周辺で、静かめに読書や勉強しませんか。会話は最小限で、休憩だけ軽く共有できたら嬉しいです。まずは集合場所と時間を揃えたい！",
    createdAt: now - 70 * min,
    replyCount: 2,
    lat: 34.687330,
    lng: 135.526120,
  },
  {
    id: "d14",
    type: "board",
    displayName: "田村 次郎",
    title: "雨でも安心！大阪城周辺で短めの“読書会/お茶会”",
    text: "5〜10分くらいの自己紹介（軽くでOK）＋それぞれ好きな本/資料を読む時間を作りたいです。天気が良ければ公園で、お天気微妙なら近くの落ち着く室内で集合しませんか？",
    createdAt: now - 120 * min,
    replyCount: 5,
    lat: 34.687220,
    lng: 135.526240,
  },
  {
    id: "d15",
    type: "announcement",
    displayName: "運営スタッフ",
    title: "【大阪城】交流イベントのお知らせ",
    text: "明日18:00〜大阪城周辺で“ちょい雑談＆読書タイム”を開催します。話したい人は少しだけ、静かに過ごしたい人も歓迎。途中参加OK、参加無料です。小さなお菓子持ってきてもらえると嬉しいです。",
    createdAt: now - 25 * min,
    replyCount: 0,
    lat: 34.687350,
    lng: 135.526190,
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
  d13: [
    { id: "r10", displayName: "松本 彩", text: "いいね！集合場所は“門の前”か“池の近く”みたいに目印決めよう。西の丸側だと分かりやすそう！", createdAt: now - 45 * min },
    { id: "r11", displayName: "中村 悠", text: "参加したいです。本は読書でも勉強資料でもOK？短い休憩のタイミングだけ決められると嬉しい！", createdAt: now - 18 * min },
  ],
  d14: [
    { id: "r12", displayName: "高橋 麻衣", text: "雨の日の集合場所、ちゃんと決めよう。駅から近い“落ち着く所”候補ある？", createdAt: now - 200 * min },
    { id: "r13", displayName: "田中 蓮", text: "公園でやるなら風のある日は帽子/日焼け対策した方が良さそう。室内なら飲み物も用意したいね。", createdAt: now - 165 * min },
    { id: "r14", displayName: "林 さくら", text: "自己紹介は長くなくてOK！その分、読んだあとに“1行だけ感想”共有できたら嬉しい。", createdAt: now - 140 * min },
    { id: "r15", displayName: "伊藤 颯", text: "途中参加しやすいの良いね。開始10分前くらいで目印の連絡だけ入れようか。", createdAt: now - 110 * min },
    { id: "r16", displayName: "山本 葵", text: "こういう静かな集まり、ほんと参加しやすい。大阪城周辺なら時間作れるから行きたい！", createdAt: now - 85 * min },
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
