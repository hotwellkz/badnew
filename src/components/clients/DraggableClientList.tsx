import React, { useState } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { Client } from '../../types/client';
import { DraggableClientCard } from './DraggableClientCard';
import { DroppableCategory } from './DroppableCategory';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'react-hot-toast';
import { CollapsibleCategory } from './CollapsibleCategory';

interface DraggableClientListProps {
  clients: Client[];
  onContextMenu: (e: React.MouseEvent, client: Client) => void;
}

export const DraggableClientList: React.FC<DraggableClientListProps> = ({
  clients,
  onContextMenu
}) => {
  const [collapsedSections, setCollapsedSections] = useState({
    deposit: false,
    building: false,
    built: false
  });

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const client = clients.find(c => c.id === active.id);
    const newStatus = (over.data.current as any)?.status;

    if (client && newStatus && client.status !== newStatus) {
      try {
        await updateDoc(doc(db, 'clients', client.id), {
          status: newStatus
        });
        
        toast.success('Статус клиента обновлен');
      } catch (error) {
        console.error('Error updating client status:', error);
        toast.error('Ошибка при обновлении статуса');
      }
    }
  };

  const depositClients = clients.filter(c => c.status === 'deposit');
  const buildingClients = clients.filter(c => c.status === 'building');
  const builtClients = clients.filter(c => c.status === 'built');

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <div className="space-y-6">
        <CollapsibleCategory
          title="Задаток"
          count={depositClients.length}
          isCollapsed={collapsedSections.deposit}
          onToggle={() => toggleSection('deposit')}
        >
          <DroppableCategory id="deposit" status="deposit">
            <div className="space-y-2">
              {depositClients.map(client => (
                <DraggableClientCard
                  key={client.id}
                  client={client}
                  onContextMenu={onContextMenu}
                />
              ))}
            </div>
          </DroppableCategory>
        </CollapsibleCategory>

        <CollapsibleCategory
          title="Строим"
          count={buildingClients.length}
          isCollapsed={collapsedSections.building}
          onToggle={() => toggleSection('building')}
        >
          <DroppableCategory id="building" status="building">
            <div className="space-y-2">
              {buildingClients.map(client => (
                <DraggableClientCard
                  key={client.id}
                  client={client}
                  onContextMenu={onContextMenu}
                />
              ))}
            </div>
          </DroppableCategory>
        </CollapsibleCategory>

        <CollapsibleCategory
          title="Построено"
          count={builtClients.length}
          isCollapsed={collapsedSections.built}
          onToggle={() => toggleSection('built')}
        >
          <DroppableCategory id="built" status="built">
            <div className="space-y-2">
              {builtClients.map(client => (
                <DraggableClientCard
                  key={client.id}
                  client={client}
                  onContextMenu={onContextMenu}
                />
              ))}
            </div>
          </DroppableCategory>
        </CollapsibleCategory>
      </div>
    </DndContext>
  );
};