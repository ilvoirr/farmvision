"use client";

import { UserButton, useUser } from '@clerk/nextjs';
import { useState, useCallback, useEffect } from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/sidebar";
import {
  IconMessageCircle,
  IconPackage,
  IconGift,
  IconTool,
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconFilter,
  IconX,
  IconCheck,
  IconAlertTriangle,
  IconTrendingUp,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';

// Types
type CattleItem = {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  healthStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  lastVaccination: string;
  milkProduction?: number; // liters per day
  feedConsumption: number; // kg per day
  location: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  notes: string;
};

type CropItem = {
  id: string;
  cropType: string;
  variety: string;
  area: number; // in acres
  plantingDate: string;
  expectedHarvest: string;
  currentStage: 'Planted' | 'Growing' | 'Flowering' | 'Mature' | 'Harvested';
  soilType: string;
  irrigationMethod: string;
  fertilizers: string[];
  pesticides: string[];
  expectedYield: number; // tons per acre
  actualYield?: number;
  costInvested: number;
  location: string;
  notes: string;
};

type InventoryStats = {
  totalCattle: number;
  totalCrops: number;
  totalValue: number;
  healthAlerts: number;
  upcomingHarvests: number;
};

const Logo = () => {
  return (
    <div className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-black w-[5vh] h-[5vh] md:w-[4.9vh] md:h-[4.9vh]"
      >
        <path d="m10 11 11 .9a1 1 0 0 1 .8 1.1l-.665 4.158a1 1 0 0 1-.988.842H20" />
        <path d="M16 18h-5" />
        <path d="M18 5a1 1 0 0 0-1 1v5.573" />
        <path d="M3 4h8.129a1 1 0 0 1 .99.863L13 11.246" />
        <path d="M4 11V4" />
        <path d="M7 15h.01" />
        <path d="M8 10.1V4" />
        <circle cx="18" cy="18" r="2" />
        <circle cx="7" cy="15" r="5" />
      </svg>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[1.6vw] font-semibold tracking-tight text-black"
      >
        FarmVision
      </motion.span>
    </div>
  );
};

const LogoIcon = () => {
  return (
    <div className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-black w-[5vh] h-[5vh] md:w-[4.9vh] md:h-[4.9vh]"
      >
        <path d="m10 11 11 .9a1 1 0 0 1 .8 1.1l-.665 4.158a1 1 0 0 1-.988.842H20" />
        <path d="M16 18h-5" />
        <path d="M18 5a1 1 0 0 0-1 1v5.573" />
        <path d="M3 4h8.129a1 1 0 0 1 .99.863L13 11.246" />
        <path d="M4 11V4" />
        <path d="M7 15h.01" />
        <path d="M8 10.1V4" />
        <circle cx="18" cy="18" r="2" />
        <circle cx="7" cy="15" r="5" />
      </svg>
    </div>
  );
};

export default function InventoryPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'cattle' | 'crops' | 'overview'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CattleItem | CropItem | null>(null);
  const [editingType, setEditingType] = useState<'cattle' | 'crops'>('cattle');

  // State for inventory items - starts empty
  const [cattleInventory, setCattleInventory] = useState<CattleItem[]>([]);
  const [cropInventory, setCropInventory] = useState<CropItem[]>([]);

  // Form states - initialize with empty values
  const initCattleForm = {
    name: '',
    breed: '',
    age: 0,
    weight: 0,
    healthStatus: 'Good' as const,
    lastVaccination: '',
    milkProduction: 0,
    feedConsumption: 0,
    location: '',
    purchaseDate: '',
    purchasePrice: 0,
    currentValue: 0,
    notes: ''
  };

  const initCropForm = {
    cropType: '',
    variety: '',
    area: 0,
    plantingDate: '',
    expectedHarvest: '',
    currentStage: 'Planted' as const,
    soilType: '',
    irrigationMethod: '',
    fertilizers: [] as string[],
    pesticides: [] as string[],
    expectedYield: 0,
    actualYield: 0,
    costInvested: 0,
    location: '',
    notes: ''
  };

  const [cattleForm, setCattleForm] = useState<Partial<CattleItem>>(initCattleForm);
  const [cropForm, setCropForm] = useState<Partial<CropItem>>(initCropForm);

  const links = [
    {
      label: "New Chat",
      href: "/",
      icon: <IconMessageCircle className="h-5 w-5 shrink-0 text-neutral-700" />,
      onClick: () => router.push('/'),
    },
    {
      label: "Inventory Management",
      href: "/inventory",
      icon: <IconPackage className="h-5 w-5 shrink-0 text-neutral-700" />,
      onClick: () => router.push('/inventory'),
    },
    {
      label: "Farmer Scheme Recommendation",
      href: "/scheme",
      icon: <IconGift className="h-5 w-5 shrink-0 text-neutral-700" />,
      onClick: () => router.push('/scheme'),
    },
    {
      label: "Hardware Tool Kit",
      href: "/hardware",
      icon: <IconTool className="h-5 w-5 shrink-0 text-neutral-700" />,
      onClick: () => router.push('/hardware'),
    },
  ];

  // Generate unique ID
  const generateId = (type: 'cattle' | 'crop') => {
    const prefix = type === 'cattle' ? 'C' : 'CR';
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}${timestamp}`;
  };

  // Reset forms
  const resetCattleForm = () => {
    setCattleForm({...initCattleForm});
  };

  const resetCropForm = () => {
    setCropForm({...initCropForm});
  };

  // CRUD Operations for Cattle
  const addCattle = () => {
    if (!cattleForm.name || !cattleForm.breed) return;
    
    const newCattle: CattleItem = {
      id: generateId('cattle'),
      name: cattleForm.name!,
      breed: cattleForm.breed!,
      age: cattleForm.age || 0,
      weight: cattleForm.weight || 0,
      healthStatus: cattleForm.healthStatus || 'Good',
      lastVaccination: cattleForm.lastVaccination || '',
      milkProduction: cattleForm.milkProduction || 0,
      feedConsumption: cattleForm.feedConsumption || 0,
      location: cattleForm.location || '',
      purchaseDate: cattleForm.purchaseDate || '',
      purchasePrice: cattleForm.purchasePrice || 0,
      currentValue: cattleForm.currentValue || 0,
      notes: cattleForm.notes || ''
    };
    
    setCattleInventory([...cattleInventory, newCattle]);
    resetCattleForm();
    setShowAddModal(false);
  };

  const updateCattle = () => {
    if (!selectedItem || !cattleForm.name || !cattleForm.breed) return;
    
    const updatedCattle: CattleItem = {
      id: selectedItem.id,
      name: cattleForm.name!,
      breed: cattleForm.breed!,
      age: cattleForm.age || 0,
      weight: cattleForm.weight || 0,
      healthStatus: cattleForm.healthStatus || 'Good',
      lastVaccination: cattleForm.lastVaccination || '',
      milkProduction: cattleForm.milkProduction || 0,
      feedConsumption: cattleForm.feedConsumption || 0,
      location: cattleForm.location || '',
      purchaseDate: cattleForm.purchaseDate || '',
      purchasePrice: cattleForm.purchasePrice || 0,
      currentValue: cattleForm.currentValue || 0,
      notes: cattleForm.notes || ''
    };
    
    setCattleInventory(cattleInventory.map(cattle => 
      cattle.id === selectedItem.id ? updatedCattle : cattle
    ));
    setShowEditModal(false);
    setSelectedItem(null);
    resetCattleForm();
  };

  const deleteCattle = (id: string) => {
    setCattleInventory(cattleInventory.filter(cattle => cattle.id !== id));
  };

  // CRUD Operations for Crops
  const addCrop = () => {
    if (!cropForm.cropType || !cropForm.variety) return;
    
    const newCrop: CropItem = {
      id: generateId('crop'),
      cropType: cropForm.cropType!,
      variety: cropForm.variety!,
      area: cropForm.area || 0,
      plantingDate: cropForm.plantingDate || '',
      expectedHarvest: cropForm.expectedHarvest || '',
      currentStage: cropForm.currentStage || 'Planted',
      soilType: cropForm.soilType || '',
      irrigationMethod: cropForm.irrigationMethod || '',
      fertilizers: cropForm.fertilizers || [],
      pesticides: cropForm.pesticides || [],
      expectedYield: cropForm.expectedYield || 0,
      actualYield: cropForm.actualYield || 0,
      costInvested: cropForm.costInvested || 0,
      location: cropForm.location || '',
      notes: cropForm.notes || ''
    };
    
    setCropInventory([...cropInventory, newCrop]);
    resetCropForm();
    setShowAddModal(false);
  };

  const updateCrop = () => {
    if (!selectedItem || !cropForm.cropType || !cropForm.variety) return;
    
    const updatedCrop: CropItem = {
      id: selectedItem.id,
      cropType: cropForm.cropType!,
      variety: cropForm.variety!,
      area: cropForm.area || 0,
      plantingDate: cropForm.plantingDate || '',
      expectedHarvest: cropForm.expectedHarvest || '',
      currentStage: cropForm.currentStage || 'Planted',
      soilType: cropForm.soilType || '',
      irrigationMethod: cropForm.irrigationMethod || '',
      fertilizers: cropForm.fertilizers || [],
      pesticides: cropForm.pesticides || [],
      expectedYield: cropForm.expectedYield || 0,
      actualYield: cropForm.actualYield || 0,
      costInvested: cropForm.costInvested || 0,
      location: cropForm.location || '',
      notes: cropForm.notes || ''
    };
    
    setCropInventory(cropInventory.map(crop => 
      crop.id === selectedItem.id ? updatedCrop : crop
    ));
    setShowEditModal(false);
    setSelectedItem(null);
    resetCropForm();
  };

  const deleteCrop = (id: string) => {
    setCropInventory(cropInventory.filter(crop => crop.id !== id));
  };

  // Handle edit button clicks
  const handleEditCattle = (cattle: CattleItem) => {
    setSelectedItem(cattle);
    setCattleForm({...cattle});
    setEditingType('cattle');
    setShowEditModal(true);
  };

  const handleEditCrop = (crop: CropItem) => {
    setSelectedItem(crop);
    setCropForm({...crop});
    setEditingType('crops');
    setShowEditModal(true);
  };

  // Handle modal close
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    resetCattleForm();
    resetCropForm();
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedItem(null);
    resetCattleForm();
    resetCropForm();
  };

  // Calculate statistics
  const getStats = (): InventoryStats => {
    const totalCattle = cattleInventory.length;
    const totalCrops = cropInventory.length;
    const cattleValue = cattleInventory.reduce((sum, cattle) => sum + cattle.currentValue, 0);
    const cropValue = cropInventory.reduce((sum, crop) => sum + crop.costInvested, 0);
    const totalValue = cattleValue + cropValue;
    
    const healthAlerts = cattleInventory.filter(cattle => 
      cattle.healthStatus === 'Poor' || cattle.healthStatus === 'Fair'
    ).length;
    
    const upcomingHarvests = cropInventory.filter(crop => {
      const harvestDate = new Date(crop.expectedHarvest);
      const today = new Date();
      const daysUntilHarvest = (harvestDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      return daysUntilHarvest <= 30 && daysUntilHarvest >= 0;
    }).length;

    return {
      totalCattle,
      totalCrops,
      totalValue,
      healthAlerts,
      upcomingHarvests
    };
  };

  const stats = getStats();

  const StatCard = ({ title, value, icon, trend, trendDirection }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    trendDirection?: 'up' | 'down';
  }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trendDirection === 'up' ? <IconTrendingUp className="w-4 h-4 mr-1" /> : <IconAlertTriangle className="w-4 h-4 mr-1" />}
              {trend}
            </div>
          )}
        </div>
        <div className="p-3 bg-gray-50 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );

  const CattleCard = ({ cattle }: { cattle: CattleItem }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{cattle.name}</h3>
          <p className="text-sm text-gray-600">{cattle.breed}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditCattle(cattle)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <IconEdit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => deleteCattle(cattle.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <IconTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Age</p>
          <p className="font-medium">{cattle.age} years</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Weight</p>
          <p className="font-medium">{cattle.weight} kg</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Milk/day</p>
          <p className="font-medium">{cattle.milkProduction}L</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Health</p>
          <span className={`px-2 py-1 text-xs rounded-full ${
            cattle.healthStatus === 'Excellent' ? 'bg-green-100 text-green-800' :
            cattle.healthStatus === 'Good' ? 'bg-blue-100 text-blue-800' :
            cattle.healthStatus === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {cattle.healthStatus}
          </span>
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">Current Value</p>
        <p className="font-semibold text-green-600">₹{cattle.currentValue.toLocaleString()}</p>
      </div>
    </div>
  );

  const CropCard = ({ crop }: { crop: CropItem }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{crop.cropType}</h3>
          <p className="text-sm text-gray-600">{crop.variety}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditCrop(crop)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <IconEdit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => deleteCrop(crop.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <IconTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Area</p>
          <p className="font-medium">{crop.area} acres</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Stage</p>
          <span className={`px-2 py-1 text-xs rounded-full ${
            crop.currentStage === 'Harvested' ? 'bg-green-100 text-green-800' :
            crop.currentStage === 'Mature' ? 'bg-yellow-100 text-yellow-800' :
            crop.currentStage === 'Flowering' ? 'bg-purple-100 text-purple-800' :
            crop.currentStage === 'Growing' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {crop.currentStage}
          </span>
        </div>
        <div>
          <p className="text-xs text-gray-500">Expected Yield</p>
          <p className="font-medium">{crop.expectedYield} tons/acre</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Harvest Date</p>
          <p className="font-medium">{crop.expectedHarvest ? new Date(crop.expectedHarvest).toLocaleDateString() : 'Not set'}</p>
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">Investment</p>
        <p className="font-semibold text-blue-600">₹{crop.costInvested.toLocaleString()}</p>
      </div>
    </div>
  );

  // Modal Components
  const AddCattleModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Add New Cattle</h2>
            <button 
              onClick={handleCloseAddModal}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                value={cattleForm.name || ''}
                onChange={(e) => setCattleForm(prev => ({...prev, name: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
                placeholder="Enter cattle name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Breed *</label>
              <input
                type="text"
                value={cattleForm.breed || ''}
                onChange={(e) => setCattleForm(prev => ({...prev, breed: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
                placeholder="Enter breed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age (years)</label>
              <input
                type="number"
                value={cattleForm.age || ''}
                onChange={(e) => setCattleForm(prev => ({...prev, age: parseInt(e.target.value) || 0}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
              <input
                type="number"
                value={cattleForm.weight || ''}
                onChange={(e) => setCattleForm(prev => ({...prev, weight: parseInt(e.target.value) || 0}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Health Status</label>
              <select
                value={cattleForm.healthStatus || 'Good'}
                onChange={(e) => setCattleForm(prev => ({...prev, healthStatus: e.target.value as any}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Milk Production (L/day)</label>
              <input
                type="number"
                value={cattleForm.milkProduction || ''}
                onChange={(e) => setCattleForm(prev => ({...prev, milkProduction: parseInt(e.target.value) || 0}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Feed Consumption (kg/day)</label>
              <input
                type="number"
                value={cattleForm.feedConsumption || ''}
                onChange={(e) => setCattleForm(prev => ({...prev, feedConsumption: parseInt(e.target.value) || 0}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={cattleForm.location || ''}
                onChange={(e) => setCattleForm(prev => ({...prev, location: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
                placeholder="Barn A - Stall 1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date</label>
              <input
                type="date"
                value={cattleForm.purchaseDate || ''}
                onChange={(e) => setCattleForm(prev => ({...prev, purchaseDate: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price (₹)</label>
              <input
                type="number"
                value={cattleForm.purchasePrice || ''}
                onChange={(e) => setCattleForm(prev => ({...prev, purchasePrice: parseInt(e.target.value) || 0}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Value (₹)</label>
              <input
                type="number"
                value={cattleForm.currentValue || ''}
                onChange={(e) => setCattleForm(prev => ({...prev, currentValue: parseInt(e.target.value) || 0}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Vaccination</label>
              <input
                type="date"
                value={cattleForm.lastVaccination || ''}
                onChange={(e) => setCattleForm(prev => ({...prev, lastVaccination: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={cattleForm.notes || ''}
              onChange={(e) => setCattleForm(prev => ({...prev, notes: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
              rows={3}
              placeholder="Additional notes..."
            />
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={handleCloseAddModal}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={addCattle}
            className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            Add Cattle
          </button>
        </div>
      </div>
    </div>
  );

  const AddCropModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Add New Crop</h2>
            <button 
              onClick={handleCloseAddModal}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type *</label>
              <input
                type="text"
                value={cropForm.cropType || ''}
                onChange={(e) => setCropForm(prev => ({...prev, cropType: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
                placeholder="Wheat, Rice, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Variety *</label>
              <input
                type="text"
                value={cropForm.variety || ''}
                onChange={(e) => setCropForm(prev => ({...prev, variety: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
                placeholder="HD-3086, Basmati 1121, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Area (acres)</label>
              <input
                type="number"
                step="0.1"
                value={cropForm.area || ''}
                onChange={(e) => setCropForm(prev => ({...prev, area: parseFloat(e.target.value) || 0}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Stage</label>
              <select
                value={cropForm.currentStage || 'Planted'}
                onChange={(e) => setCropForm(prev => ({...prev, currentStage: e.target.value as any}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
              >
                <option value="Planted">Planted</option>
                <option value="Growing">Growing</option>
                <option value="Flowering">Flowering</option>
                <option value="Mature">Mature</option>
                <option value="Harvested">Harvested</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Planting Date</label>
              <input
                type="date"
                value={cropForm.plantingDate || ''}
                onChange={(e) => setCropForm(prev => ({...prev, plantingDate: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Harvest</label>
              <input
                type="date"
                value={cropForm.expectedHarvest || ''}
                onChange={(e) => setCropForm(prev => ({...prev, expectedHarvest: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type</label>
              <input
                type="text"
                value={cropForm.soilType || ''}
                onChange={(e) => setCropForm(prev => ({...prev, soilType: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
                placeholder="Loamy, Clay, Sandy, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Irrigation Method</label>
              <input
                type="text"
                value={cropForm.irrigationMethod || ''}
                onChange={(e) => setCropForm(prev => ({...prev, irrigationMethod: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
                placeholder="Sprinkler, Drip, Flood, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Yield (tons/acre)</label>
              <input
                type="number"
                step="0.1"
                value={cropForm.expectedYield || ''}
                onChange={(e) => setCropForm(prev => ({...prev, expectedYield: parseFloat(e.target.value) || 0}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cost Invested (₹)</label>
              <input
                type="number"
                value={cropForm.costInvested || ''}
                onChange={(e) => setCropForm(prev => ({...prev, costInvested: parseInt(e.target.value) || 0}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={cropForm.location || ''}
                onChange={(e) => setCropForm(prev => ({...prev, location: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
                placeholder="Field A - North Section"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={cropForm.notes || ''}
              onChange={(e) => setCropForm(prev => ({...prev, notes: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
              rows={3}
              placeholder="Additional notes..."
            />
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={handleCloseAddModal}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={addCrop}
            className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            Add Crop
          </button>
        </div>
      </div>
    </div>
  );

  const EditModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Edit {editingType === 'cattle' ? 'Cattle' : 'Crop'}
            </h2>
            <button 
              onClick={handleCloseEditModal}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {editingType === 'cattle' ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={cattleForm.name || ''}
                    onChange={(e) => setCattleForm(prev => ({...prev, name: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Breed *</label>
                  <input
                    type="text"
                    value={cattleForm.breed || ''}
                    onChange={(e) => setCattleForm(prev => ({...prev, breed: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age (years)</label>
                  <input
                    type="number"
                    value={cattleForm.age || ''}
                    onChange={(e) => setCattleForm(prev => ({...prev, age: parseInt(e.target.value) || 0}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    value={cattleForm.weight || ''}
                    onChange={(e) => setCattleForm(prev => ({...prev, weight: parseInt(e.target.value) || 0}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Health Status</label>
                  <select
                    value={cattleForm.healthStatus || 'Good'}
                    onChange={(e) => setCattleForm(prev => ({...prev, healthStatus: e.target.value as any}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Milk Production (L/day)</label>
                  <input
                    type="number"
                    value={cattleForm.milkProduction || ''}
                    onChange={(e) => setCattleForm(prev => ({...prev, milkProduction: parseInt(e.target.value) || 0}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Value (₹)</label>
                  <input
                    type="number"
                    value={cattleForm.currentValue || ''}
                    onChange={(e) => setCattleForm(prev => ({...prev, currentValue: parseInt(e.target.value) || 0}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={cattleForm.location || ''}
                    onChange={(e) => setCattleForm(prev => ({...prev, location: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={cattleForm.notes || ''}
                  onChange={(e) => setCattleForm(prev => ({...prev, notes: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
                  rows={3}
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type *</label>
                  <input
                    type="text"
                    value={cropForm.cropType || ''}
                    onChange={(e) => setCropForm(prev => ({...prev, cropType: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Variety *</label>
                  <input
                    type="text"
                    value={cropForm.variety || ''}
                    onChange={(e) => setCropForm(prev => ({...prev, variety: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Area (acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={cropForm.area || ''}
                    onChange={(e) => setCropForm(prev => ({...prev, area: parseFloat(e.target.value) || 0}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Stage</label>
                  <select
                    value={cropForm.currentStage || 'Planted'}
                    onChange={(e) => setCropForm(prev => ({...prev, currentStage: e.target.value as any}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
                  >
                    <option value="Planted">Planted</option>
                    <option value="Growing">Growing</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Mature">Mature</option>
                    <option value="Harvested">Harvested</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Yield (tons/acre)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={cropForm.expectedYield || ''}
                    onChange={(e) => setCropForm(prev => ({...prev, expectedYield: parseFloat(e.target.value) || 0}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cost Invested (₹)</label>
                  <input
                    type="number"
                    value={cropForm.costInvested || ''}
                    onChange={(e) => setCropForm(prev => ({...prev, costInvested: parseInt(e.target.value) || 0}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={cropForm.notes || ''}
                  onChange={(e) => setCropForm(prev => ({...prev, notes: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
                  rows={3}
                />
              </div>
            </>
          )}
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={handleCloseEditModal}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={editingType === 'cattle' ? updateCattle : updateCrop}
            className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            Update {editingType === 'cattle' ? 'Cattle' : 'Crop'}
          </button>
        </div>
      </div>
    </div>
  );

  const EmptyState = ({ type }: { type: 'cattle' | 'crops' }) => (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <IconPackage className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No {type} added yet
      </h3>
      <p className="text-gray-500 mb-6">
        Start by adding your first {type === 'cattle' ? 'cattle' : 'crop'} to track your inventory.
      </p>
      <button
        onClick={() => {
          setEditingType(type);
          setShowAddModal(true);
        }}
        className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors shadow-sm"
      >
        <IconPlus className="w-5 h-5 mr-2" />
        Add {type === 'cattle' ? 'Cattle' : 'Crop'}
      </button>
    </div>
  );

  return (
    <>
      <SignedIn>
        <div className={cn(
          "mx-auto flex w-full max-w-full flex-1 flex-col overflow-hidden bg-gray-100 md:flex-row",
          "h-screen"
        )}>
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
            <SidebarBody className="justify-between gap-10">
              <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                <div 
                  className="cursor-pointer"
                  onMouseEnter={() => setSidebarOpen(true)}
                  onMouseLeave={() => setSidebarOpen(false)}
                >
                  {sidebarOpen ? <Logo /> : <LogoIcon />}
                </div>
                <div className="mt-8 flex flex-col gap-2">
                  {links.map((link, idx) => (
                    <div key={idx} onClick={link.onClick} className="cursor-pointer">
                      <SidebarLink link={link} />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <SidebarLink
                  link={{
                    label: user?.username || 'User',
                    href: "#",
                    icon: (
                      <div className="h-7 w-7 shrink-0 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                        {(user?.username?.[0] || user?.firstName?.[0] || 'U').toUpperCase()}
                      </div>
                    ),
                  }}
                />
              </div>
            </SidebarBody>
          </Sidebar>

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col">
            {/* Top Navbar */}
            <div className="flex items-center h-[9.5vh] bg-gray-100 px-8 shadow-sm border-b border-neutral-200">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                <p className="text-sm text-gray-600">Manage your cattle and crop inventory</p>
              </div>
              
              <div className="inline-flex items-center justify-center gap-3 rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-lg font-semibold text-black shadow-sm">
                <span className='text-sm'>
                  {user?.username || 'User'}
                </span>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonPopoverCard: {
                        transform: 'translateY(3.5vh)',
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Main Dashboard */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
              <div className="max-w-7xl mx-auto">
                
                {/* Tab Navigation */}
                <div className="flex space-x-1 mb-8 bg-white p-1 rounded-2xl shadow-sm border border-gray-200">
                  {['overview', 'cattle', 'crops'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`flex-1 py-3 px-6 rounded-xl text-sm font-medium transition-all duration-200 ${
                        activeTab === tab
                          ? 'bg-black text-white shadow-lg'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <StatCard
                        title="Total Cattle"
                        value={stats.totalCattle}
                        icon={<IconPackage className="w-6 h-6 text-blue-600" />}
                      />
                      <StatCard
                        title="Active Crops"
                        value={stats.totalCrops}
                        icon={<IconPackage className="w-6 h-6 text-green-600" />}
                      />
                      <StatCard
                        title="Total Value"
                        value={stats.totalValue > 0 ? `₹${(stats.totalValue / 100000).toFixed(1)}L` : '₹0'}
                        icon={<IconTrendingUp className="w-6 h-6 text-purple-600" />}
                      />
                      <StatCard
                        title="Health Alerts"
                        value={stats.healthAlerts}
                        icon={<IconAlertTriangle className="w-6 h-6 text-red-600" />}
                        trend={stats.healthAlerts > 0 ? `${stats.healthAlerts} cattle need attention` : 'All cattle healthy'}
                        trendDirection={stats.healthAlerts > 0 ? 'down' : 'up'}
                      />
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button 
                          onClick={() => {
                            setActiveTab('cattle');
                            setEditingType('cattle');
                            setShowAddModal(true);
                          }}
                          className="flex items-center p-4 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <IconPlus className="w-6 h-6 mr-3" />
                          <div className="text-left">
                            <p className="font-medium">Add New Cattle</p>
                            <p className="text-sm text-gray-600">Track livestock inventory</p>
                          </div>
                        </button>
                        <button 
                          onClick={() => {
                            setActiveTab('crops');
                            setEditingType('crops');
                            setShowAddModal(true);
                          }}
                          className="flex items-center p-4 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <IconPlus className="w-6 h-6 mr-3" />
                          <div className="text-left">
                            <p className="font-medium">Add New Crop</p>
                            <p className="text-sm text-gray-600">Monitor crop growth</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Recent Items */}
                    {(cattleInventory.length > 0 || cropInventory.length > 0) && (
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Items</h3>
                        <div className="space-y-3">
                          {cattleInventory.slice(0, 2).map(cattle => (
                            <div key={cattle.id} className="flex items-center p-3 bg-gray-50 rounded-xl">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                              <div>
                                <p className="text-sm font-medium">{cattle.name} - {cattle.breed}</p>
                                <p className="text-xs text-gray-500">Cattle added</p>
                              </div>
                            </div>
                          ))}
                          {cropInventory.slice(0, 2).map(crop => (
                            <div key={crop.id} className="flex items-center p-3 bg-gray-50 rounded-xl">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              <div>
                                <p className="text-sm font-medium">{crop.cropType} - {crop.variety}</p>
                                <p className="text-xs text-gray-500">Crop added</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Cattle Tab */}
                {activeTab === 'cattle' && (
                  <div className="space-y-6">
                    {cattleInventory.length > 0 ? (
                      <>
                        {/* Controls */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <input
                                type="text"
                                placeholder="Search cattle..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                              />
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              setEditingType('cattle');
                              setShowAddModal(true);
                            }}
                            className="flex items-center px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors shadow-sm"
                          >
                            <IconPlus className="w-4 h-4 mr-2" />
                            Add Cattle
                          </button>
                        </div>

                        {/* Cattle Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {cattleInventory
                            .filter(cattle => 
                              cattle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              cattle.breed.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map(cattle => (
                              <CattleCard key={cattle.id} cattle={cattle} />
                            ))
                          }
                        </div>
                      </>
                    ) : (
                      <EmptyState type="cattle" />
                    )}
                  </div>
                )}

                {/* Crops Tab */}
                {activeTab === 'crops' && (
                  <div className="space-y-6">
                    {cropInventory.length > 0 ? (
                      <>
                        {/* Controls */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <input
                                type="text"
                                placeholder="Search crops..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                              />
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              setEditingType('crops');
                              setShowAddModal(true);
                            }}
                            className="flex items-center px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors shadow-sm"
                          >
                            <IconPlus className="w-4 h-4 mr-2" />
                            Add Crop
                          </button>
                        </div>

                        {/* Crops Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {cropInventory
                            .filter(crop => 
                              crop.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              crop.variety.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map(crop => (
                              <CropCard key={crop.id} crop={crop} />
                            ))
                          }
                        </div>
                      </>
                    ) : (
                      <EmptyState type="crops" />
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showAddModal && editingType === 'cattle' && <AddCattleModal />}
        {showAddModal && editingType === 'crops' && <AddCropModal />}
        {showEditModal && <EditModal />}
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
