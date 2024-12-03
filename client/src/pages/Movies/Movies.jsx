import "../../../src/style.css";
import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader.jsx';
import Movie from "../../components/Movie.jsx";
import Navbar from '../../components/header/Navbar';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom

export default function Movies() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);

    const fetchData = async (pageNumber) => {
        setIsLoading(true);
        try {
            const response = await fetch(`https://aniwatch-api-v1-0.onrender.com/api/mix/tv/${pageNumber}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const jsonData = await response.json();
            setData(jsonData.mixAni);
            setHasNextPage(jsonData.nextpageavai);
            setIsLoading(false);
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const loadNextPage = () => {
        if (hasNextPage) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    if (isLoading && data.length === 0) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="text-center text-red-500">
                <p>Error: {error}</p>
                <button onClick={() => window.location.reload()} className="bg-red-500 text-white px-4 py-2 rounded">
                    Retry
                </button>
            </div>
        );
    }

    // Debugging: Check the structure of `anime` data
    console.log("Data:", data);

    return (
        <>
            <Navbar />
            <div className="pt-14 overflow-scroll scrollbar-hide w-screen h-screen bg-gray-900 text-white">
                <div className="flex flex-wrap gap-4 p-4">
                    {/* Render Movies */}
                    {data.map((anime, index) => {
                        console.log("Anime ID:", anime.id);  // Log each anime's id for debugging
                        return (
                            <Link to={`/show/${anime.idanime}`} key={anime.idanime}>
                                <Movie
                                    key={anime.idanime}
                                    id={anime.idanime}  // Ensure this is the correct field
                                    name={anime.name}
                                    jname={anime.jname}
                                    logo={anime.img}
                                    format={anime.format}
                                    duration={anime.duration}
                                    sub={anime.sub}
                                    dub={anime.dubani}
                                    totalEpisodes={anime.totalep}
                                />
                            </Link>
                        );
                    })}
                </div>
                {/* Pagination Button */}
                {hasNextPage && (
                    <div className="flex justify-center mb-4">
                        <button
                            onClick={loadNextPage}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Next Page
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

