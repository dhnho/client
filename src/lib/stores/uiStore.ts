import { makeAutoObservable, runInAction } from "mobx"

export class UiStore {
    isLoading = false
    
    constructor() {
        makeAutoObservable(this)
    }

    isBusy() {
        runInAction(() => {
            this.isLoading = true
        })
    }

    isIdle() {
        runInAction(() => {
            this.isLoading = false
        })
    }
}