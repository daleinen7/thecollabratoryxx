import type { User } from "./user.server";
import { supabase } from "./user.server";

export type Card = {
  id: string;
  parameter: string;
  category: string;
  set_id: string;
};

export async function getCardListItems({ userId }: { userId: User["id"] }) {
  const { data } = await supabase
    .from("cards")
    .select("id, parameter")
    .eq("set_id", userId);
  return data;
}

export async function createCard({
  parameter,
  category,
  userId,
}: Pick<Card, "category" | "parameter"> & { userId: User["id"] }) {
  const { data, error } = await supabase
    .from("cards")
    .insert([{ parameter, category, set_id: userId }])
    .single();

  if (!error) {
    return data;
  }

  return null;
}

export async function deleteCard({
  id,
  userId,
}: Pick<Card, "id"> & { userId: User["id"] }) {
  const { error } = await supabase
    .from("cards")
    .delete({ returning: "minimal" })
    .match({ id, set_id: userId });

  if (!error) {
    return {};
  }

  return null;
}

export async function getCard({
  id,
  userId,
}: Pick<Card, "id"> & { userId: User["id"] }) {
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("set_id", userId)
    .eq("id", id)
    .single();

  if (!error) {
    return {
      userId: data.set_id,
      id: data.id,
      parameter: data.parameter,
      category: data.category,
    };
  }

  return null;
}
