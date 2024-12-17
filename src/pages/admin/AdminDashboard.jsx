import React, { useState, useEffect, useRef } from 'react';
import { MdDelete } from "react-icons/md";
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import DeleteModal from '../../components/model/DeleteModal';
import apis from '../../utils/apis';
import CustomDataTable from '../../components/dataTable/DataTable';

const UserTable = () => {
    const [data, setData] = useState([]);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const toastShownRef = useRef(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true); 
            try {
                const response = await fetch(apis().getAllUsers);
                if (!response.ok) throw new Error('Failed to fetch users');

                const result = await response.json();
                console.log("API Response: ", result);

                if (result && result.users && result.users.length > 0) {
                    const sortedUsers = result.users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setData(sortedUsers);
                    setRecords(sortedUsers);

                    if (!toastShownRef.current) {
                        toastShownRef.current = true;
                    }
                } else {
                    console.error("No users data found", result);
                    throw new Error("No user data found");
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
        },
        {
            name: 'Email',
            selector: row => row.email,
        },
        {
            name: 'Role',
            selector: row => row.role,
        },
        {
            name: 'Actions',
            cell: row => (
                <div>
                    <button onClick={() => handleDelete(row)} className='deleteBtn Btn'><MdDelete /></button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const handleDelete = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;

        try {
            const deleteUrl = apis().deleteUser(userToDelete._id); // Make sure deleteUser API exists
            const response = await fetch(deleteUrl, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete user');

            setData(data.filter(item => item._id !== userToDelete._id));
            setRecords(records.filter(item => item._id !== userToDelete._id));
            toast.success('User deleted successfully');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setShowDeleteModal(false);
            setUserToDelete(null);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        const newRecords = data.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
        setRecords(newRecords);
    };

    return (
        <div className='supplier-container'>
            <h3 className="supplier-header-title">User List</h3>
            <div className='supplier-search'>
                <input type="text" placeholder='Search user by name' onChange={handleSearch} />
            </div>

            {loading ? (
                <div className='loading-spinner'>
                    <ClipLoader size={30} color="#00BFFF" loading={loading} />
                </div>
            ) : (
                <CustomDataTable columns={columns} data={records} />
            )}

            {showDeleteModal && (
                <DeleteModal
                    supplierName={userToDelete.name}
                    onConfirm={confirmDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
        </div>
    );
};

export default UserTable;
