import { reaction } from "@/types/quotes";

interface ReactionPickerProps {
    addReaction: (reaction: reaction) => void;
}
export default function NewReactionPicker(props: Readonly<ReactionPickerProps>) {
    return (
        <div className="grid grid-cols-2 w-24 h-32 col-end-1 justify-center content-middle text-center">
            <button onClick={() => props.addReaction("like")}>👍</button>
            <button onClick={() => props.addReaction("dislike")}>👎</button>
            <button onClick={() => props.addReaction("heart")}>❤️</button>
            <button onClick={() => props.addReaction("angry")}>😡</button>
            <button onClick={() => props.addReaction("sad")}>😢</button>
            <button onClick={() => props.addReaction("grin")}>😬</button>
            <button onClick={() => props.addReaction("neutral")} >😐</button>
            <button onClick={() => props.addReaction("hot")}>🥵</button>
        </div>
    )
}