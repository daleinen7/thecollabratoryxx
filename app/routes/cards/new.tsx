import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { createCard } from "~/models/card.server";
import { requireUserId } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const parameter = formData.get("parameter");
  const category = formData.get("category");

  if (typeof parameter !== "string" || parameter.length === 0) {
    return json(
      { errors: { parameter: "Parameter is required" } },
      { status: 400 }
    );
  }

  if (typeof category !== "string" || category.length === 0) {
    return json(
      { errors: { category: "category is required" } },
      { status: 400 }
    );
  }

  // Here is where we need the set ID instead
  const card = await createCard({ parameter, category, userId });
  return redirect(`/cards/${card.id}`);
};

export default function NewCardPage() {
  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            name="parameter"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
          />
        </label>
      </div>
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Body: </span>
          <textarea
            name="body"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
          ></textarea>
        </label>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
