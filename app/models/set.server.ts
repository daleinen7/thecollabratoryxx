import type { User } from "./user.server";
import { supabase } from "./user.server";

export type Set = {
  id: string;
  title: string;
  is_public: boolean;
  profile_id: string;
};

export async function getSetListItems({ userId }: { userId: User["id"] }) {
  const { data } = await supabase
    .from("sets")
    .select("id, title, is_public")
    .eq("profile_id", userId);
  return data;
}

export async function createSet({
  title,
  is_public,
  userId,
}: Pick<Set, "is_public" | "title"> & { userId: User["id"] }) {
  const { data, error } = await supabase
    .from("sets")
    .insert([{ title, is_public, profile_id: userId }])
    .single();

  if (!error) {
    return data;
  }

  return null;
}

export async function deleteSet({
  id,
  userId,
}: Pick<Set, "id"> & { userId: User["id"] }) {
  const { error } = await supabase
    .from("sets")
    .delete({ returning: "minimal" })
    .match({ id, profile_id: userId });

  if (!error) {
    return {};
  }

  return null;
}

export async function getSet({
  id,
  userId,
}: Pick<Set, "id"> & { userId: User["id"] }) {
  const { data, error } = await supabase
    .from("sets")
    .select("*")
    .eq("profile_id", userId)
    .eq("id", id)
    .single();

  if (!error) {
    return {
      userId: data.profile_id,
      id: data.id,
      title: data.title,
      is_public: data.is_public,
    };
  }

  return null;
}
