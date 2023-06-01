import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

const initialState = {
  listPhimLe: [],
  listPhimBo: [],
  ListPhimChieuRap: [],
  listPhimLeMoiCapNhat: [],
  listPhimChieuRapTheoNam: [],
  filmInfo: {},
  genres: {},
  country: {},
  releaseYear: {},
  type: {},
}

const filmReducer = createSlice({
  name: "film",
  initialState,
  reducers: {
    getAllMovieApiAction: (state, action) => {
      state.listPhimLeMoiCapNhat = action.payload.latestMoviesByType1ToRender;
    },
    getMovieApiAction: (state, action) => {
      state.filmInfo = action.payload;
    },
    getMovieByGenresApiAction: (state, action) => {
      state.genres = action.payload;
    },
    getMovieByCountryApiAction: (state, action) => {
      state.country = action.payload;
    },
    getMovieByYearApiAction: (state, action) => {
      state.releaseYear = action.payload;
    },
    getMovieByTypeApiAction: (state, action) => {
      state.type = action.payload;
    },
    getPhimLeTheoTheLoai: (state, action) => {
      const gettheloai = action.payload;
      console.log(gettheloai);
      const list = [];
      state.listPhimLeMoiCapNhat.forEach((film, index) => {
        film.genres.forEach((item, index) => {
          console.log("item", item);
          if (item === gettheloai) {
            list.push(film);
          }
        })
      })
      state.listPhimLeMoiCapNhat = list;
    },
    getPhimChieuRap: (state, action) => {
      const list = [];
      state.listPhimLe.forEach((film, index) => {
        film.theloai.forEach((item, index) => {
          if (item === "phim chiếu rạp") {
            list.push(film);
          }
        })
      })
      state.ListPhimChieuRap = list;
      state.listPhimChieuRapTheoNam = state.ListPhimChieuRap;
    },
    getPhimChieuRapTheoNam: (state, action) => {
      const getYear = action.payload;
      let newphimchieurap = state.ListPhimChieuRap.filter(film => film.nam_phat_hanh === getYear);
      state.listPhimChieuRapTheoNam = newphimchieurap;
    }
  }
});

export const { getMovieByTypeApiAction, getAllMovieApiAction, getMovieApiAction, getMovieByGenresApiAction, getMovieByCountryApiAction, getMovieByYearApiAction } = filmReducer.actions

export default filmReducer.reducer

export const getAllMovieApi = () => {
  return async (dispatch, getState) => {
    try {
      const result = await axios({
        url: 'http://localhost:6969/',
        method: 'GET'
      });
      const action = getAllMovieApiAction(result.data);
      dispatch(action);
    } catch (err) {
      console.log(err)
    }
  }
}

export const getMovieApi = (url_name) => {
  return async (dispatch, getState) => {
    try {
      const result = await axios({
        url: `http://localhost:6969/phim/${url_name}`,
        method: 'GET'
      });
      const action = getMovieApiAction(result.data);
      dispatch(action);
    } catch (err) {
      console.log(err)
    }
  }
}

export const getMovieByGenresApi = (genre_url) => {
  return async (dispatch, getState) => {
    try {
      const result = await axios({
        url: `http://localhost:6969/the-loai/${genre_url}`,
        method: 'GET'
      });
      const action = getMovieByGenresApiAction(result.data);
      dispatch(action);
    } catch (err) {
      console.log(err)
    }
  }
}

export const getMovieByCountryApi = (country_url) => {
  return async (dispatch, getState) => {
    try {
      const result = await axios({
        url: `http://localhost:6969/quoc-gia/${country_url}`,
        method: 'GET'
      });
      const action = getMovieByCountryApiAction(result.data);
      dispatch(action);
    } catch (err) {
      console.log(err)
    }
  }
}

export const getMovieByYearApi = (year_url) => {
  return async (dispatch, getState) => {
    try {
      const result = await axios({
        url: `http://localhost:6969/nam-phat-hanh/${year_url}`,
        method: 'GET'
      });
      const action = getMovieByYearApiAction(result.data);
      dispatch(action);
    } catch (err) {
      console.log(err)
    }
  }
}

export const getMovieByTypeApi = (type_url) => {
  return async (dispatch, getState) => {
    try {
      const result = await axios({
        url: `http://localhost:6969/${type_url}`,
        method: 'GET'
      });
      const action = getMovieByTypeApiAction(result.data);
      dispatch(action);
    } catch (err) {
      console.log(err)
    }
  }
}