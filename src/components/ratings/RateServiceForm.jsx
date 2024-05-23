import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from '../../contexts/AuthContext';
import { Form, Button } from "react-bootstrap";
import { createRating } from '../../api/ratings.api';
import ReactStars from "react-rating-stars-component";



export const RateServiceForm = ({ serviceId }) => {
    const { user } = useContext(AuthContext);
    const [rating, setRating] = useState(0);
    const [opinion, setOpinion] = useState("");


    const handleSubmit = async (event) => {
        event.preventDefault();

        const ratingData = {
            client: user.user.id,
            service: serviceId,
            rate: parseInt(rating, 10),
            opinion,
        };

        try {
            await createRating(ratingData);
        } catch (error) {
            console.error("Error creating rating: ", error);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="rating">
                <Form.Group controlId="rating">
                    <Form.Label>Rating</Form.Label>
                    <ReactStars
                        count={5}
                        onChange={setRating}
                        size={24}
                        activeColor="#ffd700"
                        value={rating}
                    />
                </Form.Group>
            </Form.Group>
            <Form.Group controlId="opinion">
                <Form.Label>Comment</Form.Label>
                <Form.Control
                    as="textarea"
                    value={opinion}
                    onChange={(event) => setOpinion(event.target.value)}
                />
            </Form.Group>
            <Button variant="primary" type="submit">
                Save Rating
            </Button>
        </Form>
    );
}