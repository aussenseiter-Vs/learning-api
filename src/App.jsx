import { useState, useEffect } from 'react'
import React from 'react'
import Search from './component/search.jsx'
import Spinner from './component/Spinner.jsx';

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

  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage('')
    try{
      const endPoint =`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

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
      console.log(data)

    } catch(error){
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies, Please try again later');
    } finally {
      setIsLoading(false)
    }
  }

  useEffect( ()=>{
    fetchMovies();
  }, [])

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
            <Spinner className='flex justify-center'/>
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movies) =>(
                <p key={movies.id} className='text-white'>{movies.title}</p>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App