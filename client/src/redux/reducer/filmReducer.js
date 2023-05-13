import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

const initialState = {
  listPhimLe: [],
  listPhimBo: [],
  ListPhimChieuRap: [],
  listPhimLeMoiCapNhat: [],
  listPhimChieuRapTheoNam: [],
}

const filmReducer = createSlice({
  name: "film",
  initialState,
  reducers: {
    getAllMovieApiAction: (state, action) => {
      state.listPhimLeMoiCapNhat = action.payload;
    },
    // getPhimLeMoiCapNhat: (state, action) => {
    //   state.listPhimLeMoiCapNhat = state.listPhimLe;
    // },
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

export const { getAllMovieApiAction, getPhimChieuRap, getPhimLeTheoTheLoai, getPhimChieuRapTheoNam } = filmReducer.actions

export default filmReducer.reducer

export const getAllMovieApi = () => {

    return async (dispatch,getState) => {

        try{
            const result = await axios ({
                url: 'http://localhost:6969/',
                method:'GET'
            });
            const action = getAllMovieApiAction(result.data);
            dispatch(action);
        }catch (err) {
            console.log(err)
        }
    }
}