
import React, { useRef, useEffect, CSSProperties } from 'react';
import { LogEntry } from '../types';
import { InfoIcon, AlertIcon } from './icons';

interface LogViewProps {
  logs: LogEntry[];
}

const LogIcon: React.FC<{type: LogEntry['type']}> = ({type}) => {
    const style: CSSProperties = {};

    switch(type) {
        case 'error':
          style.color = 'var(--color-danger)';
          return <AlertIcon style={style} />;
        case 'warning':
          style.color = 'var(--color-warning)';
          return <AlertIcon style={style} />;
        case 'success':
          style.color = 'var(--color-success)';
          return <InfoIcon style={style} />;
        case 'event':
          style.color = 'var(--color-accent)';
          return <InfoIcon style={style} />;
        default:
          style.color = 'var(--color-text-muted)';
          return <InfoIcon style={style} />;
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
      case 'error': return 'var(--color-danger)';
      case 'success': return 'var(--color-success)';
      case 'warning': return 'var(--color-warning)';
      case 'event': return 'var(--color-accent)';
      case 'action': return 'var(--color-primary)';
      default: return 'var(--color-text-secondary)';
    }
  };

  const containerStyle: CSSProperties = {
    backgroundColor: 'var(--color-surface)',
    borderTop: `1px solid var(--color-border)`,
  };

  const timestampStyle: CSSProperties = {
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-muted)',
  };

  return (
    <div className="h-48 p-3 shadow-inner overflow-y-auto" ref={logContainerRef} style={containerStyle}>
      <ul className="space-y-1.5 text-xs">
        {logs.map((log, index) => (
          <li key={index} className="flex items-start" style={{ color: getLogColor(log.type) }}>
            <span className="mr-1.5 mt-0.5 shrink-0"><LogIcon type={log.type} /></span>
            <span className="mr-1.5" style={timestampStyle}>[{log.timestamp.toLocaleTimeString()}]</span>
            <span>{log.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
