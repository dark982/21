import { Card, CardColor, ImageCard, NumberCard } from "./CardTypes";
import { v4 as uuidv4 } from 'uuid';


export class CardManager {

    public static shuffle(a: Card[]) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    public createDeck() {

        const stack: Card[] = [];

        const cardColors: CardColor[] = ["heart", "tiles", "clovers", "pikes"];

        cardColors.forEach(color => {
            for (let i = 2; i <= 9; i++) {

                let item: NumberCard = {
                    type: "NumberCard",
                    value: i,
                    color: color,
                };

                stack.push(item);
            }

            let ass: ImageCard = {
                type: "ImageCard",
                value: 1,
                altvalue: 11,
                icon: "A",
                color: color
            }

            stack.push(ass);

            let joker: ImageCard = {
                type: "ImageCard",
                value: 10,
                icon: "J",
                color: color
            }

            stack.push(joker);

            let queen: ImageCard = {
                type: "ImageCard",
                value: 10,
                icon: "Q",
                color: color
            }

            stack.push(queen);

            let king: ImageCard = {
                type: "ImageCard",
                value: 10,
                icon: "K",
                color: color
            }

            stack.push(king);
        });

        return stack;
    }
}