import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axiosInstance from "../src/Api/axiosInstance";
import { Eye, Pencil, Trash2, Plus, Loader2, X } from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../src/Context/autheContext";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Employee = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const { user } = useAuth();

  const [emp, setEmp] = useState([]);
  const [dept, setDept] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedEmp, setSelectedEmp] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [save, setSave] = useState(false);
  const [selectedDept, setSelectedDept] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const getEmp = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `/api/Emp/fetchemployees/${selectedDept}/${page}/${pageSize}`,
        {
          params: {
            sortBy,
            orderBy: sortOrder,
          },
        }
      );

      setEmp(res.data.employees || []);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDept = async () => {
    try {
      const result = await axiosInstance.get("/api/Emp/GetAllDept");
      setDept(result.data.depts);
    } catch (error) {}
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const payload = {
        ...data,
        id: Number(data.id),
        deptId: Number(data.deptId),
      };
      setSave(true);
      if (edit) {
        const result = await axiosInstance.put("/api/Emp/UpdateEmp", payload);
        if (result.status == 200) {
          toast.success("Employee Updated successfully");
          setSave(false);
          setEditOpen(false);
          getEmp();
        }
      } else {
        const result = await axiosInstance.post(
          "/api/Emp/AddEmployee",
          payload
        );
        if (result.status == 200) {
          toast.success("Employee Added sucessfully");
          setSave(false);
          setEditOpen(false);
          getEmp();
          setSelectedDept(0)
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal server error");
      setSave(false);
    }
  };

  useEffect(() => {
    getEmp();
    getDept();
  }, []);

  useEffect(() => {
    getEmp();
  }, [page, pageSize, selectedDept, sortBy, sortOrder]);

  useEffect(() => {
    console.log("SORT:", sortBy, sortOrder);
  }, [sortBy, sortOrder]);

  const handleView = (emp) => {
    setSelectedEmp(emp);
    setViewOpen(true);
  };

  const handleEdit = (emp) => {
    setEditOpen(true);
    setEdit(true);
    reset({
      id: emp.id,
      name: emp.name,
      dateOfJoin: emp.dateOfJoin,
      salary: emp.salary,
      yoe: emp.yoe,
      deptId: emp.deptId,
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axiosInstance.delete(`/api/Emp/DeleteEmp/${id}`);
        Swal.fire("Deleted!", "Employee removed", "success");
        getEmp();
      }
    });
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <Navbar />

      <div className="min-h-screen flex justify-center px-4 mt-10">
        <div className="w-full max-w-5xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Employees</h2>

            {user.role === "Admin" && (
              <button
                onClick={() => {
                  setEditOpen(true);
                  setEdit(false);
                  reset({
                    name: "",
                    dateOfJoin: "",
                    deptId: "",
                    salary: 0,
                    yoe: 0,
                  });
                }}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded"
              >
                <Plus size={18} /> Create
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin w-8 h-8 text-indigo-600" />
            </div>
          ) : (
            <div className="bg-white shadow-xl rounded-xl p-6 transition duration-300">
              <div className="mb-6 flex items-center justify-start gap-4">
                <label
                  className="text-base font-semibold text-gray-700"
                  htmlFor="deptFilter"
                >
                  Filter by Department:
                </label>
                <select
                  id="deptFilter"
                  value={selectedDept}
                  onChange={(e) => {
                    setSelectedDept(Number(e.target.value));
                    setPage(1);
                  }}
                  className="border border-gray-300 rounded-lg shadow-sm py-2 px-4 text-gray-800 transition duration-150 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 appearance-none bg-white"
                  style={{ minWidth: "150px" }}
                >
                  <option value={0}>All Departments</option>
                  {dept.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-tl-lg">
                        No
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150 select-none"
                        onClick={() => handleSort("name")}
                      >
                        Name
                        {sortBy === "name" &&
                          (sortOrder === "asc" ? " ▲" : " ▼")}
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150 select-none"
                        onClick={() => handleSort("salary")}
                      >
                        Salary
                        {sortBy === "salary" &&
                          (sortOrder === "asc" ? " ▲" : " ▼")}
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150 select-none"
                        onClick={() => handleSort("yoe")}
                      >
                        YOE
                        {sortBy === "yoe" &&
                          (sortOrder === "asc" ? " ▲" : " ▼")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-tr-lg">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {emp.map((e, i) => (
                      <tr
                        key={e.id}
                        className="hover:bg-indigo-50/50 transition duration-150"
                      >
                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {(page - 1) * pageSize + i + 1}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                          {e.name}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                          {e.salary.toLocaleString()}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                          {e.yoe}
                        </td>
                        {/* Added currency formatting */}
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {e.departmentName}
                          </span>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex justify-center gap-4">
                            <Eye
                              className="w-5 h-5 cursor-pointer text-indigo-500 hover:text-indigo-700 transform hover:scale-110 transition duration-150"
                              onClick={() => handleView(e)}
                            />
                            {user.role === "Admin" && (
                              <>
                                <Pencil
                                  className="w-5 h-5 cursor-pointer text-green-500 hover:text-green-700 transform hover:scale-110 transition duration-150"
                                  onClick={() => handleEdit(e)}
                                />
                                <Trash2
                                  className="w-5 h-5 cursor-pointer text-red-500 hover:text-red-700 transform hover:scale-110 transition duration-150"
                                  onClick={() => handleDelete(e.id)}
                                />
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* --- Pagination Section --- */}
              <div className="mt-6 flex justify-between items-center px-2">
                <span className="text-sm text-gray-600">
                  Page{" "}
                  <span className="font-semibold text-gray-800">{page}</span> of{" "}
                  <span className="font-semibold text-gray-800">
                    {totalPages}
                  </span>
                </span>

                <div className="flex gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition duration-150 ${
                      page <= 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Previous
                  </button>

                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition duration-150 ${
                      page >= totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                    }`}
                  >
                    Next
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {viewOpen && selectedEmp && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <h2 className="text-xl font-bold mb-4">Employee Details</h2>
            <p>
              <b>Name:</b> {selectedEmp.name}
            </p>
            <p>
              <b>Department:</b> {selectedEmp.departmentName}
            </p>
            <p>
              <b>Date of Join:</b> {selectedEmp.dateOfJoin}
            </p>
            <p>
              <b>Salary:</b> {selectedEmp.salary}
            </p>
            <p>
              <b>YOE:</b> {selectedEmp.yoe}
            </p>

            <button
              onClick={() => setViewOpen(false)}
              className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {editOpen && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md relative">
            <button
              onClick={() => {
                setEditOpen(false);
                reset();
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-700">
              {edit ? "Edit Employee" : "Create Employee"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input {...register("id")} type="hidden" />
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Employee Name
                </label>
                <input
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters",
                    },
                  })}
                  type="text"
                  id="name"
                  className={`mt-1 block w-full border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Talha Malek"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="dateOfJoin"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date of Joining
                </label>
                <input
                  {...register("dateOfJoin", {
                    required: "Date is required",
                  })}
                  type="date"
                  id="dateOfJoin"
                  className={`mt-1 block w-full border ${
                    errors.dateOfJoin ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500`}
                />
                {errors.dateOfJoin && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.dateOfJoin.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="departmentId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Department
                </label>
                <select
                  {...register("deptId", {
                    required: "Department is required",
                  })}
                  id="departmentId"
                  className={`mt-1 block w-full border ${
                    errors.deptId ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500`}
                >
                  <option value="">Select Department</option>
                  {dept.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.deptId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.deptId.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="salary"
                  className="block text-sm font-medium text-gray-700"
                >
                  Salary
                </label>
                <input
                  {...register("salary", {
                    required: "Salary is required",
                  })}
                  type="number"
                  step="any"
                  id="salary"
                  className={`mt-1 block w-full border ${
                    errors.salary ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="e.g., 55000"
                />
                {errors.salary && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.salary.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="yoe"
                  className="block text-sm font-medium text-gray-700"
                >
                  Years of Experience (YOE)
                </label>
                <input
                  {...register("yoe", {
                    required: "YOE is required",
                    min: {
                      value: 0,
                      message: "YOE cannot be less than 0",
                    },
                    max: {
                      value: 60,
                      message: "YOE cannot be more than 60",
                    },
                  })}
                  type="number"
                  id="yoe"
                  className={`mt-1 block w-full border ${
                    errors.yoe ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="e.g., 5"
                />
                {errors.yoe && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.yoe.message}
                  </p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center gap-2"
                  disabled={save} // disable button while saving
                >
                  {save && <Loader2 className="animate-spin h-4 w-4" />}
                  {save ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Employee;
