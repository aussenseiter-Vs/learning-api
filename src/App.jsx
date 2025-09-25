import { useState, useEffect } from 'react'
import { useDebounce } from "@uidotdev/usehooks";
import React from 'react'
import Search from './component/search.jsx'
import Spinner from './component/Spinner.jsx';
import MovieCard from './component/MovieCard.jsx';
import { updateSearchCount } from './appwrite.js';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}



const App = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [movieList, setMoviesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('')

  useDebounce(
  () => setDebounceSearchTerm(searchTerm), 500, [searchTerm]
)
  useEffect( ()=>{
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm])

  const fetchMovies = async (query) => {
    setIsLoading(true);
    setErrorMessage('')
    try{
      const endPoint =
      query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endPoint, API_OPTIONS);
      if(!response.ok){
        throw new Error('failed fetching movies')
      }

      const data = await response.json();
      if(data.response === 'False'){
        throw new Error (data.error || 'error fetching data');
        setMoviesList([]);
        return;
      }
      setMoviesList(data.results || [])
      updateSearchCount()

    } catch(error){
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies, Please try again later');
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main>
      <div className='pattern'/>
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="hero banner" />
          <h1>Find The <span className='text-gradient'>Movies</span> You'll Enjoy Without The Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>
        <section className='all-movies'>
          <h2 className='mt-[40px]'>All movies</h2>
          {isLoading ? (
            <Spinner className='justify-center'/>
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : movieList.length === 0 ? (
            <h2 className='text-white flex justify-center'>No movies Found</h2>
          ) :(
            <ul>
              {movieList.map((movies) =>(
                <MovieCard key={movies.id} movies={movies}/>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App