import React, { useState } from "react";
import "./ReviewList.css";

const ReviewList = ({
    reviews,
    onEdit,
    onDelete,
    editingReview,
    onUpdateReview,
}) => {
    const [editText, setEditText] = useState("");
    const [error, setError] = useState(null);

    const handleSave = async () => {
        try {
            await onUpdateReview(editingReview.id, editText);
            setEditText("");
            onEdit(null);
        } catch (err) {
            setError("Failed to update review. Please try again.");
        }
    };

    const handleCancelEdit = () => {
        setEditText("");
        onEdit(null);
        setError(null);
    };

    if (!reviews || reviews.length === 0) {
        return <div className="no-review-box"><p className="no-review">No reviews available.</p></div>;
    }

    return (
        <div className="review-list-box">
                {reviews.map((review) => (
                    <li className="review-item" key={review.id}>
                        <div className="review-header">
                            <p className="review-username">
                                {review.username && review.username.username
                                    ? review.username.username
                                    : "Unknown User"}
                            </p>
                            <div className="review-dates">
                                <span className="date-label">Added:</span>{" "}
                                {new Date(review.created).toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                })}
                                <span className="date-label">Updated:</span>{" "}
                                {new Date(review.updated).toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                })}
                            </div>
                        </div>

                        {editingReview && editingReview.id === review.id ? (
                            <div>
                                <textarea
                                    className="edit-review-textarea"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    placeholder="Edit your review"
                                />
                                {error && <div className="review-error-message">{error}</div>}
                                <div className="edit-review-actions">
                                    <button
                                        className="save-review-button"
                                        onClick={handleSave}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="cancel-edit-button"
                                        onClick={handleCancelEdit}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="review-body">{review.body}</p>
                        )}

                        <div className="review-actions">
                            <button
                                className="edit-review-button"
                                onClick={() => {
                                    setEditText(review.body);
                                    onEdit(review);
                                }}
                            >
                                Edit
                            </button>
                            <button
                                className="delete-review-button"
                                onClick={() => onDelete(review.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
        </div>
    );
};

export default ReviewList;
