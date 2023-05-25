import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Header(props) {
    return (
        <div className='header'>
            <nav className="container navbar navbar-expand-sm">
                {/* <NavLink className="navbar-brand" to="/">Navbar</NavLink> */}
                <button className="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="/genre/phimcollapsibleNavId" aria-controls="collapsibleNavId" aria-expanded="false" aria-label="Toggle navigation" />
                <div className="collapse navbar-collapse" id="collapsibleNavId">
                    <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/phim">PHIMMOI</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/list/phim-le">PHIM LẺ</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/list/phim-bo">PHIM BỘ</NavLink>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="/" role="button" data-toggle="dropdown" aria-expanded="false">
                                THỂ LOẠI
                            </a>
                            <div className="dropdown-menu">
                                <div className="row">
                                    <div className="col-6">
                                        <NavLink className="dropdown-item" to="/the-loai/hanh-dong">Phim Hành Động</NavLink>
                                        <NavLink className="dropdown-item" to="/the-loai/tinh-cam">Phim Tình Cảm</NavLink>
                                        <NavLink className="dropdown-item" to="/the-loai/hai-huoc">Phim Hài Hước</NavLink>
                                        <NavLink className="dropdown-item" to="/the-loai/co-trang">Phim Cổ Trang</NavLink>
                                        <NavLink className="dropdown-item" to="/the-loai/tam-ly">Phim Tâm Lý</NavLink>
                                        <NavLink className="dropdown-item" to="/the-loai/hinh-su">Phim Hình Sự</NavLink>
                                        <NavLink className="dropdown-item" to="/the-loai/chien-tranh">Phim Chiến Tranh</NavLink>
                                    </div>
                                    <div className="col-6">
                                        <NavLink className="dropdown-item" to="/the-loai/vo-thuat">Phim Võ Thuật</NavLink>
                                        <NavLink className="dropdown-item" to="/the-loai/hoat-hinh">Phim Hoạt Hình</NavLink>
                                        <NavLink className="dropdown-item" to="/the-loai/vien-tuong">Phim Viễn Tưởng</NavLink>
                                        <NavLink className="dropdown-item" to="/the-loai/phieu-luu">Phim Phiêu Lưu</NavLink>
                                        <NavLink className="dropdown-item" to="/the-loai/khoa-hoc">Phim Khoa Học</NavLink>
                                        <NavLink className="dropdown-item" to="/the-loai/kinh-di">Phim Kinh Dị</NavLink>
                                        <NavLink className="dropdown-item" to="/the-loai/am-nhac">Phim Âm Nhạc</NavLink>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="/" role="button" data-toggle="dropdown" aria-expanded="false">
                                Quốc Gia
                            </a>
                            <div className="dropdown-menu">
                            <div className="row">
                                    <div className="col-6">
                                        <NavLink className="dropdown-item" to="/genre/phim">Phim Trung Quốc</NavLink>
                                        <NavLink className="dropdown-item" to="/genre/phim">Phim Nhật Bản</NavLink>
                                        <NavLink className="dropdown-item" to="/genre/phim">Phim Thái Lan</NavLink>
                                        <NavLink className="dropdown-item" to="/genre/phim">Phim Tổng Hợp</NavLink>
                                    </div>
                                    <div className="col-6">
                                        <NavLink className="dropdown-item" to="/genre/phim">Phim Hàn Quốc</NavLink>
                                        <NavLink className="dropdown-item" to="/genre/phim">Phim Âu Mỹ</NavLink>
                                        <NavLink className="dropdown-item" to="/genre/phim">Phim Đài Loan</NavLink>
                                        <NavLink className="dropdown-item" to="/genre/phim">Phim Hồng Kông</NavLink>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/nam-phat-hanh">NĂM PHÁT HÀNH</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/list/phim-chieu-rap">PHIM CHIẾU RẠP</NavLink>
                        </li>
                    </ul>
                    <form className="header-form form-inline my-2 my-lg-0">
                        <input className="form-search form-control" type="text" placeholder="Tìm phim, diễn viên, ..." />
                        <i className="fa fa-search" type="submit"></i>
                    </form>
                </div>
            </nav>
        </div>
    )
}
