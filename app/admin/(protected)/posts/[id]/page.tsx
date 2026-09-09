import { notFound } from "next/navigation";
import { getPost } from "@/lib/db";
import PostForm from "../PostForm";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  if (!post) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl">Editar post</h1>
      <PostForm mode="edit" post={post} />
    </div>
  );
}
