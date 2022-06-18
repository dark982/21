import { isStaticProperty } from '@vue/compiler-core';
import { createStore, StoreOptions } from 'vuex'
import { CardManager } from '../CardManager';
import { Card } from '../CardTypes';
import { GameService } from '../services/GameService';
import ConnectionStore from './ConnectionStore'
import mainstore from './MainStore'

// Create a new store instance.

export default {
    state() {
        return {
            hostTurn: true,
            remainingCards: 0,
            deck: [] as Card[],

            hostSpecialCards: [] as Card[],
            clientSpecialCards: [] as Card[],

            hostCards: [] as Card[],
            clientCards: [] as Card[],
            waitingForResponse: false,
            actionResult: true,
            staycounter: 0,

            winningNumber: 21,
            winner: "",
        }
    },

    namespaced: true,

    mutations: {
        winner(state, winner) {
            state.winner = winner
        },
        deck(state, deck: Card[]) {
            state.deck = deck;
        },
        turnHost(state) {
            state.hostTurn = true;
        },
        turnClient(state) {
            state.hostTurn = false;
        },
        draw(state) {
            if (!mainstore.getters.host) {
                state.waitingForResponse = true;
                mainstore.getters.gameservice.clientDrawCard();
            } else {
                state.staycounter = 0;
                const card = state.deck.pop();

                console.log("Push host", state.hostTurn)

                if (card.type === "SpecialCard") {
                    if (state.hostTurn) {
                        state.hostSpecialCards.push(card);
                    } else {
                        state.clientSpecialCards.push(card);
                    }
                } else {
                    if (state.hostTurn) {
                        state.hostCards.push(card);
                    } else {
                        state.clientCards.push(card);
                    }
                }
            }

            state.hostTurn = !state.hostTurn;

            mainstore.getters.gameservice.passState()
        },
        stay(state) {
            if (!mainstore.getters.host) {
                state.waitingForResponse = true;
                mainstore.getters.gameservice.clientStay();
            } else {
                state.staycounter++;
            }

            state.hostTurn = !state.hostTurn;

            mainstore.getters.gameservice.passState()
        },
        playSpecial(state, cardID) {
            if (!mainstore.getters.host) {
                state.waitingForResponse = true;
                mainstore.getters.gameservice.clientPlaySpecial(cardID)
            } else {

            }


        },

        startgame(state) {
            let random = Math.random();

            if (random > 0.5) {
                state.hostTurn = true
            } else {
                state.hostTurn = false
            }

            const manager = new CardManager();

            state.deck = CardManager.shuffle(manager.createDeck());

            state.hostSpecialCards = [];
            state.clientSpecialCards = [];
            state.clientCards = [];
            state.hostCards = [];

            state.winningNumber = 21;
            state.staycounter = 0;
            state.winner = "";
        },

        setState(state, data) {
            state.hostTurn = data.hostTurn;
            state.remainingCards = data.remainingCards;

            state.hostSpecialCards = data.hostSpecialCards;
            state.clientSpecialCards = data.clientSpecialCards;

            state.clientCards = data.clientCards;
            state.hostCards = data.hostCards;

            state.waitingForResponse = data.waitingForResponse;
            state.actionResult = data.actionResult;
        }
    },

    getters: {
        state(state) {


            return {
                hostTurn: state.hostTurn,
                remainingCards: state.deck.length,

                hostSpecialCards: state.hostSpecialCards,
                clientSpecialCards: state.clientSpecialCards,

                clientCards: state.clientCards,
                hostCards: state.hostCards,

                waitingForResponse: false,
                actionResult: true,
            }
        },
        yourturn(state): boolean {
            if (mainstore.getters.host) {
                return state.hostTurn
            } else {
                return !state.hostTurn
            }
        },

        hostTurn(state) {
            return state.hostTurn
        },

        remainingCards(state): number {
            return state.deck.length
        },

        clientCards(state) {
            return state.clientCards
        },

        hostCards(state) {
            return state.hostCards
        },

        staycount(state) {
            return state.staycounter
        },

        winningNumber(state) {
            return state.winningNumber
        },
        winner(state) {
            return state.winner
        },
    },

    actions: {

    },

    modules: {

    }
} as StoreOptions<any>;