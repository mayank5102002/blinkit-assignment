import { getDatabase, ref, set, child, get } from "firebase/database";

const db = getDatabase();

const uploadImageUrl = async (url: string, userId: String) => {
    let imageNumber = 0;

    const dbRef = ref(getDatabase());
    get(child(dbRef, 'images/' + userId)).then((snapshot) => {
        if (snapshot.exists()) {
            imageNumber = snapshot.size;
            console.log('imageNumber inside:', imageNumber)
            uploadImageData(url, userId, imageNumber);
        } else {
            uploadImageData(url, userId, imageNumber);
        }
    });
};

const uploadImageData = async (url: string, userId: String, imageNumber : number) => {
    console.log('imageNumber outside:', imageNumber)
    console.log('images/' + userId + '/image' + imageNumber);
    set(ref(db, 'images/' + userId + '/image' + imageNumber), {
        imageUrl: url,
    })
        .then(() => {
            console.log('Image URL uploaded to database');
        })
        .catch((error) => {
            console.error('Error uploading image URL:', error);
        });
};

export { uploadImageUrl };