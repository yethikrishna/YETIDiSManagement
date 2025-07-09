'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface RecognitionResult {
  dialect: string;
  confidence: number;
  transcript: string;
  timestamp: Date;
}

export default function DialectRecognition() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [results, setResults] = useState<RecognitionResult[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Cleanup function to stop recording if component unmounts
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = handleRecordingStop;

      setIsRecording(true);
      mediaRecorderRef.current.start();
      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleRecordingStop = () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
    setAudioUrl(audioUrl);

    // Process the audio for dialect recognition
    processAudioForDialect(audioBlob);
  };

  const processAudioForDialect = async (audioBlob: Blob) => {
    try {
      // In a real implementation, this would send the audio blob to your backend or
      // directly to a speech recognition API like Google Cloud Speech-to-Text
      // For demonstration, we'll simulate a response
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      // Send audio to API endpoint
      const response = await fetch('/api/dialect-recognition', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to process audio');
      }

      const result: RecognitionResult = await response.json();
      // Convert timestamp string back to Date object
      result.timestamp = new Date(result.timestamp);

      setResults(prev => [result, ...prev]);
      toast.success(`Detected ${simulatedResult.dialect} with ${(simulatedResult.confidence * 100).toFixed(1)}% confidence`);
    } catch (error) {
      console.error('Error processing audio:', error);
      toast.error('Failed to process audio for dialect recognition');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Dialect Recognition</h2>

      <div className="flex justify-center mb-8">
        <motion.button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`flex items-center justify-center w-20 h-20 rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isRecording ? 'focus:ring-red-400' : 'focus:ring-green-400'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isProcessing ? (
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : isRecording ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          )}
        </motion.button>
      </div>

      <div className="text-center mb-6">
        <p className="text-lg font-medium text-gray-700">
          {isProcessing ? (
            'Analyzing dialect...'
          ) : isRecording ? (
            'Recording in progress... Speak now'
          ) : (
            'Click the button to start recording'
          )}
        </p>
      </div>

      {audioUrl && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Recording Preview:</h3>
          <audio controls className="w-full" src={audioUrl} />
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Recognition History</h3>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {results.map((result, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {result.dialect}
                  </span>
                  <span className="text-xs text-gray-500">
                    {result.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-1 italic">"{result.transcript}"</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${result.confidence * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Confidence: {(result.confidence * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}