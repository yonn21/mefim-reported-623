import React from 'react'
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

export default function Genre({ match }) {
    let category = match.params.category;
    const { listPhimLe } = useSelector(state => state.filmReducer);

    const renderFilm = () => {
        return listPhimLe.map((film, index) => {
            return <div className="small" key={index}>
                <NavLink title={film.primary_title} to={`/info/${film.primary_title}`}>
                    <img src={film.thumbnail} alt="" />
                    <span className='label'>HD-Vietsub</span>
                    <p>{film.primary_title}</p>
                </NavLink>
            </div>
        })
    }

    return (
        <div className='container genre'>
            <h4 className='mr-5'>
                {category}
            </h4>

            <div className="des d-flex justify-content-start">
                <i className="fa fa-home ml-3 mr-2 pt-2 pb-2 color" />
                <p className='m-0 mr-2 pt-2 pb-2 color'>Phim Mới</p>
                <i className="fa fa-angle-right mr-2 pt-2 pb-2 color" />
                <p className='m-0 mr-2 pt-2 pb-2'>{category}</p>
            </div>

            {renderFilm()}
            <div className="clear"></div>
        </div>
    )
}
