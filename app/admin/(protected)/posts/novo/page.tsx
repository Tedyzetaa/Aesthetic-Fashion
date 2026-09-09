import PostForm from "../PostForm";

export default function NovoPostPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl">Novo post</h1>
      <PostForm mode="new" />
    </div>
  );
}
