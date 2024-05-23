import React from 'react';
import { Card } from 'react-bootstrap';
import ReactStars from 'react-rating-stars-component';

export const RatingsServiceList = ({ ratings }) => (
    <Card>
        <Card.Header as="h3" className="text-center">Ratings</Card.Header>
        <Card.Body>
            <Card.Text className="text-center">
                {ratings.length > 0 ? (
                    ratings.map((rating, index) => (
                        <div key={index} className="mt-3">
                            <div><strong>User:</strong> {rating.client.user.username}</div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}><strong>Rating:</strong> <ReactStars value={rating.rate} edit={false} size={24} activeColor="#ffd700" /></div>
                            <div><strong>Opinion:</strong> {rating.opinion}</div>
                            <div><strong>Date:</strong> {new Date(rating.date).toLocaleDateString()}</div>
                        </div>
                    ))
                ) : (
                    <p>No ratings yet.</p>
                )}
            </Card.Text>
        </Card.Body>
    </Card>
);