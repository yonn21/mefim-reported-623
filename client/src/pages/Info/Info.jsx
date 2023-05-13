import React from 'react'
import { useSelector } from 'react-redux';

export default function Info({match}) {
    const { listPhimLe } = useSelector(state => state.filmReducer);
    let name = match.params.name;
    const film = listPhimLe.find(film => film.primary_title === name);

    return (
        <div className='container-info pd-80'>
            <div className="des d-flex justify-content-start ">
                <i className="fa fa-home ml-3 mr-2 pt-2 pb-2 color" />
                <p className='m-0 mr-2 pt-2 pb-2 color'>Xem phim</p>
                <i className="fa fa-angle-right mr-2 pt-2 pb-2 color" />
                <p className='m-0 mr-2 pt-2 pb-2 color'>{film.genres.join(", ")}</p>
                <i className="fa fa-angle-right mr-2 pt-2 pb-2 color" />
                <p className='m-0 mr-2 pt-2 pb-2'>{film.primary_title}</p>
            </div>
            <div className="film-info">
                <div className="banner" style={{ backgroundImage: `url(${film.thumbnail})` }}>
                    <img className='avatar' src={`${film.thumbnail}`} alt="" />
                </div>
                <div className="text">
                    <h1>{film.primary_title}</h1>
                    <button type="button" className="btn btn-danger"><i className="fa fa-play-circle"></i> Xem Phim</button>
                </div>
            </div>
            <div className="film-des container-fluid">
                <div className="row line pb-2">
                    <div className="col-4">
                        <p>Đang phát: </p>
                        <span> HD Vietsub</span>
                    </div>
                    <div className="col-4">
                        <p>Năm Phát Hành:</p>
                        <span> {film.year}</span>
                    </div>
                    <div className="col-4">
                        <p>Quốc gia:</p>
                        <span> {film.country}</span>
                    </div>
                    <div className="col-4">
                        <p>Thể loại:</p>
                        <span> {film.genres}</span>
                    </div>
                </div>
                <div className="film-content mt-2 pb-2 line">
                    <h3>Nội dung phim và review</h3>
                    <span><b>{film.primary_title} </b>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit cum nulla ex molestiae blanditiis quisquam dolor esse molestias obcaecati soluta pariatur impedit error aut quia excepturi laboriosam, consectetur eum dicta aspernatur nihil at autem. Iusto laudantium quam, suscipit ex natus minus dolore, in error sed, velit ullam dicta iste aspernatur facilis voluptate molestiae dolorem mollitia recusandae alias quas eos fugiat! Reprehenderit neque veniam ut aperiam accusantium voluptatem, deleniti vel et laborum nam eveniet delectus aliquam molestiae voluptatum culpa, quod vitae impedit eos pariatur dolores voluptatibus iusto. Odit tempora provident quos. Fugit reprehenderit dolores praesentium libero, mollitia illum iusto optio, veniam debitis atque ipsum? Perferendis delectus, aliqua</span>
                </div>
                
            </div>
        </div>
    )
}
