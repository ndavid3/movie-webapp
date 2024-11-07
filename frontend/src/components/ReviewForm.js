import React, { useState } from 'react';
import './ReviewForm.css'

const ReviewForm = ({ movieId, onSubmit }) => {
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSubmit({ content });
            setContent('');
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    return (
        <div className='submit-review-box'>
        <form className= 'submit-review-form' onSubmit={handleSubmit}>
            <textarea className='submit-review-text'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your review..."
                required
            />
            <div>
            <button type="submit" className='submit-review-button'>Submit Review</button>
            </div>
        </form>
        </div>
    );
};

export default ReviewForm;
