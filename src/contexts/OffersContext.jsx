import React, { useState, useEffect } from "react";
import { getAllOffers } from '../api/offers.api';

export const OffersContext = React.createContext();

export const OffersProvider = ({ children }) => {
    const [activeOffer, setActiveOffer] = useState(null);

    useEffect(() => {
        async function fetchActiveOffers() {
            try {
                const offersResponse = await getAllOffers();
                const offers = offersResponse.data;
                const currentDate = new Date();

                const activeOffer = offers.find(offer =>
                    new Date(offer.start_date) <= currentDate &&
                    new Date(offer.end_date) >= currentDate
                );

                if (activeOffer) {
                    setActiveOffer(activeOffer);
                }
            } catch (error) {
                console.error("Error fetching offers:", error);
            }
        }

        fetchActiveOffers();
    }, []);

    return (
        <OffersContext.Provider value={{ activeOffer }}>
            {children}
        </OffersContext.Provider>
    );
}
