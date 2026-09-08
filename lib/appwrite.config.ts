import * as sdk from "node-appwrite";
export const {
  ID_PROJECT,
  API_KEY,
  DATABASE_ID,
  PATIENT_ID,
  DOCTOR_ID,
  APPOINTMENT_ID,
  PUBLIC_ID: Bucket_ID,
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
} = process.env;

const client = new sdk.Client();

client
  .setEndpoint(ENDPOINT!)
  .setProject(ID_PROJECT || "")
  .setKey(API_KEY || "");

export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
