"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Download, Save, Plus, Settings2 } from "lucide-react";
import * as htmlToImage from "html-to-image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// --- Types & Data ---
type Item = { id: string; content: string; image?: string };
type Tier = { id: string; label: string; color: string; items: Item[] };

const INITIAL_TIERS: Tier[] = [
  { id: "tier-s", label: "S", color: "#FF4757", items: [] },
  { id: "tier-a", label: "A", color: "#FFA502", items: [] },
  { id: "tier-b", label: "B", color: "#ECCC68", items: [] },
  { id: "tier-c", label: "C", color: "#2ED573", items: [] },
  { id: "tier-d", label: "D", color: "#1E90FF", items: [] },
];

const INITIAL_ITEMS: Item[] = [
  { id: "item-1", content: "React" },
  { id: "item-2", content: "Vue" },
  { id: "item-3", content: "Angular" },
  { id: "item-4", content: "Svelte" },
  { id: "item-5", content: "Next.js" },
  { id: "item-6", content: "Nuxt" },
  { id: "item-7", content: "Astro" },
  { id: "item-8", content: "Remix" },
];

// --- Sub-components ---
function SortableItem({ item }: { item: Item }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    data: { type: "Item", item },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="w-20 h-20 bg-brand-black border border-white/20 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-105 hover:border-brand-purple-light transition-all shadow-lg text-sm font-medium"
    >
      {item.content}
    </div>
  );
}

// --- Main Page Component ---
export default function CreateTierUp() {
  const [tiers, setTiers] = useState<Tier[]>(INITIAL_TIERS);
  const [unassignedItems, setUnassignedItems] = useState<Item[]>(INITIAL_ITEMS);
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  
  const tierListRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    const itemData = active.data.current?.item;
    if (itemData) setActiveItem(itemData);
  };

  const handleDragEnd = (event: any) => {
    setActiveItem(null);
    const { active, over } = event;
    
    if (!over) return;
    if (active.id === over.id) return;

    const activeId = active.id;
    const overId = over.id;

    // Find where the item came from
    let sourceTierId = "unassigned";
    let activeItemObj: Item | undefined = unassignedItems.find(i => i.id === activeId);
    if (!activeItemObj) {
      for (const t of tiers) {
        const found = t.items.find(i => i.id === activeId);
        if (found) {
          activeItemObj = found;
          sourceTierId = t.id;
          break;
        }
      }
    }

    if (!activeItemObj) return;

    // Remove from source
    if (sourceTierId === "unassigned") {
      setUnassignedItems(prev => prev.filter(i => i.id !== activeId));
    } else {
      setTiers(prev => prev.map(t => t.id === sourceTierId ? { ...t, items: t.items.filter(i => i.id !== activeId) } : t));
    }

    // Determine target location (could be a tier id or another item's id)
    let targetTierId = "unassigned";
    if (overId === "unassigned" || unassignedItems.some(i => i.id === overId)) {
       targetTierId = "unassigned";
    } else {
      for (const t of tiers) {
        if (t.id === overId || t.items.some(i => i.id === overId)) {
          targetTierId = t.id;
          break;
        }
      }
    }

    // Add to target
    if (targetTierId === "unassigned") {
      setUnassignedItems(prev => [...prev, activeItemObj!]);
    } else {
      setTiers(prev => prev.map(t => {
        if (t.id === targetTierId) {
          return { ...t, items: [...t.items, activeItemObj!] };
        }
        return t;
      }));
    }
  };

  const exportAsImage = useCallback(() => {
    if (tierListRef.current === null) return;
    htmlToImage.toPng(tierListRef.current, { cacheBust: true, backgroundColor: "#0B0B0F" })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "my-tierup.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error("Error exporting image", err));
  }, [tierListRef]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-white/10">
        <div>
          <input 
            type="text" 
            defaultValue="Web Frameworks Tier List" 
            className="text-3xl font-bold bg-transparent border-none outline-none focus:ring-0 text-white placeholder:text-white/30"
          />
          <p className="text-white/50 text-sm mt-1">Drag and drop items to rank them. Click tier labels to customize.</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => alert('Settings opened')}>
            <Settings2 className="w-4 h-4" />
          </Button>
          <Button variant="secondary" size="sm" onClick={exportAsImage}>
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export</span>
          </Button>
          <Button variant="primary" size="sm">
            <Save className="w-4 h-4" /> <span className="hidden sm:inline">Publish</span>
          </Button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Tier rows container wrapper for image export */}
        <div ref={tierListRef} className="flex flex-col gap-1.5 p-2 bg-brand-black border border-white/10 rounded-2xl">
          {tiers.map((tier) => (
            <div key={tier.id} className="flex min-h-[100px] bg-white/5 rounded-xl overflow-hidden group">
              {/* Tier Label */}
              <div 
                className="w-24 sm:w-32 flex items-center justify-center relative overflow-hidden flex-shrink-0"
                style={{ 
                  backgroundColor: tier.color,
                  boxShadow: "inset 0 0 20px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.3)"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                <span 
                  className="font-black text-2xl sm:text-3xl tracking-widest text-[#1a1a1a]"
                  style={{ textShadow: "0 1px 1px rgba(255,255,255,0.3)" }}
                >
                  {tier.label}
                </span>
              </div>
              
              {/* Tier Droppable Area */}
              <div className="flex-1 p-2 flex flex-wrap gap-2 items-center" id={tier.id}>
                <SortableContext id={tier.id} items={tier.items.map(i => i.id)} strategy={horizontalListSortingStrategy}>
                  {tier.items.map((item) => (
                    <SortableItem key={item.id} item={item} />
                  ))}
                  {/* Empty state receiver to keep zone droppable */}
                  {!tier.items.length && <div className="w-full h-full min-h-[80px]" />}
                </SortableContext>
              </div>
            </div>
          ))}
        </div>

        {/* Tray / Unassigned Items */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Item Pool</h3>
            <Button size="sm" variant="glass" className="text-xs">
              <Plus className="w-3 h-3" /> Add Item
            </Button>
          </div>
          
          <div className="glass p-6 rounded-2xl min-h-[200px]" id="unassigned">
            <SortableContext id="unassigned" items={unassignedItems.map(i => i.id)} strategy={horizontalListSortingStrategy}>
              <div className="flex flex-wrap gap-3">
                {unassignedItems.map((item) => (
                  <SortableItem key={item.id} item={item} />
                ))}
                {!unassignedItems.length && (
                  <div className="w-full h-full min-h-[150px] flex items-center justify-center text-white/30 border-2 border-dashed border-white/10 rounded-xl">
                    All items assigned!
                  </div>
                )}
              </div>
            </SortableContext>
          </div>
        </div>

        {/* Drag Overlay (Visual while dragging) */}
        <DragOverlay>
          {activeItem ? (
            <div className="w-20 h-20 bg-brand-black border-2 border-brand-purple-light rounded-xl flex items-center justify-center shadow-2xl scale-110 text-sm font-medium z-50">
              {activeItem.content}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
