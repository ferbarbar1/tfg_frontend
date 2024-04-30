import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorker, updateWorker, createWorker } from '../api/workers.api';

export function WorkerForm({ isUpdate }) {
    const [username, setUsername] = useState("");
    const [originalUsername, setOriginalUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [salary, setSalary] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchWorker() {
            if (isUpdate) {
                try {
                    const response = await getWorker(id);
                    const worker = response.data;
                    setUsername(worker.user.username);
                    setOriginalUsername(worker.user.username);
                    setFirstName(worker.user.first_name);
                    setLastName(worker.user.last_name);
                    setEmail(worker.user.email);
                    setPassword(worker.user.password);
                    setSalary(worker.salary);
                    setSpecialty(worker.specialty);
                } catch (error) {
                    console.error(error);
                }
            }
        }
        fetchWorker();
    }, [id, isUpdate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        if (!username || !firstName || !lastName || !email || !salary || !specialty || (!isUpdate && !password)) {
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
                await updateWorker(id, {
                    user: userData,
                    salary: salary,
                    specialty: specialty
                });
            } else {
                await createWorker({
                    user: {
                        username: username,
                        first_name: firstName,
                        last_name: lastName,
                        email: email,
                        password: password
                    },
                    salary: salary,
                    specialty: specialty
                });
            }
            navigate('/users?tab=workers');
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
                Salary:
                <input type="text" value={salary} onChange={(e) => setSalary(e.target.value)} required />
            </label>
            <label>
                Specialty:
                <input type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)} required />
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