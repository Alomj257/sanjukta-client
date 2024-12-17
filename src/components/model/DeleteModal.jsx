import React from 'react';
import './deleteModal.css'

const DeleteModal = ({ supplierName, onConfirm, onCancel }) => {
    return (
        <div className="delete-modal">
            <div className="modal-content">
                <h3>Are you sure you want to delete {supplierName}?</h3>
                <div className="modal-buttons">
                    <button onClick={onConfirm} className="delete-confirm">Yes</button>
                    <button onClick={onCancel} className="delete-cancel">No</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
