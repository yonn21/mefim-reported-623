import React, {useEffect} from 'react'
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAllMovieApi, getPhimLeTheoTheLoai, getPhimChieuRap, getPhimChieuRapTheoNam } from '../../redux/reducer/filmReducer';

export default function Home(props) {

    const { listPhimLeMoiCapNhat, listPhimChieuRapTheoNam } = useSelector(state => state.filmReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        const actionGetPhimLe = getAllMovieApi()
        dispatch(actionGetPhimLe)

        // const actionGetPhimLeMoiCapNhat = getPhimLeMoiCapNhat()
        // dispatch(actionGetPhimLeMoiCapNhat)

        const actionGetPhimChieuRap = getPhimChieuRap()
        dispatch(actionGetPhimChieuRap)
    }, [dispatch]);

    const renderPhimle = () => {
        return listPhimLeMoiCapNhat.map((film, index) => {
            if (index === 0) {
                return <div className="large" key={index}>
                    <NavLink title={film.primary_title} to={`/info/${film.primary_title}`}>
                        <img src={film.thumbnail} alt="" />
                        <span className='label'>HD-Vietsub</span>
                        <p>{film.primary_title}</p>
                    </NavLink>
                </div>
            } else {
                return <div className="small" key={index}>
                    <NavLink title={film.primary_title} to={`/info/${film.primary_title}`}>
                        <img src={film.thumbnail} alt="" />
                        <span className='label'>HD-Vietsub</span>
                        <p>{film.primary_title}</p>
                    </NavLink>
                </div>
            }
        })
    }

    const renderPhimChieuRap = () => {
        return listPhimChieuRapTheoNam.map((film, index) => {
            if (index === 0) {
                return <div className="large" key={index}>
                    <NavLink title={film.name} to={`/info/${film.name}`}>
                        <img src={film.src} alt="" />
                        <span className='label'>HD-Vietsub</span>
                        <p>{film.name}</p>
                    </NavLink>
                </div>
            } else {
                return <div className="small" key={index}>
                    <NavLink title={film.name} to={`/info/${film.name}`}>
                        <img src={film.src} alt="" />
                        <span className='label'>HD-Vietsub</span>
                        <p>{film.name}</p>
                    </NavLink>
                </div>
            }
        })
    }

    return (
        <div className='container pd-80'>
            <ul className="tabs nav nav-tabs border-0 mb-4">
                <h4 className='mr-5' onClick={() => {
                    
                }}>PHIM LẺ MỚI CẬP NHẬT</h4>
                <li className="nav-item">
                    <button className="nav-link btn" onClick={() => {
                        const theloai = "khoa hoc vien tuong";
                        const action = getPhimLeTheoTheLoai(theloai);
                        dispatch(action);
                    }}>Khoa hoc vien tuong</button>
                </li>
                <li className="nav-item">
                    <button className="nav-link btn" onClick={() => {
                        const theloai = "phim hoạt hình";
                        const action = getPhimLeTheoTheLoai(theloai);
                        dispatch(action);
                    }}>Hoạt hình</button>
                </li>
                <li className="nav-item">
                    <button className="nav-link btn" onClick={() => {
                        const theloai = "phim ma - kinh dị";
                        const action = getPhimLeTheoTheLoai(theloai);
                        dispatch(action);
                    }}>Kinh dị</button>
                </li>
            </ul>
            <div className="list-film">
                {renderPhimle()}
                <div className="clear"></div>
            </div>

            <ul className="tabs nav nav-tabs border-0 mb-4 mt-5">
                <h4 className='mr-5'>PHIM CHIẾU RẠP</h4>
                <li className="nav-item">
                    <button className="nav-link btn" onClick={() => {
                        const year = "2023";
                        const action = getPhimChieuRapTheoNam(year);
                        dispatch(action);
                    }}>2023</button>
                </li>
                <li className="nav-item">
                    <button className="nav-link btn" onClick={() => {
                        const year = "2022";
                        const action = getPhimChieuRapTheoNam(year);
                        dispatch(action);
                    }}>2022</button>
                </li>
                <li className="nav-item">
                    <button className="nav-link btn" onClick={() => {
                        const year = "2021";
                        const action = getPhimChieuRapTheoNam(year);
                        dispatch(action);
                    }}>2021</button>
                </li>
                <li className="nav-item">
                    <button className="nav-link btn" onClick={() => {
                        const year = "2020";
                        const action = getPhimChieuRapTheoNam(year);
                        dispatch(action);
                    }}>2020</button>
                </li>
            </ul>
            <div className="list-film">
                {renderPhimChieuRap()}
                <div className="clear"></div>
            </div>

            <ul className="tabs nav nav-tabs border-0 mb-4 mt-5">
                <h4 className='mr-5'>PHIM BỘ MỚI CẬP NHẬT</h4>
                <li className="nav-item">
                    <button className="nav-link btn" onClick={() => {
                        const nation = "phim hàn quốc";
                        const action = getPhimChieuRapTheoNam(nation);
                        dispatch(action);
                    }}>Hàn Quốc</button>
                </li>
                <li className="nav-item">
                    <button className="nav-link btn" onClick={() => {
                        const nation = "phim trung quốc";
                        const action = getPhimChieuRapTheoNam(nation);
                        dispatch(action);
                    }}>Trung Quốc</button>
                </li>
                <li className="nav-item">
                    <button className="nav-link btn" onClick={() => {
                        const nation = "phim âu mỹ";
                        const action = getPhimChieuRapTheoNam(nation);
                        dispatch(action);
                    }}>Âu - Mỹ</button>
                </li>
                <li className="nav-item">
                    <button className="nav-link btn" onClick={() => {
                        const nation = "2020";
                        const action = getPhimChieuRapTheoNam(nation);
                        dispatch(action);
                    }}>Phim Bộ Full</button>
                </li>
            </ul>
            <div className="list-film">
                {renderPhimChieuRap()}
                <div className="clear"></div>
            </div>
        </div>
    )
}
