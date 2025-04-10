"use client";

import { useEffect, useState } from 'react';

interface Employee {
  id: number;
  name: string;
  role: string;
}

export default function ManageEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch('/api/employees');
        if (!res.ok) throw new Error('Failed to fetch employees');
        const data = await res.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    }
    fetchEmployees();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete employee');
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Employees</h1>

      <div className="flex flex-col gap-4 max-w-3xl mx-auto">
        {employees.map((emp) => (
          <div key={emp.id} className="bg-white p-4 shadow rounded flex justify-between items-center">
            <div>
              <p className="text-lg font-medium">{emp.name}</p>
              <p className="text-sm text-gray-600">{emp.role}</p>
            </div>
            <button 
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              onClick={() => handleDelete(emp.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
