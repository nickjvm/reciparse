import React from "react";
import CreateForm from "./components/CreateForm";
import readUserSession from "@/lib/actions";
import { redirect } from "next/navigation";
import SignOut from "../auth-server-action/components/SignOut";
import { readCollections, readTodo } from "./actions";

export default async function Page() {

	const { data } = await readUserSession()

	if (!data?.session) {
		// return redirect('/auth-server-action');
	}

	const { data: recipes } = await readTodo()
	const { data: collections } = await readCollections()

	return (
		<div className="flex justify-center items-center">
			<div className="w-96 space-y-5">
				{data.session && <CreateForm />}
				{recipes?.map(recipe => {
					const collection = recipe.collections
					return <div key={recipe.id}>{recipe.name} {collection ? `- ${collection?.name}` : null}</div>
				})}
				{collections?.map(collection => {
					return <div key={collection.name}>{collection.name}</div>
				})}
			</div>
		</div>
	);
}
