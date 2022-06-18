import { addDoc, collection, doc, DocumentReference, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { CardManager } from "../CardManager";
import { NumberedCard } from "../CardTypes";
import router from "../Router";
import store from "../store/MainStore";
import { Firestore } from "./Firebase";


export class GameService {

    private conn: RTCPeerConnection;

    // @ts-ignore
    private chatChannel: RTCDataChannel;
    // @ts-ignore
    private gameChannel: RTCDataChannel;

    private static iceServers: string[] = [
        "stun:stun.l.google.com:19302",
        //"stun:stun1.l.google.com:19302",
        //"stun:stun2.l.google.com:19302",
        //"stun:stun3.l.google.com:19302",
        //"stun:stun4.l.google.com:19302",
        "stun:stun.1und1.de:3478",
        //"stun:stun.gmx.de:3478",
        //"stun:stun.gmx.net:3478",
    ];

    private collectIceCandidates(roomRef: DocumentReference, localName: any, remoteName: any) {

        const candidatesCollection = collection(roomRef, localName);

        this.conn.addEventListener('icecandidate', event => {
            if (event.candidate) {
                const json = event.candidate.toJSON();
                addDoc(candidatesCollection, json);
            }
        });

        const roomCol = collection(roomRef, remoteName);
        onSnapshot(roomCol, snapshot => {
            console.log("got snapshot update")
            snapshot.docChanges().forEach(change => {
                if (change.type === "added") {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    this.conn.addIceCandidate(candidate);
                }
            });
        })

    }


    public static CreateRoom() {

        const srv = new GameService();

        srv.createChannels();

        const lobbiesCollection = collection(Firestore, "lobbies")
        const lobbyRef = doc(lobbiesCollection);

        const callerCandidatesCollection = collection(lobbyRef, "callerCandidates");

        srv.conn.addEventListener('icecandidate', event => {
            if (!event.candidate) {
                console.log('Got final candidate!');
                return;
            }
            console.log('Got candidate: ', event.candidate);
            addDoc(callerCandidatesCollection, event.candidate.toJSON());
        });

        srv.collectIceCandidates(lobbyRef, "callerCandidated", "calleeCandidates")

        return srv.conn.createOffer()
            .then((offer) => {
                return srv.conn.setLocalDescription(offer)
                    .then(() => {
                        return setDoc(lobbyRef, {
                            offer: {
                                type: offer.type,
                                sdp: offer.sdp
                            }
                        })
                    })
                    .then(() => {
                        store.commit("lobby", lobbyRef.id)

                        onSnapshot(lobbyRef, async (snapshot) => {
                            console.log('Got updated room:', snapshot.data());

                            const data = snapshot.data();

                            if (data && !srv.conn.currentRemoteDescription && data.answer) {
                                console.log('Set remote description: ', data.answer);
                                const answer = new RTCSessionDescription(data.answer)
                                await srv.conn.setRemoteDescription(answer);
                            }

                        })

                    })
            })
            .then(() => {
                return srv
            });
    }

    public static JoinRoom(id: any) {


        return Promise.resolve()
            .then(() => {

                return collection(Firestore, "lobbies")
            })
            .then((collection) => {
                return doc(collection, `${id}`)
            })
            .then(lobbyRef => {
                return getDoc(lobbyRef).then(lobbySnapshot => {
                    console.log('Got room:', lobbySnapshot.exists);

                    if (!lobbySnapshot.exists) {
                        throw "Lobby not found";
                    }

                    return lobbySnapshot;
                })
                    .then((lobbySnapshot) => {
                        const srv = new GameService();

                        srv.joinChannels();

                        const data = lobbySnapshot.data() as any;
                        const offer = data.offer;

                        srv.collectIceCandidates(lobbyRef, "calleeCandidates", "callerCandidated")

                        return srv.conn.setRemoteDescription(offer)
                            .then(() => {
                                return srv.conn.createAnswer()
                            })
                            .then((answer) => {
                                return srv.conn.setLocalDescription(answer)
                                    .then(() => {
                                        return answer
                                    })
                            })
                            .then((answer) => {
                                return updateDoc(lobbyRef, {
                                    answer: {
                                        type: answer.type,
                                        sdp: answer.sdp
                                    }
                                })
                            })
                    });
            })


    }

    private getConfiguration(): RTCConfiguration {

        const servers = [];

        for (let i = 0; i < GameService.iceServers.length; i++) {
            servers.push({
                urls: GameService.iceServers[i]
            } as RTCIceServer);

        }

        return {
            iceCandidatePoolSize: 4,
            iceServers: servers,
        };
    }

    private createChannels() {
        this.chatChannel = this.conn.createDataChannel("chat");
        this.gameChannel = this.conn.createDataChannel("game");

        this.addGameChannelListeners();
        this.addChatChannelListeners();
    }

    private addGameChannelListeners() {
        console.log("game channel list")
        this.gameChannel.addEventListener("open", (event) => {
            console.log("game channel open")

            store.commit("connection/established", true)
        });
        this.gameChannel.addEventListener('message', event => {
            const data = event.data;
            const json = JSON.parse(data);

            if (store.getters.host) {
                this.processGameChannelHost(json)
            } else {
                this.processGameChannelClient(json)
            }
        });
    }

    private addChatChannelListeners() {
        this.chatChannel.addEventListener("open", (event) => {
            console.log("Chat channel open")
        });


        this.chatChannel.addEventListener('message', event => {
            console.log("message", event)
        });

    }

    private joinChannels() {
        this.conn.addEventListener("datachannel", (event) => {
            const channel = event.channel;

            if (channel.label == "game") {
                this.gameChannel = channel;
                this.addGameChannelListeners();

            } else if (channel.label == "chat") {
                this.chatChannel = channel;
                this.addChatChannelListeners();
            }
        })
    }

    public passState() {

        if (!store.getters.host) {
            return;
        }

        this.checkGame();

        const state = JSON.parse(JSON.stringify(store.getters["gamestore/state"]))

        this.sendGame({
            type: "state",
            state: state
        })
    }

    private processGameChannelHost(json: any) {

        console.log(json.type, store.getters["gamestore/hostTurn"]);

        switch (json.type) {
            case "client_drawcard":
                if (!store.getters["gamestore/hostTurn"]) {
                    store.commit("gamestore/draw")
                }
                break;
            case "client_stay":
                if (!store.getters["gamestore/hostTurn"]) {
                    store.commit("gamestore/stay")
                }
                break;
            case "client_playspecial":
                if (!store.getters["gamestore/hostTurn"]) {
                    store.commit("gamestore/client_playspecial", json.id)
                }
                break;
            default:
                console.log("unkown", json)
        }
    }
    private processGameChannelClient(json: any) {
        switch (json.type) {
            case "gamestart":
                return router.push({ name: "game" })

            case "state":
                const state = json.state;
                store.commit("gamestore/setState", json.state)
                break;
            case "endgame":
                store.commit("gamestore/winner", json.winner)
                router.push({ name: "gameover" })
                break;

            default:
                console.log("unkown", json)
        }
    }

    public clientDrawCard() {
        this.sendGame({
            type: "client_drawcard"
        })
    }
    public clientStay() {
        this.sendGame({
            type: "client_stay"
        })
    }
    public clientPlaySpecial(cardID: string) {
        this.sendGame({
            type: "client_playspecial",
            id: cardID
        })
    }

    private constructor() {

        store.commit("gameservice", this)

        this.conn = new RTCPeerConnection(this.getConfiguration());

        this.conn.addEventListener('icegatheringstatechange', () => {
            console.log(
                `ICE gathering state changed: ${this.conn.iceGatheringState}`);
        });

        this.conn.onconnectionstatechange = () => {
            console.log(`Connection state change: ${this.conn.connectionState}`);

            switch (this.conn.connectionState) {
                case "new":

                    break;
                case "connected":

                    break;
                case "disconnected":

                    break;
                case "closed":

                    break;
                case "failed":

                    break;
                default:

                    break;
            }
        };

        this.conn.addEventListener('signalingstatechange', () => {
            console.log(`Signaling state change: ${this.conn.signalingState}`);
            /*
            switch (this.conn.signalingState) {
                case "stable":
                    store.commit("connection/established", true)
                    return;
            }
            */
        });

        this.conn.addEventListener('iceconnectionstatechange ', () => {
            console.log(
                `ICE connection state change: ${this.conn.iceConnectionState}`);
        });
    }

    public startGame() {

        store.commit("gamestore/startgame");

        router.push({ name: "game" })

        this.sendGame({
            type: "gamestart"
        });

        this.passState();
    }

    private sendGame(data: any) {
        this.gameChannel.send(JSON.stringify(data));
    }

    public draw() {
        store.commit("gamestore/draw");

        if (store.getters.host) {
            this.checkGame();
        }
    }
    public stay() {
        store.commit("gamestore/stay");

        if (store.getters.host) {
            this.checkGame();
        }
    }
    public playSpecialCard(id: string) {
        store.commit("gamestore/playSpecial", id);

        if (store.getters.host) {
            this.checkGame();
        }
    }

    public endGame() {
        this.determineWinner();
        router.push({ name: "gameover" })
        this.sendGame({
            type: "endgame",
            winner: store.getters["gamestore/winner"]
        })
    }

    private getCardsValue(cards: NumberedCard[]) {
        const winningNumber = store.getters["gamestore/winningNumber"]

        const alt = [] as number[];
        let value = 0;

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i]

            if (card.altvalue !== undefined) {
                alt.push(card.altvalue - card.value)
            }

            value += card.value;
        }

        if (winningNumber == value) {
            return value;
        }

        while (true) {
            let p = alt.pop();

            if (p === undefined) {
                return value;
            }

            if (value + p < winningNumber) {
                value = value + p;
            } else {
                return value;
            }
        }
    }

    private determineWinner() {

        const hostCards = store.getters["gamestore/hostCards"]
        const clientCards = store.getters["gamestore/clientCards"]

        const winningNumber = store.getters["gamestore/winningNumber"]

        let hostValue = this.getCardsValue(hostCards);
        let clientValue = this.getCardsValue(clientCards);

        console.log(hostValue, clientValue)

        if (hostValue > winningNumber && clientValue > winningNumber) {
            // both loose
            store.commit("gamestore/winner", "nobody")
            return;
        }

        if (hostValue > winningNumber) {
            // client wins
            store.commit("gamestore/winner", "client")
            return;
        }

        if (clientValue > winningNumber) {
            // host wins
            store.commit("gamestore/winner", "host")
            return;
        }

        if (hostValue == clientValue) {
            // remis#
            store.commit("gamestore/winner", "nobody")
            return;
        }

        if (hostValue < clientValue) {
            // client win
            store.commit("gamestore/winner", "client")
            return;
        } else {
            // host win
            store.commit("gamestore/winner", "host")
            return;
        }
    }

    private checkGame() {
        console.log(store.getters["gamestore/staycount"])
        if (store.getters["gamestore/staycount"] >= 2) {
            this.endGame();
        } else if (store.getters["gamestore/remainingCards"] <= 0) {
            this.endGame();
        }


    }
}
