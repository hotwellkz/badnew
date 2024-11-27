```typescript
import React, { useState, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Client } from '../../types/client';
import { DraggableClientCard } from './DraggableClientCard';

interface ClientListContainerProps {
  clients: Client[];
  onContextMenu: (e: React.MouseEvent, client: Client) => void;
}

export const ClientListContainer: React.FC<ClientListContainerProps> = ({
  clients,
  onContextMenu
}) => {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: clients.length,
    getScrollElement: () => containerRef,
    estimateSize: () => 200,
    overscan: 5
  });

  const virtualRows = useMemo(() => 
    rowVirtualizer.getVirtualItems(), 
    [rowVirtualizer]
  );

  return (
    <div 
      ref={setContainerRef}
      className="h-[calc(100vh-200px)] overflow-auto"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualRows.map((virtualRow) => {
          const client = clients[virtualRow.index];
          return (
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
              <DraggableClientCard
                client={client}
                onContextMenu={onContextMenu}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
```