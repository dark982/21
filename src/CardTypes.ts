export type CardType = "NumberCard" | "SpecialCard" | "ImageCard";
export type CardColor = "heart" | "tiles" | "clovers" | "pikes";

export interface Card {
    type: CardType;
}

export interface ColoredCard {
    type: CardType;
    color: CardColor;
}

export interface NumberedCard extends ColoredCard {
    value: number;
    altvalue?: number;
}

export interface NumberCard extends NumberedCard {
    type: "NumberCard";
}

export interface ImageCard extends NumberedCard {
    type: "ImageCard";
    icon: string;
}