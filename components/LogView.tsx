
import React, { useRef, useEffect } from 'react';
import { LogEntry } from '../types';
import { InfoIcon, AlertIcon } from './icons'; // Assuming you have these icons

interface LogViewProps {
  logs: LogEntry[];
}

const LogIcon: React.FC<{type: LogEntry['type']}> = ({type}) => {
    switch(type) {
        case 'error': return <AlertIcon className="text-red-400" />;
        case 'warning': return <AlertIcon className="text-yellow-400" />;
        case 'success': return <InfoIcon className="text-green-400" />;
        case 'event': return <InfoIcon className="text-purple-400" />;
        default: return <InfoIcon className="text-gray-400" />;
    }
};

export const LogView: React.FC<LogViewProps> = ({ logs }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (type: LogEntry['type']): string => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'event': return 'text-purple-300';
      case 'action': return 'text-blue-300';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="h-48 bg-gray-800 p-3 rounded-b-lg shadow-inner overflow-y-auto" ref={logContainerRef}>
      <ul className="space-y-1.5 text-xs">
        {logs.map((log, index) => (
          <li key={index} className={`flex items-start ${getLogColor(log.type)}`}>
            <span className="mr-1.5 mt-0.5 shrink-0"><LogIcon type={log.type} /></span>
            <span className="font-mono text-gray-500 mr-1.5">[{log.timestamp.toLocaleTimeString()}]</span>
            <span>{log.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
