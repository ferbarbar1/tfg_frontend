import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClient, updateClient, createClient } from '../../api/clients.api';

export function ClientForm({ isUpdate }) {
    const [username, setUsername] = useState("");
    const [originalUsername, setOriginalUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [subscriptionPlan, setSubscriptionPlan] = useState("FREE");
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchclient() {
            if (isUpdate) {
                try {
                    const response = await getClient(id);
                    const client = response.data;
                    setUsername(client.user.username);
                    setOriginalUsername(client.user.username);
                    setFirstName(client.user.first_name);
                    setLastName(client.user.last_name);
                    setEmail(client.user.email);
                    setPassword(client.user.password);
                    setSubscriptionPlan(client.subscription_plan);
                } catch (error) {
                    console.error(error);
                }
            }
        }
        fetchclient();
    }, [id, isUpdate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        if (!username || !firstName || !lastName || !email || (!isUpdate && !password)) {
            setError('All fields are required');
            return;
        }
        try {
            const userData = {
                first_name: firstName,
                last_name: lastName,
                email: email
            };
            if (username !== originalUsername) {
                userData.username = username;
            }
            if (isUpdate) {
                await updateClient(id, {
                    user: userData,
                    subscription_plan: subscriptionPlan
                });
            } else {
                await createClient({
                    user: {
                        username: username,
                        first_name: firstName,
                        last_name: lastName,
                        email: email,
                        password: password
                    },
                    subscription_plan: subscriptionPlan
                });
            }
            navigate('/users?tab=clients');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('An error occurred');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p>{error}</p>}
            <label>
                Username:
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </label>
            <label>
                First Name:
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </label>
            <label>
                Last Name:
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </label>
            <label>
                Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
                Subscription Plan:
                <input type="text" value={subscriptionPlan} onChange={(e) => setSubscriptionPlan(e.target.value)} required />
            </label>
            {!isUpdate && (
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
            )}
            <button type="submit">{isUpdate ? 'Update' : 'Create'}</button>
        </form>
    );
}