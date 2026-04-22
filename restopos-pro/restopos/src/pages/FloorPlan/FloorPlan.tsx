import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Floor, ResturantTable } from '../../types';
import FloorHeader from '../../components/floor_plan/FloorHeader';
import TableGrid from '../../components/floor_plan/TableGrid';
import FloorSwitcher from '../../components/floor_plan/FloorSwitcher';
import FloorSidebar from '../../components/floor_plan/FloorSidebar';
import OccupiedList from '../../components/floor_plan/OccupiedList';

import { 
  TransferModal, 
  MergeModal, 
  SplitModal, 
  AddTableModal, 
  EditTableModal,
} from '../../components/floor_plan/index';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// --- UPDATED INTERFACE: Adding Permission Props ---
interface FloorPlanPageProps {
  onStartOrder?: (tableId: number) => void;
  canManageLayout?: boolean; // Manage Table Layout Permission
  canCreateOrder?: boolean;  // Create & Manage Order Permission
}

export default function FloorPlanPage({ onStartOrder, canManageLayout, canCreateOrder }: FloorPlanPageProps) {
  const [tables, setTables] = useState<ResturantTable[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFloorId, setActiveFloorId] = useState<number | null>(null);
  const [selectedTable, setSelectedTable] = useState<ResturantTable | null>(null);
  const [modalType, setModalType] = useState<'transfer' | 'merge' | 'unmerge' | 'add' | 'edit' | 'split' | null>(null);

  // --- FETCH DATA ---
  const fetchData = useCallback(async (isInitial = false) => {
    try {
      const [fRes, tRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/floors`),
        axios.get(`${API_BASE_URL}/tables`)
      ]);
      
      setFloors(fRes.data);
      setTables(tRes.data);

      if (isInitial && fRes.data.length > 0) {
        setActiveFloorId(fRes.data[0].id);
      }

      setSelectedTable(prev => {
        if (!prev) return null;
        return tRes.data.find((t: any) => t.id === prev.id) || null;
      });

    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => {
      fetchData();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // --- API HANDLERS ---
  const handleAddTable = async (tableNumber: string, floorId: number): Promise<void> => {
    // Extra Safety Check
    if (!canManageLayout) {
      await Swal.fire('Denied', 'No Permission', 'error');
      return;
    }
    
    try {
      await axios.post(`${API_BASE_URL}/tables`, {
        table_number: tableNumber,
        floor_id: floorId,
        seating_capacity: 4,
        status: 'available'
      });
      Swal.fire({ icon: 'success', title: 'Table Added!', timer: 1500, showConfirmButton: false });
      fetchData();
      setModalType(null);
    } catch (err: any) {
      Swal.fire('Error', 'Failed to add table', 'error');
    }
  };

  const handleUpdateTable = async (id: number, formData: any) => {
    if (!canManageLayout) return;
    try {
      await axios.put(`${API_BASE_URL}/tables/${id}`, formData);
      Swal.fire({ icon: 'success', title: 'Updated!', timer: 1500, showConfirmButton: false });
      fetchData();
      setModalType(null);
    } catch (err: any) {
      Swal.fire('Error', 'Update failed', 'error');
    }
  };

  // --- RENDERING ---
  const filteredTables = useMemo(() => 
    tables.filter(t => t.floor_id === activeFloorId), 
    [tables, activeFloorId]
  );

  return (
    <div className="-m-4 lg:-m-8 flex flex-col lg:flex-row h-screen lg:h-[calc(100dvh-64px)] bg-slate-100 overflow-hidden font-sans">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col min-w-0 bg-slate-50/50 overflow-hidden">
        
        {/* --- ADD TABLE PERMISSION APPLIED HERE --- */}
        <FloorHeader 
          floorName={floors.find(f => f.id === activeFloorId)?.name} 
          // Agar permission nahi hai to onAddTable prop pass hi na karein ya andar handle karein
          onAddTable={canManageLayout ? () => setModalType('add') : undefined} 
        />

        <OccupiedList 
          tables={tables} 
          onSelectTable={(t:any) => { setActiveFloorId(t.floor_id); setSelectedTable(t); }} 
          selectedId={selectedTable?.id}
        />

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <TableGrid 
            loading={loading} 
            tables={filteredTables} 
            selectedTable={selectedTable} 
            onSelect={setSelectedTable} 
          />
        </div>
        
        <div className="mt-6">
          <FloorSwitcher floors={floors} activeId={activeFloorId} onSelect={setActiveFloorId} />
        </div>
      </main>

      <FloorSidebar 
        selectedTable={selectedTable}
        // Sidebar actions like Merge/Transfer need create-order permission
        onAction={(type: any) => {
          if (!canCreateOrder && ['transfer', 'merge', 'unmerge', 'split'].includes(type)) {
            return Swal.fire('Access Denied', 'You cannot perform table operations', 'warning');
          }

          if (type === 'unmerge') {
            if (selectedTable) {
                // handleUnmerge logical block...
                axios.post(`${API_BASE_URL}/tables/unmerge`, { table_id: selectedTable.id })
                .then(() => { fetchData(); setSelectedTable(null); });
            }
          } else {
            setModalType(type);
          }
        }}
        onStartOrder={() => {
          if (selectedTable && onStartOrder) {
            // App.tsx already checks this, but extra check here is good
            if (canCreateOrder) {
                const targetId = selectedTable.merge_id || selectedTable.id;
                onStartOrder(targetId);
            }
          }
        }}
        // Edit button in sidebar needs manage permission
        onEdit={canManageLayout ? () => setModalType('edit') : undefined}
        fetchData={fetchData}
      />

      {/* Modals - Inmein bhi canManageLayout check lag sakta hai safety ke liye */}
      {canManageLayout && (
        <>
          <AddTableModal isOpen={modalType === 'add'} onClose={() => setModalType(null)} onAdd={handleAddTable} floors={floors} activeFloorId={activeFloorId} />
          <EditTableModal isOpen={modalType === 'edit'} onClose={() => setModalType(null)} table={selectedTable} onUpdate={handleUpdateTable} />
        </>
      )}

      {/* Table Operation Modals (Need Create Order Permission) */}
      {canCreateOrder && (
        <>
          <TransferModal isOpen={modalType === 'transfer'} onClose={() => setModalType(null)} selectedTable={selectedTable} availableTables={tables.filter(t => t.status === 'available')} onTransfer={(_f: any, _t: any) => {/* logic */}} />
          <MergeModal isOpen={modalType === 'merge'} onClose={() => setModalType(null)} selectedTable={selectedTable} tables={tables} onMerge={(_p: any, _s: any) => {/* logic */}} />
          <SplitModal isOpen={modalType === 'split'} onClose={() => setModalType(null)} table={selectedTable} onSplit={(_id: any, _p: any) => {/* logic */}} />
        </>
      )}
    </div>
  );
}