```typescript
import React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Client } from '../../types/client';
import { ClientCard } from './ClientCard';

interface VirtualizedClientListProps {
  clients: Client[];
  onContextMenu: (e: React.MouseEvent, client: Client) => void;
}

export const VirtualizedClientList: React.FC<VirtualizedClientListProps> = ({
  clients,
  onContextMenu
}) => {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: clients.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 5
  });

  return (
    <div
      ref={parentRef}
      className="h-[calc(100vh-200px)] overflow-auto"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <ClientCard
              client={clients[virtualRow.index]}
              onContextMenu={onContextMenu}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
```