"use client";

import { useEffect, useState } from "react";

interface Employee {
  id: number;
  name: string;
  employee_wage: number | null;
  last_sign_in: string;
  time_worked: string;
  email: string;
}

export default function ManageEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [newEmployee, setNewEmployee] = useState({
    employee_id: "",
    name: "",
    employee_wage: "",
    last_sign_in: "",
    time_worked: "",
    email: ""
  });

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees");
      const data = await res.json();
      setEmployees(data);
      const maxId = data.reduce((max: number, emp: Employee) => Math.max(max, emp.id), 0);
      setNewEmployee((prev) => ({ ...prev, employee_id: (maxId + 1).toString() }));
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async () => {
    if (!newEmployee.name.trim() || !newEmployee.employee_wage.trim() || !newEmployee.email.trim()) {
      alert("Name, wage, and email are required.");
      return;
    }

    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee)
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewEmployee({
          employee_id: "",
          name: "",
          employee_wage: "",
          last_sign_in: "",
          time_worked: "",
          email: ""
        });
        fetchEmployees();
      }
    } catch (err) {
      console.error("Error adding employee:", err);
    }
  };

  const handleUpdateEmployee = async () => {
    if (!editingEmployee) return;

    try {
      const res = await fetch("/api/employees", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingEmployee)
      });

      if (res.ok) {
        setShowEditModal(false);
        setEditingEmployee(null);
        fetchEmployees();
      }
    } catch (err) {
      console.error("Error updating employee:", err);
    }
  };

  const handleDeleteEmployee = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const res = await fetch(`/api/employees?id=${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setShowEditModal(false);
        fetchEmployees();
      }
    } catch (err) {
      console.error("Error deleting employee:", err);
    }
  };

  return (
    <div className="pt-28 px-8 pb-32 min-h-screen">
      <div className="flex justify-between items-center mb-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800">Manage Employees</h1>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => setShowAddModal(true)}
        >
          Add Employee
        </button>
      </div>

      <div className="grid gap-4 max-w-4xl mx-auto">
        {employees.map((emp) => (
          <div key={emp.id} className="bg-white p-6 rounded shadow relative">
            <p className="text-lg font-bold">{emp.name}</p>
            <p className="text-sm text-gray-500">Email: {emp.email}</p>
            <p className="text-sm text-gray-500">
              Wage: ${emp.employee_wage ? emp.employee_wage.toFixed(2) : "N/A"}
            </p>
            <p className="text-sm text-gray-500">
              Last Sign-In: {emp.last_sign_in || "Never"}
            </p>
            <p className="text-sm text-gray-500">
              Time Worked: {emp.time_worked || "0"}
            </p>

            <button
              onClick={() => {
                setEditingEmployee(emp);
                setShowEditModal(true);
              }}
              className="absolute top-4 right-4 text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-primary bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-lg relative">
            <h2 className="text-2xl font-bold mb-4">Add Employee</h2>
            <div className="space-y-4">
              <input readOnly value={newEmployee.employee_id} placeholder="Employee ID" className="w-full border rounded p-2 bg-gray-100 text-gray-500" />
              <input type="text" placeholder="Name" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} className="w-full border rounded p-2" />
              <input type="number" placeholder="Wage" value={newEmployee.employee_wage} onChange={(e) => setNewEmployee({ ...newEmployee, employee_wage: e.target.value })} className="w-full border rounded p-2" />
              <input type="email" placeholder="Email" value={newEmployee.email} onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} className="w-full border rounded p-2" />
              <input type="text" placeholder="Last Sign-In" value={newEmployee.last_sign_in} onChange={(e) => setNewEmployee({ ...newEmployee, last_sign_in: e.target.value })} className="w-full border rounded p-2" />
              <input type="text" placeholder="Time Worked" value={newEmployee.time_worked} onChange={(e) => setNewEmployee({ ...newEmployee, time_worked: e.target.value })} className="w-full border rounded p-2" />
            </div>

            <div className="flex justify-end mt-6 gap-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
              <button
                disabled={!newEmployee.name.trim() || !newEmployee.employee_wage.trim() || !newEmployee.email.trim()}
                onClick={handleAddEmployee}
                className={`px-4 py-2 rounded text-white ${!newEmployee.name.trim() || !newEmployee.employee_wage.trim() || !newEmployee.email.trim()
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"}`}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingEmployee && (
        <div className="fixed inset-0 bg-primary bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-lg relative">
            <h2 className="text-2xl font-bold mb-4">Edit Employee</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={editingEmployee.name}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                className="w-full border rounded p-2"
              />
              <input
                type="number"
                placeholder="Wage"
                value={editingEmployee.employee_wage ?? ""}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, employee_wage: parseFloat(e.target.value) || 0 })}
                className="w-full border rounded p-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={editingEmployee.email ?? ""}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                className="w-full border rounded p-2"
              />
              <input
                type="text"
                placeholder="Last Sign-In (e.g., 2025-05-01 08:00)"
                value={editingEmployee.last_sign_in ?? ""}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, last_sign_in: e.target.value })}
                className="w-full border rounded p-2"
              />
              <input
                type="text"
                placeholder="Time Worked (e.g., 12h 30m)"
                value={editingEmployee.time_worked ?? ""}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, time_worked: e.target.value })}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => handleDeleteEmployee(editingEmployee.id, editingEmployee.name)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <div className="flex gap-2">
                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 border rounded hover:bg-gray-100">
                  Cancel
                </button>
                <button onClick={handleUpdateEmployee} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
