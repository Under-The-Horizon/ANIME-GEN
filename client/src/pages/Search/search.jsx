import '../../../src/style.css';
import { Link, useParams } from 'react-router-dom';
import MovieCard from "/src/components/Moviecard"
import SideCard from "/src/components/SideCard";
import Loader from '../../components/Loader.jsx';
import Navbar from '../../components/header/Navbar';
import React, { useState, useEffect } from 'react';

const Search = () => {
    const { id } = useParams();

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activePage, setActivePage] = useState(1);
    const [nextPageAvailable, setNextPageAvailable] = useState(false);

    useEffect(() => {
        const fetchData = async (page = 1) => {
            setIsLoading(true);
            try {
                console.log("Fetching...");
                const response = await fetch(`https://aniwatch-api-v1-0.onrender.com/api/search/${id}/${page}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const json = await response.json();
                console.log("Data fetched and parsed");
                setData(json?.searchYour || []);
                setNextPageAvailable(json?.nextpageavailable || false);
                setActivePage(page);
                setIsLoading(false);
            } catch (error) {
                console.error(error.message);
                setError(error.message);
                setIsLoading(false);
            }
        };

        fetchData(activePage);
    }, [id]);

    const handlePageClick = (page) => {
        if (page < 1 || (page > activePage && !nextPageAvailable)) return;
        fetchData(page);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }

    const cards = data.map((item) => (
        <Link to={`/show/${item.idanime}`} key={item.idanime}>
            <MovieCard
                id={item.idanime}
                name={item.name}
                poster={item.img}
                rating={`${item.sub} Sub | ${item.dubani} Dub`}
                episodes={item.totalep || "N/A"}
                type={item.format}
                duration={item.duration}
            />
        </Link>
    ));

    return (
        <>
            <Navbar />
            <div className="bg-slate-900 h-screen w-screen overflow-hidden scrollbar-hide">
                <div className="u-non-blurred w-screen pt-20 h-full overflow-x-hidden relative scrollbar-hide">
                    <div className="text-3xl px-8 font-bold text-slate-400">
                        SHOWING SEARCH RESULT FOR: <span className="font-serif">{id.toUpperCase()}</span>
                    </div>
                    <div className="mx-4 flex w-screen h-max min-h-[30rem]">
                        <div className="w-full flex h-full overflow-hidden">
                            <div className="relative flex w-full gap-3 flex-wrap py-4 overflow-x-scroll scrollbar-hide">
                                {cards}
                            </div>
                        </div>
                    </div>
                    <div className="w-screen flex justify-center gap-[1px] mt-12">
                        <i
                            className="ri-skip-left-fill text-2xl text-purple-400 cursor-pointer"
                            onClick={() => handlePageClick(1)}
                        ></i>
                        <i
                            className="ri-arrow-left-s-fill text-2xl text-purple-400 cursor-pointer"
                            onClick={() => handlePageClick(activePage - 1)}
                        ></i>
                        <div className="page w-8 h-8 pt-1 text-sm text-center font-bold cursor-pointer rounded-lg bg-purple-400">
                            {activePage}
                        </div>
                        {nextPageAvailable && (
                            <i
                                className="ri-arrow-right-s-fill text-2xl text-purple-400 cursor-pointer"
                                onClick={() => handlePageClick(activePage + 1)}
                            ></i>
                        )}
                        <i
                            className="ri-skip-right-fill text-2xl text-purple-400 cursor-pointer"
                            onClick={() => handlePageClick(activePage + 1)}
                        ></i>
                    </div>
                    <div className="w-screen h-20"></div>
                </div>
            </div>
        </>
    );
};

export default Search;
