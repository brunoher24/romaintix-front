const emptyData = { 
    uid: "", 
    nickname: "",
    wordIndex: -1,
    playedWords: [],
    wordHasBeenFound: false,
    firebaseIdToken: ""
};

class StorageService {
    constructor() {
        this.data = this.getAllData();
    }

    getAllData() {
        const data = localStorage.getItem('romaintix2404');
        return data ? JSON.parse(data) : emptyData;  
    }
    getData(key) {
        return this.data[key];
    }
    setData(key, newValue) {
        this.data[key] = newValue;
        localStorage.setItem('romaintix2404', JSON.stringify(this.data));
        console.log(this.data);
    }
    setAllData(data) {
        this.data = {...data};
        localStorage.setItem('romaintix2404', JSON.stringify(this.data));
    }
    unset(key) {
        this.data[key] = null;
        localStorage.setItem('romaintix2404', JSON.stringify(this.data));
    }
    clear() {
        this.data = {...emptyData};
        localStorage.setItem('romaintix2404', JSON.stringify(this.data));
    }
}

export default StorageService;