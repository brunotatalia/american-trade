
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

  // Only show last 2 logs
  const recentLogs = logs.slice(-2);

  return (
    <div className="bg-gray-800 p-2 border-t border-gray-700 overflow-hidden" style={{maxHeight: '60px'}}>
      <ul className="space-y-0.5 text-xs">
        {recentLogs.map((log, index) => (
          <li key={index} className={`flex items-center ${getLogColor(log.type)} truncate`}>
            <span className="mr-1 shrink-0"><LogIcon type={log.type} /></span>
            <span className="font-mono text-gray-500 mr-1.5 text-[10px]">[{log.timestamp.toLocaleTimeString()}]</span>
            <span className="truncate">{log.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
