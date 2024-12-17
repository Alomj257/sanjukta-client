import React, { useState, useEffect, useRef } from 'react';
import DataTable from '../../../components/dataTable/DataTable';
import './section-style.css';
import { FaEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import apis from '../../../utils/apis';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import DeleteModal from '../../../components/model/DeleteModal';

const SectionTable = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [sectionToDelete, setSectionToDelete] = useState(null);
    const toastShownRef = useRef(false);

    useEffect(() => {
        const fetchSection = async () => {
            setLoading(true);
            try {
                const response = await fetch(apis().getAllSections);
                if (!response.ok) throw new Error('Failed to fetch sections');

                const result = await response.json();
                if (result && result.sections && result.sections.length > 0) {
                    const updatedSections = await Promise.all(
                        result.sections.map(async (val) => {
                            if (!val?.userId) return val;
                            const res2 = await fetch(apis().getUserById(val?.userId));
                            const res = await res2.json();
                            return {
                                ...val,
                                userEmail: res?.user?.email || '',
                                userName: res?.user?.name || '',
                            };
                        })
                    );
                    const sortedSections = updatedSections.sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    );

                    setData(sortedSections);
                    setRecords(sortedSections);

                    if (!toastShownRef.current) {
                        toastShownRef.current = true;
                        // toast.success("Sections fetched successfully!");
                    }
                } else {
                    console.error("No section data found", result);
                    throw new Error("No section data found");
                }
            } catch (error) {
                console.error("Error fetching sections:", error);
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };


        fetchSection();
    }, []);
    console.log(records)
    const columns = [
        {
            name: 'Section Name',
            selector: row => row.sectionName,
        },
        {
            name: 'User name',
            selector: row => row.userName,
        },
        {
            name: 'User Email',
            selector: row => row.userEmail,
        },
        {
            name: 'User Phone',
            selector: row => row.userPhone,
        },
        {
            name: 'Distribute Stock',
            cell: row => (
                <div>
                    <button onClick={() => navigate("stocks", { state: { sectionData: row } })} className='distributBtn Btn'>Distr. Stock</button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <div>
                    <button onClick={() => handleView(row)} className='readBtn Btn'><FaEye /></button>
                    <button onClick={() => handleEdit(row)} className='editBtn Btn'><MdEdit /></button>
                    <button onClick={() => handleDelete(row)} className='deleteBtn Btn'><MdDelete /></button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const handleView = (row) => {
        navigate(`/admin/section/view/${row._id}`, { state: { sectionId: row?._id } });
    };

    const handleEdit = (row) => {
        navigate(`/admin/section/edit/${row._id}`, { state: { sectionData: row } });
    };

    const handleDelete = (section) => {
        setSectionToDelete(section);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!sectionToDelete) return;
        try {
            const deleteUrl = apis().deleteSection(sectionToDelete._id);
            const response = await fetch(deleteUrl, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete section');
            setData(data.filter(item => item._id !== sectionToDelete._id));
            setRecords(records.filter(item => item._id !== sectionToDelete._id));
            toast.success('Supplier deleted successfully');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setShowDeleteModal(false);
            setSectionToDelete(null);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        const newRecords = data?.filter(item => item?.sectionName?.toLowerCase().includes(query?.toLowerCase()));
        setRecords(newRecords);
    };

    const handleAddSectionClick = () => {
        navigate('/admin/section/add');
    };

    return (
        <div className='section-container'>
            <h3 className="section-header-title">Section List</h3>
            <div className='section-search'>
                <input type="text" placeholder='Search section by name' onChange={handleSearch} />
                <button className='supplierBtn' onClick={handleAddSectionClick}>Add Section</button>
            </div>

            {loading ? (
                <div className='loading-spinner'>
                    <ClipLoader size={30} color="#00BFFF" loading={loading} />
                </div>
            ) : (

                <DataTable columns={columns} data={records} />
            )
            }

            {showDeleteModal && (
                <DeleteModal
                    supplierName={sectionToDelete.supplierName}
                    onConfirm={confirmDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
        </div>
    );
};

export default SectionTable;
