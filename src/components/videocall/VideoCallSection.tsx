import React, { useState } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Monitor, Phone } from 'lucide-react';

export const VideoCallSection: React.FC = () => {
  const [callActive, setCallActive] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const [timer, setTimer] = useState<any>(null);

  const startCall = () => {
    setCallActive(true);
    const t = setInterval(() => setCallTime(prev => prev + 1), 1000);
    setTimer(t);
  };

  const endCall = () => {
    setCallActive(false);
    setScreenSharing(false);
    setVideoOn(true);
    setAudioOn(true);
    clearInterval(timer);
    setCallTime(0);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">📹 Video Call</h2>

      {/* Main video area */}
      <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-4" style={{ height: '320px' }}>
        
        {callActive ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-3 text-white text-3xl font-bold">
                MR
              </div>
              <p className="text-white text-lg font-medium">Michael Rodriguez</p>
              <p className="text-green-400 text-sm mt-1">● Connected • {formatTime(callTime)}</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Video size={52} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-lg">No active call</p>
              <p className="text-gray-500 text-sm mt-1">Click Start Call to begin</p>
            </div>
          </div>
        )}

        {/* Self preview box */}
        {callActive && (
          <div className="absolute bottom-3 right-3 w-32 h-20 bg-gray-700 rounded-lg border-2 border-blue-400 flex items-center justify-center">
            {videoOn ? (
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mx-auto">
                  <span className="text-white text-xs font-bold">You</span>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <VideoOff size={20} className="text-gray-400 mx-auto" />
                <p className="text-gray-400 text-xs mt-1">Camera off</p>
              </div>
            )}
          </div>
        )}

        {/* Screen sharing badge */}
        {screenSharing && (
          <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
            ● Screen Sharing Active
          </div>
        )}

        {/* Muted badge */}
        {!audioOn && callActive && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">
            🔇 Muted
          </div>
        )}
      </div>

      {/* Call controls */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        
        {/* Mic toggle */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => setAudioOn(!audioOn)}
            disabled={!callActive}
            className={`p-3 rounded-full transition ${
              !callActive ? 'bg-gray-100 cursor-not-allowed opacity-50' :
              audioOn ? 'bg-gray-200 hover:bg-gray-300' : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {audioOn
              ? <Mic size={22} className="text-gray-700" />
              : <MicOff size={22} className="text-white" />
            }
          </button>
          <span className="text-xs text-gray-500">{audioOn ? 'Mute' : 'Unmute'}</span>
        </div>

        {/* Start / End call */}
        <div className="flex flex-col items-center gap-1">
          {!callActive ? (
            <button
              onClick={startCall}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium flex items-center gap-2 transition"
            >
              <Phone size={20} /> Start Call
            </button>
          ) : (
            <button
              onClick={endCall}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium flex items-center gap-2 transition"
            >
              <PhoneOff size={20} /> End Call
            </button>
          )}
          <span className="text-xs text-gray-500">{callActive ? 'Click to end' : 'Click to start'}</span>
        </div>

        {/* Video toggle */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => setVideoOn(!videoOn)}
            disabled={!callActive}
            className={`p-3 rounded-full transition ${
              !callActive ? 'bg-gray-100 cursor-not-allowed opacity-50' :
              videoOn ? 'bg-gray-200 hover:bg-gray-300' : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {videoOn
              ? <Video size={22} className="text-gray-700" />
              : <VideoOff size={22} className="text-white" />
            }
          </button>
          <span className="text-xs text-gray-500">{videoOn ? 'Stop Video' : 'Start Video'}</span>
        </div>

        {/* Screen share */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => setScreenSharing(!screenSharing)}
            disabled={!callActive}
            className={`p-3 rounded-full transition ${
              !callActive ? 'bg-gray-100 cursor-not-allowed opacity-50' :
              screenSharing ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <Monitor size={22} className={screenSharing ? 'text-white' : 'text-gray-700'} />
          </button>
          <span className="text-xs text-gray-500">{screenSharing ? 'Stop Share' : 'Share Screen'}</span>
        </div>
      </div>
    </div>
  );
};