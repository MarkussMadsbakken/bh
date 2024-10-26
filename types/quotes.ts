export type theme = "light" | "light-colorful"
export type reaction = "like" | "dislike" | "heart" | "angry" | "sad" | "grin" | "neutral" | "hot"
export type userReaction = { reaction: reaction, user: { name: string, id: string } }
export enum reactionMap {
    like = "👍",
    dislike = "👎",
    heart = "❤️",
    angry = "😡",
    sad = "😢",
    grin = "😬",
    neutral = "😐",
    hot = "🥵"
}
export enum reactionDescription {
    like = "kjente seg enig med sitatet",
    dislike = "likte ikke sitatet",
    heart = "elsket sitatet",
    angry = "ble provosert av sitatet",
    sad = "syntes sitatet var veldig trist",
    grin = "mente sitatet var kleint",
    neutral = "mente sitatet var mid",
    hot = "syntes sitatet var hot"
}