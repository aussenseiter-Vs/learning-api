const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABSE_ID
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID

export const updateSearchCount = async () => {
    console.log(PROJECT_ID, DATABASE_ID, COLLECTION_ID)
}