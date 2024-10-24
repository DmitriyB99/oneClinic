import type { FC, ReactElement } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Draggable from "react-draggable";
import { useQuery } from "react-query";
import useWebSocket from "react-use-websocket";

import { Spin } from "antd";
import clsx from "clsx";
import { intervalToDuration } from "date-fns";
import { useRouter } from "next/router";
import type { SendJsonMessage } from "react-use-websocket/src/lib/types";

import { chatApi } from "@/shared/api/chat";
import { CameraOffIcon, MicOffIcon } from "@/shared/components";
import { UserContext } from "@/shared/contexts/userContext";
import type { NewMessages } from "@/shared/hooks/useChat";
import { useChat } from "@/shared/hooks/useChat";
import useLongPress from "@/shared/hooks/useLongPress";
import { useMediaQuery } from "@/shared/utils";
import { CallAnswer } from "@/widgets/call";

/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-empty-function */

interface LocalUser {
  isCameraOn: boolean;
  isMicOn: boolean;
  name?: string;
  sdp?: string;
  type: "offer" | "answer";
  user: string;
}

interface CallContextType {
  acceptCall: (chatRoomIdLocal?: string, setAccept?: boolean) => void;
  changeCamera: () => void;
  chatRoomName?: string;
  error: string | null;
  generatedStream: boolean;
  handleOffer: () => void;
  initCall: (chatRoomId: string) => void;
  isCameraOn: boolean;
  isMicOn: boolean;
  isOffer: boolean | null;
  isRunning: boolean;
  isSocketConnected: boolean;
  isSpeakerOn: boolean;
  lastJsonMessage: { [p: string]: string };
  makeCall: (to: string) => void;
  minutes: string;
  newMessages: NewMessages;
  readMessages: (id: string) => void;
  seconds: string;
  sendJsonMessage: SendJsonMessage;
  setIsOffer: (val: boolean) => void;
  start: () => void;
  state: string | null;
  stop: () => void;
  stream: MediaStream | null;
  toggleCamera: () => void;
  toggleMic: () => void;
  toggleSpeaker: () => void;
  totalNewMessages: number;
}

export const CallContext = createContext<CallContextType>({
  isOffer: false,
  setIsOffer: () => {},
  handleOffer: () => {},
  isRunning: false,
  chatRoomName: undefined,
  toggleCamera: () => {},
  generatedStream: false,
  changeCamera: () => {},
  acceptCall: () => {},
  isSocketConnected: false,
  sendJsonMessage: () => {},
  makeCall: () => {},
  isCameraOn: true,
  readMessages: () => {},
  lastJsonMessage: {},
  minutes: "0",
  seconds: "0",
  newMessages: {},
  totalNewMessages: 0,
  toggleMic: () => {},
  initCall: () => {},
  stop: () => {},
  toggleSpeaker: () => {},
  start: () => {},
  stream: null,
  isMicOn: true,
  isSpeakerOn: false,
  state: null,
  error: null,
});

export const CallContextProvider: FC<{ children: ReactElement }> = (props) => {
  const { user: me, locale } = useContext(UserContext);

  const [isOffer, setIsOffer] = useState<boolean | null>(null);
  const [openModal, setModalOpen] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [frontCamera, setFrontCamera] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] =
    useState<null | "processing" | "inCall" | "initCall" | "acceptCall">(null);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [switchCamera, setSwitchCamera] = useState(false);
  const [generatedStream, setGeneratedStream] = useState(false);
  const [users, setUsers] = useState<LocalUser[]>([]);

  const duration = intervalToDuration({ start: 0, end: time * 1000 });
  const zeroPad = (num: number) => String(num).padStart(2, "0");

  useEffect(() => {
    let intervalId: number | Interval;
    if (isRunning) {
      // @ts-ignore
      intervalId = setInterval(() => setTime(time + 1), 1000);
    }
    // @ts-ignore
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  const myVideo = useRef<HTMLVideoElement>(null);
  const usersVideoRef = useRef<{ [key: string]: HTMLVideoElement }>({});
  const connectionRef = useRef<{ [key: string]: RTCPeerConnection }>({});
  const chatRoomId = useRef<string>("");
  const connectedUsers = useRef<string[]>([]);
  const isConnectingToUser = useRef(false);
  const isMobile = useMediaQuery();

  const router = useRouter();

  const getSocketUrl = useCallback(
    () =>
      chatApi
        .getTicket()
        .then(
          (res) =>
            `wss://oneclinic.consilium.kz:8080/main/realtime-chat?ticketId=${res.data.id}&languageCode=${locale}`
        ),
    [locale]
  );

  const { sendJsonMessage, lastJsonMessage, readyState } =
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    useWebSocket<any>(getSocketUrl, {
      shouldReconnect: () => true,
      reconnectAttempts: 100,
      reconnectInterval: 300,
    });

  const { data: chatRoomName } = useQuery(
    ["getChatInfoForCall", chatRoomId?.current],
    () => chatApi.getChatInfo(chatRoomId?.current).then((re) => re.data.name),
    { enabled: !!chatRoomId?.current }
  );

  const {
    newMessages,
    total: totalNewMessages,
    readMessages,
  } = useChat(lastJsonMessage);

  const onIceCandidate = useCallback(
    (candidate: RTCIceCandidate | null, user: string) => {
      if (candidate) {
        const message = {
          command: "ON_ICE_CANDIDATE",
          chatRoomId: chatRoomId.current,
          iceCandidate: candidate as unknown as string,
          receiverId: user,
        };
        sendJsonMessage(message);
      }
    },
    [chatRoomId, sendJsonMessage]
  );

  const redirectCallPage = useCallback(
    (_chatRoomId?: string) => {
      if (isMobile) {
        router.push({
          pathname: "/call",
          query: { chatRoomId: _chatRoomId ?? chatRoomId.current },
        });
      } else {
        router.push({
          pathname: `/desktop/call/${_chatRoomId ?? chatRoomId.current}`,
        });
      }
    },
    [isMobile, router]
  );

  const getCandidates = useCallback(() => {
    sendJsonMessage({
      command: "GET_CHAT_USER_INFO",
      chatRoomId: chatRoomId.current,
    });
  }, [sendJsonMessage]);

  const createPeerConnection = useCallback(
    async (user: string) => {
      const peer = await new RTCPeerConnection({
        iceServers: [
          { urls: "stun:oneclinic.consilium.kz:347" },
          {
            urls: "turn:oneclinic.consilium.kz:3478",
            username: "admin",
            credential: "v3hAfnHZWpur8JYG",
          },
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
          { urls: "stun:stun4.l.google.com:19302" },
        ],
      });
      connectionRef.current[user] = peer;
      peer.onicecandidate = (ev) => {
        onIceCandidate(ev.candidate, user);
      };
      peer.onnegotiationneeded = (ev) => {
        console.log(`${user} - negotiation: ${ev} - ${new Date()}`);
      };
      peer.onconnectionstatechange = () => {
        console.log(
          `${user} - connection: ${peer.connectionState} - ${new Date()}`
        );
        if (peer.connectionState === "disconnected") {
          const localUser = users.find((_user) => _user.user === user);
          if (localUser?.type === "offer") {
            peer.close();
            console.log("disconnected", localUser, user, users);
            setUsers((prev) =>
              prev.map((prevUser) => {
                if (prevUser.user === user) {
                  return { ...prevUser, sdp: "" };
                }
                return prevUser;
              })
            );
            connectedUsers.current = connectedUsers.current.filter(
              (_user) => _user !== user
            );
          }
        } else if (peer.connectionState === "connected") {
          isConnectingToUser.current = false;
        }
      };
      peer.oniceconnectionstatechange = () => {
        console.log(
          `${user} - iceConnection: ${peer.iceConnectionState}- ${new Date()}`
        );
        if (
          peer.iceConnectionState === "failed" ||
          peer.iceConnectionState === "disconnected"
        ) {
          peer.restartIce();
          getCandidates();
        }
      };

      peer.onsignalingstatechange = () =>
        console.log(
          `${user} - signalingState: ${peer.signalingState}- ${new Date()}`
        );
      peer.onicegatheringstatechange = () =>
        console.log(
          `${user} - iceGathering: ${peer.iceGatheringState}- ${new Date()}`
        );

      peer.ontrack = (event) => {
        // @ts-ignore
        usersVideoRef.current[user].srcObject = event.streams[0];
      };
      stream?.getTracks().forEach((track) => peer.addTrack(track, stream));
    },
    [getCandidates, onIceCandidate, stream, users]
  );

  const onOfferCall = useCallback(
    (chatRoomId: string) => {
      const message = {
        command: "CALL",
        chatRoomId,
      };
      sendJsonMessage(message);
    },
    [sendJsonMessage]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleOffer = async () => {
    setState("inCall");
    setIsRunning(true);
  };

  const isCallPage = useMemo(
    () =>
      router.pathname === "/call" ||
      router.pathname === "/desktop/call/[callId]" ||
      router.pathname === "/desktop/configCall/[callId]",
    [router]
  );

  const stop = useCallback(
    (message?: boolean, decline?: boolean) => {
      if (connectionRef) {
        if (window) {
          window.AndroidInterface?.declineCall?.();
        }
        if (window?.webkit) {
          window.webkit?.messageHandlers?.jsMessageHandler?.postMessage?.(
            "declineCall"
          );
        }
        Object.values(connectionRef.current)?.forEach((connection) => {
          connection.close();
        });
        connectionRef.current = {};
        stream?.getTracks().forEach((track) => {
          track.stop();
        });
        if (message) {
          const message = {
            command: "CALL_STOP",
            chatRoomId: chatRoomId.current,
          };
          sendJsonMessage(message);
        }
        setState(null);
        setIsRunning(false);
        setUsers([]);
        setIsOffer(null);
        setTime(0);
        setGeneratedStream(false);
        setModalOpen(false);
        setSwitchCamera(false);
        setStream(null);
        connectedUsers.current = [];
        usersVideoRef.current = {};
        // @ts-ignore
        myVideo.current = null;
        if (me?.role === "doctor" && !decline) {
          if (isMobile) {
            router
              .replace({
                pathname: "/newRecord",
                query: { chatRoomId: chatRoomId.current, final: true },
              })
              .then(() => router.reload());
          } else {
            router
              .replace({
                pathname: "/newRecord",
                query: { chatRoomId: chatRoomId.current, final: true },
              })
              .then(() => router.reload());
          }
        } else if (isCallPage) {
          if (isMobile) {
            router
              .replace(`/chat/${chatRoomId.current}`)
              .then(() => router.reload());
          } else {
            router.replace(`/desktop/chat`).then(() => router.reload());
          }
        }
      }
    },
    [stream, isCallPage, sendJsonMessage, me?.role, isMobile, router]
  );
  const userJoinCall = useCallback(
    async (user: string) => {
      await createPeerConnection(user);
      const offerT = await connectionRef.current[user].createOffer();
      await connectionRef.current[user].setLocalDescription(offerT);
      const response = {
        command: "SDP_OFFER",
        chatRoomId: chatRoomId.current,
        receiverId: user,
        sdp: offerT.sdp,
      };
      sendJsonMessage(response);
    },
    [createPeerConnection, sendJsonMessage]
  );

  const userReceiveOfferCall = useCallback(
    async (user: string, sdp: string) => {
      await createPeerConnection(user);
      if (connectionRef.current) {
        connectionRef.current[user]?.setRemoteDescription({
          type: "offer",
          sdp,
        });
        const offerT = await connectionRef.current[user].createAnswer();
        await connectionRef.current[user].setLocalDescription(offerT);
        const response = {
          command: "SDP_ANSWER",
          chatRoomId: chatRoomId.current,
          receiverId: user,
          sdp: offerT.sdp,
        };
        sendJsonMessage(response);
        getCandidates();
      }
    },
    [createPeerConnection, getCandidates, sendJsonMessage]
  );

  useEffect(() => {
    if (users.length > 0 && stream && !isConnectingToUser.current) {
      users.forEach((newUser) => {
        if (
          !connectedUsers.current.includes(newUser.user) &&
          !isConnectingToUser.current
        ) {
          if (newUser.type === "offer") {
            userJoinCall(newUser.user);
            connectedUsers.current.push(newUser.user);
          } else if (newUser.type === "answer" && newUser.sdp) {
            userReceiveOfferCall(newUser.user, newUser.sdp);
            connectedUsers.current.push(newUser.user);
          }
          isConnectingToUser.current = true;
        }
      });
    }
  }, [stream, userJoinCall, userReceiveOfferCall, users]);

  // http://localhost:3000/callAccept?chatRoomId=6445845ac9e0517537806a27
  useEffect(() => {
    if (lastJsonMessage && lastJsonMessage.command === "INCOMING_CALL") {
      if (isMobile) {
        setModalOpen(true);
      } else {
        router.push(`/desktop/configCall/${lastJsonMessage.chatRoomId}`);
      }
      chatRoomId.current = lastJsonMessage.chatRoomId;
    }
    if (lastJsonMessage && lastJsonMessage.command === "JOIN_CALL_BROADCAST") {
      if (!lastJsonMessage.accepted) {
        stop(false, true);
      } else if (state) {
        setUsers((prev) => [
          ...prev,
          {
            user: lastJsonMessage.senderId,
            type: "offer",
            isCameraOn: true,
            isMicOn: true,
          },
        ]);
        setIsRunning(true);
        setState("inCall");
      }
    }
    if (lastJsonMessage && lastJsonMessage.command === "SDP_OFFER_REQ") {
      setUsers((prev) => [
        ...prev,
        {
          user: lastJsonMessage.receiverId,
          type: "offer",
          isCameraOn: true,
          isMicOn: true,
        },
      ]);
      setIsRunning(true);
      setState("inCall");
    }
    if (lastJsonMessage && lastJsonMessage.command === "SDP_ANSWER") {
      connectionRef.current[lastJsonMessage.senderId]?.setRemoteDescription({
        type: "answer",
        sdp: lastJsonMessage.sdp,
      });
      getCandidates();
    }
    if (lastJsonMessage && lastJsonMessage.command === "ICE_CANDIDATE") {
      if (
        isRunning &&
        lastJsonMessage.receiverId === me?.user_id &&
        connectionRef.current[lastJsonMessage.senderId]?.signalingState &&
        connectionRef.current[lastJsonMessage.senderId]?.signalingState !==
          "closed"
      ) {
        connectionRef.current[lastJsonMessage.senderId]?.addIceCandidate(
          lastJsonMessage.iceCandidate as unknown as RTCIceCandidate
        );
      }
    }
    if (lastJsonMessage && lastJsonMessage.command === "SDP_OFFER") {
      console.log("receive offer");
      setUsers((prev) => {
        if (prev.find((_user) => _user.user === lastJsonMessage.senderId)) {
          return prev.map((_user) => {
            if (_user.user === lastJsonMessage.senderId) {
              connectionRef.current?.[_user.user]?.close();
              connectedUsers.current = connectedUsers.current.filter(
                (_userLoc) => _userLoc !== _user.user
              );
              return {
                user: lastJsonMessage.senderId,
                type: "answer",
                sdp: lastJsonMessage.sdp,
                isMicOn: true,
                isCameraOn: true,
              };
            }
            return _user;
          });
        } else {
          return [
            ...prev,
            {
              user: lastJsonMessage.senderId,
              type: "answer",
              sdp: lastJsonMessage.sdp,
              isMicOn: true,
              isCameraOn: true,
            },
          ];
        }
      });
    }
    if (lastJsonMessage && lastJsonMessage.command === "GET_CHAT_USER_INFO") {
      const userNames: {
        [key: string]: { username: string; isMicOn: boolean; isCamOn: boolean };
      } = {};
      let needRequest = false;
      lastJsonMessage.chatUserInfo.chatUserInfoChunks.forEach(
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        (user: any) => {
          user.candidateList?.forEach((ice: RTCIceCandidate) => {
            if (
              connectionRef &&
              connectionRef.current[user.userId] &&
              connectionRef.current[user.userId]?.connectionState
            ) {
              connectionRef.current[user.userId]?.addIceCandidate(
                ice as unknown as RTCIceCandidate
              );
            } else {
              needRequest = true;
            }
          });
          userNames[user.userId] = {
            username: user.username,
            isMicOn: user.microphone,
            isCamOn: user.camera,
          };
        }
      );
      setUsers((prev) =>
        prev.map((pUser) => ({
          ...pUser,
          name: userNames[pUser.user]?.username ?? pUser.name,
          isMicOn: userNames[pUser.user]?.isMicOn ?? pUser.isMicOn,
          isCameraOn: userNames[pUser.user]?.isCamOn ?? pUser.isCameraOn,
        }))
      );

      if (needRequest) {
        getCandidates();
      }
    }
    if (lastJsonMessage && lastJsonMessage.command === "CALL_STOP") {
      stop();
    }
    if (lastJsonMessage && lastJsonMessage.command === "MICROPHONE") {
      setUsers((prev) =>
        prev.map((pUser) => {
          if (pUser.user === lastJsonMessage.senderId) {
            return { ...pUser, isMicOn: lastJsonMessage.content === "true" };
          }
          return pUser;
        })
      );
    }
    if (lastJsonMessage && lastJsonMessage.command === "CAMERA") {
      setUsers((prev) =>
        prev.map((pUser) => {
          if (pUser.user === lastJsonMessage.senderId) {
            return { ...pUser, isCameraOn: lastJsonMessage.content === "true" };
          }
          return pUser;
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastJsonMessage]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const acceptCall = async (chatRoomIdLocal?: string, setAccept = true) => {
    if (chatRoomIdLocal) {
      chatRoomId.current = chatRoomIdLocal;
    }
    setState("acceptCall");
    redirectCallPage();
    setIsOffer(false);
    setModalOpen(false);
    if (setAccept) {
      if (window) {
        window.AndroidInterface?.acceptCall?.();
      }
      if (window?.webkit) {
        window.webkit?.messageHandlers?.jsMessageHandler?.postMessage?.(
          "acceptCall"
        );
      }
    }
  };

  const declineCall = () => {
    const response = {
      command: "JOIN_CALL",
      accepted: 0,
      chatRoomId: chatRoomId.current,
    };
    sendJsonMessage(response);
    setModalOpen(false);
    stop(false, true);
  };

  const start = useCallback(
    async (stateCamera: boolean) => {
      setGeneratedStream(true);
      if (stream && connectionRef.current) {
        await stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 },
            facingMode: stateCamera ? "user" : "environment", // user or patient? 
            frameRate: 25,
          },
        })
        .then((media) => {
          if (state === "acceptCall") {
            const response = {
              command: "JOIN_CALL",
              accepted: 1,
              chatRoomId: chatRoomId.current,
            };
            sendJsonMessage(response);
            // setTimeout(
            //   () => sendJsonMessage(response),
            //   Math.floor(Math.random() * 2000)
            // );
          }

          setStream(media);
          if (myVideo.current) myVideo.current.srcObject = media;
          if (
            Object.values(connectionRef.current).length > 0 &&
            state === "inCall"
          ) {
            Object.values(connectionRef.current).forEach((rtc) => {
              rtc?.getSenders().forEach((sender) => {
                if (sender.track?.kind === "video") {
                  sender.replaceTrack(media.getVideoTracks()[0]);
                } else {
                  sender.replaceTrack(media.getAudioTracks()[0]);
                }
              });
            });
          }
        })
        .catch(() => {
          setError("не получилось подключиться к камере");
        });
    },
    [sendJsonMessage, state, stream]
  );

  const makeCall = useCallback(
    async (chatRoomIdT: string) => {
      await onOfferCall(chatRoomIdT);
      setState("processing");
      chatRoomId.current = chatRoomIdT;
    },
    [onOfferCall]
  );

  const initCall = useCallback(
    (chatRoomId: string) => {
      redirectCallPage(chatRoomId);
      setIsOffer(true);
      setState("initCall");
    },
    [redirectCallPage]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const toggleCamera = () => {
    if (isCameraOn) {
      stream?.getTracks().forEach((track) => {
        if (track.kind === "video") {
          track.stop();
        }
      });
    } else {
      start(frontCamera);
    }
    const response = {
      command: "CAMERA",
      chatRoomId: chatRoomId.current,
      content: !isCameraOn,
    };
    sendJsonMessage(response);
    setIsCameraOn(!isCameraOn);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const toggleMic = () => {
    if (isMicOn) {
      stream?.getTracks().forEach((track) => {
        if (track.kind === "audio") {
          track.stop();
        }
      });
    } else {
      start(frontCamera);
    }
    const response = {
      command: "MICROPHONE",
      chatRoomId: chatRoomId.current,
      content: !isMicOn,
    };
    sendJsonMessage(response);
    setIsMicOn(!isMicOn);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const changeCamera = () => {
    const newState = !frontCamera;
    setFrontCamera(newState);
    start(newState);
  };

  const onPressMyVideo = () => {
    if (isMobile) {
      setSwitchCamera((prev) => !prev);
    }
  };

  const onPressUserVideo = () => {
    if (isCallPage && isMobile) {
      setSwitchCamera((prev) => !prev);
    } else if (!isCallPage) {
      redirectCallPage();
    }
  };

  const longPressEvent = useLongPress(() => {}, onPressMyVideo);
  const longPressUserVideoEvent = useLongPress(() => {}, onPressUserVideo);

  const callContext = useMemo<CallContextType>(
    () => ({
      isOffer,
      setIsOffer,
      isCameraOn,
      makeCall,
      changeCamera,
      myVideo,
      minutes: zeroPad(duration.minutes ?? 0),
      seconds: zeroPad(duration.seconds ?? 0),
      toggleCamera,
      toggleMic,
      acceptCall,
      isSocketConnected: readyState === 1,
      isMicOn,
      isSpeakerOn,
      toggleSpeaker: () => setIsSpeakerOn(!isSpeakerOn),
      handleOffer,
      initCall,
      chatRoomName,
      state,
      start: () => start(true),
      error,
      stream,
      isRunning,
      connectionRef,
      sendJsonMessage,
      stop: () => stop(true),
      lastJsonMessage,
      totalNewMessages,
      newMessages,
      readMessages,
      generatedStream,
    }),
    [
      isOffer,
      isCameraOn,
      generatedStream,
      makeCall,
      chatRoomName,
      changeCamera,
      duration.minutes,
      duration.seconds,
      toggleCamera,
      toggleMic,
      acceptCall,
      isRunning,
      readyState,
      isMicOn,
      isSpeakerOn,
      handleOffer,
      initCall,
      state,
      error,
      stream,
      sendJsonMessage,
      lastJsonMessage,
      totalNewMessages,
      newMessages,
      readMessages,
      start,
      stop,
    ]
  );

  return (
    <CallContext.Provider value={callContext}>
      <CallAnswer
        accept={acceptCall}
        decline={declineCall}
        isOpen={openModal}
        name={chatRoomName}
        toggleMic={setIsMicOn}
        toggleSpeaker={setIsSpeakerOn}
        isMicOn={isMicOn}
        isSpeakerOn={isSpeakerOn}
      />
      {!isCallPage && isRunning && (
        <div
          className="fixed left-0 top-0 z-50 h-12 w-full cursor-pointer bg-brand-primary p-3 text-center"
          onClick={() => redirectCallPage()}
        >
          В звонке {zeroPad(duration.minutes ?? 0)}:
          {zeroPad(duration.seconds ?? 0)}
        </div>
      )}
      {state && (
        <div
          className={clsx(
            "absolute left-0 top-10 grid h-3/4 w-full grid-cols-2 gap-2 self-center justify-self-center px-4",
            {
              "z-50 grid-cols-3 mx-auto": !isMobile,
              "!grid-cols-2": users.length === 1,
            }
          )}
        >
          {users.map((user) => (
            <Draggable
              key={user.user}
              disabled={isCallPage ? !switchCamera ?? !isMobile : false}
            >
              <div
                className={clsx("rounded-3xl", {
                  "fixed right-6 bottom-32 h-40 w-40 z-50": !isCallPage,
                  "fixed left-0 top-0 z-50 h-full w-full !transform-none":
                    isCallPage && !switchCamera && isMobile,
                  "!flex justify-center items-center flex-col":
                    isRunning && !switchCamera,
                  "absolute bottom-[280px] right-[110px] h-10 w-10 rounded-2xl pr-4 !z-[999]":
                    switchCamera && isMobile,
                  "!relative": users.length > 1,
                  "!h-full": users.length === 2 && isMobile,
                  "!h-1/2": users.length > 2 && isMobile,
                  "!min-h-[50%] w-full": !isMobile,
                  "!hidden": !isCallPage && !isMobile,
                })}
              >
                {!user.isCameraOn && (
                  <div className="!z-[1000] flex h-36 w-36 items-center justify-center rounded-full bg-twinPurple">
                    <p className="m-0 p-0 text-Semibold48 text-white">
                      <CameraOffIcon size="xl" color="white" />
                    </p>
                  </div>
                )}
                <div
                  className={clsx("relative h-auto w-full text-center", {
                    "!h-full": !isMobile,
                  })}
                >
                  {connectionRef.current?.[user.user]?.connectionState !==
                    "connected" && (
                    <div className="absolute flex h-full w-full flex-col items-center justify-center backdrop-blur">
                      <Spin size="large" />
                      <p className="mt-2 rounded bg-brand-darkGreen p-1 text-Bold20 text-white">
                        Соединение...
                      </p>
                    </div>
                  )}
                  <video
                    ref={(el) =>
                      (usersVideoRef.current[user.user] =
                        el as HTMLVideoElement)
                    }
                    autoPlay
                    playsInline
                    className={clsx("rounded-2xl", {
                      "w-full h-auto": !switchCamera,
                      "h-40 w-[120px] !z-[999]": switchCamera,
                      hidden: !user.isCameraOn,
                      "max-h-full": !isMobile,
                    })}
                    {...longPressUserVideoEvent}
                  />
                  {!switchCamera && (
                    <div className="flex items-center justify-center">
                      <p className="mr-2 mt-4 p-0 text-Semibold20 text-white">
                        {user.name}
                      </p>
                      {!user.isMicOn && <MicOffIcon color="white" />}
                    </div>
                  )}
                </div>
              </div>
            </Draggable>
          ))}

          {isCameraOn && (
            <Draggable disabled={!isMobile}>
              <div
                className={clsx({
                  hidden: !isCallPage,
                  "fixed left-0 top-0 z-50 h-screen w-screen !transform-none":
                    switchCamera && isMobile,
                  "absolute bottom-[280px] right-[110px] !z-[999] h-10 w-10 rounded-2xl pr-4":
                    !switchCamera && isMobile,
                  "!w-full !min-h-[50%] flex justify-center items-center flex-col":
                    !isMobile,
                })}
              >
                <video
                  ref={myVideo}
                  muted
                  autoPlay
                  className={clsx("rounded-2xl", {
                    "h-full w-full": switchCamera,
                    "h-40 w-[120px]": !switchCamera,
                    "!h-auto !w-full": !isMobile,
                  })}
                  playsInline
                  {...longPressEvent}
                ></video>
                {!isMobile && (
                  <p className="mt-4 p-0 text-Semibold20 text-white">me</p>
                )}
              </div>
            </Draggable>
          )}
        </div>
      )}
      <div
        className={clsx("h-full w-full bg-gray-0", {
          "pt-12": !isCallPage && isRunning,
        })}
      >
        {props.children}
      </div>
    </CallContext.Provider>
  );
};
