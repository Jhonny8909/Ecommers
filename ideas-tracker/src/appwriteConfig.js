import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Tu endpoint de Appwrite
  .setProject('67206aa30037aeb13d18'); // Tu ID de proyecto

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client); // Inicializa el servicio de almacenamiento

export const databaseID = '6727bf430038d4b25385'; // Tu ID de base de datos
export const collectionID = '6727bf55003de8159322'; // Tu ID de colección
export const bucketID = '6726c939000829482579'; // Reemplaza con el ID de tu bucket