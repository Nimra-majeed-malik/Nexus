import React from 'react';
import { VideoCallSection } from '../../components/videocall/VideoCallSection';

export const VideoCallPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Video Calling</h1>
        <p className="text-gray-600">Connect with entrepreneurs and investors via video call</p>
      </div>
      
      {/* Video Call Section */}
      <VideoCallSection />
    </div>
  );
};
