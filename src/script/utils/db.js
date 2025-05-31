import { openDB } from 'idb';

const DATABASE_NAME = 'tabir-db';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'user-data';

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
    upgrade(database) {
        database.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
    },
});

const TabirIdb = {
    async getUserData(id) {
        return (await dbPromise).get(OBJECT_STORE_NAME, id);
    },

    async getAllUserData() {
        return (await dbPromise).getAll(OBJECT_STORE_NAME);
    },

    async putUserData(data) {
        return (await dbPromise).put(OBJECT_STORE_NAME, data);
    },

    async deleteUserData(id) {
        return (await dbPromise).delete(OBJECT_STORE_NAME, id);
    },
};

export default TabirIdb; 