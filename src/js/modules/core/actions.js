import * as t from './actionTypes'

export const setLanguage = (language)=>
({
    type    : t.SET_LANGUAGE,
    payload : { language }
});

export const refreshWindowDimensions = ()=>
({
    type : t.REFRESH_WINDOW_DIMENSIONS,
    payload : {}
});

export const openAppMenu = ()=>
({
    type    : t.OPEN_APP_MENU,
    payload : {}
});

export const closeAppMenu = ()=>
({
    type    : t.CLOSE_APP_MENU,
    payload : {}
});
