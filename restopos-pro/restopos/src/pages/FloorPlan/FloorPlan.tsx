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

interface FloorPlanPageProps {
  onStartOrder?: (tableId: number) => void;
}

export default function FloorPlanPage({ onStartOrder }: FloorPlanPageProps) {
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
  const handleAddTable = async (tableNumber: string, floorId: number) => {
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
    try {
      await axios.put(`${API_BASE_URL}/tables/${id}`, formData);
      Swal.fire({ icon: 'success', title: 'Updated!', timer: 1500, showConfirmButton: false });
      fetchData();
      setModalType(null);
    } catch (err: any) {
      Swal.fire('Error', 'Update failed', 'error');
    }
  };

  const handleTransfer = async (fromId: number, toId: number) => {
    try {
      await axios.post(`${API_BASE_URL}/tables/transfer`, { from_table_id: fromId, to_table_id: toId });
      Swal.fire({ icon: 'success', title: 'Transferred!', timer: 1500, showConfirmButton: false });
      fetchData();
      setModalType(null);
      setSelectedTable(null);
    } catch (err: any) {
      Swal.fire('Error', 'Transfer failed', 'error');
    }
  };

  const handleMerge = async (pId: number, sId: number) => {
    try {
      await axios.post(`${API_BASE_URL}/tables/merge`, { primary_table_id: pId, secondary_table_id: sId });
      Swal.fire({ icon: 'success', title: 'Merged!', timer: 1500, showConfirmButton: false });
      fetchData();
      setModalType(null);
    } catch (err: any) {
      Swal.fire('Error', 'Merge failed', 'error');
    }
  };

  const handleUnmerge = async (tableId: number) => {
    try {
      await axios.post(`${API_BASE_URL}/tables/unmerge`, { table_id: tableId });
      Swal.fire({ icon: 'success', title: 'Unmerged!', timer: 1500, showConfirmButton: false });
      fetchData();
      setSelectedTable(null);
    } catch (err: any) {
      Swal.fire('Error', 'Unmerge failed', 'error');
    }
  };

  const handleSplitBill = async (orderId: number, parts: number) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/orders/${orderId}/split`, { parts });
      Swal.fire({
        title: 'Bill Split Successfully',
        html: `Each person pays: <b>Rs. ${response.data.per_person || response.data.data?.per_person}</b>`,
        icon: 'success'
      });
      setModalType(null);
      fetchData();
    } catch (err: any) {
      Swal.fire('Error', 'Could not split bill', 'error');
    }
  };

  const filteredTables = useMemo(() => 
    tables.filter(t => t.floor_id === activeFloorId), 
    [tables, activeFloorId]
  );

  return (
    <div className="-m-4 lg:-m-8 flex flex-col lg:flex-row h-screen lg:h-[calc(100dvh-64px)] bg-slate-100 overflow-hidden font-sans">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col min-w-0 bg-slate-50/50 overflow-hidden">
        <FloorHeader 
          floorName={floors.find(f => f.id === activeFloorId)?.name} 
          onAddTable={() => setModalType('add')} 
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
        onAction={(type: any) => {
          if (type === 'unmerge') {
            if (selectedTable) handleUnmerge(selectedTable.id);
          } else {
            setModalType(type);
          }
        }}
        // --- UPDATED: Pass the ID to POS Terminal ---
        onStartOrder={() => {
          if (selectedTable && onStartOrder) {
            // Agar table merged hai, to primary table (merge_id) bhejain, warna apni ID
            const targetId = selectedTable.merge_id || selectedTable.id;
            onStartOrder(targetId);
          }
        }}
        onEdit={() => setModalType('edit')}
        fetchData={fetchData}
      />

      {/* Modals */}
      <AddTableModal isOpen={modalType === 'add'} onClose={() => setModalType(null)} onAdd={handleAddTable} floors={floors} activeFloorId={activeFloorId} />
      <EditTableModal isOpen={modalType === 'edit'} onClose={() => setModalType(null)} table={selectedTable} onUpdate={handleUpdateTable} />
      <TransferModal isOpen={modalType === 'transfer'} onClose={() => setModalType(null)} selectedTable={selectedTable} availableTables={tables.filter(t => t.status === 'available')} onTransfer={handleTransfer} />
      <MergeModal isOpen={modalType === 'merge'} onClose={() => setModalType(null)} selectedTable={selectedTable} tables={tables} onMerge={handleMerge} />
      <SplitModal isOpen={modalType === 'split'} onClose={() => setModalType(null)} table={selectedTable} onSplit={handleSplitBill} />
    </div>
  );
}