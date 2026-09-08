"use server";

import { users } from "../appwrite.config";
import { Query, ID } from "node-appwrite";

export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name,
    );
    return { $id: newUser.$id };
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 409
    ) {
      const documents = await users.list([Query.equal("email", user.email)]);

      return { $id: documents.users[0].$id };
    }

    throw error;
  }
};
