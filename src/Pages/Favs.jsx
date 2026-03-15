import React, { useState, useEffect, Suspense, lazy } from "react";
import { useTmdbAPI } from "../Store/API";
import MovieCardFallback from "../Components/MovieCardFallback";
import Loader from "../Components/Loader";

const backendURL = import.meta.env.VITE_BACKEND_SERVICE_URL || "http://localhost:5000";

export default function Favs() {
  const [loading, setLoading] = useState(true);
  const { userData, tembApi } = useTmdbAPI();
  const [userReactions, setUserReactions] = useState({});
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const MovieCard = lazy(() => import("../Components/MovieCard"));

  useEffect(() => {
    if (!userData?._id) return;
    const getUserReactions = async () => {
      try {
        const response = await fetch(
          `${backendURL}/api/user/getfavoritesandwatchlist/${userData._id}`,
          { credentials: "include" }
        );
        const data = await response.json();
        setUserReactions(data);
      } catch (err) {
        console.error(err);
      }
    };
    getUserReactions();
  }, [userData?._id]);

  useEffect(() => {
    if (!userReactions?.favoriteMovies?.length) {
      setFavoriteMovies([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const results = await Promise.all(
          userReactions.favoriteMovies.map((movieId) => tembApi.getMovieDetail(movieId))
        );
        if (!cancelled) {
          setFavoriteMovies(results.filter(Boolean));
        }
      } catch (err) {
        if (!cancelled) console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [userReactions?.favoriteMovies?.join(",")]);

  if (loading && favoriteMovies.length === 0) {
    return <Loader />;
  }
  return (
    <div className="w-full">
      <div className="w-full flex justify-start my-5">
        <h1 className="text-white font-bold text-2xl">Your Favourite Movies</h1>
      </div>
      <div className="w-full flex flex-wrap justify-center gap-3">
        {favoriteMovies?.map((movie) => (
          <Suspense key={movie.id} fallback={<MovieCardFallback />}>
            <MovieCard
              movieId={movie.id}
              releaseDate={movie.release_date}
              movieName={movie.original_title}
              backdropPath={movie.backdrop_path}
            />
          </Suspense>
        ))}
      </div>
    </div>
  );
}
