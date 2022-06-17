import { addDoc, collection, doc, DocumentReference, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import router from "../Router";
import store from "../store/MainStore";
import { Firestore } from "./Firebase";


export class GameService {

    private conn: RTCPeerConnection;

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

        const lobbiesCollection = collection(Firestore, "lobbies")
        const lobyRef = doc(lobbiesCollection);

        const callerCandidatesCollection = collection(lobyRef, "callerCandidates");

        /*
        
        srv.collectIceCandidates(lobbyRef, "calleeCandidates", "callerCandidated")
*/
        srv.conn.addEventListener('icecandidate', event => {
            if (!event.candidate) {
                console.log('Got final candidate!');
                return;
            }
            console.log('Got candidate: ', event.candidate);
            addDoc(callerCandidatesCollection, event.candidate.toJSON());
        });


        return srv.conn.createOffer()
            .then((offer) => {
                return srv.conn.setLocalDescription(offer)
                    .then(() => {
                        return setDoc(lobyRef, {
                            offer: {
                                type: offer.type,
                                sdp: offer.sdp
                            }
                        })
                    })
                    .then(() => {
                        store.commit("lobby", lobyRef.id)

                        onSnapshot(lobyRef, async (snapshot) => {
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
        return {
            iceCandidatePoolSize: 512,
            iceServers: [
                {
                    urls: GameService.iceServers
                } as RTCIceServer
            ],
        };
    }

    private constructor() {
        this.conn = new RTCPeerConnection(this.getConfiguration());

        this.conn.addEventListener('icegatheringstatechange', () => {
            console.log(
                `ICE gathering state changed: ${this.conn.iceGatheringState}`);
        });

        this.conn.addEventListener('connectionstatechange', () => {
            console.log(`Connection state change: ${this.conn.connectionState}`);
        });

        this.conn.addEventListener('signalingstatechange', () => {
            console.log(`Signaling state change: ${this.conn.signalingState}`);

            switch (this.conn.signalingState) {
                case "stable":
                    store.commit("connection/established", true)
                    return;
            }
        });

        this.conn.addEventListener('iceconnectionstatechange ', () => {
            console.log(
                `ICE connection state change: ${this.conn.iceConnectionState}`);
        });
    }
}
